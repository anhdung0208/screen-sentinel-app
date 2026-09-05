// Gentle, calming, and acoustic instruments synthesis

export function playDing(ctx, volume = 0.8) {
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

export function playAirportChime(ctx, volume = 0.8) {
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

export function playMarimba(ctx, volume = 0.8) {
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

export function playPianoChord(ctx, volume = 0.8) {
  const now = ctx.currentTime;
  const vol = Math.max(0.1, Math.min(volume, 1.0));
  const chord = [523.25, 659.25, 783.99, 987.77];

  chord.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    const t = now + i * 0.04;
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime((vol * 0.5) / (i * 0.3 + 1), t + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 1.65);
  });
}

export function playGuitarStrum(ctx, volume = 0.8) {
  const now = ctx.currentTime;
  const vol = Math.max(0.1, Math.min(volume, 1.0));
  const notes = [329.63, 440.0, 587.33, 659.25];

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    const t = now + idx * 0.045;
    osc.frequency.setValueAtTime(freq, t);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, t);
    filter.frequency.exponentialRampToValueAtTime(300, t + 1.2);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(vol * 0.45, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 1.25);
  });
}

export function playMusicBox(ctx, volume = 0.8) {
  const now = ctx.currentTime;
  const vol = Math.max(0.1, Math.min(volume, 1.0));
  const notes = [1046.5, 1318.51, 1567.98, 2093.0];

  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const t = now + i * 0.16;
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(vol * 0.45, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.95);
  });
}

export function playWindChimes(ctx, volume = 0.8) {
  const now = ctx.currentTime;
  const vol = Math.max(0.1, Math.min(volume, 1.0));
  const freqs = [659.25, 783.99, 880.0, 1174.66, 1318.51];

  freqs.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    const t = now + (i * 0.11 + (i % 2) * 0.03);
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(vol * 0.4, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.75);
  });
}

export function playVibraphone(ctx, volume = 0.8) {
  const now = ctx.currentTime;
  const vol = Math.max(0.1, Math.min(volume, 1.0));
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const tremolo = ctx.createGain();
  const lfo = ctx.createOscillator();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(698.46, now);

  lfo.type = 'sine';
  lfo.frequency.setValueAtTime(6, now);

  const lfoGain = ctx.createGain();
  lfoGain.gain.setValueAtTime(0.3, now);
  lfo.connect(lfoGain);
  lfoGain.connect(tremolo.gain);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(vol * 0.7, now + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

  osc.connect(tremolo);
  tremolo.connect(gain);
  gain.connect(ctx.destination);

  lfo.start(now);
  osc.start(now);
  osc.stop(now + 1.65);
  lfo.stop(now + 1.65);
}

export function playShinkansenChime(ctx, volume = 0.8) {
  const now = ctx.currentTime;
  const vol = Math.max(0.1, Math.min(volume, 1.0));
  const melody = [659.25, 830.61, 987.77, 1318.51, 987.77, 830.61];

  melody.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const t = now + idx * 0.14;
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(vol * 0.5, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.55);
  });
}

export function playCrystalGlass(ctx, volume = 0.8) {
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

export function playZenBowl(ctx, volume = 0.8) {
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

export function playHarp(ctx, volume = 0.8) {
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

export function playChime(ctx, volume = 0.8) {
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

export function playElevatorDing(ctx, volume = 0.8) {
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
