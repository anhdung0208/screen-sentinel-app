import React from 'react';
import { Settings, Volume2, Clock, RefreshCw, Music } from 'lucide-react';
import { soundManager } from '../utils/audioAlert';
import toast from 'react-hot-toast';

export default function SettingsPanel({ settings, setSettings }) {
  const handleTestSound = () => {
    soundManager.playSound(settings.soundType || 'voice', (settings.volume || 80) / 100, 'Tornado');
    toast.success('Đang phát âm thanh mẫu...', { id: 'sound_test' });
  };

  const cooldownDisplay =
    (settings.cooldownMin || 5) < 1
      ? `${Math.round((settings.cooldownMin || 0.5) * 60)} giây`
      : `${settings.cooldownMin || 5} phút`;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <h2 className="text-base font-semibold text-white mb-3.5 flex items-center gap-2">
        <Settings className="w-4 h-4 text-indigo-400" /> Cài đặt Tần số quét &amp; Báo động
      </h2>

      <div className="space-y-4 text-xs">
        {/* Row 1: Tần số quét (Scan Interval) */}
        <div className="space-y-1.5">
          <label className="text-slate-300 font-medium flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-sky-400" /> Tần số quét màn hình:
            </span>
            <span className="text-sky-400 font-bold font-mono text-sm">
              {settings.scanIntervalSec || 10} giây/lần
            </span>
          </label>

          <input
            type="range"
            min={1}
            max={30}
            step={1}
            value={settings.scanIntervalSec || 10}
            onChange={(e) => setSettings({ ...settings, scanIntervalSec: Number(e.target.value) })}
            className="w-full accent-sky-500 cursor-pointer"
          />

          {/* Preset Buttons for Scan Interval */}
          <div className="flex gap-1.5 pt-0.5">
            {[1, 5, 10, 15, 30].map((sec) => (
              <button
                key={sec}
                onClick={() => setSettings({ ...settings, scanIntervalSec: sec })}
                className={`flex-1 py-1 text-[11px] rounded-lg font-mono transition border ${
                  (settings.scanIntervalSec || 10) === sec
                    ? 'bg-sky-950 text-sky-300 border-sky-600 font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
              >
                {sec}s
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-500">Khoảng thời gian giữa mỗi lần chụp &amp; quét các vùng.</p>
        </div>

        {/* Row 2: Trì hoãn báo lại (Cooldown in Minutes) */}
        <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
          <label className="text-slate-300 font-medium flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" /> Trì hoãn báo lại (Cooldown):
            </span>
            <span className="text-amber-400 font-bold font-mono text-sm">
              {cooldownDisplay}
            </span>
          </label>

          <input
            type="range"
            min={0.5}
            max={30}
            step={0.5}
            value={settings.cooldownMin || 5}
            onChange={(e) => setSettings({ ...settings, cooldownMin: Number(e.target.value) })}
            className="w-full accent-amber-500 cursor-pointer"
          />

          {/* Preset Buttons for Cooldown */}
          <div className="flex gap-1.5 pt-0.5">
            {[
              { label: '30s', val: 0.5 },
              { label: '1m', val: 1 },
              { label: '5m', val: 5 },
              { label: '10m', val: 10 },
              { label: '15m', val: 15 },
              { label: '30m', val: 30 },
            ].map((p) => (
              <button
                key={p.val}
                onClick={() => setSettings({ ...settings, cooldownMin: p.val })}
                className={`flex-1 py-1 text-[11px] rounded-lg font-mono transition border ${
                  (settings.cooldownMin || 5) === p.val
                    ? 'bg-amber-950 text-amber-300 border-amber-600 font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-500">Khi 1 vùng bị lỗi, hệ thống sẽ tạm dừng báo động lại vùng đó trong thời gian này.</p>
        </div>

        {/* Row 3: Âm thanh báo động & Giọng nói đọc tên vị trí */}
        <div className="pt-2 border-t border-slate-800/80 space-y-2">
          <div>
            <label className="text-slate-300 font-medium mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-purple-400" /> Loại âm thanh cảnh báo:
              </span>
              <button
                onClick={handleTestSound}
                className="text-[11px] bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-0.5 rounded-lg cursor-pointer transition font-medium flex items-center gap-1 shadow-md shadow-indigo-600/20"
              >
                <Volume2 className="w-3 h-3" /> Nghe thử
              </button>
            </label>
            <select
              value={settings.soundType || 'voice'}
              onChange={(e) => setSettings({ ...settings, soundType: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer font-medium"
            >
              <optgroup label="🗣️ Giọng Nói Tiếng Việt (Thông Minh)">
                <option value="voice">🔔 Chuông Ding + Đọc giọng nói (VD: "Ding! Cảnh báo sự cố tại...") [Khuyên dùng]</option>
                <option value="voice_airport">✈️ Chuông Sân bay + Đọc giọng nói (Ding-Dong! Cảnh báo...)</option>
                <option value="voice_marimba">🪵 Chuông Gỗ Marimba + Đọc giọng nói</option>
                <option value="voice_only">📢 Chỉ đọc giọng nói trực tiếp (Không kèm chuông)</option>
              </optgroup>

              <optgroup label="🍃 Chuông Nhẹ Nhàng & Thư Giãn (Không Giật Mình)">
                <option value="marimba">🪵 Chuông Gỗ Marimba / Kalimba (4 nốt êm dịu)</option>
                <option value="airport">✈️ Chuông Sân bay 2 nốt (Ding-Dong ấm áp)</option>
                <option value="crystal_glass">💎 Chuông Pha Lê Thủy Tinh (Trong vắt, lấp lánh)</option>
                <option value="zen_bowl">🧘 Chuông Thiền Tĩnh Tâm (432Hz trầm ấm, thư thái)</option>
                <option value="harp">🎻 Đàn Harp 5 nốt (Bay bổng, mượt mà)</option>
                <option value="chime">🔔 Chuông Ngân 4 nốt (Thanh thoát du dương)</option>
                <option value="elevator">🛗 Chuông Thang Máy Khách Sạn (Ding Sol ngân dài)</option>
              </optgroup>

              <optgroup label="🚀 Âm Thanh Công Nghệ & Hiện Đại">
                <option value="radar">📡 Radar Sonar Pulse (Xung công nghệ 2 nhịp)</option>
                <option value="cyber">🤖 Cyber Matrix Pop (Giao diện tương lai)</option>
                <option value="double_ping">🎯 Double Ping iOS Style (2 tiếng ping ấm)</option>
                <option value="gaming">🎮 Gaming Quest / Level Up (Sinh động, vui tươi)</option>
              </optgroup>

              <optgroup label="🚨 Cảnh Báo Chuyên Nghiệp & Khẩn Cấp">
                <option value="soft_beep">🔊 Tiếng Beep mềm mại (3 nhịp sóng Sine êm tai)</option>
                <option value="pulsar">💓 Nhịp Dập Cảnh Báo (Urgent Heartbeat trầm ấm)</option>
                <option value="radio">📻 Tín hiệu Bộ đàm / Roger Beep (Phong cách quân sự)</option>
                <option value="siren">🚨 Còi hú công nghiệp (Âm lượng lớn)</option>
              </optgroup>
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
