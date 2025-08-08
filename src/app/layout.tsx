import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { StructuredData } from '@/components/SEO/StructuredData';
import GoogleAnalytics from '@/components/GoogleAnalytics';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' }
  ]
};

export const metadata: Metadata = {
  metadataBase: new URL('https://paruparu.vercel.app'),
  title: {
    default: '特典速報 パルパル - 台灣電影特典資訊追蹤平台 | Movie Bonus Tracker',
    template: '%s | 特典速報 パルパル'
  },
  description: '台灣最完整的電影特典與限定禮品追蹤平台 パルパル。即時更新威秀影城、各大電影院的獨家特典資訊，movie bonus、perk、限定商品一網打盡！不錯過任何精彩好康！',
  keywords: [
    // 中文關鍵字
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
  authors: [{ name: '特典速報' }],
  creator: '特典速報',
  publisher: '特典速報',
  category: '娛樂',
  
  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    url: 'https://paruparu.vercel.app',
    title: '特典速報 パルパル - 台灣電影特典資訊追蹤平台 | Movie Bonus Tracker',
    description: '台灣最完整的電影特典與限定禮品追蹤平台 パルパル。即時更新威秀影城、各大電影院的獨家特典資訊，movie bonus、perk、限定商品一網打盡！',
    siteName: '特典速報 パルパル',
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: '特典速報 - 台灣電影特典資訊',
    }],
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: '特典速報 パルパル - 台灣電影特典資訊追蹤平台 | Movie Bonus Tracker',
    description: '台灣最完整的電影特典與限定禮品追蹤平台 パルパル。即時更新威秀影城、各大電影院的獨家特典資訊，movie bonus、perk、限定商品一網打盡！',
    images: ['/og-image.jpg'],
  },
  
  // 其他 meta tags
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
  
  // AdSense verification
  other: {
    'google-adsense-account': 'ca-pub-3744784797459022',
  },
  
  alternates: {
    canonical: 'https://paruparu.vercel.app',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" className="light">
      <head>
        {/* Enhanced Safari iOS viewport handling */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=yes, maximum-scale=5" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* Basic CSS for iOS overflow prevention */}
        <style dangerouslySetInnerHTML={{
          __html: `
            html { 
              overflow-x: hidden !important; 
            }
            body { 
              overflow-x: hidden !important; 
              position: relative; 
            }
            * { 
              box-sizing: border-box; 
            }
          `
        }} />
        
        {/* Google Search Console 驗證 */}
        <meta name="google-site-verification" content="uhuWAZIse2zwAXrBThHqPQZhxruWaqyMgdm_m2EmKUk" />
        
        {/* Favicon 設定 */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />
        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3744784797459022" crossOrigin="anonymous"></script>
        <StructuredData type="organization" />
        <StructuredData type="website" />
      </head>
      <body className="font-body antialiased">
        <GoogleAnalytics />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
