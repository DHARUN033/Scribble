import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import { RoomManager } from './game/RoomManager.js';
import { WORD_PRESETS } from './game/words.js';
import { db } from './db/supabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3000;
const roomManager = new RoomManager(io);

// Enable CORS for all REST requests (e.g. if frontend is hosted on Vercel and backend on Render)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// REST Endpoints
app.get('/api/supabase/status', (req, res) => {
  res.json({
    success: true,
    configured: db.isConfigured()
  });
});

app.get('/api/leaderboard', async (req, res) => {
  const leaderboard = await db.getGlobalLeaderboard(20);
  res.json({ success: true, leaderboard });
});

app.get('/api/lobby-results', async (req, res) => {
  const results = await db.getGameSessions(50);
  res.json({ success: true, results });
});

app.get('/api/wordpacks', async (req, res) => {
  const packs = await db.getCustomWordPacks();
  res.json({ success: true, packs, presets: WORD_PRESETS });
});

app.post('/api/wordpacks', async (req, res) => {
  const { name, description, words, createdBy } = req.body || {};
  if (!name || !words) {
    return res.status(400).json({ success: false, error: 'Name and words are required' });
  }
  const pack = await db.saveCustomWordPack({ name, description, words, createdBy });
  res.json({ success: !!pack, pack });
});

app.get('/api/presets', (req, res) => {
  res.json({ success: true, presets: WORD_PRESETS });
});

app.post('/api/rooms/create', (req, res) => {
  const { settings } = req.body || {};
  const { code, adminKey } = roomManager.createRoom(null, settings || {});
  res.json({ success: true, roomCode: code, adminKey });
});

app.get('/api/rooms/:code', (req, res) => {
  const room = roomManager.getRoom(req.params.code);
  if (!room) {
    return res.status(404).json({ success: false, error: 'Room not found' });
  }
  res.json({
    success: true,
    code: room.code,
    state: room.state,
    playersCount: room.players.size,
    gameMode: room.settings.gameMode
  });
});

// Socket.IO Handlers
io.on('connection', (socket) => {
  console.log(`[Socket] Connected: ${socket.id}`);

  // Join Room
  socket.on('join_room', (data, callback) => {
    const { roomCode, role, name, avatar, team, adminKey } = data;
    const result = roomManager.joinRoom(socket, roomCode, {
      role,
      name,
      avatar,
      team,
      adminKey
    });

    if (typeof callback === 'function') {
      callback(result);
    }
  });

  // Host starts game
  socket.on('start_game', ({ roomCode, adminKey }, callback) => {
    const room = roomManager.getRoom(roomCode);
    if (!room) return callback && callback({ success: false, error: 'Room not found' });
    const result = room.startGame(adminKey);
    if (callback) callback(result);
  });

  // Drawer chooses word
  socket.on('select_word', ({ roomCode, word }) => {
    const room = roomManager.getRoom(roomCode);
    if (room) {
      room.setChosenWord(socket.id, word);
    }
  });

  // Canvas drawing event
  socket.on('draw_stroke', ({ roomCode, stroke }) => {
    const room = roomManager.getRoom(roomCode);
    if (!room) return;

    // Allow active drawer during DRAWING phase, or players during LOBBY phase
    if ((room.currentDrawerId === socket.id && room.state === 'DRAWING') || room.state === 'LOBBY') {
      if (stroke.type === 'clear') {
        room.clearCanvas();
      } else if (stroke.type === 'undo') {
        room.undoStroke();
      } else {
        room.addStroke(stroke);
      }
      // Broadcast to other players and arena display in this room
      socket.to(roomCode).emit('remote_stroke', stroke);
    }
  });

  // Chat guess
  socket.on('chat_message', ({ roomCode, text }) => {
    const room = roomManager.getRoom(roomCode);
    if (room) {
      room.handleGuess(socket.id, text);
    }
  });

  // Power-up triggers
  socket.on('trigger_powerup', ({ roomCode, powerup }) => {
    const room = roomManager.getRoom(roomCode);
    if (!room || room.state !== 'DRAWING') return;

    if (powerup === 'hint' && socket.id !== room.currentDrawerId) {
      // Player triggered hint powerup for themselves
      room.revealRandomHint();
    } else if (powerup === 'bomb' && socket.id === room.currentDrawerId) {
      // Drawer bomb erased canvas
      room.clearCanvas();
      io.to(roomCode).emit('remote_stroke', { type: 'bomb' });
      io.to(roomCode).emit('audio_cue', { sound: 'bomb_blast' });
    }
  });

  // --- ADMIN ACTIONS ---
  socket.on('admin_pause', ({ roomCode, adminKey }, callback) => {
    const room = roomManager.getRoom(roomCode);
    if (!room) return callback && callback({ success: false, error: 'Room not found' });
    const result = room.togglePause(adminKey);
    if (callback) callback(result);
  });

  socket.on('admin_skip', ({ roomCode, adminKey }, callback) => {
    const room = roomManager.getRoom(roomCode);
    if (!room) return callback && callback({ success: false, error: 'Room not found' });
    const result = room.forceSkip(adminKey);
    if (callback) callback(result);
  });

  socket.on('admin_end_match', ({ roomCode, adminKey }, callback) => {
    const room = roomManager.getRoom(roomCode);
    if (!room) return callback && callback({ success: false, error: 'Room not found' });
    const result = room.endMatch(adminKey);
    if (callback) callback(result);
  });

  socket.on('admin_close_lobby', ({ roomCode, adminKey }, callback) => {
    const result = roomManager.closeRoom(roomCode, adminKey);
    if (callback) callback(result);
  });

  socket.on('admin_adjust_score', ({ roomCode, adminKey, playerId, delta }, callback) => {
    const room = roomManager.getRoom(roomCode);
    if (!room) return callback && callback({ success: false, error: 'Room not found' });
    const result = room.adjustScore(adminKey, playerId, delta);
    if (callback) callback(result);
  });

  socket.on('admin_mute', ({ roomCode, adminKey, playerId }, callback) => {
    const room = roomManager.getRoom(roomCode);
    if (!room) return callback && callback({ success: false, error: 'Room not found' });
    const result = room.toggleMute(adminKey, playerId);
    if (callback) callback(result);
  });

  socket.on('admin_kick', ({ roomCode, adminKey, playerId }, callback) => {
    const room = roomManager.getRoom(roomCode);
    if (!room) return callback && callback({ success: false, error: 'Room not found' });
    const result = room.kickPlayer(adminKey, playerId);
    if (callback) callback(result);
  });

  socket.on('admin_update_settings', ({ roomCode, adminKey, settings }, callback) => {
    const room = roomManager.getRoom(roomCode);
    if (!room) return callback && callback({ success: false, error: 'Room not found' });
    const result = room.updateSettings(adminKey, settings);
    if (callback) callback(result);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket] Disconnected: ${socket.id}`);
    roomManager.handleDisconnect(socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Scribble Arena Server running at http://localhost:${PORT}`);
});
