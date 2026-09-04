// Web Audio API & Speech Synthesis Sound Generator
class SoundAlertManager {
  constructor() {
    this.audioCtx = null;
  }

  initContext() {
    try {
      if (!this.audioCtx) {
        const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioCtxClass();
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
    } catch (e) {
      console.warn('AudioContext init error:', e);
    }
  }

  // 1. Âm thanh Chuông ngân nhẹ nhàng (Chime / Bell)
  playChime(volume = 0.8) {
    this.initContext();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    const vol = Math.max(0.1, Math.min(volume, 1.0));
    const notes = [523.25, 659.25, 784.0, 1046.5];

    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const noteTime = now + index * 0.12;

      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(vol * 0.5, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.85);
    });
  }

  // 2. Còi hú báo động công nghiệp (Siren)
  playSiren(durationMs = 2500, volume = 0.8) {
    this.initContext();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    const now = ctx.currentTime;
    const vol = Math.max(0.1, Math.min(volume, 1.0));

    osc.frequency.setValueAtTime(650, now);
    for (let i = 0; i < durationMs / 1000; i += 0.4) {
      osc.frequency.linearRampToValueAtTime(1200, now + i + 0.2);
      osc.frequency.linearRampToValueAtTime(650, now + i + 0.4);
    }

    gain.gain.setValueAtTime(vol * 0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + durationMs / 1000);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + durationMs / 1000);
  }

  // 3. Tiếng Beep ngắt quãng (Rõ tiếng & Đậm âm)
  playBeep(count = 3, freq = 880, volume = 0.8) {
    this.initContext();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    const vol = Math.max(0.1, Math.min(volume, 1.0));

    for (let i = 0; i < count; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      const startT = now + i * 0.22;
      osc.frequency.setValueAtTime(freq, startT);

      gain.gain.setValueAtTime(vol * 0.4, startT);
      gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startT);
      osc.stop(startT + 0.16);
    }
  }

  // 4. Giọng nói Tiếng Việt đọc tên vị trí lỗi (Web Speech API)
  speakText(text, volume = 0.8) {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.volume = Math.max(0.1, Math.min(volume, 1.0));
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  }

  // Phát âm thanh theo loại lựa chọn
  playSound(type = 'voice', volume = 0.8, zoneName = '') {
    this.initContext();

    if (type === 'voice') {
      const locationText = zoneName
        ? `Cảnh báo sự cố tại ${zoneName}`
        : 'Cảnh báo phát hiện sự cố';
      
      this.playChime(volume);
      setTimeout(() => {
        this.speakText(locationText, volume);
      }, 350);
    } else if (type === 'siren') {
      this.playSiren(2500, volume);
    } else if (type === 'beep') {
      this.playBeep(3, 880, volume);
    } else {
      this.playChime(volume);
    }
  }
}

export const soundManager = new SoundAlertManager();
