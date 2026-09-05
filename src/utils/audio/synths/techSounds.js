// UI, Modern Tech & Sci-Fi synthesis

export function playMacGlass(ctx, volume = 0.8) {
  const now = ctx.currentTime;
  const vol = Math.max(0.1, Math.min(volume, 1.0));
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(1567.98, now);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(vol * 0.7, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.5);
}

export function playDoublePing(ctx, volume = 0.8) {
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

export function playSynthWave(ctx, volume = 0.8) {
  const now = ctx.currentTime;
  const vol = Math.max(0.1, Math.min(volume, 1.0));
  const freqs = [392.0, 493.88, 587.33, 739.99];

  freqs.forEach((freq) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(vol * 0.35, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 1.55);
  });
}

export function playRadarPulse(ctx, volume = 0.8) {
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

export function playCyberChime(ctx, volume = 0.8) {
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

export function playSpaceDrop(ctx, volume = 0.8) {
  const now = ctx.currentTime;
  const vol = Math.max(0.1, Math.min(volume, 1.0));
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(400, now);
  osc.frequency.exponentialRampToValueAtTime(1400, now + 0.12);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(vol * 0.7, now + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.65);
}

export function playGamingQuest(ctx, volume = 0.8) {
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
