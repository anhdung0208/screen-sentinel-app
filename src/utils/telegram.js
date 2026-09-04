// Gửi thông báo Telegram Bot kèm hoặc không kèm hình ảnh
export async function sendTelegramAlert(botToken, chatId, message, imageBase64) {
  if (!botToken || !chatId) {
    return { success: false, error: 'Chưa cấu hình Token hoặc Chat ID' };
  }

  try {
    if (imageBase64) {
      const byteString = atob(imageBase64.split(',')[1]);
      const mimeString = imageBase64.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      const formData = new FormData();
      formData.append('chat_id', chatId);
      formData.append('caption', message);
      formData.append('parse_mode', 'HTML');
      formData.append('photo', blob, 'incident.jpg');

      const res = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
        method: 'POST',
        body: formData,
      });
      return await res.json();
    } else {
      const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' }),
      });
      return await res.json();
    }
  } catch (err) {
    return { success: false, error: err.message };
  }
}
