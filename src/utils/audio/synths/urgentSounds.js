// Caution, Beeps and Industrial alerts synthesis

export function playTwoToneWarning(ctx, volume = 0.8) {
  const now = ctx.currentTime;
  const vol = Math.max(0.1, Math.min(volume, 1.0));
  const notes = [
    { freq: 440.0, delay: 0.0, dur: 0.3 },
    { freq: 554.37, delay: 0.22, dur: 0.45 },
  ];

  notes.forEach(({ freq, delay, dur }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const t = now + delay;
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(vol * 0.65, t + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  });
}

export function playSubtleSonar(ctx, volume = 0.8) {
  const now = ctx.currentTime;
  const vol = Math.max(0.1, Math.min(volume, 1.0));
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(320, now);
  osc.frequency.exponentialRampToValueAtTime(160, now + 0.8);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(vol * 0.8, now + 0.06);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 1.45);
}

export function playSoftBeep(ctx, count = 3, volume = 0.8) {
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

export function playPulsar(ctx, volume = 0.8) {
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

export function playRadioBeep(ctx, volume = 0.8) {
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

export function playSiren(ctx, durationMs = 2500, volume = 0.8) {
  const now = ctx.currentTime;
  const vol = Math.max(0.1, Math.min(volume, 1.0));
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
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
