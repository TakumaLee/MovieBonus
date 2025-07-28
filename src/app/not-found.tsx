import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold">頁面不存在</h2>
          <p className="text-muted-foreground">
            抱歉，您要尋找的頁面不存在或已被移除。
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
      </div>
    </div>
  );
}