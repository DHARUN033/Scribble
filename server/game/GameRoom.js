import { WORD_PRESETS, MASTER_RANDOM_WORDS, cleanWordList } from './words.js';
import { db } from '../db/supabase.js';

function levenshtein(a, b) {
  const al = a.length;
  const bl = b.length;
  if (!al) return bl;
  if (!bl) return al;
  const matrix = Array.from({ length: al + 1 }, () => new Array(bl + 1).fill(0));
  for (let i = 0; i <= al; i++) matrix[i][0] = i;
  for (let j = 0; j <= bl; j++) matrix[0][j] = j;

  for (let i = 1; i <= al; i++) {
    for (let j = 1; j <= bl; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[al][bl];
}

export class GameRoom {
  constructor(code, adminKey, hostSocketId, io) {
    this.code = code;
    this.adminKey = adminKey;
    this.io = io;
    this.createdAt = Date.now();

    // Default settings
    this.settings = {
      rounds: 3,
      drawTime: 80,
      hintCount: 2,
      gameMode: 'ffa', // 'ffa' or 'team'
      wordMode: 'random', // 'random' (automatic) or 'custom' (admin entered)
      customWords: []
    };

    this.state = 'LOBBY'; // LOBBY, STARTING, SELECTING_WORD, DRAWING, ROUND_END, GAME_OVER, PAUSED
    this.currentRound = 1;
    this.drawerIndex = -1;
    this.currentDrawerId = null;
    this.currentWord = '';
    this.wordOptions = [];
    this.revealedHints = new Set();
    this.timeLeft = 0;
    this.timerInterval = null;
    this.isPaused = false;
    this.pausedState = null;

    // Player storage: socketId -> Player
    this.players = new Map();
    // Turn order of drawing players
    this.playerOrder = [];
    // Current turn correct guessers
    this.guessHistory = [];
    // Last round-end payload for reconnects
    this.lastRoundEndData = null;
    // Prevent duplicate turn-finalization and duplicate next-turn timers
    this.isEndingTurn = false;
    this.turnTransitionTimer = null;
    // Drawing actions buffer
    this.canvasStrokes = [];
    // Recent chat
    this.chatMessages = [];
    // Used words tracking to prevent repeat words
    this.usedWords = new Set();
    // Entry and exit activity logs for Admin tracking
    this.activityLogs = [];
  }

  // Add a participant (Player, Admin, or Arena Spectator)
  addParticipant(socket, data) {
    const { role = 'player', name = 'Guest', avatar = {}, team = null, adminKey = null } = data;

    let assignedRole = role;
    let isHost = false;

    if (role === 'admin') {
      if (adminKey && adminKey === this.adminKey) {
        assignedRole = 'admin';
        isHost = true;
      } else {
        return { success: false, error: 'Invalid Admin Key' };
      }
    } else if (role === 'arena') {
      assignedRole = 'arena';
    } else {
      assignedRole = 'player';
    }

    // Check if an offline player with the same name is reconnecting
    let existingPlayer = null;
    for (const [oldId, p] of this.players.entries()) {
      if (p.name.toLowerCase() === (name || '').toLowerCase().trim() && !p.connected && p.role === assignedRole) {
        existingPlayer = { oldId, p };
        break;
      }
    }

    let playerObj;
    if (existingPlayer) {
      // Reconnect existing player
      this.players.delete(existingPlayer.oldId);
      playerObj = existingPlayer.p;
      playerObj.id = socket.id;
      playerObj.connected = true;
      playerObj.avatar = avatar || playerObj.avatar;
      this.players.set(socket.id, playerObj);
      this.playerOrder = this.playerOrder.map(id => id === existingPlayer.oldId ? socket.id : id);
    } else {
      playerObj = {
        id: socket.id,
        name: (name || 'Player').slice(0, 18),
        role: assignedRole,
        avatar: avatar || {},
        score: 0,
        streak: 0,
        team: team || (this.players.size % 2 === 0 ? 'red' : 'blue'),
        hasGuessed: false,
        turnScore: 0,
        isMuted: false,
        isHost: isHost,
        connected: true
      };
      this.players.set(socket.id, playerObj);
      if (assignedRole === 'player') {
        if (!this.playerOrder.includes(socket.id)) {
          this.playerOrder.push(socket.id);
        }
      }
    }

    socket.join(this.code);

    // Record Entry in Activity Log
    this.activityLogs.push({
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      type: 'JOIN',
      name: playerObj.name,
      role: assignedRole,
      score: playerObj.score,
      time: new Date().toLocaleTimeString()
    });
    if (this.activityLogs.length > 60) this.activityLogs.shift();

    this.broadcastState();
    this.broadcastChat({
      system: true,
      text: `${playerObj.name} joined as ${assignedRole.toUpperCase()}`
    });

    return { success: true, player: playerObj, roomCode: this.code };
  }

  removeParticipant(socketId) {
    const player = this.players.get(socketId);
    if (!player) return;

    // Mark as disconnected instead of deleting, so Admin retains all records!
    player.connected = false;
    player.disconnectedAt = Date.now();

    // Record Exit in Activity Log
    this.activityLogs.push({
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      type: 'EXIT',
      name: player.name,
      role: player.role,
      score: player.score,
      time: new Date().toLocaleTimeString()
    });
    if (this.activityLogs.length > 60) this.activityLogs.shift();

    this.broadcastChat({
      system: true,
      text: `${player.name} left the room`
    });

    // If active drawer disconnected
    if (this.currentDrawerId === socketId && (this.state === 'DRAWING' || this.state === 'SELECTING_WORD')) {
      this.broadcastChat({
        system: true,
        text: `Drawer disconnected! Skipping to next turn.`
      });
      this.endTurn('Drawer disconnected');
    } else {
      this.broadcastState();
    }
  }

  getActivePlayers() {
    return Array.from(this.players.values()).filter(p => p.role === 'player' && p.connected);
  }

  broadcastState() {
    const playerList = Array.from(this.players.values()).map(p => ({
      id: p.id,
      name: p.name,
      role: p.role,
      avatar: p.avatar,
      score: p.score,
      streak: p.streak,
      team: p.team,
      hasGuessed: p.hasGuessed,
      isMuted: p.isMuted,
      isHost: p.isHost,
      connected: p.connected
    }));

    // Mask the secret word for players who haven't guessed yet
    const maskedWord = this.getMaskedWord();

    // Broadcast generic state to everyone
    this.players.forEach((p, socketId) => {
      const isDrawer = socketId === this.currentDrawerId;
      const isAdmin = p.role === 'admin';

      // Who can see the full word?
      // Drawer always sees it.
      // Guessed player sees it.
      // Admin sees it if revealWord toggle or drawing phase.
      // Arena spectator sees masked word blanks, unless round ended.
      const canSeeWord = isDrawer || (isAdmin && this.settings.revealWordToAdmin) || this.state === 'ROUND_END' || this.state === 'GAME_OVER';

      this.io.to(socketId).emit('room_state', {
        code: this.code,
        state: this.state,
        currentRound: this.currentRound,
        totalRounds: this.settings.rounds,
        timeLeft: this.timeLeft,
        isPaused: this.isPaused,
        gameMode: this.settings.gameMode,
        settings: {
          drawTime: this.settings.drawTime,
          rounds: this.settings.rounds,
          customWordsCount: this.settings.customWords.length
        },
        currentDrawerId: this.currentDrawerId,
        currentDrawer: this.players.get(this.currentDrawerId) || null,
        wordOptions: isDrawer && this.state === 'SELECTING_WORD' ? this.wordOptions : [],
        roundEndData: this.state === 'ROUND_END' ? this.lastRoundEndData : null,
        word: canSeeWord ? this.currentWord : null,
        wordDisplay: canSeeWord ? this.currentWord : maskedWord,
        wordLength: this.currentWord ? this.currentWord.length : 0,
        players: playerList,
        activityLogs: this.activityLogs,
        strokes: this.canvasStrokes
      });
    });
  }

  getMaskedWord() {
    if (!this.currentWord) return '';
    return this.currentWord
      .split('')
      .map((char, index) => {
        if (char === ' ') return '  ';
        if (char === '-') return '-';
        if (this.revealedHints.has(index)) return char;
        return '_';
      })
      .join(' ');
  }

  broadcastChat(msg) {
    this.chatMessages.push(msg);
    if (this.chatMessages.length > 100) this.chatMessages.shift();
    this.io.to(this.code).emit('chat_message', msg);
  }

  // --- GAMEPLAY LIFECYCLE ---

  startGame(adminKey) {
    if (adminKey !== this.adminKey) return { success: false, error: 'Unauthorized' };

    const activePlayers = this.getActivePlayers();
    if (activePlayers.length < 1) {
      return { success: false, error: 'Need at least 1 player to start the game' };
    }

    if (this.settings.wordMode === 'custom' && (!this.settings.customWords || this.settings.customWords.length === 0)) {
      return { success: false, error: 'Custom word mode selected, but no words were entered. Please enter words or switch to Random mode!' };
    }

    // Reset scores & streaks
    this.players.forEach(p => {
      p.score = 0;
      p.streak = 0;
      p.hasGuessed = false;
    });

    this.currentRound = 1;
    this.drawerIndex = -1;
    this.state = 'STARTING';

    // Reset scores & turn state for fresh match
    this.players.forEach(p => {
      p.score = 0;
      p.streak = 0;
      p.hasGuessed = false;
      p.turnScore = 0;
    });

    this.broadcastState();

    // Persist room active state to Supabase
    db.updateRoomStatus(this.code, 'active');

    this.broadcastChat({
      system: true,
      text: `Game is starting! Round 1 of ${this.settings.rounds}.`
    });

    setTimeout(() => {
      this.nextTurn();
    }, 2000);

    return { success: true };
  }

  nextTurn() {
    this.isEndingTurn = false;
    if (this.turnTransitionTimer) {
      clearTimeout(this.turnTransitionTimer);
      this.turnTransitionTimer = null;
    }

    const activePlayers = this.getActivePlayers();
    if (activePlayers.length === 0) {
      this.state = 'LOBBY';
      this.broadcastState();
      return;
    }

    this.drawerIndex++;
    if (this.drawerIndex >= activePlayers.length) {
      // Round completed
      this.drawerIndex = 0;
      this.currentRound++;
      if (this.currentRound > this.settings.rounds) {
        this.endGame();
        return;
      }
      this.broadcastChat({
        system: true,
        text: `Round ${this.currentRound} started!`
      });
    }

    const drawer = activePlayers[this.drawerIndex];
    if (!drawer) {
      this.endGame();
      return;
    }

    this.currentDrawerId = drawer.id;
    this.canvasStrokes = [];
    this.guessHistory = [];
    this.revealedHints.clear();
    this.lastRoundEndData = null;

    // Reset hasGuessed and turnScore for everyone
    this.players.forEach(p => {
      p.hasGuessed = false;
      p.turnScore = 0;
    });

    // Notify all clients to automatically clear/refresh the drawing board
    this.io.to(this.code).emit('canvas_clear');

    // Pick 2 random words from Host Custom Words without repeat
    this.wordOptions = this.pickTwoWords();
    this.state = 'SELECTING_WORD';
    this.timeLeft = 15; // 15 seconds to pick a word

    // Emit words to drawer specifically (2 choices)
    this.io.to(drawer.id).emit('select_word_options', {
      options: this.wordOptions,
      timeout: this.timeLeft
    });

    this.broadcastChat({
      system: true,
      text: `${drawer.name} is choosing a word!`
    });

    this.io.to(this.code).emit('audio_cue', { sound: 'turn_start' });
    this.broadcastState();

    this.startSelectionTimer();
  }

  pickTwoWords() {
    let sourcePool = [];
    const isCustomMode = this.settings.wordMode === 'custom';
    const customList = cleanWordList(this.settings.customWords);

    if (isCustomMode && customList.length > 0) {
      // Filter out words that were already picked in this lobby
      sourcePool = customList.filter(w => !this.usedWords.has(w.toLowerCase().trim()));

      // If fewer than 2 unused custom words remain, fill remaining slots with unused master random words
      // NEVER reuse words that have already been picked in this.usedWords!
      if (sourcePool.length < 2) {
        const fallback = MASTER_RANDOM_WORDS.filter(w => 
          !this.usedWords.has(w.toLowerCase().trim()) &&
          !sourcePool.some(sw => sw.toLowerCase().trim() === w.toLowerCase().trim())
        );
        sourcePool = [...sourcePool, ...fallback];
      }
    } else {
      // Random mode: choose automatically from master words that haven't been picked yet
      sourcePool = MASTER_RANDOM_WORDS.filter(w => !this.usedWords.has(w.toLowerCase().trim()));
    }

    // Shuffle available unused words
    const shuffled = [...sourcePool].sort(() => 0.5 - Math.random());

    // Pick top 2 distinct unused words
    const choices = [];
    for (const w of shuffled) {
      if (!choices.some(c => c.toLowerCase().trim() === w.toLowerCase().trim())) {
        choices.push(w);
      }
      if (choices.length === 2) break;
    }

    return choices;
  }

  startSelectionTimer() {
    this.clearTimer();
    this.timerInterval = setInterval(() => {
      if (this.isPaused) return;

      this.timeLeft--;
      this.io.to(this.code).emit('timer_tick', { timeLeft: this.timeLeft, state: this.state });

      if (this.timeLeft <= 0) {
        this.clearTimer();
        // If the drawer does not choose a word, auto-pick one so the round can continue.
        const drawerName = this.players.get(this.currentDrawerId)?.name || 'Drawer';
        const fallbackWord = this.wordOptions[0] || this.pickTwoWords()[0] || MASTER_RANDOM_WORDS[Math.floor(Math.random() * MASTER_RANDOM_WORDS.length)] || 'drawing';
        this.broadcastChat({
          system: true,
          text: `Time's up! ${drawerName} did not pick a word, so one was chosen automatically.`
        });
        this.setChosenWord(this.currentDrawerId, fallbackWord, true);
      }
    }, 1000);
  }

  setChosenWord(socketId, word, autoSelected = false) {
    if (this.currentDrawerId !== socketId || this.state !== 'SELECTING_WORD') return;

    this.currentWord = word.trim();
    // Add to used words so it will NEVER appear again in this lobby!
    this.usedWords.add(this.currentWord.toLowerCase().trim());

    this.canvasStrokes = [];
    this.io.to(this.code).emit('canvas_clear');

    this.state = 'DRAWING';
    this.timeLeft = this.settings.drawTime;
    this.revealedHints.clear();

    this.clearTimer();
    this.broadcastState();

    this.broadcastChat({
      system: true,
      text: autoSelected
        ? `${this.players.get(socketId)?.name} ran out of time. The word was auto-selected. Start guessing!`
        : `${this.players.get(socketId)?.name} selected a word! Start guessing!`
    });

    this.startDrawingTimer();
  }

  startDrawingTimer() {
    this.clearTimer();

    // Calculate dynamic letter hint reveals as countdown ticks down
    const cleanWordLetters = this.currentWord ? this.currentWord.replace(/[\s-]/g, '') : '';
    const wordLen = cleanWordLetters.length;
    const maxHints = wordLen <= 2 ? 0 : wordLen <= 4 ? 1 : wordLen <= 7 ? 2 : 3;

    const hintCheckpoints = [];
    if (maxHints === 1) {
      hintCheckpoints.push(Math.floor(this.settings.drawTime * 0.5));
    } else if (maxHints === 2) {
      hintCheckpoints.push(Math.floor(this.settings.drawTime * 0.6));
      hintCheckpoints.push(Math.floor(this.settings.drawTime * 0.3));
    } else if (maxHints >= 3) {
      hintCheckpoints.push(Math.floor(this.settings.drawTime * 0.7));
      hintCheckpoints.push(Math.floor(this.settings.drawTime * 0.45));
      hintCheckpoints.push(Math.floor(this.settings.drawTime * 0.2));
    }

    this.timerInterval = setInterval(() => {
      if (this.isPaused) return;

      this.timeLeft--;
      this.io.to(this.code).emit('timer_tick', { timeLeft: this.timeLeft, state: this.state });

      // Automatically reveal one by one hint letters as countdown progresses
      if (hintCheckpoints.includes(this.timeLeft)) {
        this.revealRandomHint();
      }

      // Audio cue for last 10 seconds
      if (this.timeLeft <= 10 && this.timeLeft > 0) {
        this.io.to(this.code).emit('audio_cue', { sound: 'tick_urgent' });
      }

      if (this.timeLeft <= 0) {
        this.clearTimer();
        this.endTurn('Time is up!');
      }
    }, 1000);
  }

  revealRandomHint() {
    if (!this.currentWord) return;
    const cleanWord = this.currentWord;
    const eligibleIndices = [];
    for (let i = 0; i < cleanWord.length; i++) {
      if (cleanWord[i] !== ' ' && cleanWord[i] !== '-' && !this.revealedHints.has(i)) {
        eligibleIndices.push(i);
      }
    }

    if (eligibleIndices.length > 1) {
      const pick = eligibleIndices[Math.floor(Math.random() * eligibleIndices.length)];
      this.revealedHints.add(pick);
      this.broadcastState();
      this.io.to(this.code).emit('audio_cue', { sound: 'hint_reveal' });
    }
  }

  handleGuess(socketId, text) {
    const player = this.players.get(socketId);
    if (!player) return;

    if (player.isMuted) {
      socket.emit('chat_message', { system: true, text: 'You are muted by the host.' });
      return;
    }

    const cleanInput = text.trim();
    if (!cleanInput) return;

    // If player is the drawer
    if (socketId === this.currentDrawerId) {
      // Check if drawer accidentally wrote the word
      if (cleanInput.toLowerCase() === this.currentWord.toLowerCase()) {
        this.io.to(socketId).emit('chat_message', {
          system: true,
          text: `You cannot write the secret word in chat!`
        });
        return;
      }
      this.broadcastChat({
        name: player.name,
        text: cleanInput,
        color: '#f59e0b',
        team: player.team
      });
      return;
    }

    // If player has already guessed correctly, lock chat writing (comments from others can still display)
    if (player.hasGuessed && this.state === 'DRAWING') {
      this.io.to(socketId).emit('chat_message', {
        system: true,
        text: `You already found the word! Chat is locked so other players can guess.`
      });
      return;
    }

    // Active guessing phase
    if (this.state === 'DRAWING') {
      const guessNorm = cleanInput.toLowerCase().replace(/[^a-z0-9]/g, '');
      const targetNorm = this.currentWord.toLowerCase().replace(/[^a-z0-9]/g, '');

      if (guessNorm === targetNorm) {
        // Correct guess!
        player.hasGuessed = true;
        player.streak += 1;
        this.guessHistory.push({
          playerId: player.id,
          name: player.name,
          timeLeft: this.timeLeft,
          streak: player.streak,
          rank: this.guessHistory.length + 1
        });

        // Notify room immediately, but do not award points until the turn ends.
        this.io.to(this.code).emit('player_guessed_correctly', {
          playerId: player.id,
          playerName: player.name,
          pointsEarned: 0,
          streak: player.streak,
          firstGuesser: this.guessHistory.length === 1,
          scoreSettled: false
        });

        this.io.to(socketId).emit('audio_cue', { sound: 'correct_guess' });
        this.io.to(this.code).emit('audio_cue', { sound: 'guess_bell' });

        this.broadcastChat({
          system: true,
          highlight: 'green',
          text: `${player.name} guessed the word! Scores will be revealed at the end of the turn.`
        });

        this.broadcastState();

        // Check if all players have guessed
        const remainingGuessers = this.getActivePlayers().filter(
          p => p.id !== this.currentDrawerId && !p.hasGuessed
        );

        if (remainingGuessers.length === 0) {
          this.clearTimer();
          this.endTurn('Everyone guessed the word!');
        }
        return;
      }

      // Check for close guess (Levenshtein distance)
      const dist = levenshtein(guessNorm, targetNorm);
      if (dist === 1 || (dist === 2 && targetNorm.length >= 6)) {
        this.io.to(socketId).emit('close_guess_alert', {
          guess: cleanInput,
          message: `'${cleanInput}' is very close!`
        });
        this.io.to(socketId).emit('audio_cue', { sound: 'close_guess' });
      }
    }

    // Regular chat message broadcast
    this.broadcastChat({
      name: player.name,
      text: cleanInput,
      team: player.team
    });
  }

  endTurn(reason = '') {
    if (this.isEndingTurn || this.state === 'ROUND_END' || this.state === 'GAME_OVER') {
      return;
    }

    this.isEndingTurn = true;
    this.clearTimer();
    this.state = 'ROUND_END';

    // Clear strokes on server
    this.canvasStrokes = [];

    this.settleTurnScores();

    // Compile turn scoreboard (Skribbl style: non-guessers get 0)
    const roundScores = this.getActivePlayers().map(p => ({
      id: p.id,
      name: p.name,
      avatar: p.avatar,
      isDrawer: p.id === this.currentDrawerId,
      hasGuessed: p.hasGuessed,
      pointsEarned: p.turnScore || 0,
      totalScore: p.score
    })).sort((a, b) => {
      if (b.pointsEarned !== a.pointsEarned) return b.pointsEarned - a.pointsEarned;
      return b.totalScore - a.totalScore;
    });

    const isFinalRound = (this.currentRound >= this.settings.rounds) && 
                         (this.drawerIndex + 1 >= this.getActivePlayers().length);

    const roundEndData = {
      word: this.currentWord,
      reason,
      scores: roundScores,
      currentRound: this.currentRound,
      totalRounds: this.settings.rounds,
      isFinalRound,
      duration: 5
    };
    this.lastRoundEndData = roundEndData;

    this.broadcastChat({
      system: true,
      text: `Turn finished! The secret word was: "${this.currentWord}". ${reason}`
    });

    this.io.to(this.code).emit('audio_cue', { sound: 'round_end' });

    // Emit round score reveal event to everyone (including arena display)
    this.io.to(this.code).emit('round_end_scores', roundEndData);

    // Also emit canvas_clear so draw boards refresh automatically across all clients
    this.io.to(this.code).emit('canvas_clear');

    this.broadcastState();

    this.turnTransitionTimer = setTimeout(() => {
      if (this.state === 'ROUND_END') {
        this.nextTurn();
      }
    }, 5000);
  }

  endGame() {
    this.clearTimer();
    if (this.turnTransitionTimer) {
      clearTimeout(this.turnTransitionTimer);
      this.turnTransitionTimer = null;
    }
    this.isEndingTurn = false;
    this.state = 'GAME_OVER';

    // Calculate podium
    const activePlayers = this.getActivePlayers().sort((a, b) => b.score - a.score);
    const podium = activePlayers.slice(0, 3);

    // Calculate team scores if Team mode
    let teamScores = { red: 0, blue: 0 };
    if (this.settings.gameMode === 'team') {
      activePlayers.forEach(p => {
        if (p.team === 'red') teamScores.red += p.score;
        if (p.team === 'blue') teamScores.blue += p.score;
      });
    }

    this.io.to(this.code).emit('game_over_podium', {
      podium,
      allPlayers: activePlayers,
      teamScores,
      mode: this.settings.gameMode
    });

    this.io.to(this.code).emit('audio_cue', { sound: 'game_over' });
    this.broadcastState();

    this.broadcastChat({
      system: true,
      text: `GAME OVER! 1st Place: ${podium[0]?.name || 'Nobody'} with ${podium[0]?.score || 0} pts!`
    });

    // Persist match session and global hall of fame to Supabase
    db.saveGameSession({
      roomCode: this.code,
      winner: podium[0] || null,
      totalRounds: this.settings.rounds,
      gameMode: this.settings.gameMode,
      podium: podium,
      allPlayers: activePlayers
    }).then(savedSession => {
      if (savedSession) {
        // Broadcast new lobby result to all connected clients across the entire app
        this.io.emit('lobby_result_updated', savedSession);
      }
    }).catch(e => {
      console.error('[GameRoom] saveGameSession exception:', e);
    });

    db.updateLeaderboard(activePlayers, podium[0]?.name || null);
    db.updateRoomStatus(this.code, 'finished');
  }

  calculateGuessPoints({ timeLeft, streak = 1, isFirstGuess = false, rank = 1, totalGuessers = 1, eligibleGuessers = 1, previousPoints = Infinity }) {
    const drawTime = Math.max(1, this.settings.drawTime || 80);
    const timeFactor = Math.max(0, Math.min(1, (timeLeft || 0) / drawTime));

    // 1. Base reward: Guaranteed solid reward for discovering the secret word
    const baseReward = 120;

    // 2. Speed / Time bonus: Up to 180 points based on speed of solving
    const timeBonus = Math.round(timeFactor * 180);

    // 3. Smooth rank ladder decay:
    // Avoids massive drop-offs so 4th-7th guessers still earn healthy, satisfying points.
    // Rank 1: +120, Rank 2: +95, Rank 3: +75, Rank 4: +60, Rank 5: +48, Rank 6: +38, Rank 7+: +30
    const rankBonuses = [120, 95, 75, 60, 48, 38, 30, 24];
    const rankBonus = rank <= rankBonuses.length
      ? rankBonuses[rank - 1]
      : Math.max(15, 24 - (rank - 8) * 2);

    // 4. First solver lightning bonus
    const firstBonus = isFirstGuess ? 35 : 0;

    // 5. Consecutive guess streak bonus (+15 pts per consecutive turn, max 45 pts)
    const streakBonus = Math.min(45, Math.max(0, streak - 1) * 15);

    let points = baseReward + timeBonus + rankBonus + firstBonus + streakBonus;

    // 6. Enforce strict ladder order: each lower rank must score less than the rank above
    if (previousPoints !== Infinity) {
      points = Math.min(points, previousPoints - 3);
    }

    // 7. Dynamic guaranteed minimum floor so players never receive low points (e.g. old 50 pts)
    const minFloor = Math.max(80, 140 - (rank - 1) * 8);
    points = Math.max(minFloor, points);

    // Final safety clamp for strict descending order
    if (previousPoints !== Infinity && points >= previousPoints) {
      points = Math.max(25, previousPoints - 2);
    }

    return points;
  }

  settleTurnScores() {
    const settledGuessers = [];
    const usedPoints = new Set();

    let previousPoints = Infinity;
    const totalGuessers = this.guessHistory.length;
    const activePlayers = this.getActivePlayers();
    const eligibleCount = activePlayers.filter(p => p.id !== this.currentDrawerId).length;
    const eligibleGuessers = Math.max(1, Math.max(totalGuessers, eligibleCount));

    // Settle points for guessers in chronological order
    this.guessHistory.forEach((entry) => {
      const player = this.players.get(entry.playerId);
      if (!player) return;

      let points = this.calculateGuessPoints({
        timeLeft: entry.timeLeft,
        streak: entry.streak,
        isFirstGuess: entry.rank === 1,
        rank: entry.rank,
        totalGuessers,
        eligibleGuessers,
        previousPoints
      });

      // Strict uniqueness guarantee: no two players can get the exact same points in a turn
      while (usedPoints.has(points)) {
        points = Math.max(1, points - 1);
      }

      usedPoints.add(points);
      previousPoints = points;
      player.turnScore = points;
      player.score += points;
      settledGuessers.push(player.id);
    });

    // Reset streaks for eligible guessers who failed to guess this turn
    activePlayers.forEach((p) => {
      if (p.id !== this.currentDrawerId && !p.hasGuessed) {
        p.streak = 0;
      }
    });

    // Drawer Points:
    // - If nobody guesses (0 correct): all players get 0 (drawer gets 0).
    // - If all players guess (100%): drawer gets top points (up to ~425+ pts).
    // - If only fewer players guess: moderate proportional reward based on player count + speed.
    const drawer = this.players.get(this.currentDrawerId);
    if (drawer) {
      let drawerPoints = 0;

      if (totalGuessers > 0) {
        const guessRatio = Math.min(1.0, totalGuessers / eligibleGuessers); // 0.0 < guessRatio <= 1.0
        const drawTime = Math.max(1, this.settings.drawTime || 80);

        // Average time left among guessers (higher = drawing was clear and recognized quickly)
        const avgTimeLeft = this.guessHistory.reduce((sum, g) => sum + (g.timeLeft || 0), 0) / totalGuessers;
        const avgTimeFactor = Math.max(0, Math.min(1, avgTimeLeft / drawTime));

        // Base clarity reward for having at least 1 person solve it
        const baseClarity = 80;

        // Proportional reward scaling with how many players found the answer
        const ratioReward = Math.round(guessRatio * 280);

        // Recognition speed bonus (up to 60 pts)
        const speedReward = Math.round(avgTimeFactor * 60);

        // Perfection bonus if all eligible guessers found the answer
        const perfectionBonus = (totalGuessers >= eligibleGuessers && eligibleGuessers > 1) ? 35 : 0;

        drawerPoints = baseClarity + ratioReward + speedReward + perfectionBonus;

        // Ensure drawer points do NOT collide with any guesser's points
        while (usedPoints.has(drawerPoints)) {
          drawerPoints += 1;
        }
        usedPoints.add(drawerPoints);
      }

      drawer.turnScore = (drawer.turnScore || 0) + drawerPoints;
      drawer.score += drawerPoints;
    }

    this.guessHistory = this.guessHistory.map((entry) => ({
      ...entry,
      points: settledGuessers.includes(entry.playerId)
        ? (this.players.get(entry.playerId)?.turnScore || 0)
        : 0
    }));

    return settledGuessers;
  }

  clearTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  // --- ADMIN / HOST ACTIONS ---

  togglePause(adminKey) {
    if (adminKey !== this.adminKey) return { success: false, error: 'Unauthorized' };
    this.isPaused = !this.isPaused;
    this.broadcastChat({
      system: true,
      text: this.isPaused ? `Host paused the game!` : `Host resumed the game!`
    });
    this.broadcastState();
    return { success: true, isPaused: this.isPaused };
  }

  forceSkip(adminKey) {
    if (adminKey !== this.adminKey) return { success: false, error: 'Unauthorized' };
    this.broadcastChat({
      system: true,
      text: `Host skipped the current turn!`
    });
    this.endTurn('Host skipped');
    return { success: true };
  }

  endMatch(adminKey) {
    if (adminKey !== this.adminKey) return { success: false, error: 'Unauthorized' };
    this.broadcastChat({
      system: true,
      text: `Host ended the match early!`
    });
    this.endGame();
    setTimeout(() => {
      this.state = 'LOBBY';
      this.currentDrawerId = null;
      this.drawerIndex = -1;
      this.currentWord = '';
      this.canvasStrokes = [];
      this.broadcastChat({
        system: true,
        text: 'Lobby reset. Ready for next match!'
      });
      this.broadcastState();
    }, 5000);
    return { success: true };
  }

  closeLobby(adminKey) {
    if (adminKey !== this.adminKey) return { success: false, error: 'Unauthorized' };
    this.clearTimer();
    this.state = 'CLOSED';
    this.io.to(this.code).emit('lobby_closed_by_host', {
      message: 'The host has ended and closed this lobby.'
    });
    db.updateRoomStatus(this.code, 'closed');
    return { success: true };
  }

  adjustScore(adminKey, playerId, delta) {
    if (adminKey !== this.adminKey) return { success: false, error: 'Unauthorized' };
    const player = this.players.get(playerId);
    if (!player) return { success: false, error: 'Player not found' };

    player.score = Math.max(0, player.score + delta);
    this.broadcastChat({
      system: true,
      text: `Host adjusted ${player.name}'s score by ${delta > 0 ? '+' + delta : delta} pts (New score: ${player.score})`
    });
    this.broadcastState();
    return { success: true, newScore: player.score };
  }

  toggleMute(adminKey, playerId) {
    if (adminKey !== this.adminKey) return { success: false, error: 'Unauthorized' };
    const player = this.players.get(playerId);
    if (!player) return { success: false, error: 'Player not found' };

    player.isMuted = !player.isMuted;
    this.broadcastChat({
      system: true,
      text: `${player.name} was ${player.isMuted ? 'muted' : 'unmuted'} by Host.`
    });
    this.broadcastState();
    return { success: true, isMuted: player.isMuted };
  }

  kickPlayer(adminKey, playerId) {
    if (adminKey !== this.adminKey) return { success: false, error: 'Unauthorized' };
    const player = this.players.get(playerId);
    if (!player) return { success: false, error: 'Player not found' };

    this.io.to(playerId).emit('kicked_by_host', { reason: 'Kicked by game host' });
    this.removeParticipant(playerId);
    return { success: true };
  }

  updateSettings(adminKey, newSettings) {
    if (adminKey !== this.adminKey) return { success: false, error: 'Unauthorized' };

    if (newSettings.rounds) this.settings.rounds = Math.max(1, Math.min(10, parseInt(newSettings.rounds)));
    if (newSettings.drawTime) this.settings.drawTime = Math.max(30, Math.min(180, parseInt(newSettings.drawTime)));
    if (newSettings.gameMode) this.settings.gameMode = newSettings.gameMode;
    if (newSettings.wordMode) this.settings.wordMode = newSettings.wordMode;
    if (newSettings.customWords !== undefined) {
      this.settings.customWords = cleanWordList(newSettings.customWords);
    }
    if (typeof newSettings.revealWordToAdmin === 'boolean') {
      this.settings.revealWordToAdmin = newSettings.revealWordToAdmin;
    }

    this.broadcastChat({
      system: true,
      text: `Host updated room settings!`
    });
    this.broadcastState();
    return { success: true, settings: this.settings };
  }

  // --- DRAWING STROKES BUFFER ---

  addStroke(strokeData) {
    this.canvasStrokes.push(strokeData);
    // Broadcast stroke immediately to all sockets except sender
    return strokeData;
  }

  undoStroke() {
    if (this.canvasStrokes.length > 0) {
      // Remove last stroke or action
      this.canvasStrokes.pop();
    }
  }

  clearCanvas() {
    this.canvasStrokes = [];
  }
}
