// Google AdSense 配置
export const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-3744784797459022';

// AdSense 廣告單元尺寸配置
export const AD_SIZES = {
  // 手機版廣告尺寸
  mobile: {
    banner: { width: 320, height: 50 },
    rectangle: { width: 300, height: 250 },
    large_banner: { width: 320, height: 100 },
  },
  // 桌面版廣告尺寸
  desktop: {
    banner: { width: 728, height: 90 },
    rectangle: { width: 300, height: 250 },
    large_rectangle: { width: 336, height: 280 },
    leaderboard: { width: 728, height: 90 },
    skyscraper: { width: 160, height: 600 },
  },
  // 響應式廣告
  responsive: {
    display: 'block',
    format: 'auto',
    'full-width-responsive': 'true',
  }
} as const;

// 測試廣告單元 ID (開發環境使用)
export const TEST_AD_SLOTS = {
  homepage_top: 'ca-app-pub-3940256099942544/6300978111', // Google 測試廣告 ID
  homepage_middle: 'ca-app-pub-3940256099942544/6300978111',
  movie_detail_top: 'ca-app-pub-3940256099942544/6300978111',
  movie_detail_sidebar: 'ca-app-pub-3940256099942544/6300978111',
} as const;

// 生產環境廣告單元 ID (需要實際申請)
export const PRODUCTION_AD_SLOTS = {
  homepage_top: 'ca-pub-3744784797459022/1234567890', // 需要替換為實際的廣告單元 ID
  homepage_middle: 'ca-pub-3744784797459022/1234567891',
  movie_detail_top: 'ca-pub-3744784797459022/1234567892',
  movie_detail_sidebar: 'ca-pub-3744784797459022/1234567893',
} as const;

// 根據環境選擇廣告單元 ID
export const getAdSlotId = (slotName: keyof typeof TEST_AD_SLOTS): string => {
  const isProduction = process.env.NODE_ENV === 'production';
  return isProduction ? PRODUCTION_AD_SLOTS[slotName] : TEST_AD_SLOTS[slotName];
};

// AdSense 類型定義
export interface AdSenseAdProps {
  slot: keyof typeof TEST_AD_SLOTS;
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  responsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export interface AdSenseSlotConfig {
  'data-ad-client': string;
  'data-ad-slot': string;
  'data-ad-format'?: string;
  'data-full-width-responsive'?: string;
  style?: React.CSSProperties;
}

// 初始化 AdSense 廣告
export const initializeAd = (element: HTMLElement) => {
  if (typeof window !== 'undefined' && window.adsbygoogle) {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('AdSense 廣告初始化失敗:', error);
    }
  }
};

// 獲取廣告配置
export const getAdConfig = (
  slot: keyof typeof TEST_AD_SLOTS,
  format: string = 'auto',
  responsive: boolean = true
): AdSenseSlotConfig => {
  return {
    'data-ad-client': ADSENSE_CLIENT_ID,
    'data-ad-slot': getAdSlotId(slot),
    'data-ad-format': format,
    'data-full-width-responsive': responsive ? 'true' : 'false',
  };
};

// 檢查是否應該顯示廣告
export const shouldShowAds = (): boolean => {
  // 只在生產環境或明確設置了 SHOW_ADS 環境變量時顯示廣告
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';
  const isProduction = process.env.NODE_ENV === 'production';
  return isProduction || showAds;
};

// AdSense 事件追蹤
export const trackAdEvent = (eventName: string, adSlot: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      event_category: 'AdSense',
      event_label: adSlot,
    });
  }
};

// 預設義一些常用的廣告事件追蹤
export const adEvents = {
  // 廣告載入完成
  adLoaded: (slot: string) => {
    trackAdEvent('ad_loaded', slot);
  },
  
  // 廣告點擊
  adClicked: (slot: string) => {
    trackAdEvent('ad_clicked', slot);
  },
  
  // 廣告載入失敗
  adError: (slot: string, error: string) => {
    trackAdEvent('ad_error', `${slot}_${error}`);
  },
};

// TypeScript 全域類型定義
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}