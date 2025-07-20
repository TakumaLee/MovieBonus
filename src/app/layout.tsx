import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { StructuredData } from '@/components/SEO/StructuredData';

export const metadata: Metadata = {
  metadataBase: new URL('https://paruparu.vercel.app'),
  title: {
    default: '特典速報 - 台灣電影特典資訊追蹤平台',
    template: '%s | 特典速報'
  },
  description: '台灣最完整的電影特典與限定禮品追蹤平台。即時更新威秀影城、各大電影院的獨家特典資訊，不錯過任何精彩好康！',
  keywords: ['電影特典', '電影禮品', '威秀影城', '電影院特典', '限定商品', '台灣電影', '特典速報', '電影周邊'],
  authors: [{ name: '特典速報' }],
  creator: '特典速報',
  publisher: '特典速報',
  category: '娛樂',
  
  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    url: 'https://paruparu.vercel.app',
    title: '特典速報 - 台灣電影特典資訊追蹤平台',
    description: '台灣最完整的電影特典與限定禮品追蹤平台。即時更新威秀影城、各大電影院的獨家特典資訊，不錯過任何精彩好康！',
    siteName: '特典速報',
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
    title: '特典速報 - 台灣電影特典資訊追蹤平台',
    description: '台灣最完整的電影特典與限定禮品追蹤平台。即時更新威秀影城、各大電影院的獨家特典資訊，不錯過任何精彩好康！',
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
  
  verification: {
    // 可以在這裡添加 Google Search Console、Bing 等驗證碼
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
        <StructuredData type="organization" />
        <StructuredData type="website" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
