/**
 * 圖片 URL 處理工具
 */

/**
 * 將外部圖片 URL 轉換為代理 URL
 * 用於解決 Vercel 環境下的圖片載入問題
 */
export function getProxyImageUrl(originalUrl: string): string {
  if (!originalUrl) {
    return 'https://placehold.co/400x600.png?text=無圖片';
  }

  // 如果是 placeholder 圖片，直接返回
  if (originalUrl.includes('placehold.co') || originalUrl.includes('placeholder.com')) {
    return originalUrl;
  }

  // 如果是威秀影城圖片，直接嘗試載入（Firebase Hosting 從台灣節點提供更好連線）
  if (originalUrl.includes('vscinemas.com.tw')) {
    return originalUrl;
  }

  // 其他圖片直接返回
  return originalUrl;
}

/**
 * 獲取適當尺寸的 placeholder 圖片
 */
export function getPlaceholderUrl(width: number = 400, height: number = 600, text: string = '電影海報'): string {
  return `https://placehold.co/${width}x${height}.png?text=${encodeURIComponent(text)}`;
}

/**
 * 圖片載入錯誤處理
 */
export function handleImageError(event: React.SyntheticEvent<HTMLImageElement, Event>) {
  const img = event.currentTarget;
  const currentSrc = img.src;
  
  // 如果是代理 URL 失敗，嘗試原始 URL
  if (currentSrc.includes('/api/image-proxy')) {
    const urlMatch = currentSrc.match(/url=([^&]+)/);
    if (urlMatch) {
      const originalUrl = decodeURIComponent(urlMatch[1]);
      img.src = originalUrl;
      return;
    }
  }
  
  // 如果是威秀圖片失敗，使用 placeholder
  if (currentSrc.includes('vscinemas.com.tw') || currentSrc.includes('/api/image-proxy')) {
    img.src = getPlaceholderUrl(400, 600, '圖片載入失敗');
  }
}