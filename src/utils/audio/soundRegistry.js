import * as gentle from './synths/gentleSounds';
import * as tech from './synths/techSounds';
import * as urgent from './synths/urgentSounds';

export const soundHandlers = {
  // Voice combinations
  voice: { playChime: gentle.playDing, speechDelay: 450, useSpeech: true },
  voice_ding: { playChime: gentle.playDing, speechDelay: 450, useSpeech: true },
  voice_airport: { playChime: gentle.playAirportChime, speechDelay: 850, useSpeech: true },
  voice_marimba: { playChime: gentle.playMarimba, speechDelay: 600, useSpeech: true },
  voice_piano: { playChime: gentle.playPianoChord, speechDelay: 700, useSpeech: true },
  voice_shinkansen: { playChime: gentle.playShinkansenChime, speechDelay: 950, useSpeech: true },
  voice_macos: { playChime: tech.playMacGlass, speechDelay: 400, useSpeech: true },
  voice_only: { playChime: null, speechDelay: 0, useSpeech: true },

  // Gentle chimes
  ding: { playChime: gentle.playDing },
  airport: { playChime: gentle.playAirportChime },
  marimba: { playChime: gentle.playMarimba },
  piano: { playChime: gentle.playPianoChord },
  guitar: { playChime: gentle.playGuitarStrum },
  music_box: { playChime: gentle.playMusicBox },
  wind_chimes: { playChime: gentle.playWindChimes },
  vibraphone: { playChime: gentle.playVibraphone },
  shinkansen: { playChime: gentle.playShinkansenChime },
  crystal_glass: { playChime: gentle.playCrystalGlass },
  zen_bowl: { playChime: gentle.playZenBowl },
  harp: { playChime: gentle.playHarp },
  chime: { playChime: gentle.playChime },
  elevator: { playChime: gentle.playElevatorDing },

  // Tech / UI sounds
  macos: { playChime: tech.playMacGlass },
  double_ping: { playChime: tech.playDoublePing },
  synth_wave: { playChime: tech.playSynthWave },
  radar: { playChime: tech.playRadarPulse },
  cyber: { playChime: tech.playCyberChime },
  space_drop: { playChime: tech.playSpaceDrop },
  gaming: { playChime: tech.playGamingQuest },

  // Urgent / Caution sounds
  two_tone: { playChime: urgent.playTwoToneWarning },
  sonar: { playChime: urgent.playSubtleSonar },
  soft_beep: { playChime: (ctx, vol) => urgent.playSoftBeep(ctx, 3, vol) },
  beep: { playChime: (ctx, vol) => urgent.playSoftBeep(ctx, 3, vol) },
  pulsar: { playChime: urgent.playPulsar },
  radio: { playChime: urgent.playRadioBeep },
  siren: { playChime: (ctx, vol) => urgent.playSiren(ctx, 2500, vol) },
};
