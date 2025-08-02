'use client';

import { Suspense } from 'react';
import Script from 'next/script';
import { ADSENSE_CLIENT_ID, shouldShowAds } from '@/lib/adsense';

function GoogleAdSenseInner() {
  // 只在應該顯示廣告時載入 AdSense 腳本
  if (!shouldShowAds() || !ADSENSE_CLIENT_ID) {
    return null;
  }

  return (
    <>
      <Script
        id="google-adsense"
        strategy="afterInteractive"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
        crossOrigin="anonymous"
        onLoad={() => {
          console.log('Google AdSense script loaded successfully');
        }}
        onError={(error) => {
          console.error('Failed to load Google AdSense script:', error);
        }}
      />
    </>
  );
}

export default function GoogleAdSense() {
  return (
    <Suspense fallback={null}>
      <GoogleAdSenseInner />
    </Suspense>
  );
}

// TypeScript 類型定義擴展
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}