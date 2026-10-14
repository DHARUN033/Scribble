// Scribble Arena Master Client Controller
import { soundEngine } from './audio.js';
import { 
  AVATAR_OPTIONS, 
  AVATAR_CATEGORIES, 
  AVATAR_ITEM_DETAILS, 
  SVG_ICONS,
  getRandomAvatar, 
  getHeroPresetAvatar, 
  renderAvatarSvg 
} from './avatar.js';
import { DrawingBoard } from './canvas.js';

class ScribbleApp {
  constructor() {
    this.socket = null;
    this.currentRole = 'player'; // 'player', 'admin', 'arena'
    this.roomCode = null;
    this.adminKey = null;
    this.myPlayerId = null;
    this.currentAvatar = getHeroPresetAvatar();
    this.activeStudioCategory = 'outfit';
    this.roomState = null;
    this.drawingBoard = null;
    this.arenaBoard = null;
    this.isMyTurn = false;
    this.pickerCountdown = null;

    // Confetti particles
    this.confettiCanvas = document.getElementById('confettiCanvas');
    this.confettiCtx = this.confettiCanvas ? this.confettiCanvas.getContext('2d') : null;
    this.confettiParticles = [];
    this.confettiActive = false;

    // Palette Colors
    this.paletteColors = [
      '#000000', '#ffffff', '#6b7280', '#ef4444', '#f97316', 
      '#f59e0b', '#84cc16', '#10b981', '#06b6d4', '#3b82f6', 
      '#6366f1', '#a855f7', '#ec4899', '#78350f', '#064e3b'
    ];

    this.init();
  }

  init() {
    // 1. Bind UI events FIRST so all buttons (volume, tabs, audio) work immediately
    this.bindDOMEvents();
    this.initConfetti();
    this.renderAvatarPreview();
    this.checkUrlParams();
    this.initArenaRecording();
    this.initServerSettingsUI();

    // 2. Initialize networking safely
    this.initSocket();
    this.checkSupabaseStatus();
  }

  getBackendUrl() {
    const saved = localStorage.getItem('scribble_server_url');
    if (saved && saved.trim()) {
      return saved.trim().replace(/\/+$/, '');
    }
    if (window.SCRIBBLE_SERVER_URL && window.SCRIBBLE_SERVER_URL.trim()) {
      return window.SCRIBBLE_SERVER_URL.trim().replace(/\/+$/, '');
    }
    return '';
  }

  apiUrl(path) {
    const base = this.getBackendUrl();
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    if (base) {
      return `${base}${cleanPath}`;
    }
    return cleanPath;
  }

  updateServerStatusUI(connected, errorMsg = '') {
    const headerBtn = document.getElementById('serverStatusHeaderBtn');
    if (!headerBtn) return;

    if (connected) {
      const url = this.getBackendUrl();
      headerBtn.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" fill="#10b981"><circle cx="12" cy="12" r="6"/></svg> ${url ? 'Server: Remote' : 'Server: Online'}`;
      headerBtn.style.color = '#34d399';
      headerBtn.style.borderColor = 'rgba(16, 185, 129, 0.4)';
    } else {
      headerBtn.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" fill="#ef4444"><circle cx="12" cy="12" r="6"/></svg> Server: Offline`;
      headerBtn.style.color = '#f87171';
      headerBtn.style.borderColor = 'rgba(239, 68, 68, 0.5)';
    }
  }

  showServerNoticeBanner(msg) {
    const banner = document.getElementById('serverNoticeBanner');
    const text = document.getElementById('serverNoticeText');
    if (banner && text) {
      text.textContent = msg;
      banner.classList.remove('hidden');
    }
  }

  hideServerNoticeBanner() {
    const banner = document.getElementById('serverNoticeBanner');
    if (banner) {
      banner.classList.add('hidden');
    }
  }

  initServerSettingsUI() {
    const modal = document.getElementById('serverConfigModal');
    const openBtn = document.getElementById('serverStatusHeaderBtn');
    const bannerBtn = document.getElementById('serverConfigBannerBtn');
    const closeBtn = document.getElementById('closeServerConfigBtn');
    const saveBtn = document.getElementById('testAndSaveServerBtn');
    const resetBtn = document.getElementById('resetServerBtn');
    const input = document.getElementById('customServerUrlInput');
    const statusBox = document.getElementById('serverTestStatus');

    const openModal = () => {
      if (input) input.value = localStorage.getItem('scribble_server_url') || '';
      if (statusBox) statusBox.style.display = 'none';
      modal?.classList.remove('hidden');
    };

    openBtn?.addEventListener('click', openModal);
    bannerBtn?.addEventListener('click', openModal);
    closeBtn?.addEventListener('click', () => modal?.classList.add('hidden'));

    saveBtn?.addEventListener('click', () => {
      const val = input ? input.value.trim().replace(/\/+$/, '') : '';
      if (val) {
        localStorage.setItem('scribble_server_url', val);
        if (statusBox) {
          statusBox.style.display = 'block';
          statusBox.style.background = 'rgba(16, 185, 129, 0.2)';
          statusBox.style.color = '#34d399';
          statusBox.innerHTML = `Saved! Reconnecting to <strong>${val}</strong>...`;
        }
      } else {
        localStorage.removeItem('scribble_server_url');
        if (statusBox) {
          statusBox.style.display = 'block';
          statusBox.style.background = 'rgba(59, 130, 246, 0.2)';
          statusBox.style.color = '#60a5fa';
          statusBox.innerHTML = 'Saved! Using default host.';
        }
      }

      setTimeout(() => {
        window.location.reload();
      }, 700);
    });

    resetBtn?.addEventListener('click', () => {
      localStorage.removeItem('scribble_server_url');
      if (input) input.value = '';
      if (statusBox) {
        statusBox.style.display = 'block';
        statusBox.style.background = 'rgba(59, 130, 246, 0.2)';
        statusBox.style.color = '#60a5fa';
        statusBox.innerHTML = 'Reset to default host. Reloading...';
      }
      setTimeout(() => {
        window.location.reload();
      }, 600);
    });
  }

  initSocket() {
    if (typeof io === 'undefined') {
      console.warn('[Socket] Socket.io client not available.');
      this.updateServerStatusUI(false, 'Socket.io client unavailable');
      this.showServerNoticeBanner('Socket library failed to load. Check internet connection.');
      return;
    }

    const backendUrl = this.getBackendUrl();
    try {
      const socketOptions = {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 8,
        reconnectionDelay: 1000
      };

      this.socket = backendUrl ? io(backendUrl, socketOptions) : io(socketOptions);

      this.socket.on('connect', () => {
        this.myPlayerId = this.socket.id;
        console.log('[Socket] Connected as', this.myPlayerId);
        this.updateServerStatusUI(true);
        this.hideServerNoticeBanner();
      });

      this.socket.on('connect_error', (err) => {
        console.warn('[Socket] Connection error:', err.message);
        this.updateServerStatusUI(false, err.message);
        this.showServerNoticeBanner(`Cannot reach game server (${backendUrl || 'local'}). Checking connection...`);
      });

      this.socket.on('disconnect', (reason) => {
        console.warn('[Socket] Disconnected:', reason);
        this.updateServerStatusUI(false, reason);
      });

      this.socket.on('room_state', (state) => {
        this.onRoomStateUpdate(state);
      });

      this.socket.on('select_word_options', ({ options, timeout }) => {
        this.showWordPickerModal(options, timeout);
      });

      this.socket.on('timer_tick', ({ timeLeft, state }) => {
        this.updateTimerDisplay(timeLeft, state);
      });

      this.socket.on('remote_stroke', (stroke) => {
        if (this.drawingBoard) this.drawingBoard.applyStroke(stroke);
        if (this.arenaBoard) this.arenaBoard.applyStroke(stroke);
      });

      this.socket.on('canvas_clear', () => {
        if (this.drawingBoard) this.drawingBoard.reset();
        if (this.arenaBoard) this.arenaBoard.reset();
      });

      this.socket.on('round_end_scores', (data) => {
        this.showRoundEndModal(data);
      });

      this.socket.on('chat_message', (msg) => {
        this.appendChatMessage(msg);
      });

      this.socket.on('close_guess_alert', ({ guess, message }) => {
        this.showCloseGuessBanner(message);
      });

      this.socket.on('player_guessed_correctly', ({ playerId, playerName, pointsEarned, firstGuesser }) => {
        if (playerId === this.myPlayerId) {
          this.triggerConfetti(80);
        }
      });

      this.socket.on('audio_cue', ({ sound }) => {
        soundEngine.playCue(sound);
      });

      this.socket.on('game_over_podium', (data) => {
        this.showPodiumModal(data);
      });

      this.socket.on('kicked_by_host', ({ reason }) => {
        alert(`You have been removed: ${reason}`);
        window.location.reload();
      });

      this.socket.on('lobby_closed_by_host', ({ message }) => {
        alert(message || 'The host has ended and closed this lobby.');
        window.location.href = window.location.pathname;
      });

      this.socket.on('lobby_result_updated', (data) => {
        this.handleNewLobbyResult(data);
      });
    } catch (err) {
      console.error('[Socket] Failed to initialize socket:', err);
      this.updateServerStatusUI(false, err.message);
    }
  }

