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

  // 如果是威秀影城圖片，使用代理
  if (originalUrl.includes('vscinemas.com.tw')) {
    const encodedUrl = encodeURIComponent(originalUrl);
    return `/api/image-proxy?url=${encodedUrl}`;
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