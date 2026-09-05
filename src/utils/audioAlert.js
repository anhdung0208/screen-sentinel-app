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

  // 1. Tiếng chuông 'Ding!' nhẹ nhàng trong trẻo
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
    osc.frequency.setValueAtTime(880, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(vol * 0.7, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.55);
  }

  // 2. Chuông sân bay 2 nốt (Airport Ding-Dong)
  playAirportChime(volume = 0.8) {
    this.initContext();
    if (!this.audioCtx) return;
    const ctx = this.audioCtx;
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    const vol = Math.max(0.1, Math.min(volume, 1.0));
    const notes = [
      { freq: 739.99, delay: 0.0, dur: 0.6 },
      { freq: 587.33, delay: 0.35, dur: 0.9 },
    ];

    notes.forEach(({ freq, delay, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const noteTime = now + delay;
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.001, noteTime);
      gain.gain.linearRampToValueAtTime(vol * 0.7, noteTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + dur + 0.05);
    });
  }

  // 3. Chuông gỗ Marimba / Kalimba 4 nốt ấm áp
  playMarimba(volume = 0.8) {
    this.initContext();
    if (!this.audioCtx) return;
    const ctx = this.audioCtx;
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    const vol = Math.max(0.1, Math.min(volume, 1.0));
    const freqs = [523.25, 659.25, 783.99, 1046.5];

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      const noteTime = now + idx * 0.12;
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.001, noteTime);
      gain.gain.linearRampToValueAtTime(vol * 0.6, noteTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.65);
    });
  }

  // 4. Chuông Ngân 4 nốt (Chime)
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
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.85);
    });
  }

  // 5. Chuông Pha Lê Thủy Tinh (Crystal Glass Chime - Trong suốt, lấp lánh)
  playCrystalGlass(volume = 0.8) {
    this.initContext();
    if (!this.audioCtx) return;
    const ctx = this.audioCtx;
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    const vol = Math.max(0.1, Math.min(volume, 1.0));
    const notes = [987.77, 1318.51, 1661.22];

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const t = now + idx * 0.14;
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(vol * 0.5, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.95);
    });
  }

  // 6. Chuông Thiền Tĩnh Tâm (Tibetan Singing Bowl - 432Hz trầm ấm)
  playZenBowl(volume = 0.8) {
    this.initContext();
    if (!this.audioCtx) return;
    const ctx = this.audioCtx;
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    const vol = Math.max(0.1, Math.min(volume, 1.0));

    [432, 864].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime((vol * 0.55) / (i + 1), now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.85);
    });
  }

  // 7. Đàn Harp Arpeggio 5 nốt (Bay bổng, mượt mà)
  playHarp(volume = 0.8) {
    this.initContext();
    if (!this.audioCtx) return;
    const ctx = this.audioCtx;
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    const vol = Math.max(0.1, Math.min(volume, 1.0));
    const harpNotes = [523.25, 659.25, 783.99, 1046.5, 1318.51];

    harpNotes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const t = now + idx * 0.09;
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(vol * 0.5, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.75);
    });
  }

  // 8. Radar Ping Hiện Đại (Futuristic Sonar Pulse - 2 nhịp êm tai)
  playRadarPulse(volume = 0.8) {
    this.initContext();
    if (!this.audioCtx) return;
    const ctx = this.audioCtx;
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    const vol = Math.max(0.1, Math.min(volume, 1.0));

    [0, 0.28].forEach((delay) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const t = now + delay;
      osc.frequency.setValueAtTime(950, t);
      osc.frequency.exponentialRampToValueAtTime(450, t + 0.22);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(vol * 0.65, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.28);
    });
  }

  // 9. Cyber Matrix Pop (Âm thanh giao diện tương lai)
  playCyberChime(volume = 0.8) {
    this.initContext();
    if (!this.audioCtx) return;
    const ctx = this.audioCtx;
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    const vol = Math.max(0.1, Math.min(volume, 1.0));
    const notes = [600, 900, 1400];

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      const t = now + idx * 0.08;
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(vol * 0.55, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.28);
    });
  }

  // 10. Double Ping phong cách iOS (2 tiếng ping ấm áp)
  playDoublePing(volume = 0.8) {
    this.initContext();
    if (!this.audioCtx) return;
    const ctx = this.audioCtx;
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    const vol = Math.max(0.1, Math.min(volume, 1.0));
    const notes = [
      { freq: 1046.5, delay: 0.0 },
      { freq: 1318.51, delay: 0.16 },
    ];

    notes.forEach(({ freq, delay }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const t = now + delay;
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(vol * 0.65, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.38);
    });
  }

  // 11. Chuông Thang Máy Khách Sạn (Elevator Ding Sol trầm ngân dài)
  playElevatorDing(volume = 0.8) {
    this.initContext();
    if (!this.audioCtx) return;
    const ctx = this.audioCtx;
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    const vol = Math.max(0.1, Math.min(volume, 1.0));

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(783.99, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(vol * 0.7, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 1.25);
  }

  // 12. Gaming Quest / Level Up (Âm thanh nhiệm vụ sinh động)
  playGamingQuest(volume = 0.8) {
    this.initContext();
    if (!this.audioCtx) return;
    const ctx = this.audioCtx;
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    const vol = Math.max(0.1, Math.min(volume, 1.0));
    const freqs = [523.25, 659.25, 783.99, 1046.5];

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      const t = now + idx * 0.08;
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(vol * 0.35, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.25);
    });
  }

  // 13. Tiếng Beep nhẹ nhàng ngắt quãng (Soft Beep)
  playSoftBeep(count = 3, volume = 0.8) {
    this.initContext();
    if (!this.audioCtx) return;
    const ctx = this.audioCtx;
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    const vol = Math.max(0.1, Math.min(volume, 1.0));

    for (let i = 0; i < count; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const startT = now + i * 0.22;
      osc.frequency.setValueAtTime(800, startT);

      gain.gain.setValueAtTime(0.001, startT);
      gain.gain.linearRampToValueAtTime(vol * 0.6, startT + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, startT + 0.16);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startT);
      osc.stop(startT + 0.18);
    }
  }

  // 14. Nhịp Dập Cảnh Báo (Urgent Pulsar Heartbeat - Trầm ấm)
  playPulsar(volume = 0.8) {
    this.initContext();
    if (!this.audioCtx) return;
    const ctx = this.audioCtx;
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    const vol = Math.max(0.1, Math.min(volume, 1.0));

    [0, 0.18, 0.45, 0.63].forEach((delay) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const t = now + delay;
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.exponentialRampToValueAtTime(150, t + 0.12);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(vol * 0.8, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.16);
    });
  }

  // 15. Tín hiệu Bộ đàm / Radio Roger Beep
  playRadioBeep(volume = 0.8) {
    this.initContext();
    if (!this.audioCtx) return;
    const ctx = this.audioCtx;
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    const vol = Math.max(0.1, Math.min(volume, 1.0));

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1209, now);
    osc.frequency.setValueAtTime(1336, now + 0.08);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(vol * 0.6, now + 0.02);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  // 16. Còi hú báo động công nghiệp (Siren)
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

  // 17. Giọng nói Tiếng Việt đọc tên vị trí lỗi (Web Speech API)
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

    const alertSpeech = locationText
      ? `Cảnh báo sự cố tại ${locationText}`
      : 'Cảnh báo phát hiện sự cố';

    switch (type) {
      case 'voice':
      case 'voice_ding':
        this.playDing(volume);
        setTimeout(() => this.speakText(alertSpeech, volume), 450);
        break;

      case 'voice_airport':
        this.playAirportChime(volume);
        setTimeout(() => this.speakText(`Cảnh báo, phát hiện lỗi tại ${locationText || 'khu vực giám sát'}`, volume), 850);
        break;

      case 'voice_marimba':
        this.playMarimba(volume);
        setTimeout(() => this.speakText(alertSpeech, volume), 600);
        break;

      case 'voice_only':
        this.speakText(alertSpeech, volume);
        break;

      case 'airport':
        this.playAirportChime(volume);
        break;

      case 'marimba':
        this.playMarimba(volume);
        break;

      case 'crystal_glass':
        this.playCrystalGlass(volume);
        break;

      case 'zen_bowl':
        this.playZenBowl(volume);
        break;

      case 'harp':
        this.playHarp(volume);
        break;

      case 'radar':
        this.playRadarPulse(volume);
        break;

      case 'cyber':
        this.playCyberChime(volume);
        break;

      case 'double_ping':
        this.playDoublePing(volume);
        break;

      case 'elevator':
        this.playElevatorDing(volume);
        break;

      case 'gaming':
        this.playGamingQuest(volume);
        break;

      case 'chime':
        this.playChime(volume);
        break;

      case 'soft_beep':
      case 'beep':
        this.playSoftBeep(3, volume);
        break;

      case 'pulsar':
        this.playPulsar(volume);
        break;

      case 'radio':
        this.playRadioBeep(volume);
        break;

      case 'siren':
        this.playSiren(2500, volume);
        break;

      default:
        this.playAirportChime(volume);
        break;
    }
  }
}

export const soundManager = new SoundAlertManager();


