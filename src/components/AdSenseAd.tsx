'use client';

import { useEffect, useRef, memo } from 'react';
import { 
  AdSenseAdProps, 
  getAdConfig, 
  initializeAd, 
  shouldShowAds,
  adEvents 
} from '@/lib/adsense';
import { cn } from '@/lib/utils';

const AdSenseAd = memo(function AdSenseAd({
  slot,
  format = 'auto',
  responsive = true,
  style,
  className,
}: AdSenseAdProps) {
  const adRef = useRef<HTMLModElement>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // 檢查是否應該顯示廣告
    if (!shouldShowAds()) {
      return;
    }

    // 確保 AdSense 腳本已載入且廣告未初始化過
    if (
      typeof window !== 'undefined' && 
      window.adsbygoogle && 
      adRef.current && 
      !hasInitialized.current
    ) {
      try {
        // 初始化廣告
        initializeAd(adRef.current);
        hasInitialized.current = true;
        
        // 追蹤廣告載入事件
        adEvents.adLoaded(slot);
      } catch (error) {
        console.error('AdSense 廣告初始化失敗:', error);
        adEvents.adError(slot, 'initialization_failed');
      }
    }
  }, [slot]);

  // 如果不應該顯示廣告，返回 null
  if (!shouldShowAds()) {
    return null;
  }

  // 獲取廣告配置
  const adConfig = getAdConfig(slot, format, responsive);

  // 預設樣式
  const defaultStyle: React.CSSProperties = {
    display: 'block',
    textAlign: 'center',
    minHeight: responsive ? '250px' : undefined,
    ...style,
  };

  return (
    <div 
      className={cn(
        'w-full flex justify-center items-center',
        'bg-muted/30 rounded-lg border border-border/50',
        'transition-all duration-300 hover:bg-muted/50',
        className
      )}
      style={{ minHeight: '250px' }}
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={defaultStyle}
        {...adConfig}
        onClick={() => adEvents.adClicked(slot)}
      />
    </div>
  );
});

// 預定義的廣告組件變體
export const HomePageTopAd = memo(function HomePageTopAd({ className }: { className?: string }) {
  return (
    <AdSenseAd
      slot="homepage_top"
      format="auto"
      responsive={true}
      className={cn('my-8', className)}
    />
  );
});

export const HomePageMiddleAd = memo(function HomePageMiddleAd({ className }: { className?: string }) {
  return (
    <AdSenseAd
      slot="homepage_middle"
      format="auto"
      responsive={true}
      className={cn('my-8', className)}
    />
  );
});

export const MovieDetailTopAd = memo(function MovieDetailTopAd({ className }: { className?: string }) {
  return (
    <AdSenseAd
      slot="movie_detail_top"
      format="auto"
      responsive={true}
      className={cn('my-6', className)}
    />
  );
});

export const MovieDetailSidebarAd = memo(function MovieDetailSidebarAd({ className }: { className?: string }) {
  return (
    <AdSenseAd
      slot="movie_detail_sidebar"
      format="vertical"
      responsive={true}
      className={cn('my-4', className)}
      style={{ minHeight: '600px' }}
    />
  );
});

// 響應式橫幅廣告
export const ResponsiveBannerAd = memo(function ResponsiveBannerAd({ 
  slot, 
  className 
}: { 
  slot: AdSenseAdProps['slot']; 
  className?: string; 
}) {
  return (
    <AdSenseAd
      slot={slot}
      format="auto"
      responsive={true}
      className={cn('my-6', className)}
      style={{ minHeight: '100px' }}
    />
  );
});

export default AdSenseAd;