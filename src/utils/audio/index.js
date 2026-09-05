import { getAudioContext } from './audio/context';
import { speakText } from './audio/speech';
import { soundHandlers } from './audio/soundRegistry';

class SoundAlertManager {
  playSound(type = 'voice', volume = 0.8, locationText = '') {
    const ctx = getAudioContext();
    if (!ctx) return;

    const alertSpeech = locationText
      ? `Cảnh báo sự cố tại ${locationText}`
      : 'Cảnh báo phát hiện sự cố';

    const handler = soundHandlers[type] || soundHandlers.airport;

    if (handler.playChime) {
      handler.playChime(ctx, volume);
    }

    if (handler.useSpeech) {
      if (handler.speechDelay > 0) {
        setTimeout(() => speakText(alertSpeech, volume), handler.speechDelay);
      } else {
        speakText(alertSpeech, volume);
      }
    }
  }

  speakText(text, volume = 0.8) {
    speakText(text, volume);
  }
}

export const soundManager = new SoundAlertManager();
export { getAudioContext } from './audio/context';
export { speakText } from './audio/speech';
export { soundHandlers } from './audio/soundRegistry';
