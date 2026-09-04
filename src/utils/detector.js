/**
 * Thuật toán phân tích ảnh, nhận diện vị trí tab bị lỗi (5 Vị trí) & loại trừ vùng
 */

// Danh sách 5 vị trí tab mặc định theo thứ tự từ trái sang phải
export const DEFAULT_SLOT_NAMES = [
  'Full Warehouse',
  'Moulding Area',
  'Ground Floor PCS',
  'Central Reject',
  'Tornado',
];

// Hàm kiểm tra chính xác pixel màu ĐỎ (🔴), phân biệt rõ với màu VÀNG/CAM (⚠️)
export function isTrueRedPixel(r, g, b) {
  return r > 130 && g < 115 && (r - g) > 60 && (r - b) > 60;
}

// Kiểm tra xem 1 tọa độ pixel có nằm trong Vùng Loại Trừ nào không
function isPixelExcluded(videoX, videoY, exclusionZones = []) {
  for (let i = 0; i < exclusionZones.length; i++) {
    const ex = exclusionZones[i];
    if (
      ex.enabled &&
      videoX >= ex.x &&
      videoX < ex.x + ex.width &&
      videoY >= ex.y &&
      videoY < ex.y + ex.height
    ) {
      return true;
    }
  }
  return false;
}

// 1. Phân tích tỷ lệ điểm màu ĐỎ & Tự động xác định tên 5 Vị trí bị lỗi
export function analyzeRedDominance(ctx, zone, exclusionZones = [], thresholdPercent = 0.1, customSlotNames = DEFAULT_SLOT_NAMES) {
  const { width, height, x: zoneX, y: zoneY } = zone;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  let totalValidPixels = 0;
  let redPixels = 0;

  // Theo dõi số pixel đỏ ở từng phân vị trí (5 slots)
  const slotRedCounts = [0, 0, 0, 0, 0];
  const slotValidCounts = [0, 0, 0, 0, 0];

  for (let py = 0; py < height; py++) {
    for (let px = 0; px < width; px++) {
      const videoX = zoneX + px;
      const videoY = zoneY + py;

      // Bỏ qua pixel thuộc vùng loại trừ
      if (isPixelExcluded(videoX, videoY, exclusionZones)) {
        continue;
      }

      // Xác định pixel thuộc slot nào (từ 0 đến 4)
      const slotIndex = Math.min(Math.floor((px / width) * 5), 4);
      slotValidCounts[slotIndex]++;
      totalValidPixels++;

      const i = (py * width + px) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      if (isTrueRedPixel(r, g, b)) {
        redPixels++;
        slotRedCounts[slotIndex]++;
      }
    }
  }

  if (totalValidPixels === 0) {
    return {
      isAlert: false,
      ratio: 0,
      redPixels: 0,
      totalPixels: 0,
      alertLocations: [],
      message: 'Tất cả điểm ảnh đã bị loại trừ',
    };
  }

  // Tìm danh sách tên các vị trí (slots) bị phát hiện có điểm đỏ > ngưỡng
  const alertLocations = [];
  slotRedCounts.forEach((count, idx) => {
    const slotValid = slotValidCounts[idx];
    if (slotValid > 0) {
      const slotRatio = (count / slotValid) * 100;
      if (slotRatio >= thresholdPercent && count >= 5) {
        const slotName = customSlotNames[idx] || `Vị trí #${idx + 1}`;
        alertLocations.push(slotName);
      }
    }
  });

  const redRatio = (redPixels / totalValidPixels) * 100;
  const isAlert = redRatio >= thresholdPercent && redPixels >= 5;

  const locationText = alertLocations.length > 0 ? alertLocations.join(', ') : '';
  const message = isAlert
    ? `Phát hiện ${redRatio.toFixed(2)}% màu ĐỎ tại [${locationText || 'Vùng soi'}] (${redPixels} px)`
    : `Bình thường (${redRatio.toFixed(2)}% màu ĐỎ)`;

  return {
    isAlert,
    ratio: redRatio,
    redPixels,
    totalPixels: totalValidPixels,
    alertLocations,
    locationText,
    message,
  };
}

// 2. So sánh khác biệt ảnh (với tính năng phân vị trí)
export function analyzeImageDifference(ctx, zone, baselineImageData, exclusionZones = [], diffThreshold = 5, customSlotNames = DEFAULT_SLOT_NAMES) {
  const { width, height, x: zoneX, y: zoneY } = zone;
  if (!baselineImageData) return { isAlert: false, ratio: 0, redPixels: 0, alertLocations: [], message: 'Chưa có ảnh mẫu baseline' };

  const currentImageData = ctx.getImageData(0, 0, width, height);
  const cur = currentImageData.data;
  const base = baselineImageData.data;
  let totalValidPixels = 0;
  let diffPixels = 0;

  const slotDiffCounts = [0, 0, 0, 0, 0];
  const slotValidCounts = [0, 0, 0, 0, 0];

  for (let py = 0; py < height; py++) {
    for (let px = 0; px < width; px++) {
      const videoX = zoneX + px;
      const videoY = zoneY + py;

      if (isPixelExcluded(videoX, videoY, exclusionZones)) {
        continue;
      }

      const slotIndex = Math.min(Math.floor((px / width) * 5), 4);
      slotValidCounts[slotIndex]++;
      totalValidPixels++;

      const i = (py * width + px) * 4;
      const diffR = Math.abs(cur[i] - base[i]);
      const diffG = Math.abs(cur[i + 1] - base[i + 1]);
      const diffB = Math.abs(cur[i + 2] - base[i + 2]);
      const avgDiff = (diffR + diffG + diffB) / 3;

      if (avgDiff > 25) {
        diffPixels++;
        slotDiffCounts[slotIndex]++;
      }
    }
  }

  if (totalValidPixels === 0) {
    return { isAlert: false, ratio: 0, redPixels: 0, totalPixels: 0, alertLocations: [], message: 'Tất cả điểm ảnh đã bị loại trừ' };
  }

  const alertLocations = [];
  slotDiffCounts.forEach((count, idx) => {
    const slotValid = slotValidCounts[idx];
    if (slotValid > 0) {
      const slotRatio = (count / slotValid) * 100;
      if (slotRatio >= diffThreshold && count >= 5) {
        const slotName = customSlotNames[idx] || `Vị trí #${idx + 1}`;
        alertLocations.push(slotName);
      }
    }
  });

  const diffRatio = (diffPixels / totalValidPixels) * 100;
  const isAlert = diffRatio >= diffThreshold;
  const locationText = alertLocations.length > 0 ? alertLocations.join(', ') : '';

  return {
    isAlert,
    ratio: diffRatio,
    redPixels: diffPixels,
    totalPixels: totalValidPixels,
    alertLocations,
    locationText,
    message: isAlert ? `Trạng thái thay đổi ${diffRatio.toFixed(2)}% tại [${locationText || 'Vùng soi'}]` : 'Bình thường',
  };
}
