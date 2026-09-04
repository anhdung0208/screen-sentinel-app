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
      const prevPixels = zone.currentPixels || 0;

      zone.currentRatio = result.ratio;
      zone.currentPixels = result.redPixels;

      if (result.isAlert) {
        zone.lastStatus = 'alert';

        // Tình huống 1: Mới xuất hiện sự cố (Chuyển từ Bình thường -> Báo động)
        const isNewAlertTransition = prevStatus !== 'alert';

        // Tình huống 2: Phát hiện có thêm icon lỗi mới xuất hiện ở vị trí khác (Số pixel đỏ tăng > 40px)
        const isSignificantIncrease = (result.redPixels - prevPixels) > 40;

        handleTriggerAlert(
          zone,
          result.message,
          canvas.toDataURL('image/jpeg', 0.85),
          isNewAlertTransition || isSignificantIncrease
        );
      } else {
        zone.lastStatus = 'normal';
        // Khi vùng đã quay về Bình thường, xoá thời gian cooldown cũ để lần lỗi tiếp theo báo ngay!
        lastAlertTimes.current[zone.id] = 0;
      }

      if (prevStatus !== zone.lastStatus || Math.abs((prevRatio || 0) - result.ratio) > 0.01 || prevPixels !== result.redPixels) {
        updated = true;
      }
    });

    if (updated) {
      setZones([...zones]);
    }
  };

  const handleTriggerAlert = (zone, reason, snapshot, forceAlert = false) => {
    const now = Date.now();
    const lastTime = lastAlertTimes.current[zone.id] || 0;
    const cooldownMs = (settings.cooldownMin || 5) * 60 * 1000;

    // Nếu KHÔNG phải sự cố mới VÀ vẫn đang trong thời gian Cooldown -> tạm ngưng kêu lặp lại
    if (!forceAlert && now - lastTime < cooldownMs) return;
    lastAlertTimes.current[zone.id] = now;

    // Phát âm thanh hoặc ĐỌC GIỌNG NÓI ĐỌC TÊN VỊ TRÍ LỖI
    soundManager.playSound(settings.soundType || 'voice', (settings.volume || 80) / 100, zone.name);

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
