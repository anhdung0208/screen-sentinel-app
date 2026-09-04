import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import ScreenViewer from './components/ScreenViewer';
import ZoneList from './components/ZoneList';
import SettingsPanel from './components/SettingsPanel';
import IncidentLogs from './components/IncidentLogs';
import TestSimulator from './components/TestSimulator';
import { useScreenCapture } from './hooks/useScreenCapture';
import { useZoneTracker } from './hooks/useZoneTracker';

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const { stream, isCapturing, videoRef, startCapture, stopCapture } = useScreenCapture();

  const [zones, setZones] = useState([]);
  const [settings, setSettings] = useState(() => {
    const savedVol = Number(localStorage.getItem('sentinel_vol') || '80');
    const savedCooldownMin = Number(localStorage.getItem('sentinel_cooldown_min') || '5');
    const savedScanSec = Number(localStorage.getItem('sentinel_scan_sec') || '10');
    const savedSoundType = localStorage.getItem('sentinel_sound_type') || 'chime';
    return {
      volume: savedVol,
      cooldownMin: savedCooldownMin,
      scanIntervalSec: savedScanSec,
      soundType: savedSoundType,
    };
  });

  useEffect(() => {
    localStorage.setItem('sentinel_vol', String(settings.volume));
    localStorage.setItem('sentinel_cooldown_min', String(settings.cooldownMin));
    localStorage.setItem('sentinel_scan_sec', String(settings.scanIntervalSec));
    localStorage.setItem('sentinel_sound_type', settings.soundType);
  }, [settings]);

  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  const { isTracking, setIsTracking, incidents, processCanvasRef } = useZoneTracker({
    isCapturing,
    videoRef,
    zones,
    setZones,
    settings,
  });

  // Neu dang o duong dan /test thi hien thi trang TestSimulator
  if (currentPath === '/test') {
    return <TestSimulator />;
  }

  const handleAddZone = (rect, drawType = 'alert') => {
    const isIgnore = drawType === 'ignore';
    const ignoreCount = zones.filter((z) => z.mode === 'ignore_detect').length + 1;
    const alertCount = zones.filter((z) => z.mode !== 'ignore_detect').length + 1;

    const newZone = {
      id: 'zone_' + Date.now(),
      name: isIgnore ? `Bỏ qua #${ignoreCount}` : `Vùng #${alertCount}`,
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      mode: isIgnore ? 'ignore_detect' : 'red_detect',
      redThreshold: 0.1,
      diffThreshold: 5,
      baselineData: null,
      lastStatus: 'normal',
      enabled: true,
    };
    captureBaselineData(newZone);
    setZones((prev) => [...prev, newZone]);
  };

  const captureBaselineData = (zone) => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = zone.width;
    canvas.height = zone.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(
      videoRef.current,
      zone.x, zone.y, zone.width, zone.height,
      0, 0, zone.width, zone.height
    );
    zone.baselineData = ctx.getImageData(0, 0, zone.width, zone.height);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#e2e8f0',
            border: '1px solid #334155',
            fontSize: '13px',
          },
        }}
      />

      <Header
        isCapturing={isCapturing}
        isTracking={isTracking}
        onStartCapture={startCapture}
        onStopCapture={stopCapture}
        onToggleTracking={() => setIsTracking(!isTracking)}
        onOpenTestPage={() => window.open('/test', '_blank')}
      />

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 p-6 max-w-[1800px] w-full mx-auto">
        <div className="lg:col-span-3 flex flex-col gap-4">
          <ScreenViewer
            isCapturing={isCapturing}
            isTracking={isTracking}
            videoRef={videoRef}
            processCanvasRef={processCanvasRef}
            zones={zones}
            onAddZone={handleAddZone}
            settings={settings}
          />
        </div>

        <div className="flex flex-col gap-6">
          <ZoneList
            zones={zones}
            setZones={setZones}
            onCaptureBaseline={captureBaselineData}
          />
          <SettingsPanel
            settings={settings}
            setSettings={setSettings}
          />
          <IncidentLogs
            incidents={incidents}
          />
        </div>
      </main>
    </div>
  );
}
