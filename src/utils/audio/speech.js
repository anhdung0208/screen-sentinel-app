// Web Speech API wrapper for Vietnamese text-to-speech
export function speakText(text, volume = 0.8) {
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
