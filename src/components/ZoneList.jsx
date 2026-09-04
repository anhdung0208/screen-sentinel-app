import React from 'react';
import { Layers, Trash2, Camera, ToggleLeft, ToggleRight, Info, EyeOff, MapPin } from 'lucide-react';

export default function ZoneList({ zones, setZones, onCaptureBaseline }) {
  const removeZone = (id) => {
    setZones((prev) => prev.filter((z) => z.id !== id));
  };

  const toggleZone = (id) => {
    setZones((prev) =>
      prev.map((z) => (z.id === id ? { ...z, enabled: !z.enabled } : z))
    );
  };

  const updateZoneField = (id, field, value) => {
    setZones((prev) =>
      prev.map((z) => (z.id === id ? { ...z, [field]: value } : z))
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <h2 className="text-base font-semibold text-white mb-3 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" /> Danh sách Vùng soi ({zones.length})
        </span>
      </h2>

      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
        {zones.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-3 text-center">
            Chưa có vùng nào. Kéo chuột trên khung hình để tạo vùng soi.
          </p>
        ) : (
          zones.map((zone) => {
            const isIgnore = zone.mode === 'ignore_detect';

            return (
              <div
                key={zone.id}
                className={`p-3.5 rounded-xl border text-xs transition ${
                  isIgnore
                    ? 'bg-purple-950/20 border-purple-800/50'
                    : zone.lastStatus === 'alert'
                    ? 'bg-rose-950/40 border-rose-700/80 shadow-lg shadow-rose-900/20'
                    : zone.enabled
                    ? 'bg-slate-800/60 border-slate-700'
                    : 'bg-slate-800/30 border-slate-800 opacity-60'
                }`}
              >
                {/* Hàng 1: Tên zone + các nút điều khiển */}
                <div className="flex items-center justify-between mb-2.5">
                  <input
                    type="text"
                    value={zone.name}
                    onChange={(e) => updateZoneField(zone.id, 'name', e.target.value)}
                    className="bg-transparent text-sm font-semibold text-white border-b border-transparent hover:border-slate-600 focus:border-indigo-500 focus:outline-none w-32"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleZone(zone.id)}
                      className="text-slate-400 hover:text-indigo-400 cursor-pointer transition"
                      title={zone.enabled ? 'Tắt zone' : 'Bật zone'}
                    >
                      {zone.enabled ? (
                        <ToggleRight className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <ToggleLeft className="w-5 h-5" />
                      )}
                    </button>
                    {zone.mode === 'diff_detect' && (
                      <button
                        onClick={() => {
                          onCaptureBaseline(zone);
                          setZones((prev) => [...prev]);
                        }}
                        className="text-slate-400 hover:text-sky-400 cursor-pointer transition flex items-center gap-1 text-[11px] bg-slate-900 px-2 py-0.5 rounded border border-slate-700"
                        title="Chụp lại ảnh mẫu ban đầu"
                      >
                        <Camera className="w-3.5 h-3.5" /> Chụp mẫu
                      </button>
                    )}
                    <button
                      onClick={() => removeZone(zone.id)}
                      className="text-slate-400 hover:text-rose-400 cursor-pointer transition"
                      title="Xoá vùng"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Hàng 2: Chọn chế độ & set ngưỡng */}
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Chế độ soi:</label>
                    <select
                      value={zone.mode}
                      onChange={(e) => updateZoneField(zone.id, 'mode', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 text-[11px] focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="red_detect">🔴 Phát hiện Đỏ</option>
                      <option value="diff_detect">🔄 So sánh Thay đổi</option>
                      <option value="ignore_detect">🚫 Vùng Loại trừ (Ignore)</option>
                    </select>
                  </div>

                  <div>
                    {!isIgnore ? (
                      <>
                        <label className="text-[11px] text-slate-400 block mb-1">Ngưỡng báo động (%):</label>
                        <input
                          type="number"
                          min={0.01}
                          max={50}
                          step={0.05}
                          value={zone.mode === 'red_detect' ? zone.redThreshold : zone.diffThreshold}
                          onChange={(e) =>
                            updateZoneField(
                              zone.id,
                              zone.mode === 'red_detect' ? 'redThreshold' : 'diffThreshold',
                              Number(e.target.value)
                            )
                          }
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 text-center font-mono text-[11px] focus:outline-none focus:border-indigo-500"
                        />
                      </>
                    ) : (
                      <div className="flex items-center h-full pt-4 text-[11px] text-purple-400 gap-1">
                        <EyeOff className="w-3.5 h-3.5" /> Bỏ qua điểm ảnh
                      </div>
                    )}
                  </div>
                </div>

                {/* Hàng 3: Hiển thị chỉ số thực tế + Vị trí bị lỗi detected */}
                {zone.enabled && !isIgnore && (
                  <div className="mt-2.5 pt-2 border-t border-slate-700/60 bg-slate-950/40 p-2 rounded-lg space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">
                        {zone.mode === 'red_detect' ? 'Đã tìm thấy:' : 'Mức độ biến đổi:'}
                      </span>
                      <span
                        className={`font-mono font-bold ${
                          zone.lastStatus === 'alert' ? 'text-rose-400' : 'text-emerald-400'
                        }`}
                      >
                        {zone.currentRatio !== undefined ? `${zone.currentRatio.toFixed(2)}%` : '0%'}
                        <span className="text-[10px] text-slate-500 font-normal ml-1">
                          ({zone.currentPixels || 0} px)
                        </span>
                      </span>
                    </div>

                    {/* Vị trí bị lỗi được phát hiện */}
                    {zone.detectedLocations && zone.detectedLocations.length > 0 && (
                      <div className="flex items-center gap-1 text-[11px] text-rose-300 font-medium">
                        <MapPin className="w-3 h-3 text-rose-400 flex-shrink-0" />
                        <span>Lỗi tại: <b>{zone.detectedLocations.join(', ')}</b></span>
                      </div>
                    )}

                    {/* Meter Bar */}
                    <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          zone.lastStatus === 'alert' ? 'bg-rose-500' : 'bg-emerald-500'
                        }`}
                        style={{
                          width: `${Math.min(
                            ((zone.currentRatio || 0) /
                              (zone.mode === 'red_detect' ? zone.redThreshold || 0.1 : zone.diffThreshold || 5)) *
                              100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="mt-3 p-2.5 bg-indigo-950/30 border border-indigo-900/50 rounded-xl text-[11px] text-indigo-300 flex items-start gap-2">
        <Info className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
        <span>
          <b>Tự động đọc 5 Vị trí:</b> Chỉ cần vẽ 1 vùng lớn bao phủ cả 5 tab, hệ thống sẽ tự phát hiện icon đỏ nằm ở vị trí nào và đọc chính xác tên vị trí đó!
        </span>
      </div>
    </div>
  );
}
