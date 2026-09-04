import { useState, useEffect, useRef } from 'react';
import { analyzeRedDominance, analyzeImageDifference } from '../utils/detector';
import { soundManager } from '../utils/audioAlert';
import toast from 'react-hot-toast';

export function useZoneTracker({ isCapturing, videoRef, zones, setZones, settings }) {
  const [isTracking, setIsTracking] = useState(false);
  const [incidents, setIncidents] = useState([]);
  const lastAlertTimes = useRef({});
  const processCanvasRef = useRef(null);
  const intervalRef = useRef(null);

  const scanIntervalMs = (settings.scanIntervalSec || 10) * 1000;

  useEffect(() => {
    if (isTracking && isCapturing) {
      // Quét ngay lập tức 1 lần đầu tiên khi bấm Bắt đầu tracking
      runDetection();

      intervalRef.current = setInterval(() => {
        runDetection();
      }, scanIntervalMs);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isTracking, isCapturing, zones, settings, scanIntervalMs]);

  const runDetection = () => {
    if (!videoRef.current || !processCanvasRef.current) return;
    const video = videoRef.current;
    const canvas = processCanvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    let updated = false;

    // Lọc danh sách các Vùng Loại Trừ đang bật
    const exclusionZones = zones.filter((z) => z.enabled && z.mode === 'ignore_detect');

    zones.forEach((zone) => {
      if (!zone.enabled) return;

      // Bỏ qua Vùng Loại Trừ khi tính điểm ảnh
      if (zone.mode === 'ignore_detect') {
        zone.lastStatus = 'normal';
        zone.currentRatio = 0;
        zone.currentPixels = 0;
        return;
      }

      canvas.width = zone.width;
      canvas.height = zone.height;
      ctx.drawImage(
        video,
        zone.x, zone.y, zone.width, zone.height,
        0, 0, zone.width, zone.height
      );

      let result = { isAlert: false, message: '', ratio: 0, redPixels: 0 };

      if (zone.mode === 'red_detect') {
        result = analyzeRedDominance(ctx, zone, exclusionZones, zone.redThreshold);
      } else if (zone.mode === 'diff_detect') {
        result = analyzeImageDifference(ctx, zone, zone.baselineData, exclusionZones, zone.diffThreshold);
      }

      const prevStatus = zone.lastStatus;
      const prevRatio = zone.currentRatio;
      const prevPixels = zone.currentPixels;

      zone.currentRatio = result.ratio;
      zone.currentPixels = result.redPixels;

      if (result.isAlert) {
        zone.lastStatus = 'alert';
        handleTriggerAlert(zone, result.message, canvas.toDataURL('image/jpeg', 0.85));
      } else {
        zone.lastStatus = 'normal';
      }

      if (prevStatus !== zone.lastStatus || Math.abs((prevRatio || 0) - result.ratio) > 0.01 || prevPixels !== result.redPixels) {
        updated = true;
      }
    });

    if (updated) {
      setZones([...zones]);
    }
  };

  const handleTriggerAlert = (zone, reason, snapshot) => {
    const now = Date.now();
    const lastTime = lastAlertTimes.current[zone.id] || 0;
    const cooldownMs = (settings.cooldownMin || 5) * 60 * 1000;

    // Kiểm tra thời gian trì hoãn báo lại (Cooldown)
    if (now - lastTime < cooldownMs) return;
    lastAlertTimes.current[zone.id] = now;

    // Phát âm thanh báo động theo cài đặt (Chime, Siren, Beep)
    soundManager.playSound(settings.soundType || 'chime', (settings.volume || 80) / 100);

    // Toast cảnh báo
    toast.error(`\u{1F6A8} ${zone.name}: ${reason}`, { duration: 5000 });

    // Browser notification
    if (Notification.permission === 'granted') {
      new Notification(`\u{1F6A8} BÁO ĐỘNG: ${zone.name}`, { body: reason });
    }

    // Lưu lịch sử sự cố
    const newIncident = {
      id: Date.now(),
      time: new Date().toLocaleTimeString(),
      zoneName: zone.name,
      reason,
      snapshot,
    };
    setIncidents((prev) => [newIncident, ...prev.slice(0, 25)]);
  };

  return {
    isTracking,
    setIsTracking,
    incidents,
    processCanvasRef,
  };
}
