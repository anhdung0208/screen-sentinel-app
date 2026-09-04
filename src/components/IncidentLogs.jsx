import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';

export default function IncidentLogs({ incidents }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex-1 flex flex-col">
      <h2 className="text-base font-semibold text-white mb-3 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" /> Lịch sử sự cố ({incidents.length})
        </span>
        {incidents.length > 0 && (
          <span className="text-[11px] text-slate-500 font-normal">Tự lưu 25 sự cố gần nhất</span>
        )}
      </h2>

      <div className="space-y-2.5 overflow-y-auto max-h-[260px] flex-1 pr-1">
        {incidents.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-3 text-center">Chưa có sự cố nào được ghi nhận.</p>
        ) : (
          incidents.map((inc) => (
            <div
              key={inc.id}
              className="p-3 bg-rose-950/30 border border-rose-900/50 rounded-xl text-xs flex gap-3 items-center hover:bg-rose-950/50 transition"
            >
              {inc.snapshot && (
                <img
                  src={inc.snapshot}
                  alt="incident"
                  className="w-14 h-14 object-cover rounded-lg border border-rose-500/40 bg-black flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="font-semibold text-rose-300 truncate">{inc.zoneName}</p>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" /> {inc.time}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">{inc.reason}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
