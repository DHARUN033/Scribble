// Web Audio API Sound Synthesizer & Procedural BGM Engine

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.sfxVolume = 0.7;
    this.bgmVolume = 0.25;
    this.sfxMuted = false;
    this.bgmMuted = false;
    this.bgmInterval = null;
    this.bgmPlaying = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq, type, duration, startTime = 0, gainLevel = 1) {
    if (!this.ctx || this.sfxMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime + startTime);

    gain.gain.setValueAtTime(gainLevel * this.sfxVolume, this.ctx.currentTime + startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + startTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(this.ctx.currentTime + startTime);
    osc.stop(this.ctx.currentTime + startTime + duration);
  }

  playCue(soundName) {
    this.init();
    if (this.sfxMuted) return;

    switch (soundName) {
      case 'correct_guess': {
        // Triumphant 4-note ascending major arpeggio (C5, E5, G5, C6)
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((f, i) => this.playTone(f, 'triangle', 0.25, i * 0.08, 0.9));
        break;
      }
      case 'guess_bell': {
        // Soft chime for everyone when a player guesses
        this.playTone(880, 'sine', 0.2, 0, 0.4);
        this.playTone(1320, 'sine', 0.3, 0.08, 0.5);
        break;
      }
      case 'close_guess': {
        // Friendly "uh-oh, almost!" 2-tone
        this.playTone(440, 'sine', 0.12, 0, 0.6);
        this.playTone(493.88, 'sine', 0.18, 0.1, 0.6);
        break;
      }
      case 'tick_urgent': {
        // Clock tick
        this.playTone(700, 'square', 0.04, 0, 0.3);
        break;
      }
      case 'turn_start': {
        // Energetic wake up chime
        this.playTone(440, 'triangle', 0.15, 0, 0.7);
        this.playTone(554.37, 'triangle', 0.15, 0.12, 0.7);
        this.playTone(659.25, 'triangle', 0.3, 0.24, 0.8);
        break;
      }
      case 'hint_reveal': {
        // Magical sparkle sweep
        [587.33, 659.25, 880, 1174.66].forEach((f, i) => {
          this.playTone(f, 'sine', 0.15, i * 0.06, 0.5);
        });
        break;
      }
      case 'round_end': {
        // Turn transition gong
        this.playTone(330, 'triangle', 0.4, 0, 0.6);
        this.playTone(220, 'sine', 0.6, 0.1, 0.7);
        break;
      }
      case 'bomb_blast': {
        // Boom noise burst
        this.playNoise(0.5);
        break;
      }
      case 'game_over': {
        // Victory fanfare
        const notes = [440, 554.37, 659.25, 880, 880, 1108.73];
        const times = [0, 0.15, 0.3, 0.45, 0.65, 0.85];
        notes.forEach((f, i) => this.playTone(f, 'triangle', 0.3, times[i], 0.8));
        break;
      }
      default:
        break;
    }
  }

  playNoise(duration = 0.4) {
    if (!this.ctx || this.sfxMuted) return;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + duration);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.8 * this.sfxVolume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
  }

  // --- PROCEDURAL UPBEAT ARCADE BACKGROUND MUSIC ---
  startBGM() {
    this.init();
    if (this.bgmPlaying || this.bgmMuted) return;
    this.bgmPlaying = true;

    // Upbeat chords progression: Cmaj -> Amin -> Fmaj -> Gmaj (120 BPM)
    const scale = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];
    const bassline = [130.81, 110.00, 87.31, 98.00];
    let step = 0;

    this.bgmInterval = setInterval(() => {
      if (!this.bgmPlaying || this.bgmMuted || !this.ctx) return;

      const chordIdx = Math.floor(step / 8) % bassline.length;
      const bassNote = bassline[chordIdx];

      // Bass pulse on quarter beats
      if (step % 2 === 0) {
        this.playBGMTone(bassNote, 'sawtooth', 0.15, 0.15);
      }

      // Arp melody
      const melodyNote = scale[(step * 3 + chordIdx) % scale.length];
      this.playBGMTone(melodyNote, 'sine', 0.1, 0.1);

      step = (step + 1) % 32;
    }, 250); // 16th notes at 120 BPM
  }

  playBGMTone(freq, type, duration, gainLevel = 0.1) {
    if (!this.ctx || this.bgmMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    gain.gain.setValueAtTime(gainLevel * this.bgmVolume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  toggleBGM() {
    if (this.bgmPlaying) {
      this.stopBGM();
      return false;
    } else {
      this.startBGM();
      return true;
    }
  }

  setSfxVolume(val) {
    this.sfxVolume = parseFloat(val);
  }

  setBgmVolume(val) {
    this.bgmVolume = parseFloat(val);
  }
}

export const soundEngine = new SoundEngine();
