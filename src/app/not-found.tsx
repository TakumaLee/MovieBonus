import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Search, Film } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - 頁面不存在 | 特典速報 パルパル',
  description: '抱歉，您要尋找的頁面不存在。返回特典速報首頁，探索最新的電影特典資訊。',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center mb-4">
          <Film className="h-16 w-16 text-muted-foreground" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold">頁面不存在</h2>
          <p className="text-muted-foreground">
            抱歉，您要尋找的頁面不存在或已被移除。
          </p>
          <p className="text-sm text-muted-foreground">
            可能是連結已過期，或您輸入了錯誤的網址。
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              返回首頁
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/?search=true">
              <Search className="mr-2 h-4 w-4" />
              搜尋電影
            </Link>
          </Button>
        </div>
        
        <div className="pt-8 border-t">
          <p className="text-sm text-muted-foreground mb-2">熱門電影特典：</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link href="/" className="text-sm text-primary hover:underline">威秀影城特典</Link>
            <span className="text-muted-foreground">·</span>
            <Link href="/" className="text-sm text-primary hover:underline">首週購票禮</Link>
            <span className="text-muted-foreground">·</span>
            <Link href="/" className="text-sm text-primary hover:underline">限定商品</Link>
          </div>
        </div>
      </div>
    </div>
  );
}