  bindDOMEvents() {
    // Navigation / Tabs
    document.querySelectorAll('.lobby-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.lobby-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        const tabId = btn.getAttribute('data-tab');
        document.getElementById(tabId)?.classList.add('active');
      });
    });

    // Brand Logo reload
    document.getElementById('brandLogo')?.addEventListener('click', () => {
      if (confirm('Leave current match and return to home?')) {
        window.location.href = window.location.pathname;
      }
    });

    // Audio Controls
    const bgmBtn = document.getElementById('bgmToggleBtn');
    bgmBtn?.addEventListener('click', () => {
      const isPlaying = soundEngine.toggleBGM();
      bgmBtn.innerHTML = `${SVG_ICONS.music} BGM: ${isPlaying ? 'ON' : 'OFF'}`;
      bgmBtn.classList.toggle('active', isPlaying);
    });

    const sfxBtn = document.getElementById('sfxToggleBtn');
    sfxBtn?.addEventListener('click', () => {
      soundEngine.sfxMuted = !soundEngine.sfxMuted;
      sfxBtn.innerHTML = `${soundEngine.sfxMuted ? SVG_ICONS.volumeMute : SVG_ICONS.volume} SFX: ${soundEngine.sfxMuted ? 'OFF' : 'ON'}`;
      sfxBtn.classList.toggle('active', !soundEngine.sfxMuted);
    });

    const masterVol = document.getElementById('masterVolume');
    masterVol?.addEventListener('input', (e) => {
      soundEngine.setSfxVolume(e.target.value);
      soundEngine.setBgmVolume(e.target.value * 0.4);
    });

    // Supabase Status Modal
    document.getElementById('supabaseStatusBtn')?.addEventListener('click', () => {
      document.getElementById('supabaseInfoModal')?.classList.remove('hidden');
    });

    document.getElementById('closeSupabaseInfoBtn')?.addEventListener('click', () => {
      document.getElementById('supabaseInfoModal')?.classList.add('hidden');
    });

    // All Lobby Results Modal
    const openLobbyResults = () => this.openLobbyResultsModal();
    document.getElementById('hallOfFameBtn')?.addEventListener('click', openLobbyResults);
    document.getElementById('lobbyResultsBtn')?.addEventListener('click', openLobbyResults);

    const closeLobbyResults = () => {
      document.getElementById('hallOfFameModal')?.classList.add('hidden');
    };
    document.getElementById('closeHallOfFameBtn')?.addEventListener('click', closeLobbyResults);
    document.getElementById('lobbyResultsCrossBtn')?.addEventListener('click', closeLobbyResults);

    // Fair Play Scoring Rules Modal
    const openScoringRules = () => this.openScoringRulesModal();
    const closeScoringRules = () => this.closeScoringRulesModal();
    document.getElementById('pointSystemHeaderBtn')?.addEventListener('click', openScoringRules);
    document.getElementById('lobbyScoringBtn')?.addEventListener('click', openScoringRules);
    document.getElementById('inGameScoringBtn')?.addEventListener('click', openScoringRules);
    document.getElementById('roundEndScoringRulesBtn')?.addEventListener('click', openScoringRules);
    document.getElementById('fullReportScoringBtn')?.addEventListener('click', openScoringRules);
    document.getElementById('closeScoringRulesBtn')?.addEventListener('click', closeScoringRules);
    document.getElementById('closeScoringRulesCrossBtn')?.addEventListener('click', closeScoringRules);

    document.getElementById('scoringRulesModal')?.addEventListener('click', (e) => {
      if (e.target.id === 'scoringRulesModal') {
        closeScoringRules();
      }
    });

    document.getElementById('refreshLobbyResultsBtn')?.addEventListener('click', () => {
      this.loadLobbyResults(true);
    });

    document.getElementById('tabLobbyMatchesBtn')?.addEventListener('click', () => {
      document.getElementById('tabLobbyMatchesBtn')?.classList.add('active');
      document.getElementById('tabGlobalRanksBtn')?.classList.remove('active');
      document.getElementById('tabLobbyMatchesContent')?.classList.remove('hidden');
      document.getElementById('tabGlobalRanksContent')?.classList.add('hidden');
    });

    document.getElementById('tabGlobalRanksBtn')?.addEventListener('click', () => {
      document.getElementById('tabGlobalRanksBtn')?.classList.add('active');
      document.getElementById('tabLobbyMatchesBtn')?.classList.remove('active');
      document.getElementById('tabGlobalRanksContent')?.classList.remove('hidden');
      document.getElementById('tabLobbyMatchesContent')?.classList.add('hidden');
      this.loadGlobalLeaderboard();
    });

    // Word Selection Mode (Random vs Custom)
    document.querySelectorAll('input[name="adminWordMode"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        const isCustom = e.target.value === 'custom';
        const customSec = document.getElementById('customWordsSection');
        if (customSec) {
          customSec.classList.toggle('hidden', !isCustom);
        }
      });
    });

    // Custom words input counter
    document.getElementById('adminCustomWords')?.addEventListener('input', (e) => {
      const words = e.target.value.split(/[\n,;]+/).map(w => w.trim()).filter(w => w.length > 1);
      const help = document.getElementById('wordCountHelp');
      if (help) {
        help.textContent = words.length > 0 ? `Custom words entered: ${words.length}` : 'Enter custom words for this game lobby';
      }
    });

    // Copy Invite & QR Code
    document.getElementById('copyInviteBtn')?.addEventListener('click', () => {
      const url = `${window.location.origin}?room=${this.roomCode}`;
      navigator.clipboard.writeText(url).then(() => {
        alert(`Invite link copied to clipboard!\n${url}`);
      });
    });

    document.getElementById('showQrBtn')?.addEventListener('click', () => {
      this.openQrModal();
    });

    document.getElementById('closeQrBtn')?.addEventListener('click', () => {
      document.getElementById('qrModal')?.classList.add('hidden');
    });

    // Avatar Quick-Cycle Controls
    const cycleAvatarProp = (prop, list) => {
      const currentVal = this.currentAvatar[prop];
      const idx = (list.indexOf(currentVal) + 1) % list.length;
      this.currentAvatar[prop] = list[idx];
      this.renderAvatarPreview();
    };

    document.getElementById('prevColorBtn')?.addEventListener('click', () => {
      cycleAvatarProp('skinColor', AVATAR_OPTIONS.skinColors);
    });

    document.getElementById('nextHairBtn')?.addEventListener('click', () => {
      cycleAvatarProp('hair', AVATAR_OPTIONS.hairs);
    });

    document.getElementById('nextAccBtn')?.addEventListener('click', () => {
      cycleAvatarProp('hat', AVATAR_OPTIONS.hats);
    });

    document.getElementById('nextOutfitBtn')?.addEventListener('click', () => {
      cycleAvatarProp('outfit', AVATAR_OPTIONS.outfits);
    });

    document.getElementById('nextEyeBtn')?.addEventListener('click', () => {
      cycleAvatarProp('eye', AVATAR_OPTIONS.eyes);
    });

    document.getElementById('nextMouthBtn')?.addEventListener('click', () => {
      cycleAvatarProp('mouth', AVATAR_OPTIONS.mouths);
    });

    document.getElementById('nextNeckBtn')?.addEventListener('click', () => {
      cycleAvatarProp('accessory', AVATAR_OPTIONS.accessories);
    });

    document.getElementById('nextBackpackBtn')?.addEventListener('click', () => {
      cycleAvatarProp('backpack', AVATAR_OPTIONS.backpacks);
    });

    document.getElementById('randomAvatarBtn')?.addEventListener('click', () => {
      this.currentAvatar = getRandomAvatar();
      this.renderAvatarPreview();
    });

    // Character Studio Modal Triggers
    document.getElementById('openAvatarStudioBtn')?.addEventListener('click', () => {
      this.openAvatarStudio();
    });

    document.getElementById('closeAvatarStudioBtn')?.addEventListener('click', () => {
      this.closeAvatarStudio();
    });

    document.getElementById('studioSaveBtn')?.addEventListener('click', () => {
      this.closeAvatarStudio();
    });

    document.getElementById('studioHeroPresetBtn')?.addEventListener('click', () => {
      this.currentAvatar = getHeroPresetAvatar();
      this.renderStudioStage();
      this.renderStudioItemsGrid();
      this.renderAvatarPreview();
    });

    document.getElementById('studioRandomBtn')?.addEventListener('click', () => {
      this.currentAvatar = getRandomAvatar();
      this.renderStudioStage();
      this.renderStudioItemsGrid();
      this.renderAvatarPreview();
    });

    document.getElementById('stageRandomBtn')?.addEventListener('click', () => {
      this.currentAvatar = getRandomAvatar();
      this.renderStudioStage();
      this.renderStudioItemsGrid();
      this.renderAvatarPreview();
    });

    document.getElementById('stageResetBtn')?.addEventListener('click', () => {
      this.currentAvatar = getHeroPresetAvatar();
      this.renderStudioStage();
      this.renderStudioItemsGrid();
      this.renderAvatarPreview();
    });



    // Player Join button
    document.getElementById('joinPlayerBtn')?.addEventListener('click', () => {
      this.joinAsPlayer();
    });

    // Host Create Room button
    document.getElementById('createRoomBtn')?.addEventListener('click', () => {
      this.createRoomAsHost();
    });

    // Reconnect as Host
    document.getElementById('reconnectAdminBtn')?.addEventListener('click', () => {
      const code = document.getElementById('reconnectRoomCode')?.value.trim();
      const key = document.getElementById('reconnectAdminKey')?.value.trim();
      if (!code || !key) return alert('Please enter both Room Code and Admin Passkey');
      this.joinAsAdmin(code, key);
    });

    // Launch Arena Display button
    document.getElementById('launchArenaBtn')?.addEventListener('click', () => {
      const code = document.getElementById('arenaRoomCode')?.value.trim();
      if (!code) return alert('Please enter a Room Code');
      this.joinAsArena(code);
    });

    // Chat submit
    document.getElementById('chatForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.sendChatMessage();
    });

    // Round End Scoreboard Close Button
    document.getElementById('roundEndCloseBtn')?.addEventListener('click', () => {
      if (this.roundEndTimeout) clearTimeout(this.roundEndTimeout);
      document.getElementById('roundEndModal')?.classList.add('hidden');
    });

    // View Full Report Button
    document.getElementById('viewFullReportBtn')?.addEventListener('click', () => {
      this.showFullReportModal();
    });

    // Close Full Report / Back to Podium
    document.getElementById('closeFullReportBtn')?.addEventListener('click', () => {
      document.getElementById('fullReportModal')?.classList.add('hidden');
      document.getElementById('podiumModal')?.classList.remove('hidden');
    });

    // Full Report return to lobby
    document.getElementById('fullReportLobbyBtn')?.addEventListener('click', () => {
      document.getElementById('fullReportModal')?.classList.add('hidden');
      document.getElementById('podiumModal')?.classList.add('hidden');
      if (this.currentRole === 'admin') {
        this.switchScreen('adminScreen');
      } else {
        this.switchScreen('lobbyScreen');
      }
    });

    // Podium close button
    document.getElementById('podiumCloseBtn')?.addEventListener('click', () => {
      document.getElementById('podiumModal')?.classList.add('hidden');
      document.getElementById('fullReportModal')?.classList.add('hidden');
      if (this.currentRole === 'admin') {
        this.switchScreen('adminScreen');
      } else {
        this.switchScreen('lobbyScreen');
      }
    });

    // Admin Controls
    document.getElementById('adminStartGameBtn')?.addEventListener('click', () => {
      this.socket.emit('start_game', {
        roomCode: this.roomCode,
        adminKey: this.adminKey
      }, (res) => {
        if (!res?.success) alert(res?.error || 'Failed to start game');
      });
    });

    document.getElementById('adminPauseBtn')?.addEventListener('click', () => {
      this.socket.emit('admin_pause', {
        roomCode: this.roomCode,
        adminKey: this.adminKey
      }, (res) => {
        if (res?.success) {
          document.getElementById('adminPauseBtn').innerHTML = res.isPaused ? `${SVG_ICONS.play} RESUME` : `${SVG_ICONS.pause} PAUSE`;
        }
      });
    });

    document.getElementById('adminSkipBtn')?.addEventListener('click', () => {
      this.socket.emit('admin_skip', {
        roomCode: this.roomCode,
        adminKey: this.adminKey
      });
    });

    document.getElementById('adminEndGameBtn')?.addEventListener('click', () => {
      if (confirm('End the current match early? (Shows podium and resets to lobby)')) {
        this.socket.emit('admin_end_match', {
          roomCode: this.roomCode,
          adminKey: this.adminKey
        }, (res) => {
          if (!res?.success) alert(res?.error || 'Could not end match');
        });
      }
    });

    document.getElementById('adminCloseLobbyBtn')?.addEventListener('click', () => {
      if (confirm('Permanently close and destroy this lobby for everyone?')) {
        this.socket.emit('admin_close_lobby', {
          roomCode: this.roomCode,
          adminKey: this.adminKey
        }, (res) => {
          if (res?.success) {
            alert('Lobby closed successfully.');
            window.location.href = window.location.pathname;
          } else {
            alert(res?.error || 'Could not close lobby');
          }
        });
      }
    });

    document.getElementById('adminSaveWordsBtn')?.addEventListener('click', () => {
      const words = (document.getElementById('adminLiveWordList')?.value || '').trim();
      const wordMode = words.length > 0 ? 'custom' : 'random';
      this.socket.emit('admin_update_settings', {
        roomCode: this.roomCode,
        adminKey: this.adminKey,
        settings: { 
          wordMode: wordMode,
          customWords: words 
        }
      }, (res) => {
        if (res?.success) {
          alert(wordMode === 'custom' ? 'Custom words updated successfully!' : 'Switched to automatic Random Words!');
        }
      });
    });

    document.getElementById('adminSaveRulesBtn')?.addEventListener('click', () => {
      const rounds = document.getElementById('adminLiveRounds')?.value;
      const drawTime = document.getElementById('adminLiveDrawTime')?.value;
      this.socket.emit('admin_update_settings', {
        roomCode: this.roomCode,
        adminKey: this.adminKey,
        settings: { rounds, drawTime }
      }, (res) => {
        if (res?.success) alert('Room rules updated!');
      });
    });

    document.getElementById('adminOpenArenaLinkBtn')?.addEventListener('click', () => {
      const url = `${window.location.origin}?room=${this.roomCode}&view=arena`;
      window.open(url, '_blank');
    });

    // Track word count in host setup textarea
    document.getElementById('adminCustomWords')?.addEventListener('input', (e) => {
      const words = e.target.value.split(/[\n,;]+/).filter(w => w.trim().length > 1);
      const helper = document.getElementById('wordCountHelp');
      if (helper) helper.textContent = `Words loaded: ${words.length}`;
    });
  }

  renderAvatarPreview() {
    const container = document.getElementById('avatarPreviewContainer');
    if (container) {
      container.innerHTML = renderAvatarSvg(this.currentAvatar, 110);
    }
  }

  openAvatarStudio() {
    const modal = document.getElementById('avatarStudioModal');
    if (!modal) return;
    modal.classList.remove('hidden');
    this.renderStudioCategoryNav();
    this.renderStudioItemsGrid();
    this.renderStudioStage();
  }

  closeAvatarStudio() {
    const modal = document.getElementById('avatarStudioModal');
    if (modal) modal.classList.add('hidden');
    this.renderAvatarPreview();
  }

  renderStudioCategoryNav() {
    const nav = document.getElementById('studioCategoryNav');
    if (!nav) return;

    nav.innerHTML = AVATAR_CATEGORIES.map(cat => {
      const isActive = cat.id === this.activeStudioCategory;
      return `
        <button type="button" class="studio-tab-btn ${isActive ? 'active' : ''}" data-cat="${cat.id}" title="${cat.name}">
          <span class="studio-tab-icon">${cat.icon}</span>
          <span class="studio-tab-label">${cat.name.split(' ')[0]}</span>
        </button>
      `;
    }).join('');

    nav.querySelectorAll('.studio-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const catId = btn.getAttribute('data-cat');
        this.activeStudioCategory = catId;
        this.renderStudioCategoryNav();
        this.renderStudioItemsGrid();
      });
    });
  }

  renderStudioItemsGrid() {
    const grid = document.getElementById('studioItemsGrid');
    const titleEl = document.getElementById('studioCategoryTitle');
    const descEl = document.getElementById('studioCategoryDesc');
    if (!grid) return;

    const currentCatObj = AVATAR_CATEGORIES.find(c => c.id === this.activeStudioCategory) || AVATAR_CATEGORIES[0];
    const catId = currentCatObj.id;

    // Get items list for this category
    let itemList = [];
    if (catId === 'skinColor') itemList = AVATAR_OPTIONS.skinColors;
    else if (catId === 'hair') itemList = AVATAR_OPTIONS.hairs;
    else if (catId === 'hat') itemList = AVATAR_OPTIONS.hats;
    else if (catId === 'outfit') itemList = AVATAR_OPTIONS.outfits;
    else if (catId === 'eye') itemList = AVATAR_OPTIONS.eyes;
    else if (catId === 'mouth') itemList = AVATAR_OPTIONS.mouths;
    else if (catId === 'accessory') itemList = AVATAR_OPTIONS.accessories;
    else if (catId === 'backpack') itemList = AVATAR_OPTIONS.backpacks;

    if (titleEl) {
      titleEl.innerHTML = `${currentCatObj.name} <span class="studio-item-count" id="studioItemCount">(${itemList.length} items)</span>`;
    }
    if (descEl) descEl.textContent = currentCatObj.desc || 'Select an item to equip';

    const detailsMap = AVATAR_ITEM_DETAILS[catId] || {};

    grid.innerHTML = itemList.map(itemId => {
      const isSelected = this.currentAvatar[catId] === itemId;
      const details = detailsMap[itemId] || { name: itemId };

      // Render thumbnail
      let thumbHtml = '';
      if (catId === 'skinColor') {
        thumbHtml = `<div class="color-swatch-thumb" style="background-color: ${itemId};"></div>`;
      } else {
        // Create a live avatar preview with this specific item equipped!
        const previewAvatar = { ...this.currentAvatar, [catId]: itemId };
        thumbHtml = renderAvatarSvg(previewAvatar, 52);
      }

      return `
        <div class="studio-item-card ${isSelected ? 'selected' : ''}" data-cat="${catId}" data-id="${itemId}" role="button" tabindex="0">
          <div class="item-thumb-box">${thumbHtml}</div>
          <div class="studio-item-title">${details.name || itemId}</div>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('.studio-item-card').forEach(card => {
      card.addEventListener('click', () => {
        const itemVal = card.getAttribute('data-id');
        this.currentAvatar[catId] = itemVal;
        this.renderStudioStage();
        this.renderStudioItemsGrid();
        this.renderAvatarPreview();
        try { soundEngine?.play('click'); } catch (e) {}
      });
    });
  }

  renderStudioStage() {
    const stage = document.getElementById('studioStageAvatar');
    if (stage) {
      stage.innerHTML = renderAvatarSvg(this.currentAvatar, 210);
    }
  }

  checkUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const room = params.get('room');
    const view = params.get('view');

    if (room) {
      const code = room.toUpperCase();
      document.getElementById('playerRoomCode').value = code;
      document.getElementById('reconnectRoomCode').value = code;
      document.getElementById('arenaRoomCode').value = code;

      if (view === 'arena') {
        // Automatically switch to Arena tab
        const arenaTabBtn = document.querySelector('[data-tab="tabArena"]');
        arenaTabBtn?.click();
      }
    }
  }



  async checkSupabaseStatus() {
    try {
      const res = await fetch(this.apiUrl('/api/supabase/status'));
      const data = await res.json();
      const btn = document.getElementById('supabaseStatusBtn');
      const statusBox = document.getElementById('supabaseConnectionStatusBox');

      if (data.configured) {
        if (btn) {
          btn.textContent = 'Supabase: Connected';
          btn.style.borderColor = 'var(--accent-emerald)';
          btn.style.color = '#34d399';
        }
        if (statusBox) {
          statusBox.style.background = 'rgba(16, 185, 129, 0.2)';
          statusBox.style.border = '1px solid var(--accent-emerald)';
          statusBox.style.color = '#34d399';
          statusBox.innerHTML = '<strong>Connected!</strong> Active rooms, game sessions, and player leaderboards are persisting to Supabase in real-time.';
        }
      } else {
        if (btn) {
          btn.textContent = 'Supabase: Local (Setup)';
          btn.style.borderColor = 'var(--accent-amber)';
          btn.style.color = 'var(--accent-amber)';
        }
        if (statusBox) {
          statusBox.style.background = 'rgba(245, 158, 11, 0.2)';
          statusBox.style.border = '1px solid var(--accent-amber)';
          statusBox.style.color = 'var(--accent-amber)';
          statusBox.innerHTML = '<strong>Unconfigured</strong>: Game is running in local memory fallback mode. Add SUPABASE_URL and SUPABASE_ANON_KEY to your .env file to enable cloud persistence.';
        }
      }
    } catch (e) {
      console.warn('Could not check Supabase status:', e);
    }
  }



  openScoringRulesModal() {
    const modal = document.getElementById('scoringRulesModal');
    if (!modal) return;
    modal.classList.remove('hidden');
    modal.scrollTop = 0;
  }

  closeScoringRulesModal() {
    document.getElementById('scoringRulesModal')?.classList.add('hidden');
  }

  openHallOfFameModal() {
    this.openLobbyResultsModal();
  }

  openLobbyResultsModal() {
    const modal = document.getElementById('hallOfFameModal');
    if (!modal) return;
    modal.classList.remove('hidden');
    modal.scrollTop = 0;
    const content = document.getElementById('tabLobbyMatchesContent');
    if (content) content.scrollTop = 0;

    // Default to Lobby Matches tab
    document.getElementById('tabLobbyMatchesBtn')?.classList.add('active');
    document.getElementById('tabGlobalRanksBtn')?.classList.remove('active');
    document.getElementById('tabLobbyMatchesContent')?.classList.remove('hidden');
    document.getElementById('tabGlobalRanksContent')?.classList.add('hidden');

    this.loadLobbyResults();
  }

  async loadLobbyResults(showLoading = false) {
    const listEl = document.getElementById('lobbyResultsList');
    const countEl = document.getElementById('lobbyMatchCount');
    if (!listEl) return;

    if (showLoading || !this.cachedLobbyResults) {
      listEl.innerHTML = '<div style="text-align:center;padding:30px;color:var(--text-muted);">Loading live lobby results...</div>';
    }

    try {
      const res = await fetch(this.apiUrl('/api/lobby-results'));
      const data = await res.json();
      const results = (data && data.results) || [];
      this.cachedLobbyResults = results;
      if (countEl) countEl.textContent = results.length;
      this.renderLobbyResults(results);
    } catch (e) {
      listEl.innerHTML = `<div style="text-align:center;padding:20px;color:var(--accent-rose);">Failed to load lobby results: ${e.message}</div>`;
    }
  }

  renderLobbyResults(results) {
    const listEl = document.getElementById('lobbyResultsList');
    const countEl = document.getElementById('lobbyMatchCount');
    if (!listEl) return;

    if (countEl) countEl.textContent = results.length;

    if (!results || results.length === 0) {
      listEl.innerHTML = `
        <div class="lobby-empty-state">
          <div class="empty-icon">${SVG_ICONS.gamepad}</div>
          <p class="empty-title">No Lobby Matches Recorded Yet</p>
          <p class="empty-desc">Once any game lobby finishes a match, the full match result and player rankings will automatically appear here!</p>
        </div>
      `;
      return;
    }

    listEl.innerHTML = '';
    results.forEach((r, idx) => {
      const card = document.createElement('div');
      card.className = 'lobby-card-item';
      const cardId = r.id || `session_${idx}`;
      card.id = `lobby_result_${cardId}`;

      const modeBadge = r.game_mode === 'team' ? 'Red vs Blue Team' : 'Classic FFA';
      const timeAgo = this.formatTimeAgo(r.created_at);
      const winnerName = r.winner_name || 'Champion';
      const winnerScore = r.winner_score || 0;
      
      const podiumList = Array.isArray(r.podium) ? r.podium : [];
      const winnerAvatar = r.winner_avatar || (podiumList[0] && podiumList[0].avatar) || {};

      let podiumSummaryHtml = '';
      if (podiumList[1]) {
        podiumSummaryHtml += `<div class="podium-summary-item"><span>2nd:</span> <strong>${this.escapeHtml(podiumList[1].name)}</strong> <span style="color:var(--accent-cyan);">(${podiumList[1].score || 0} pts)</span></div>`;
      }
      if (podiumList[2]) {
        podiumSummaryHtml += `<div class="podium-summary-item"><span>3rd:</span> <strong>${this.escapeHtml(podiumList[2].name)}</strong> <span style="color:var(--accent-cyan);">(${podiumList[2].score || 0} pts)</span></div>`;
      }

      const allPlayers = Array.isArray(r.all_players) && r.all_players.length > 0 ? r.all_players : podiumList;
      const totalPlayers = allPlayers.length;

      // Build drawer rows
      let drawerRowsHtml = '';
      allPlayers.forEach((p, pIdx) => {
        const medal = pIdx === 0 ? '1st' : pIdx === 1 ? '2nd' : pIdx === 2 ? '3rd' : `#${pIdx + 1}`;
        const teamTag = p.team && p.team !== 'auto' ? `<span class="team-badge badge-${p.team}" style="font-size:0.65rem;padding:1px 5px;margin-left:4px;">${p.team}</span>` : '';
        drawerRowsHtml += `
          <div class="lobby-player-row">
            <div class="player-row-left">
              <span class="player-row-rank">${medal}</span>
              <div class="player-row-avatar">${renderAvatarSvg(p.avatar || {}, 20)}</div>
              <strong>${this.escapeHtml(p.name)}</strong>
              ${teamTag}
            </div>
            <div class="player-row-score">${p.score || 0} pts</div>
          </div>
        `;
      });

      card.innerHTML = `
        <div class="lobby-card-top">
          <div class="lobby-card-info">
            <span class="lobby-code-badge">LOBBY #${r.room_code || 'MATCH'}</span>
            <span class="lobby-mode-badge">${modeBadge}</span>
            <span class="lobby-rounds-badge">${r.total_rounds || 3} Rounds</span>
          </div>
          <div style="display:flex;align-items:center;gap:12px;">
            <span class="lobby-time-tag">${timeAgo}</span>
            <button class="toggle-players-btn" data-target="drawer_${cardId}">
              Standings (${totalPlayers})
            </button>
          </div>
        </div>

        <div class="lobby-card-body">
          <div class="lobby-winner-pill">
            <div class="lobby-winner-avatar">${renderAvatarSvg(winnerAvatar, 28)}</div>
            <div class="lobby-winner-info">
              <span class="winner-crown-label">Champion</span>
              <span class="winner-name">${this.escapeHtml(winnerName)}</span>
            </div>
            <span class="winner-points-tag">${winnerScore} pts</span>
          </div>

          ${podiumSummaryHtml ? `<div class="lobby-podium-summary">${podiumSummaryHtml}</div>` : ''}
        </div>

        <div class="lobby-players-drawer hidden" id="drawer_${cardId}">
          <div class="drawer-header-row">
            <span>RANK &amp; PLAYER</span>
            <span style="text-align:right;">EARNED POINTS</span>
          </div>
          ${drawerRowsHtml}
        </div>
      `;

      // Handle drawer toggle
      const toggleBtn = card.querySelector('.toggle-players-btn');
      const drawer = card.querySelector(`#drawer_${cardId}`);
      toggleBtn?.addEventListener('click', () => {
        const isHidden = drawer.classList.contains('hidden');
        drawer.classList.toggle('hidden', !isHidden);
        toggleBtn.textContent = isHidden ? `Hide Standings (${totalPlayers})` : `Standings (${totalPlayers})`;
      });

      listEl.appendChild(card);
    });
  }

  handleNewLobbyResult(newSession) {
    if (!newSession) return;
    if (!this.cachedLobbyResults) this.cachedLobbyResults = [];

    // Add to cache if not already present
    const exists = this.cachedLobbyResults.some(r => r.id === newSession.id || (r.room_code === newSession.room_code && Math.abs(new Date(r.created_at) - new Date(newSession.created_at)) < 5000));
    if (!exists) {
      this.cachedLobbyResults.unshift(newSession);
    }

    const modal = document.getElementById('hallOfFameModal');
    // If modal is visible, re-render
    if (modal && !modal.classList.contains('hidden')) {
      this.renderLobbyResults(this.cachedLobbyResults);
    } else {
      // Update count badge
      const countEl = document.getElementById('lobbyMatchCount');
      if (countEl) countEl.textContent = this.cachedLobbyResults.length;
    }
  }

  async loadGlobalLeaderboard() {
    const tbody = document.getElementById('hallOfFameTableBody');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:20px;color:var(--text-muted);">Loading All-Time Player Ranks...</td></tr>';
    try {
      const res = await fetch(this.apiUrl('/api/leaderboard'));
      const data = await res.json();
      tbody.innerHTML = '';

      if (!data.leaderboard || data.leaderboard.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:20px;color:var(--text-muted);">No player records yet. Finish a match to record all-time points!</td></tr>';
        return;
      }

      data.leaderboard.forEach((p, idx) => {
        const tr = document.createElement('tr');
        const rankMedal = idx === 0 ? '1st' : idx === 1 ? '2nd' : idx === 2 ? '3rd' : `#${idx + 1}`;
        tr.innerHTML = `
          <td><strong>${rankMedal}</strong></td>
          <td>
            <div style="display:flex;align-items:center;gap:8px;">
              <div style="width:24px;height:24px;">${renderAvatarSvg(p.avatar, 24)}</div>
              <strong>${this.escapeHtml(p.player_name)}</strong>
            </div>
          </td>
          <td><strong style="color:var(--accent-cyan);">${p.total_score} pts</strong></td>
          <td>${p.matches_played}</td>
          <td><span style="color:var(--accent-emerald);font-weight:700;">${p.matches_won}</span></td>
        `;
        tbody.appendChild(tr);
      });
    } catch (e) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:20px;color:var(--accent-rose);">Failed to load all-time ranks: ${e.message}</td></tr>`;
    }
  }

  formatTimeAgo(dateStr) {
    if (!dateStr) return 'Just now';
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffSec = Math.floor((now - date) / 1000);
      if (diffSec < 15) return 'Just now';
      if (diffSec < 60) return `${diffSec}s ago`;
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `${diffMin}m ago`;
      const diffHours = Math.floor(diffMin / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return date.toLocaleDateString();
    } catch {
      return 'Recently';
    }
  }

  switchScreen(screenId) {
    document.querySelectorAll('.view-screen').forEach(s => s.classList.remove('active-screen'));
    document.getElementById(screenId)?.classList.add('active-screen');
  }

  // --- JOIN FLOWS ---

  joinAsPlayer() {
    if (!this.socket || !this.socket.connected) {
      this.showServerNoticeBanner('Server offline: Please check your game server connection.');
      return alert('Not connected to the game server!\nPlease ensure the game server is running.');
    }

    const roomCode = document.getElementById('playerRoomCode')?.value.trim().toUpperCase();
    const name = document.getElementById('playerName')?.value.trim() || 'Player';
    const teamInput = document.querySelector('input[name="playerTeam"]:checked')?.value || 'auto';

    if (!roomCode || roomCode.length < 4) {
      return alert('Please enter a valid 6-character Room Code');
    }

    this.socket.emit('join_room', {
      roomCode,
      role: 'player',
      name,
      avatar: this.currentAvatar,
      team: teamInput === 'auto' ? null : teamInput
    }, (res) => {
      if (!res?.success) {
        return alert(res?.error || 'Could not join room');
      }
      this.currentRole = 'player';
      this.roomCode = roomCode;
      this.setupActiveSession();
      this.switchScreen('gameScreen');
      this.initDrawingBoard();
    });
  }

  async createRoomAsHost() {
    const rounds = parseInt(document.getElementById('adminRounds')?.value || 3, 10);
    const drawTime = parseInt(document.getElementById('adminDrawTime')?.value || 80, 10);
    const gameMode = document.querySelector('input[name="adminGameMode"]:checked')?.value || 'ffa';
    const wordMode = document.querySelector('input[name="adminWordMode"]:checked')?.value || 'random';
    const wordsRaw = wordMode === 'custom' ? (document.getElementById('adminCustomWords')?.value || '') : '';

    if (wordMode === 'custom' && !wordsRaw.trim()) {
      return alert('Please enter your custom words in the box, or select "Random Words (Automatic)".');
    }

    try {
      const res = await fetch(this.apiUrl('/api/rooms/create'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: {
            rounds,
            drawTime,
            gameMode,
            wordMode,
            customWords: wordsRaw
          }
        })
      });
      const data = await res.json();
      if (!data.success) {
        return alert('Failed to create room: ' + data.error);
      }

      this.joinAsAdmin(data.roomCode, data.adminKey);
    } catch (err) {
      this.showServerNoticeBanner('Backend error: Could not reach game server.');
      alert('Error creating room: ' + err.message);
    }
  }

  joinAsAdmin(roomCode, adminKey) {
    if (!this.socket || !this.socket.connected) {
      this.showServerNoticeBanner('Server offline: Could not connect to game server.');
      return alert('Not connected to the game server!\nPlease ensure the game server is running.');
    }

    const cleanCode = roomCode.toUpperCase().trim();
    this.socket.emit('join_room', {
      roomCode: cleanCode,
      role: 'admin',
      name: 'Host Admin',
      adminKey: adminKey
    }, (res) => {
      if (!res?.success) {
        return alert(res?.error || 'Invalid Admin Credentials');
      }
      this.currentRole = 'admin';
      this.roomCode = cleanCode;
      this.adminKey = adminKey;
      this.setupActiveSession();
      this.switchScreen('adminScreen');

      // Populate Admin UI
      document.getElementById('adminDisplayRoomCode').textContent = cleanCode;
      document.getElementById('adminDisplayKey').textContent = adminKey;
    });
  }

  joinAsArena(roomCode) {
    if (!this.socket || !this.socket.connected) {
      this.showServerNoticeBanner('Server offline: Could not connect to game server.');
      return alert('Not connected to the game server!\nPlease ensure the game server is running.');
    }

    const cleanCode = roomCode.toUpperCase().trim();
    this.socket.emit('join_room', {
      roomCode: cleanCode,
      role: 'arena',
      name: 'Arena Display'
    }, (res) => {
      if (!res?.success) {
        return alert(res?.error || 'Could not connect Arena Display');
      }
      this.currentRole = 'arena';
      this.roomCode = cleanCode;
      this.setupActiveSession();
      this.switchScreen('arenaScreen');
      this.initArenaBoard();

      document.getElementById('arenaCodeBadge').textContent = cleanCode;
      document.getElementById('arenaJoinHostText').textContent = window.location.host;

      // Start BGM automatically on big screen if preferred
      soundEngine.startBGM();
      const bgmBtn = document.getElementById('bgmToggleBtn');
      if (bgmBtn) {
        bgmBtn.innerHTML = `${SVG_ICONS.music} BGM: ON`;
        bgmBtn.classList.add('active');
      }
    });
  }

  setupActiveSession() {
    // Show room code badge in header
    const container = document.getElementById('roomBadgeContainer');
    if (container) container.classList.remove('hidden');
    document.getElementById('headerRoomCode').textContent = this.roomCode;

    // Set role indicator
    const rolePill = document.getElementById('roleIndicator');
    if (rolePill) {
      rolePill.classList.remove('hidden');
      rolePill.textContent = this.currentRole.toUpperCase();
    }
  }

  initDrawingBoard() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;

    this.drawingBoard = new DrawingBoard(canvas, {
      isInteractive: false, // Default false until chosen as drawer
      onStroke: (stroke) => {
        this.socket.emit('draw_stroke', {
          roomCode: this.roomCode,
          stroke: stroke
        });
      }
    });

    this.bindDrawingToolbar();
  }

  initArenaBoard() {
    const canvas = document.getElementById('arenaCanvas');
    if (!canvas) return;

    this.arenaBoard = new DrawingBoard(canvas, {
      isInteractive: false
    });
  }

  bindDrawingToolbar() {
    // Tool buttons
    document.querySelectorAll('.tool-btn[data-tool]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tool-btn[data-tool]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.drawingBoard.setTool(btn.getAttribute('data-tool'));
      });
    });

    // Undo
    document.getElementById('toolUndo')?.addEventListener('click', () => {
      this.drawingBoard.undo();
      this.socket.emit('draw_stroke', {
        roomCode: this.roomCode,
        stroke: { type: 'undo' }
      });
    });

    // Clear
    document.getElementById('toolClear')?.addEventListener('click', () => {
      if (confirm('Clear the entire canvas?')) {
        this.drawingBoard.clear();
      }
    });

    // Bomb Erase
    document.getElementById('toolBomb')?.addEventListener('click', () => {
      this.socket.emit('trigger_powerup', {
        roomCode: this.roomCode,
        powerup: 'bomb'
      });
    });

    // Brush size dots
    document.querySelectorAll('.size-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        document.querySelectorAll('.size-dot').forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        const size = dot.getAttribute('data-size');
        this.drawingBoard.setSize(size);
        document.getElementById('brushSizeSlider').value = size;
      });
    });

    // Brush size slider
    document.getElementById('brushSizeSlider')?.addEventListener('input', (e) => {
      this.drawingBoard.setSize(e.target.value);
    });

    // Color Swatches
    const palette = document.getElementById('colorPalette');
    if (palette) {
      this.paletteColors.forEach(c => {
        const swatch = document.createElement('div');
        swatch.className = 'color-swatch';
        swatch.style.backgroundColor = c;
        swatch.addEventListener('click', () => {
          document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
          swatch.classList.add('active');
          this.drawingBoard.setColor(c);
          document.getElementById('customColorPicker').value = c;
        });
        palette.insertBefore(swatch, palette.firstChild);
      });
    }

    // Custom Color Input
    document.getElementById('customColorPicker')?.addEventListener('input', (e) => {
      this.drawingBoard.setColor(e.target.value);
    });
  }

  // --- ROOM STATE SYNCHRONIZATION ---

  onRoomStateUpdate(state) {
    this.roomState = state;
    const isMeDrawer = state.currentDrawerId === this.myPlayerId;
    this.isMyTurn = isMeDrawer;

    // Synchronize canvas strokes if newly joining
    if (this.drawingBoard && state.strokes && state.strokes.length > 0 && !this.isMyTurn) {
      this.drawingBoard.loadStrokes(state.strokes);
    }
    if (this.arenaBoard && state.strokes && state.strokes.length > 0) {
      this.arenaBoard.loadStrokes(state.strokes);
    }

    // Automatically reset canvas if server strokes are cleared on new turn
    if (Array.isArray(state.strokes) && state.strokes.length === 0) {
      if (this.drawingBoard && this.drawingBoard.history.length > 0) {
        this.drawingBoard.reset();
      }
      if (this.arenaBoard && this.arenaBoard.history.length > 0) {
        this.arenaBoard.reset();
      }
    }

    // Restore or close the round-end modal from server state.
    if (state.state === 'ROUND_END' && state.roundEndData) {
      this.showRoundEndModal(state.roundEndData);
    } else if (state.state === 'SELECTING_WORD' || state.state === 'DRAWING' || state.state === 'LOBBY' || state.state === 'GAME_OVER') {
      if (this.roundEndTimeout) clearTimeout(this.roundEndTimeout);
      document.getElementById('roundEndModal')?.classList.add('hidden');
    }

    // Keep the word picker in sync for the drawer, even after reconnects.
    const wordPickerVisible = state.state === 'SELECTING_WORD' && isMeDrawer && Array.isArray(state.wordOptions) && state.wordOptions.length > 0;
    if (wordPickerVisible) {
      this.showWordPickerModal(state.wordOptions, state.timeLeft);
    } else if (state.state !== 'SELECTING_WORD') {
      document.getElementById('wordPickerModal')?.classList.add('hidden');
    }

    // Update Player View HUD
    this.updateHUD(state, isMeDrawer);
    // Update Leaderboard
    this.renderLeaderboard(state.players);
    // Update Admin Screen if Admin
    if (this.currentRole === 'admin') {
      this.updateAdminDashboard(state);
    }
    // Update Arena Screen if Arena
    if (this.currentRole === 'arena') {
      this.updateArenaDisplay(state);
    }
  }

  updateHUD(state, isMeDrawer) {
    // Round
    const hudRound = document.getElementById('hudRound');
    if (hudRound) hudRound.textContent = `${state.currentRound} / ${state.totalRounds}`;

    // Timer
    const hudTimer = document.getElementById('hudTimer');
    const timerProgress = document.getElementById('timerProgress');
    const timerWrap = document.querySelector('.timer-circle-wrap');
    if (hudTimer) {
      hudTimer.textContent = state.timeLeft;
      if (state.settings?.drawTime) {
        const pct = Math.max(0, state.timeLeft / state.settings.drawTime);
        const circumference = 2 * Math.PI * 16; // ~100.5
        if (timerProgress) {
          timerProgress.style.strokeDashoffset = (circumference * (1 - pct)).toString();
        }
      }
      if (state.timeLeft <= 10 && state.state === 'DRAWING') {
        timerWrap?.classList.add('timer-urgent');
      } else {
        timerWrap?.classList.remove('timer-urgent');
      }
    }

    // Drawer info
    const drawerAvatar = document.getElementById('drawerAvatarMini');
    const drawerName = document.getElementById('drawerName');
    if (drawerName) drawerName.textContent = state.currentDrawer?.name || 'Selecting...';
    if (drawerAvatar && state.currentDrawer?.avatar) {
      drawerAvatar.innerHTML = renderAvatarSvg(state.currentDrawer.avatar, 28);
    }

    // Secret Word / Word Blanks
    const wordBox = document.getElementById('wordRevealBox');
    const wordStatus = document.getElementById('wordStatusNotice');
    if (wordBox) {
      if (isMeDrawer && state.state === 'DRAWING' && state.word) {
        wordBox.innerHTML = `
          <div class="stealth-privacy-shield" id="stealthWordCard" title="Press & hold or hover to peek word (Side-view protected)">
            <span class="stealth-unrevealed">${SVG_ICONS.shield} HOLD TO PEEK [SIDE PROTECTED]</span>
            <span class="stealth-revealed">${state.word}</span>
          </div>
        `;
        const stealthEl = document.getElementById('stealthWordCard');
        if (stealthEl && !stealthEl.dataset.peekBound) {
          stealthEl.dataset.peekBound = 'true';
          const onHold = (e) => {
            if (e.cancelable && e.type.startsWith('touch')) e.preventDefault();
            stealthEl.classList.add('peeking');
          };
          const onRelease = () => { stealthEl.classList.remove('peeking'); };
          stealthEl.addEventListener('mouseenter', onHold);
          stealthEl.addEventListener('mouseleave', onRelease);
          stealthEl.addEventListener('mousedown', onHold);
          stealthEl.addEventListener('mouseup', onRelease);
          stealthEl.addEventListener('touchstart', onHold, { passive: false });
          stealthEl.addEventListener('touchend', onRelease);
          stealthEl.addEventListener('touchcancel', onRelease);
        }
      } else {
        wordBox.textContent = state.wordDisplay || '_ _ _ _ _';
      }
    }

    // Drawer Toolbar vs Guesser Action Bar
    const drawerToolbar = document.getElementById('drawerToolbar');
    const guesserBar = document.getElementById('guesserActionBar');
    const guesserStatus = document.getElementById('guesserStatusText');

    const isLobby = state.state === 'LOBBY';
    const canDraw = (isMeDrawer && state.state === 'DRAWING') || isLobby;

    if (this.drawingBoard) {
      this.drawingBoard.setInteractive(canDraw);
    }

    if (canDraw) {
      drawerToolbar?.classList.remove('hidden');
      if (isLobby) {
        guesserBar?.classList.add('hidden');
        if (wordStatus) wordStatus.textContent = 'Practice Canvas (Lobby Mode) - Draw freely while waiting for Host to start!';
      } else {
        guesserBar?.classList.add('hidden');
        if (wordStatus) wordStatus.textContent = 'It is your turn to draw! (Hold card above to peek secret word)';
      }
    } else {
      drawerToolbar?.classList.add('hidden');
      guesserBar?.classList.remove('hidden');

      const myPlayer = state.players.find(p => p.id === this.myPlayerId);
      if (myPlayer?.hasGuessed) {
        if (wordStatus) wordStatus.textContent = 'You guessed correctly! Enjoy watching the drawing.';
        if (guesserStatus) guesserStatus.textContent = 'You got it right! Enjoy the show!';
      } else {
        if (wordStatus) wordStatus.textContent = `${state.currentDrawer?.name || 'Someone'} is drawing!`;
        if (guesserStatus) guesserStatus.textContent = 'Type your guess in the chat box on the right!';
      }
    }

    // Lock chat writing for guessed players or active drawer, but keep comments display active
    const myPlayer = state.players.find(p => p.id === this.myPlayerId);
    const chatInput = document.getElementById('chatInput');
    const chatSendBtn = document.getElementById('chatSendBtn');
    if (chatInput) {
      if (myPlayer?.hasGuessed && state.state === 'DRAWING') {
        chatInput.disabled = true;
        chatInput.placeholder = 'Word found! Chat is locked so other players can guess.';
        chatInput.classList.add('input-locked');
        if (chatSendBtn) chatSendBtn.disabled = true;
      } else if (isMeDrawer && state.state === 'DRAWING') {
        chatInput.disabled = true;
        chatInput.placeholder = 'You are drawing! Chat is locked for drawer.';
        chatInput.classList.add('input-locked');
        if (chatSendBtn) chatSendBtn.disabled = true;
      } else {
        chatInput.disabled = false;
        chatInput.placeholder = 'Type your guess or message...';
        chatInput.classList.remove('input-locked');
        if (chatSendBtn) chatSendBtn.disabled = false;
      }
    }

    // Team scores bar in HUD
    const teamScoresBar = document.getElementById('teamScoresBar');
    if (teamScoresBar) {
      if (state.gameMode === 'team') {
        teamScoresBar.classList.remove('hidden');
        let red = 0, blue = 0;
        state.players.forEach(p => {
          if (p.team === 'red') red += p.score;
          if (p.team === 'blue') blue += p.score;
        });
        document.getElementById('redScore').textContent = red;
        document.getElementById('blueScore').textContent = blue;
      } else {
        teamScoresBar.classList.add('hidden');
      }
    }
  }

  showWordPickerModal(options, timeout) {
    document.getElementById('roundEndModal')?.classList.add('hidden');
    const modal = document.getElementById('wordPickerModal');
    const container = document.getElementById('wordChoicesContainer');
    const fill = document.getElementById('pickerTimerFill');
    if (!modal || !container) return;

    container.innerHTML = '';
    options.forEach((w, idx) => {
      const btn = document.createElement('button');
      btn.className = 'word-choice-btn stealth-choice-btn';
      btn.type = 'button';
      btn.title = 'Hover or hold to peek at this word';
      btn.innerHTML = `
        <span class="choice-unrevealed">
          <span style="display:flex;align-items:center;justify-content:center;margin-bottom:2px;">${SVG_ICONS.shield}</span>
          <span>WORD ${idx + 1}</span>
          <small style="font-size:0.72rem;color:#94a3b8;font-weight:600;margin-top:2px;">[Hover / Hold to Peek]</small>
        </span>
        <span class="choice-revealed">
          <span style="color:var(--accent-cyan);display:flex;align-items:center;justify-content:center;">${SVG_ICONS.eye}</span>
          <span>${this.escapeHtml(w)}</span>
        </span>
      `;

      // Touch / mouse listeners for hold-to-peek on touchscreen devices
      const onPeek = () => btn.classList.add('peeking');
      const onUnpeek = () => btn.classList.remove('peeking');

      btn.addEventListener('mouseenter', onPeek);
      btn.addEventListener('mouseleave', onUnpeek);
      btn.addEventListener('touchstart', onPeek, { passive: true });
      btn.addEventListener('touchend', onUnpeek);

      btn.addEventListener('click', () => {
        this.selectWord(w);
      });
      container.appendChild(btn);
    });

    modal.classList.remove('hidden');

    if (fill) {
      fill.style.width = '100%';
      setTimeout(() => {
        fill.style.transition = `width ${timeout}s linear`;
        fill.style.width = '0%';
      }, 50);
    }
  }

  selectWord(word) {
    document.getElementById('wordPickerModal')?.classList.add('hidden');
    this.socket.emit('select_word', {
      roomCode: this.roomCode,
      word: word
    });
  }

  renderLeaderboard(players = []) {
    const list = document.getElementById('leaderboardList');
    const badge = document.getElementById('playerCountBadge');
    if (!list) return;

    const playerRoleOnly = players.filter(p => p.role === 'player').sort((a, b) => b.score - a.score);
    if (badge) badge.textContent = playerRoleOnly.length;

    list.innerHTML = '';
    playerRoleOnly.forEach((p, idx) => {
      const card = document.createElement('div');
      card.className = `player-card ${p.id === this.roomState?.currentDrawerId ? 'is-drawer' : ''} ${p.hasGuessed ? 'has-guessed' : ''}`;
      
      const isDrawerIcon = p.id === this.roomState?.currentDrawerId ? '[Drawing] ' : '';
      const streakIcon = p.streak > 1 ? `<span class="streak-badge">${SVG_ICONS.flame} ${p.streak}</span>` : '';

      card.innerHTML = `
        <div class="player-card-left">
          <span class="player-rank">#${idx + 1}</span>
          <div class="avatar-mini">${renderAvatarSvg(p.avatar, 24)}</div>
          <div class="player-info">
            <span class="player-name-text" title="${p.name}">${isDrawerIcon}${p.name}</span>
            ${streakIcon}
          </div>
        </div>
        <div class="player-score">${p.score}</div>
      `;
      list.appendChild(card);
    });
  }

  // --- CHAT & GUESSES ---

  sendChatMessage() {
    const myPlayer = this.roomState?.players?.find(p => p.id === this.myPlayerId);
    if (myPlayer?.hasGuessed && this.roomState?.state === 'DRAWING') {
      return; // Cannot send comments once word is found
    }
    const input = document.getElementById('chatInput');
    const text = input?.value.trim();
    if (!text) return;

    this.socket.emit('chat_message', {
      roomCode: this.roomCode,
      text: text
    });

    input.value = '';
  }

  appendChatMessage(msg) {
    const container = document.getElementById('chatMessagesContainer');
    const arenaFeed = document.getElementById('arenaChatFeed');

    const msgEl = document.createElement('div');
    if (msg.system) {
      msgEl.className = `chat-msg chat-msg-system ${msg.highlight ? 'chat-msg-' + msg.highlight : ''}`;
      msgEl.textContent = msg.text;
    } else {
      msgEl.className = 'chat-msg chat-msg-user';
      msgEl.innerHTML = `
        <span class="chat-sender" style="color: ${msg.team === 'red' ? '#ef4444' : msg.team === 'blue' ? '#3b82f6' : 'var(--accent-cyan)'}">${msg.name}:</span>
        <span class="chat-text">${this.escapeHtml(msg.text)}</span>
      `;
    }

    if (container) {
      const shouldStickToBottom = (container.scrollHeight - container.scrollTop - container.clientHeight) < 40;
      container.appendChild(msgEl);
      while (container.children.length > 250) {
        container.removeChild(container.firstChild);
      }
      if (shouldStickToBottom) {
        container.scrollTop = container.scrollHeight;
      }
    }

    if (arenaFeed) {
      const shouldStickToBottom = (arenaFeed.scrollHeight - arenaFeed.scrollTop - arenaFeed.clientHeight) < 40;
      const arenaClone = msgEl.cloneNode(true);
      arenaFeed.appendChild(arenaClone);
      while (arenaFeed.children.length > 250) {
        arenaFeed.removeChild(arenaFeed.firstChild);
      }
      if (shouldStickToBottom) {
        arenaFeed.scrollTop = arenaFeed.scrollHeight;
      }
    }
  }

  showCloseGuessBanner(msg) {
    const banner = document.getElementById('closeGuessAlert');
    if (!banner) return;
    banner.textContent = msg;
    banner.classList.remove('hidden');
    setTimeout(() => {
      banner.classList.add('hidden');
    }, 2500);
  }

  escapeHtml(str) {
    return str.replace(/[&<>"']/g, (m) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    })[m]);
  }

  // --- ADMIN DASHBOARD SYNC ---

  updateAdminDashboard(state) {
    document.getElementById('adminGameStateBadge').textContent = `STATE: ${state.state}`;
    document.getElementById('adminPlayerCount').textContent = `${state.players.length} Players`;

    // Secret Word Monitor
    const secretWordEl = document.getElementById('adminSecretWordDisplay');
    const drawerEl = document.getElementById('adminDrawerDisplay');

    if (secretWordEl) {
      secretWordEl.innerHTML = `
        <div class="admin-hover-word-box stealth-privacy-shield" id="adminSecretWordCard" title="Press & hold or hover to peek word (Side-view protected)">
          <span class="stealth-unrevealed">${SVG_ICONS.shield} HOLD TO PEEK [SIDE SHIELD]</span>
          <span class="stealth-revealed">${state.word || '(None)'}</span>
        </div>
      `;
      const adminPeekEl = document.getElementById('adminSecretWordCard');
      if (adminPeekEl && !adminPeekEl.dataset.peekBound) {
        adminPeekEl.dataset.peekBound = 'true';
        const onHold = (e) => {
          if (e.cancelable && e.type.startsWith('touch')) e.preventDefault();
          adminPeekEl.classList.add('peeking');
        };
        const onRelease = () => { adminPeekEl.classList.remove('peeking'); };
        adminPeekEl.addEventListener('mouseenter', onHold);
        adminPeekEl.addEventListener('mouseleave', onRelease);
        adminPeekEl.addEventListener('mousedown', onHold);
        adminPeekEl.addEventListener('mouseup', onRelease);
        adminPeekEl.addEventListener('touchstart', onHold, { passive: false });
        adminPeekEl.addEventListener('touchend', onRelease);
        adminPeekEl.addEventListener('touchcancel', onRelease);
      }
    }
    if (drawerEl) drawerEl.textContent = `Drawer: ${state.currentDrawer?.name || 'None'}`;

    // Player Table with Online/Offline Status and Scores
    const tbody = document.getElementById('adminPlayerTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    const allPlayers = state.players.filter(p => p.role === 'player');

    allPlayers.forEach(p => {
      const tr = document.createElement('tr');
      const statusPill = p.connected !== false
        ? '<span class="status-pill-online">Online</span>'
        : '<span class="status-pill-offline">Left</span>';

      tr.innerHTML = `
        <td>
          <div style="display:flex;align-items:center;gap:6px;">
            <div style="width:20px;height:20px;">${renderAvatarSvg(p.avatar, 20)}</div>
            <strong>${p.name}</strong>
            ${statusPill}
            ${p.isMuted ? '[Muted]' : ''}
          </div>
        </td>
        <td><strong style="color:var(--accent-cyan);">${p.score}</strong></td>
        <td>
          <div class="admin-pt-btn-group">
            <button class="btn-pt plus" data-adjust="100" data-id="${p.id}">+100</button>
            <button class="btn-pt plus" data-adjust="50" data-id="${p.id}">+50</button>
            <button class="btn-pt minus" data-adjust="-50" data-id="${p.id}">-50</button>
          </div>
        </td>
        <td>
          <div class="admin-action-btn-group">
            <button class="btn-subtle" data-mute="${p.id}">${p.isMuted ? 'Unmute' : 'Mute'}</button>
            <button class="btn-danger" style="padding:4px 8px;font-size:0.75rem;" data-kick="${p.id}">Kick</button>
          </div>
        </td>
      `;

      // Point adjustments
      tr.querySelectorAll('[data-adjust]').forEach(btn => {
        btn.addEventListener('click', () => {
          const delta = parseInt(btn.getAttribute('data-adjust'), 10);
          const pid = btn.getAttribute('data-id');
          this.socket.emit('admin_adjust_score', {
            roomCode: this.roomCode,
            adminKey: this.adminKey,
            playerId: pid,
            delta
          });
        });
      });

      // Mute
      tr.querySelector('[data-mute]')?.addEventListener('click', () => {
        this.socket.emit('admin_mute', {
          roomCode: this.roomCode,
          adminKey: this.adminKey,
          playerId: p.id
        });
      });

      // Kick
      tr.querySelector('[data-kick]')?.addEventListener('click', () => {
        if (confirm(`Kick ${p.name}?`)) {
          this.socket.emit('admin_kick', {
            roomCode: this.roomCode,
            adminKey: this.adminKey,
            playerId: p.id
          });
        }
      });

      tbody.appendChild(tr);
    });

    // Render Entry & Exit Activity Logs
    const logBox = document.getElementById('adminActivityLogBox');
    const logCount = document.getElementById('adminLogCount');
    if (logBox && state.activityLogs) {
      if (logCount) logCount.textContent = `${state.activityLogs.length} Events`;
      if (state.activityLogs.length === 0) {
        logBox.innerHTML = '<div style="text-align:center;color:var(--text-dim);padding:8px;font-size:0.85rem;">No entry/exit activity recorded yet</div>';
      } else {
        logBox.innerHTML = '';
        [...state.activityLogs].reverse().forEach(log => {
          const item = document.createElement('div');
          item.className = `activity-log-item ${log.type === 'JOIN' ? 'log-join' : 'log-exit'}`;
          item.innerHTML = `
            <span>
              <strong class="${log.type === 'JOIN' ? 'log-tag-join' : 'log-tag-exit'}">${log.type === 'JOIN' ? 'ENTERED' : 'EXITED'}:</strong>
              ${log.name} ${log.score !== undefined ? `(${log.score} pts)` : ''}
            </span>
            <span class="log-time">${log.time}</span>
          `;
          logBox.appendChild(item);
        });
      }
    }
  }

  updateTimerDisplay(timeLeft, state) {
    if (this.roomState) {
      this.roomState.timeLeft = timeLeft;
    }
    const hudTimer = document.getElementById('hudTimer');
    const timerProgress = document.getElementById('timerProgress');
    const timerWrap = document.querySelector('.timer-circle-wrap');
    const arenaTimer = document.getElementById('arenaTimerDisplay');

    if (hudTimer) hudTimer.textContent = timeLeft;
    if (arenaTimer) arenaTimer.textContent = timeLeft;

    if (this.roomState?.settings?.drawTime) {
      const pct = Math.max(0, timeLeft / this.roomState.settings.drawTime);
      const circumference = 2 * Math.PI * 16;
      if (timerProgress) {
        timerProgress.style.strokeDashoffset = (circumference * (1 - pct)).toString();
      }
    }

    if (timeLeft <= 10 && state === 'DRAWING') {
      timerWrap?.classList.add('timer-urgent');
    } else {
      timerWrap?.classList.remove('timer-urgent');
    }
  }

  // --- ARENA DISPLAY SYNC ---

  updateArenaDisplay(state) {
    document.getElementById('arenaTimerDisplay').textContent = state.timeLeft;
    document.getElementById('arenaWordBlanks').textContent = state.wordDisplay || '_ _ _ _ _';
    document.getElementById('arenaRoundIndicator').textContent = `ROUND ${state.currentRound} / ${state.totalRounds}`;
    document.getElementById('arenaDrawerName').textContent = state.currentDrawer?.name || 'Selecting...';

    const avatarBox = document.getElementById('arenaDrawerAvatar');
    if (avatarBox && state.currentDrawer?.avatar) {
      avatarBox.innerHTML = renderAvatarSvg(state.currentDrawer.avatar, 52);
    }

    // Live Podium Leaderboard
    const list = document.getElementById('arenaLeaderboardList');
    if (!list) return;

    list.innerHTML = '';
    const ranked = state.players.filter(p => p.role === 'player').sort((a, b) => b.score - a.score);
    document.getElementById('arenaPlayerCount').textContent = `${ranked.length} PLAYERS`;

    ranked.forEach((p, idx) => {
      const card = document.createElement('div');
      const rankClass = idx === 0 ? 'rank-1' : idx === 1 ? 'rank-2' : idx === 2 ? 'rank-3' : '';
      card.className = `arena-player-card ${rankClass}`;

      card.innerHTML = `
        <div style="display:flex;align-items:center;gap:12px;">
          <span style="font-family:var(--font-mono);font-weight:900;font-size:1.2rem;width:28px;">#${idx + 1}</span>
          <div style="width:36px;height:36px;">${renderAvatarSvg(p.avatar, 36)}</div>
          <div>
            <div style="font-size:1.1rem;font-weight:800;">${p.name}</div>
            ${p.streak > 1 ? `<div style="display:flex;align-items:center;gap:4px;font-size:0.8rem;color:var(--accent-amber);">${SVG_ICONS.flame} ${p.streak} Streak</div>` : ''}
          </div>
        </div>
        <div style="font-family:var(--font-mono);font-size:1.3rem;font-weight:900;color:#fff;">${p.score}</div>
      `;
      list.appendChild(card);
    });
  }

  // --- ROUND / TURN END SCORES (SKRIBBL STYLE) ---

  showRoundEndModal(data) {
    const modal = document.getElementById('roundEndModal');
    const badgeEl = document.getElementById('roundEndBadge');
    const wordEl = document.getElementById('roundEndWord');
    const reasonEl = document.getElementById('roundEndReason');
    const listEl = document.getElementById('roundEndScoresList');
    const fillEl = document.getElementById('roundEndTimerFill');
    const footerEl = document.getElementById('roundEndFooterText');
    if (!modal) return;

    const cur = data.currentRound || this.roomState?.currentRound || 1;
    const tot = data.totalRounds || this.roomState?.totalRounds || 3;

    if (badgeEl) {
      if (data.isFinalRound) {
        badgeEl.textContent = `FINAL ROUND ${cur} / ${tot} COMPLETE`;
      } else {
        badgeEl.textContent = `ROUND ${cur} / ${tot} COMPLETE`;
      }
    }

    if (wordEl) wordEl.textContent = data.word ? data.word.toUpperCase() : '???';
    if (reasonEl) reasonEl.textContent = data.reason || 'Turn finished';

    if (footerEl) {
      if (data.isFinalRound) {
        footerEl.textContent = 'Calculating final victory standings & podium...';
      } else {
        const nextR = cur + 1 <= tot ? cur + 1 : tot;
        footerEl.textContent = `Next round (${nextR}/${tot}) starting in a few seconds...`;
      }
    }

    if (listEl) {
      listEl.innerHTML = '';
      if (Array.isArray(data.scores)) {
        data.scores.forEach(s => {
          const row = document.createElement('div');
          row.className = 'round-score-row';
          const isPos = s.pointsEarned > 0;
          row.innerHTML = `
            <div class="round-score-user">
              <div class="avatar-mini">${renderAvatarSvg(s.avatar, 24)}</div>
              <span class="user-name">${s.name}</span>
              ${s.isDrawer ? '<span class="drawer-tag">DRAWER</span>' : ''}
            </div>
            <div class="pts-earned ${isPos ? 'pts-positive' : 'pts-zero'}">
              ${isPos ? `+${s.pointsEarned}` : '+0'}
            </div>
            <div class="pts-total">
              ${s.totalScore.toLocaleString()} pts
            </div>
          `;
          listEl.appendChild(row);
        });
      }
    }

    modal.classList.remove('hidden');

    if (fillEl) {
      fillEl.style.transition = 'none';
      fillEl.style.width = '100%';
      const dur = data.duration || 5;
      setTimeout(() => {
        fillEl.style.transition = `width ${dur}s linear`;
        fillEl.style.width = '0%';
      }, 50);
    }

    // Auto-dismiss countdown to ensure screen NEVER gets stuck
    if (this.roundEndTimeout) clearTimeout(this.roundEndTimeout);
    const durSec = data.duration || 5;
    this.roundEndTimeout = setTimeout(() => {
      modal.classList.add('hidden');
    }, durSec * 1000);
  }

  // --- PODIUM CELEBRATION ---

  showPodiumModal(data) {
    this.lastMatchResults = data;
    if (this.roundEndTimeout) clearTimeout(this.roundEndTimeout);
    document.getElementById('roundEndModal')?.classList.add('hidden');

    const modal = document.getElementById('podiumModal');
    const stage = document.getElementById('podiumStage');
    const rowBasesContainer = document.getElementById('podiumRowBasesContainer');
    const rowBasesList = document.getElementById('podiumRowBases');
    if (!modal || !stage) return;

    stage.innerHTML = '';
    this.triggerConfetti(220);

    const all = data.allPlayers || data.podium || [];
    const p1 = all[0];
    const p2 = all[1];
    const p3 = all[2];

    // Pillar 2 (Silver - Left)
    if (p2) {
      stage.appendChild(this.createPillarEl(p2, 2, '2nd Place'));
    }
    // Pillar 1 (Gold - Center)
    if (p1) {
      stage.appendChild(this.createPillarEl(p1, 1, '1st Place'));
    }
    // Pillar 3 (Bronze - Right)
    if (p3) {
      stage.appendChild(this.createPillarEl(p3, 3, '3rd Place'));
    }

    // 4th and 5th on Row Bases
    const fourthAndFifth = all.slice(3, 5);
    if (rowBasesContainer && rowBasesList) {
      if (fourthAndFifth.length > 0) {
        rowBasesList.innerHTML = '';
        fourthAndFifth.forEach((p, idx) => {
          const rank = idx + 4;
          const card = document.createElement('div');
          card.className = 'podium-row-card';
          card.innerHTML = `
            <div class="podium-row-left">
              <span class="podium-row-rank">#${rank}</span>
              <div class="avatar-mini">${renderAvatarSvg(p.avatar, 26)}</div>
              <span class="podium-row-name">${p.name}</span>
            </div>
            <div class="podium-row-score">${p.score.toLocaleString()} pts</div>
          `;
          rowBasesList.appendChild(card);
        });
        rowBasesContainer.classList.remove('hidden');
      } else {
        rowBasesContainer.classList.add('hidden');
      }
    }

    modal.classList.remove('hidden');
  }

  showFullReportModal() {
    const data = this.lastMatchResults;
    if (!data || !data.allPlayers) return;

    const modal = document.getElementById('fullReportModal');
    const listEl = document.getElementById('fullReportList');
    const subEl = document.getElementById('fullReportSubtitle');
    if (!modal || !listEl) return;

    if (subEl) {
      subEl.textContent = `Room ${this.roomCode || 'Match'} | ${data.allPlayers.length} Players | ${data.totalRounds || 3} Rounds Completed`;
    }

    listEl.innerHTML = '';
    data.allPlayers.forEach((p, idx) => {
      const rank = idx + 1;
      const row = document.createElement('div');
      row.className = `full-report-row ${rank <= 3 ? 'rank-' + rank : ''}`;
      const medalIcon = rank === 1 ? '1st' : rank === 2 ? '2nd' : rank === 3 ? '3rd' : `#${rank}`;
      row.innerHTML = `
        <span style="font-weight:800;font-family:var(--font-mono);font-size:0.95rem;">${medalIcon}</span>
        <div style="display:flex;align-items:center;gap:10px;">
          <div class="avatar-mini">${renderAvatarSvg(p.avatar, 26)}</div>
          <span style="font-weight:700;color:#fff;">${p.name}</span>
        </div>
        <span style="color:var(--text-dim);font-size:0.85rem;">${p.isHost ? 'Host' : 'Player'}</span>
        <span class="full-report-points">${p.score.toLocaleString()} pts</span>
      `;
      listEl.appendChild(row);
    });

    document.getElementById('podiumModal')?.classList.add('hidden');
    modal.classList.remove('hidden');
  }

  createPillarEl(player, rank, label) {
    const el = document.createElement('div');
    el.className = `podium-pillar pillar-${rank}`;
    el.innerHTML = `
      <div style="width:48px;height:48px;">${renderAvatarSvg(player.avatar, 48)}</div>
      <div class="podium-player-name">${player.name}</div>
      <div class="podium-score">${player.score} pts</div>
      <div class="podium-rank-tag">${label}</div>
    `;
    return el;
  }

  openQrModal() {
    const modal = document.getElementById('qrModal');
    const qrContainer = document.getElementById('qrContainer');
    const urlText = document.getElementById('qrJoinUrlText');
    if (!modal) return;

    const joinUrl = `${window.location.origin}?room=${this.roomCode}`;
    urlText.textContent = joinUrl;

    // Generate lightweight SVG QR code representation
    qrContainer.innerHTML = `
      <svg width="180" height="180" viewBox="0 0 100 100" style="shape-rendering:crispEdges;">
        <rect width="100" height="100" fill="#ffffff"/>
        <!-- Corner Markers -->
        <rect x="5" y="5" width="25" height="25" fill="#0f172a"/>
        <rect x="9" y="9" width="17" height="17" fill="#ffffff"/>
        <rect x="13" y="13" width="9" height="9" fill="#0f172a"/>

        <rect x="70" y="5" width="25" height="25" fill="#0f172a"/>
        <rect x="74" y="9" width="17" height="17" fill="#ffffff"/>
        <rect x="78" y="13" width="9" height="9" fill="#0f172a"/>

        <rect x="5" y="70" width="25" height="25" fill="#0f172a"/>
        <rect x="9" y="74" width="17" height="17" fill="#ffffff"/>
        <rect x="13" y="78" width="9" height="9" fill="#0f172a"/>

        <!-- Artistic QR Data Matrix -->
        <rect x="36" y="8" width="5" height="5" fill="#0f172a"/>
        <rect x="46" y="14" width="5" height="5" fill="#0f172a"/>
        <rect x="56" y="8" width="5" height="5" fill="#0f172a"/>
        <rect x="36" y="24" width="25" height="5" fill="#0f172a"/>
        <rect x="15" y="38" width="70" height="5" fill="#0f172a"/>
        <rect x="25" y="48" width="15" height="5" fill="#0f172a"/>
        <rect x="55" y="48" width="25" height="5" fill="#0f172a"/>
        <rect x="35" y="60" width="30" height="8" fill="#0f172a"/>
        <rect x="45" y="75" width="15" height="15" fill="#0f172a"/>
        <rect x="70" y="70" width="20" height="20" fill="#0f172a"/>
      </svg>
    `;

    modal.classList.remove('hidden');
  }

  // --- DYNAMIC CONFETTI CELEBRATION ENGINE ---

  initConfetti() {
    if (!this.confettiCanvas) return;
    const resize = () => {
      this.confettiCanvas.width = window.innerWidth;
      this.confettiCanvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();
  }

  triggerConfetti(count = 100) {
    if (!this.confettiCtx) return;
    const colors = ['#38bdf8', '#a855f7', '#fbbf24', '#10b981', '#f43f5e', '#ec4899'];
    for (let i = 0; i < count; i++) {
      this.confettiParticles.push({
        x: Math.random() * this.confettiCanvas.width,
        y: -10,
        w: Math.random() * 8 + 6,
        h: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 6,
        vy: Math.random() * 5 + 4,
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10
      });
    }

    if (!this.confettiActive) {
      this.confettiActive = true;
      this.animateConfetti();
    }
  }

  animateConfetti() {
    if (!this.confettiCtx) return;
    this.confettiCtx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);

    for (let i = this.confettiParticles.length - 1; i >= 0; i--) {
      const p = this.confettiParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.rotSpeed;

      this.confettiCtx.save();
      this.confettiCtx.translate(p.x, p.y);
      this.confettiCtx.rotate((p.rot * Math.PI) / 180);
      this.confettiCtx.fillStyle = p.color;
      this.confettiCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      this.confettiCtx.restore();

      if (p.y > this.confettiCanvas.height) {
        this.confettiParticles.splice(i, 1);
      }
    }

    if (this.confettiParticles.length > 0) {
      requestAnimationFrame(() => this.animateConfetti());
    } else {
      this.confettiActive = false;
    }
  }

  // --- ARENA BROADCAST RECORDING ---

  initArenaRecording() {
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.isRecording = false;
    this.recStartTime = null;
    this.recTimerInterval = null;

    const recordBtn = document.getElementById('arenaRecordBtn');
    if (!recordBtn) return;

    recordBtn.addEventListener('click', () => {
      if (this.isRecording) {
        this.stopArenaRecording();
      } else {
        this.startArenaRecording();
      }
    });
  }

  async startArenaRecording() {
    try {
      let stream = null;
      // Try getDisplayMedia for full broadcast screen/tab recording if supported
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        try {
          stream = await navigator.mediaDevices.getDisplayMedia({
            video: { displaySurface: 'browser' },
            audio: true
          });
        } catch (e) {
          console.warn('[Record] Screen capture cancelled/unavailable, falling back to Canvas stream:', e);
        }
      }

      // If user cancelled display media or on unsupported context, capture Arena Canvas stream
      if (!stream) {
        const canvas = document.getElementById('arenaCanvas');
        if (!canvas) return alert('Arena canvas not found for recording');
        stream = canvas.captureStream(30);
      }

      this.recordedChunks = [];
      let mimeType = 'video/webm;codecs=vp9,opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
      }

      this.mediaRecorder = new MediaRecorder(stream, { mimeType });

      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          this.recordedChunks.push(e.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        this.saveArenaRecording();
      };

      stream.getVideoTracks()[0]?.addEventListener('ended', () => {
        if (this.isRecording) {
          this.stopArenaRecording();
        }
      });

      this.mediaRecorder.start(1000);
      this.isRecording = true;
      this.recStartTime = Date.now();

      const btn = document.getElementById('arenaRecordBtn');
      const btnText = document.getElementById('arenaRecordBtnText');
      const watermark = document.getElementById('arenaRecWatermark');
      if (btn) btn.classList.add('is-recording');
      if (watermark) watermark.classList.remove('hidden');

      this.recTimerInterval = setInterval(() => {
        const elapsedSec = Math.floor((Date.now() - this.recStartTime) / 1000);
        const mins = String(Math.floor(elapsedSec / 60)).padStart(2, '0');
        const secs = String(elapsedSec % 60).padStart(2, '0');
        const timeStr = `${mins}:${secs}`;
        if (btnText) btnText.textContent = `STOP RECORDING (${timeStr})`;
        const wmTime = document.getElementById('arenaRecWatermarkTime');
        if (wmTime) wmTime.textContent = timeStr;
      }, 1000);

      soundEngine?.playCue('turn_start');
    } catch (err) {
      console.error('[Record] Error starting recording:', err);
      alert('Could not start recording session: ' + err.message);
    }
  }

  stopArenaRecording() {
    if (!this.mediaRecorder || !this.isRecording) return;
    this.isRecording = false;
    clearInterval(this.recTimerInterval);

    try {
      this.mediaRecorder.stop();
    } catch (e) {
      console.error(e);
    }

    if (this.mediaRecorder.stream) {
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }

    const btn = document.getElementById('arenaRecordBtn');
    const btnText = document.getElementById('arenaRecordBtnText');
    const watermark = document.getElementById('arenaRecWatermark');
    if (btn) btn.classList.remove('is-recording');
    if (btnText) btnText.textContent = 'RECORD SESSION';
    if (watermark) watermark.classList.add('hidden');

    soundEngine?.playCue('round_end');
  }

  saveArenaRecording() {
    if (this.recordedChunks.length === 0) return;
    const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    a.href = url;
    a.download = `Scribble-Arena-Session-${this.roomCode || 'Match'}-${timestamp}.webm`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.app = new ScribbleApp();
});
