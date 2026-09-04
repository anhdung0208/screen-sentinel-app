import React from 'react';
import { Settings, Volume2, Clock, RefreshCw, Music, VolumeX } from 'lucide-react';
import { soundManager } from '../utils/audioAlert';
import toast from 'react-hot-toast';

export default function SettingsPanel({ settings, setSettings }) {
  const handleTestSound = () => {
    soundManager.playSound(settings.soundType || 'voice', (settings.volume || 80) / 100, 'Tornado');
    toast.success('Đang phát âm thanh mẫu...', { id: 'sound_test' });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <h2 className="text-base font-semibold text-white mb-3.5 flex items-center gap-2">
        <Settings className="w-4 h-4 text-indigo-400" /> Cài đặt Tần số quét &amp; Báo động
      </h2>

      <div className="space-y-3.5 text-xs">
        {/* Row 1: Tần số quét (Scan Interval) */}
        <div>
          <label className="text-slate-300 font-medium mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-sky-400" /> Tần số quét màn hình:
            </span>
            <span className="text-indigo-400 font-bold font-mono">{settings.scanIntervalSec || 10} giây/lần</span>
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="range"
              min={1}
              max={30}
              step={1}
              value={settings.scanIntervalSec || 10}
              onChange={(e) => setSettings({ ...settings, scanIntervalSec: Number(e.target.value) })}
              className="flex-1 accent-indigo-500 cursor-pointer"
            />
            <select
              value={settings.scanIntervalSec || 10}
              onChange={(e) => setSettings({ ...settings, scanIntervalSec: Number(e.target.value) })}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 font-mono text-[11px] focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value={1}>1s (Siêu nhanh)</option>
              <option value={5}>5s</option>
              <option value={10}>10s (Khuyên dùng)</option>
              <option value={15}>15s</option>
              <option value={30}>30s</option>
            </select>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Khoảng thời gian giữa mỗi lần chụp &amp; quét các vùng.</p>
        </div>

        {/* Row 2: Trì hoãn báo lại (Cooldown in Minutes) */}
        <div>
          <label className="text-slate-300 font-medium mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" /> Trì hoãn báo lại (Cooldown):
            </span>
            <span className="text-amber-400 font-bold font-mono">{settings.cooldownMin || 5} phút</span>
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="range"
              min={0.5}
              max={30}
              step={0.5}
              value={settings.cooldownMin || 5}
              onChange={(e) => setSettings({ ...settings, cooldownMin: Number(e.target.value) })}
              className="flex-1 accent-amber-500 cursor-pointer"
            />
            <select
              value={settings.cooldownMin || 5}
              onChange={(e) => setSettings({ ...settings, cooldownMin: Number(e.target.value) })}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 font-mono text-[11px] focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value={0.5}>30 giây</option>
              <option value={1}>1 phút</option>
              <option value={5}>5 phút (Tối ưu)</option>
              <option value={10}>10 phút</option>
              <option value={15}>15 phút</option>
              <option value={30}>30 phút</option>
            </select>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Khi 1 vùng bị lỗi, hệ thống sẽ tạm dừng báo động lại vùng đó trong thời gian này để tránh bị phiền.</p>
        </div>

        {/* Row 3: Âm thanh báo động & Giọng nói đọc tên vị trí */}
        <div className="pt-1 border-t border-slate-800 space-y-2">
          <div>
            <label className="text-slate-300 font-medium mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-purple-400" /> Cảnh báo Âm thanh &amp; Giọng nói:
              </span>
              <button
                onClick={handleTestSound}
                className="text-[11px] bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-0.5 rounded-lg cursor-pointer transition font-medium flex items-center gap-1"
              >
                <Volume2 className="w-3 h-3" /> Nghe thử
              </button>
            </label>
            <select
              value={settings.soundType || 'voice'}
              onChange={(e) => setSettings({ ...settings, soundType: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="voice">🗣️ Giọng nói đọc tên vị trí lỗi (VD: "Cảnh báo sự cố tại Tornado") [Khuyên dùng]</option>
              <option value="chime">🔔 Chuông ngân vang nhẹ nhàng</option>
              <option value="siren">🚨 Còi hú báo động công nghiệp</option>
              <option value="beep">🔊 Tiếng Beep ngắt quãng</option>
            </select>
          </div>

          <div>
            <label className="text-slate-300 font-medium block mb-1">
              Âm lượng: <b className="text-indigo-400">{settings.volume || 80}%</b>
            </label>
            <input
              type="range"
              min={10}
              max={100}
              value={settings.volume || 80}
              onChange={(e) => setSettings({ ...settings, volume: Number(e.target.value) })}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
