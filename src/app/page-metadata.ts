import type { Metadata } from 'next';

export const homePageMetadata: Metadata = {
  title: '特典速報 パルパル - 台灣電影特典資訊追蹤平台 | Movie Bonus Tracker',
  description: '台灣最完整的電影特典與限定禮品追蹤平台 パルパル。即時更新威秀影城、各大電影院的獨家特典資訊，movie bonus、perk、限定商品一網打盡！不錯過任何精彩好康！',
  keywords: [
    // 核心關鍵字
    '特典速報', 'パルパル', '帕魯帕魯', 'paruparu',
    '電影特典', '電影禮品', '電影贈品', '電影周邊',
    '威秀影城', '電影院特典', '限定商品', '台灣電影',
    '首週購票禮', '預售禮', '會員禮', '電影特典情報',
    // 英文關鍵字
    'movie bonus', 'movie perk', 'cinema bonus', 'film bonus',
    'movie gift', 'cinema gift', 'movie merchandise', 'movie collectible',
    'movie promotion', 'cinema promotion', 'taiwan movie',
    'vieshow cinema', 'movie theater bonus', 'limited edition',
    // 日文關鍵字
    '映画特典', '映画グッズ', 'シネマ特典',
    // 品牌相關
    'paruparu', 'paru paru', 'パルパル', '帕魯帕魯'
  ],
  
  openGraph: {
    title: '特典速報 パルパル - 台灣電影特典資訊追蹤平台',
    description: '台灣最完整的電影特典與限定禮品追蹤平台。即時更新威秀影城、各大電影院的獨家特典資訊！',
    url: 'https://paruparu.vercel.app',
    siteName: '特典速報 パルパル',
    images: [
      {
        url: 'https://paruparu.vercel.app/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '特典速報 - 台灣電影特典資訊',
      }
    ],
    locale: 'zh_TW',
    type: 'website',
  },
  
  twitter: {
    card: 'summary_large_image',
    title: '特典速報 パルパル - 台灣電影特典資訊追蹤平台',
    description: '台灣最完整的電影特典與限定禮品追蹤平台。即時更新威秀影城、各大電影院的獨家特典資訊！',
    images: ['https://paruparu.vercel.app/og-image.jpg'],
  },
  
  alternates: {
    canonical: 'https://paruparu.vercel.app',
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};