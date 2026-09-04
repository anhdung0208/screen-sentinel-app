// Web Audio API Sound Generator
class SoundAlertManager {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
  }

  initContext() {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // 1. Am thanh Chuong ngan nhang (Chime / Bell) - Dễ nghe & Nhẹ nhàng
  playChime(volume = 0.8) {
    this.initContext();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    // Hop am 3 not: C5 (523Hz), E5 (659Hz), G5 (784Hz), C6 (1046Hz)
    const notes = [523.25, 659.25, 784.0, 1046.5];

    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const noteTime = now + index * 0.15;

      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0, noteTime);
      gain.gain.linearRampToValueAtTime(volume * 0.6, noteTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 1.25);
    });
  }

  // 2. Coi hu bao dong (Siren)
  playSiren(durationMs = 2500, volume = 0.8) {
    this.initContext();
    if (!this.audioCtx) return;

    this.isPlaying = true;
    const ctx = this.audioCtx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    const now = ctx.currentTime;

    osc.frequency.setValueAtTime(650, now);
    for (let i = 0; i < durationMs / 1000; i += 0.5) {
      osc.frequency.linearRampToValueAtTime(1200, now + i + 0.25);
      osc.frequency.linearRampToValueAtTime(650, now + i + 0.5);
    }

    gain.gain.setValueAtTime(volume * 0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + durationMs / 1000);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + durationMs / 1000);

    setTimeout(() => {
      this.isPlaying = false;
    }, durationMs);
  }

  // 3. Tieng Beep ngat quang
  playBeep(count = 3, freq = 880, volume = 0.4) {
    this.initContext();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    for (let i = 0; i < count; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.2);
      gain.gain.setValueAtTime(volume, now + i * 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.2 + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.2);
      osc.stop(now + i * 0.2 + 0.13);
    }
  }

  // Phat am thanh theo loai lua chon
  playSound(type = 'chime', volume = 0.8) {
    if (type === 'siren') {
      this.playSiren(2500, volume);
    } else if (type === 'beep') {
      this.playBeep(3, 880, volume);
    } else {
      this.playChime(volume);
    }
  }
}

export const soundManager = new SoundAlertManager();
