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

  // 1. Tiếng chuông 'Ding!' nhẹ nhàng 1 cái làm tín hiệu báo hiệu
  playDing(volume = 0.8) {
    this.initContext();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    const vol = Math.max(0.1, Math.min(volume, 1.0));

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now); // Nốt La (A5) trong trẻo

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(vol * 0.7, now + 0.03);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.55);
  }

  // 2. Âm thanh Chuông ngân 3 nốt (Chime / Bell)
  playChime(volume = 0.8) {
    this.initContext();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    const vol = Math.max(0.1, Math.min(volume, 1.0));
    const notes = [523.25, 659.25, 784.0, 1046.5];

    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const noteTime = now + index * 0.15;

      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.001, noteTime);
      gain.gain.linearRampToValueAtTime(vol * 0.6, noteTime + 0.04);
      gain.gain.linearRampToValueAtTime(0.001, noteTime + 1.0);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 1.05);
    });
  }

  // 3. Còi hú báo động công nghiệp (Siren)
  playSiren(durationMs = 2500, volume = 0.8) {
    this.initContext();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    if (ctx.state === 'suspended') ctx.resume();

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

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(vol * 0.6, now + 0.05);
    gain.gain.linearRampToValueAtTime(0.001, now + durationMs / 1000);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + durationMs / 1000);
  }

  // 4. Tiếng Beep ngắt quãng (Rõ tiếng & Đậm âm)
  playBeep(count = 4, freq = 900, volume = 0.8) {
    this.initContext();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    const vol = Math.max(0.1, Math.min(volume, 1.0));

    for (let i = 0; i < count; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      const startT = now + i * 0.22;
      osc.frequency.setValueAtTime(freq, startT);

      gain.gain.setValueAtTime(0.001, startT);
      gain.gain.linearRampToValueAtTime(vol * 0.5, startT + 0.02);
      gain.gain.linearRampToValueAtTime(0.001, startT + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startT);
      osc.stop(startT + 0.16);
    }
  }

  // 5. Giọng nói Tiếng Việt đọc tên vị trí lỗi (Web Speech API)
  speakText(text, volume = 0.8) {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'vi-VN';
        utterance.volume = Math.max(0.1, Math.min(volume, 1.0));
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      }, 50);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  }

  // Phát âm thanh theo loại lựa chọn
  playSound(type = 'voice', volume = 0.8, locationText = '') {
    this.initContext();

    if (type === 'voice' || type === 'voice_ding') {
      const textToSpeak = locationText
        ? `Cảnh báo sự cố tại ${locationText}`
        : 'Cảnh báo phát hiện sự cố';
      
      // Reo 1 tiếng chuông 'Ding!' nhẹ trước
      this.playDing(volume);

      // Chờ 450ms cho tiếng chuông dứt hẳn rồi mới đọc tên vị trí
      setTimeout(() => {
        this.speakText(textToSpeak, volume);
      }, 450);
    } else if (type === 'siren') {
      this.playSiren(2500, volume);
    } else if (type === 'beep') {
      this.playBeep(4, 900, volume);
    } else {
      this.playChime(volume);
    }
  }
}

export const soundManager = new SoundAlertManager();
