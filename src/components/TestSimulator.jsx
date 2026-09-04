import React, { useState, useEffect } from 'react';
import { ShieldAlert, Play, Pause, RefreshCw, ArrowLeft, ExternalLink } from 'lucide-react';

export default function TestSimulator() {
  const [tabs, setTabs] = useState([
    { id: 1, name: 'Full Warehouse', status: 'yellow' },
    { id: 2, name: 'Moulding Area', status: 'normal' },
    { id: 3, name: 'Ground Floor PCS', status: 'normal' },
    { id: 4, name: 'Central Reject', status: 'normal' },
    { id: 5, name: 'Tornado', status: 'red' },
  ]);

  const [autoSim, setAutoSim] = useState(false);

  useEffect(() => {
    let timer;
    if (autoSim) {
      timer = setInterval(() => {
        setTabs((prev) =>
          prev.map((t) => {
            const states = ['normal', 'yellow', 'red'];
            const randomState = states[Math.floor(Math.random() * states.length)];
            return { ...t, status: randomState };
          })
        );
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [autoSim]);

  const setStatus = (id, status) => {
    setTabs((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Bar Navigation */}
      <header className="border-b border-slate-800 bg-slate-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              🧪 Trang Giả Lập Test Trạng Thái Nhà Máy
            </h1>
            <p className="text-xs text-slate-400">
              Đường dẫn: <code className="text-indigo-400 font-mono">/test</code> — Dùng trang này để chia sẻ màn hình &amp; kiểm tra ScreenSentinel
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition"
          >
            <ArrowLeft className="w-4 h-4" /> Về Màn Hình Giám Sát
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-6 flex flex-col gap-8 justify-center items-center">
        {/* SIMULATED FACTORY TAB BAR (Tương tự ảnh thật) */}
        <div className="w-full bg-white rounded-lg shadow-2xl overflow-hidden border border-slate-300">
          <div className="text-xs font-bold text-slate-400 px-4 py-1.5 bg-slate-100 border-b border-slate-200 uppercase tracking-wider">
            Bảng điều khiển hệ thống nhà máy (Simulated Factory Interface)
          </div>

          <div className="flex divide-x divide-slate-300 overflow-x-auto text-slate-800 font-sans text-sm">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className="flex-1 min-w-[160px] px-4 py-3 flex items-center justify-center gap-2 bg-white hover:bg-slate-50 transition select-none"
              >
                {/* ICON RENDERER */}
                {tab.status === 'yellow' && (
                  <span className="text-amber-500 text-base leading-none">⚠️</span>
                )}
                {tab.status === 'red' && (
                  <span className="inline-flex items-center justify-center w-4 h-4 bg-rose-600 text-white rounded-full text-[11px] font-bold leading-none shadow-sm">
                    ✕
                  </span>
                )}
                <span className={`font-medium ${tab.status === 'red' ? 'text-slate-900 font-semibold' : 'text-slate-700'}`}>
                  {tab.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CONTROL PANEL TO CHANGE ICON STATES */}
        <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-semibold text-white">Bảng Bật/Tắt Trạng Thái Các Vị Trí</h2>
              <p className="text-xs text-slate-400 mt-0.5">Bấm nút bên dưới để chuyển icon từng tab hoặc bật Tự Động Đổi</p>
            </div>

            <button
              onClick={() => setAutoSim(!autoSim)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                autoSim
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
              }`}
            >
              {autoSim ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {autoSim ? 'Dừng Tự Động Đổi' : 'Bật Tự Động Đổi Ngẫu Nhiên (5s/lần)'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tabs.map((tab) => (
              <div key={tab.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-slate-200">{tab.name}</span>
                  <span className="text-xs">
                    {tab.status === 'normal' && <span className="text-slate-500">Bình thường</span>}
                    {tab.status === 'yellow' && <span className="text-amber-400 font-semibold">⚠️ Vàng (Warning)</span>}
                    {tab.status === 'red' && <span className="text-rose-400 font-semibold">🔴 Đỏ (Alert)</span>}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  <button
                    onClick={() => setStatus(tab.id, 'normal')}
                    className={`py-1.5 text-xs rounded-lg font-medium transition border ${
                      tab.status === 'normal'
                        ? 'bg-slate-800 text-white border-slate-600'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    Bình thường
                  </button>
                  <button
                    onClick={() => setStatus(tab.id, 'yellow')}
                    className={`py-1.5 text-xs rounded-lg font-medium transition border ${
                      tab.status === 'yellow'
                        ? 'bg-amber-950 text-amber-300 border-amber-700'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    ⚠️ Vàng
                  </button>
                  <button
                    onClick={() => setStatus(tab.id, 'red')}
                    className={`py-1.5 text-xs rounded-lg font-medium transition border ${
                      tab.status === 'red'
                        ? 'bg-rose-950 text-rose-300 border-rose-700'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    🔴 Đỏ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* INSTRUCTIONS */}
        <div className="w-full bg-indigo-950/30 border border-indigo-900/50 p-4 rounded-xl text-xs text-indigo-300 leading-relaxed">
          <b>💡 Hướng dẫn Test:</b>
          <ol className="list-decimal list-inside space-y-1 mt-1">
            <li>Mở trang này ở một <b>Cửa Sổ Mới (New Window)</b> hoặc Tab riêng.</li>
            <li>Quay lại ứng dụng ScreenSentinel và bấm <b>"Chọn màn hình cần soi"</b> ➔ Chọn cửa sổ trang Test này.</li>
            <li>Thử thay đổi trạng thái icon từ <b>Vàng ⚠️ ➔ Đỏ 🔴</b> ở các vị trí khác nhau để kiểm tra còi báo động!</li>
          </ol>
        </div>
      </main>
    </div>
  );
}
