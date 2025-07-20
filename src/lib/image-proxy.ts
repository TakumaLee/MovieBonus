/**
 * 圖片代理工具 - 處理外部圖片載入問題
 */

/**
 * 將威秀影城圖片 URL 轉換為可靠的替代方案
 */
export function getReliableImageUrl(originalUrl: string, fallbackUrl?: string): string {
  // 如果是威秀影城圖片，嘗試轉換為可靠來源
  if (originalUrl?.includes('vscinemas.com.tw')) {
    // 提取檔名
    const filename = originalUrl.split('/').pop();
    
    // 嘗試不同的 URL 格式
    const alternatives = [
      originalUrl,
      originalUrl.replace('www.vscinemas.com.tw', 'vscinemas.com.tw'),
      originalUrl.replace('https://', 'http://'),
    ];
    
    // 返回第一個 URL，錯誤時會自動 fallback
    return alternatives[0];
  }
  
  return originalUrl || fallbackUrl || 'https://placehold.co/400x600.png';
}

/**
 * 圖片載入錯誤處理
 */
export function handleImageError(event: React.SyntheticEvent<HTMLImageElement, Event>) {
  const img = event.currentTarget;
  const currentSrc = img.src;
  
  // 如果當前是威秀圖片且載入失敗，使用 placeholder
  if (currentSrc.includes('vscinemas.com.tw') || currentSrc.includes('_next/image')) {
    img.src = 'https://placehold.co/400x600.png?text=電影海報';
  }
}