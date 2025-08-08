/**
 * SEO 工具函數
 */

// 生成優化的頁面標題
export function generatePageTitle(title: string, suffix: string = '特典速報 パルパル'): string {
  if (!title) return suffix;
  
  // 確保標題長度不超過 60 個字符（對 SEO 更友好）
  const fullTitle = `${title} | ${suffix}`;
  if (fullTitle.length > 60) {
    const maxTitleLength = 60 - suffix.length - 3; // 3 是 " | " 的長度
    const truncatedTitle = title.substring(0, maxTitleLength) + '...';
    return `${truncatedTitle} | ${suffix}`;
  }
  
  return fullTitle;
}

// 生成優化的描述
export function generateDescription(description: string, maxLength: number = 160): string {
  if (!description) return '';
  
  // 移除多餘空白和換行
  const cleanDescription = description.replace(/\s+/g, ' ').trim();
  
  // 如果描述太長，截斷並加上省略號
  if (cleanDescription.length > maxLength) {
    return cleanDescription.substring(0, maxLength - 3) + '...';
  }
  
  return cleanDescription;
}

// 生成 JSON-LD 結構化數據
export function generateJsonLd(data: any): string {
  return JSON.stringify(data, null, 2);
}

// 生成 canonical URL
export function generateCanonicalUrl(path: string): string {
  const baseUrl = 'https://paruparu.vercel.app';
  
  // 確保路徑以 / 開頭
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // 移除查詢參數和錨點
  const pathWithoutQuery = cleanPath.split('?')[0].split('#')[0];
  
  // 移除尾部斜線（除了根路徑）
  const finalPath = pathWithoutQuery === '/' ? pathWithoutQuery : pathWithoutQuery.replace(/\/$/, '');
  
  return `${baseUrl}${finalPath}`;
}

// 優化的關鍵字生成器
export function generateKeywords(baseKeywords: string[], additionalKeywords?: string[]): string[] {
  const allKeywords = [...baseKeywords];
  
  if (additionalKeywords) {
    allKeywords.push(...additionalKeywords);
  }
  
  // 移除重複關鍵字
  const uniqueKeywords = Array.from(new Set(allKeywords));
  
  // 限制關鍵字數量（過多的關鍵字可能被視為 spam）
  return uniqueKeywords.slice(0, 20);
}

// 生成 Open Graph 圖片 URL
export function generateOgImageUrl(imagePath?: string): string {
  const baseUrl = 'https://paruparu.vercel.app';
  
  if (!imagePath) {
    return `${baseUrl}/og-image.png`;
  }
  
  // 如果是相對路徑，轉換為絕對路徑
  if (!imagePath.startsWith('http')) {
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${baseUrl}${cleanPath}`;
  }
  
  return imagePath;
}

// 檢查並優化圖片 URL
export function optimizeImageUrl(url?: string): string | undefined {
  if (!url) return undefined;
  
  // 如果是本地路徑，返回原始路徑
  if (url.startsWith('/')) return url;
  
  // 如果是完整的 URL，確保使用 HTTPS
  if (url.startsWith('http://')) {
    return url.replace('http://', 'https://');
  }
  
  return url;
}

// 生成 hreflang 標籤數據
export function generateHreflangData(currentPath: string) {
  const baseUrl = 'https://paruparu.vercel.app';
  
  return {
    'zh-TW': `${baseUrl}${currentPath}`,
    'x-default': `${baseUrl}${currentPath}`,
  };
}