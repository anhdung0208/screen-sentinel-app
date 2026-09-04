/**
 * Thuật toán phân tích ảnh & loại trừ vùng (Exclusion Zone)
 */

// Hàm kiểm tra chính xác pixel màu ĐỎ (🔴), phân biệt rõ với màu VÀNG/CAM (⚠️)
export function isTrueRedPixel(r, g, b) {
  // Màu đỏ chuẩn: R cao (> 130), G thấp (< 115), R áp đảo cả G và B ít nhất 60 đơn vị
  // Màu vàng/cam có G rất cao (G > 130) nên sẽ bị loại bỏ hoàn toàn
  return r > 130 && g < 115 && (r - g) > 60 && (r - b) > 60;
}

// Kiểm tra xem 1 tọa độ pixel có nằm trong Vùng Loại Trừ (Exclusion Zone) nào không
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

// 1. Phân tích tỷ lệ điểm ảnh màu ĐỎ (có tính loại trừ)
export function analyzeRedDominance(ctx, zone, exclusionZones = [], thresholdPercent = 0.1) {
  const { width, height, x: zoneX, y: zoneY } = zone;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  let totalValidPixels = 0;
  let redPixels = 0;

  for (let py = 0; py < height; py++) {
    for (let px = 0; px < width; px++) {
      const videoX = zoneX + px;
      const videoY = zoneY + py;

      // Bỏ qua pixel thuộc vùng loại trừ
      if (isPixelExcluded(videoX, videoY, exclusionZones)) {
        continue;
      }

      totalValidPixels++;
      const i = (py * width + px) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Sử dụng hàm lọc màu ĐỎ chuẩn
      if (isTrueRedPixel(r, g, b)) {
        redPixels++;
      }
    }
  }

  if (totalValidPixels === 0) {
    return { isAlert: false, ratio: 0, redPixels: 0, totalPixels: 0, message: 'Tất cả điểm ảnh đã bị loại trừ' };
  }

  const redRatio = (redPixels / totalValidPixels) * 100;
  return {
    isAlert: redRatio >= thresholdPercent && redPixels > 5,
    ratio: redRatio,
    redPixels,
    totalPixels: totalValidPixels,
    message: `Phát hiện ${redRatio.toFixed(2)}% màu ĐỎ (${redPixels} px / Ngưỡng: ${thresholdPercent}%)`,
  };
}

// 2. So sánh khác biệt giữa ảnh hiện tại và ảnh mẫu (có tính loại trừ)
export function analyzeImageDifference(ctx, zone, baselineImageData, exclusionZones = [], diffThreshold = 5) {
  const { width, height, x: zoneX, y: zoneY } = zone;
  if (!baselineImageData) return { isAlert: false, ratio: 0, redPixels: 0, message: 'Chưa có ảnh mẫu baseline' };

  const currentImageData = ctx.getImageData(0, 0, width, height);
  const cur = currentImageData.data;
  const base = baselineImageData.data;
  let totalValidPixels = 0;
  let diffPixels = 0;

  for (let py = 0; py < height; py++) {
    for (let px = 0; px < width; px++) {
      const videoX = zoneX + px;
      const videoY = zoneY + py;

      // Bỏ qua pixel thuộc vùng loại trừ
      if (isPixelExcluded(videoX, videoY, exclusionZones)) {
        continue;
      }

      totalValidPixels++;
      const i = (py * width + px) * 4;

      const diffR = Math.abs(cur[i] - base[i]);
      const diffG = Math.abs(cur[i + 1] - base[i + 1]);
      const diffB = Math.abs(cur[i + 2] - base[i + 2]);
      const avgDiff = (diffR + diffG + diffB) / 3;

      if (avgDiff > 25) {
        diffPixels++;
      }
    }
  }

  if (totalValidPixels === 0) {
    return { isAlert: false, ratio: 0, redPixels: 0, totalPixels: 0, message: 'Tất cả điểm ảnh đã bị loại trừ' };
  }

  const diffRatio = (diffPixels / totalValidPixels) * 100;
  return {
    isAlert: diffRatio >= diffThreshold,
    ratio: diffRatio,
    redPixels: diffPixels,
    totalPixels: totalValidPixels,
    message: `Trạng thái thay đổi ${diffRatio.toFixed(2)}% (${diffPixels} px / Ngưỡng: ${diffThreshold}%)`,
  };
}
