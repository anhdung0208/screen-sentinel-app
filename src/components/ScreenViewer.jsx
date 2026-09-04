import React, { useState, useRef, useEffect } from 'react';
import { Eye, Monitor, ShieldAlert, ShieldOff } from 'lucide-react';

export default function ScreenViewer({
  isCapturing,
  isTracking,
  videoRef,
  processCanvasRef,
  zones,
  onAddZone,
  settings,
}) {
  const previewCanvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState({ x: 0, y: 0 });
  const [currentRect, setCurrentRect] = useState(null);
  const [activeDrawType, setActiveDrawType] = useState('alert'); // 'alert' hoac 'ignore'

  const handleMouseDown = (e) => {
    if (!isCapturing || isTracking) return;
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    setIsDrawing(true);
    setDrawStart({ x, y });
    setCurrentRect({ x, y, width: 0, height: 0 });
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    setCurrentRect({
      x: Math.min(drawStart.x, x),
      y: Math.min(drawStart.y, y),
      width: Math.abs(x - drawStart.x),
      height: Math.abs(y - drawStart.y),
    });
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (currentRect && currentRect.width > 15 && currentRect.height > 15) {
      onAddZone(
        {
          x: Math.round(currentRect.x),
          y: Math.round(currentRect.y),
          width: Math.round(currentRect.width),
          height: Math.round(currentRect.height),
        },
        activeDrawType // Truyen loai va (alert hoac ignore)
      );
    }
    setCurrentRect(null);
  };

  useEffect(() => {
    let animId;
    const render = () => {
      if (videoRef.current && previewCanvasRef.current && isCapturing) {
        const video = videoRef.current;
        const canvas = previewCanvasRef.current;
        const ctx = canvas.getContext('2d');

        if (video.readyState >= 2 && video.videoWidth > 0) {
          if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
          }

          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          zones.forEach((zone) => {
            const isAlert = zone.lastStatus === 'alert';
            const isIgnore = zone.mode === 'ignore_detect';

            if (isIgnore) {
              // Stroke va Label cho Vung Loai Tru
              ctx.strokeStyle = zone.enabled ? '#c084fc' : '#64748b';
              ctx.lineWidth = 3;
              ctx.setLineDash([6, 6]);
              ctx.strokeRect(zone.x, zone.y, zone.width, zone.height);
              ctx.setLineDash([]);

              const tagText = `🚫 ${zone.name} (BỎ QUA / KHÔNG QUÉT)`;
              ctx.fillStyle = zone.enabled ? '#9333ea' : '#475569';
              ctx.fillRect(zone.x, zone.y - 25, Math.max(180, tagText.length * 8.5), 25);
              ctx.fillStyle = '#ffffff';
              ctx.font = 'bold 12px sans-serif';
              ctx.fillText(tagText, zone.x + 6, zone.y - 7);
            } else {
              // Stroke va Label cho Vung Soi
              ctx.strokeStyle = isAlert ? '#ef4444' : (zone.enabled ? '#10b981' : '#64748b');
              ctx.lineWidth = 3;
              ctx.strokeRect(zone.x, zone.y, zone.width, zone.height);

              const modeText = zone.mode === 'red_detect' ? '🔴 ĐỎ' : '🔄 DIFF';
              const tagText = `${zone.name} (${modeText})`;
              ctx.fillStyle = isAlert ? '#ef4444' : (zone.enabled ? '#10b981' : '#64748b');
              ctx.fillRect(zone.x, zone.y - 25, Math.max(140, tagText.length * 8.5), 25);
              ctx.fillStyle = '#ffffff';
              ctx.font = 'bold 12px sans-serif';
              ctx.fillText(tagText, zone.x + 6, zone.y - 7);
            }
          });

          if (currentRect) {
            ctx.strokeStyle = activeDrawType === 'ignore' ? '#c084fc' : '#38bdf8';
            ctx.lineWidth = 2;
            ctx.setLineDash([6, 6]);
            ctx.strokeRect(currentRect.x, currentRect.y, currentRect.width, currentRect.height);
            ctx.setLineDash([]);
          }
        }
      }
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isCapturing, zones, currentRect, activeDrawType, videoRef]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col flex-1 relative overflow-hidden shadow-2xl">
      {/* Top Controls Bar: Select drawing type */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800 text-sm">
        <div className="flex items-center gap-2 text-slate-300">
          <Eye className="w-4 h-4 text-indigo-400" />
          <span>
            {isCapturing
              ? isTracking
                ? `Đang giám sát (chu kỳ ${settings?.scanIntervalSec || 10}s/lần)`
                : 'Chọn công cụ và kéo chuột trên khung hình:'
              : 'Chưa có nguồn màn hình'}
          </span>
        </div>

        {isCapturing && !isTracking && (
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveDrawType('alert')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${activeDrawType === 'alert'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
                }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" /> Vẽ Vùng Cảnh Báo Lỗi
            </button>
            <button
              onClick={() => setActiveDrawType('ignore')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${activeDrawType === 'ignore'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
                }`}
            >
              <ShieldOff className="w-3.5 h-3.5" /> Vẽ Vùng Bỏ Qua (Không Quét)
            </button>
          </div>
        )}

        {isTracking && (
          <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800 px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Quét {settings?.scanIntervalSec || 10}s / lần
          </span>
        )}
      </div>

      <div className="flex-1 flex items-center justify-center bg-black/40 rounded-xl mt-3 relative overflow-auto min-h-[500px]">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute w-1 h-1 opacity-0 pointer-events-none -z-50"
        />
        <canvas ref={processCanvasRef} className="hidden" />

        {isCapturing ? (
          <canvas
            ref={previewCanvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="max-w-full max-h-full object-contain cursor-crosshair rounded-lg"
          />
        ) : (
          <div className="text-center p-8 text-slate-500">
            <Monitor className="w-16 h-16 mx-auto mb-3 opacity-30 text-slate-400" />
            <p className="text-base font-medium text-slate-400">Chưa có luồng chia sẻ màn hình</p>
            <p className="text-xs text-slate-600 mt-1">Bấm nút "Chọn màn hình cần soi" ở góc trên để bắt đầu</p>
          </div>
        )}
      </div>
    </div>
  );
}
