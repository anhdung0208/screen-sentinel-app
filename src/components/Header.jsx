import React from 'react';
import { ShieldAlert, Monitor, Play, Square } from 'lucide-react';

export default function Header({
  isCapturing,
  isTracking,
  onStartCapture,
  onStopCapture,
  onToggleTracking,
}) {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
            ScreenSentinel{' '}
            <span className="text-xs px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-full font-mono">
              v1.0
            </span>
          </h1>
          <p className="text-xs text-slate-400">
            Giám sát màn hình &amp; Tự động phát chuông báo động khi có lỗi
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {!isCapturing ? (
          <button
            onClick={onStartCapture}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium shadow-lg shadow-indigo-600/30 transition cursor-pointer"
          >
            <Monitor className="w-4 h-4" /> Chọn màn hình cần soi
          </button>
        ) : (
          <>
            <button
              onClick={onToggleTracking}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition cursor-pointer ${
                isTracking
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
              }`}
            >
              {isTracking ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isTracking ? 'DỪNG TRACKING' : 'BẮT ĐẦU TRACKING'}
            </button>
            <button
              onClick={onStopCapture}
              className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm transition cursor-pointer"
            >
              Ngắt kết nối
            </button>
          </>
        )}
      </div>
    </header>
  );
}
