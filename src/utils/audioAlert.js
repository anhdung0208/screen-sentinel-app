// Web Audio API & Speech Synthesis Sound Generator
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

  // 1. Âm thanh Chuông ngân nhẹ nhàng (Chime / Bell)
  playChime(volume = 0.8) {
    this.initContext();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;
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

  // 2. Còi hú báo động (Siren)
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

  // 3. Tiếng Beep ngắt quãng
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

  // 4. Giọng nói Tiếng Việt phát âm đọc tên vị trí lỗi (Web Speech API)
  speakText(text, volume = 0.8) {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.volume = volume;
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  }

  // Phát âm thanh hoặc Giọng nói đọc tên vị trí
  playSound(type = 'voice', volume = 0.8, zoneName = '') {
    if (type === 'voice' || type === 'voice_chime') {
      const locationText = zoneName
        ? `Cảnh báo sự cố tại ${zoneName}`
        : 'Cảnh báo phát hiện sự cố';
      
      this.playChime(volume * 0.5);
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
