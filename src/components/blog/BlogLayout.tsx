/**
 * BlogLayout Component
 * 
 * Main layout wrapper for blog pages with navigation,
 * breadcrumbs, and consistent structure
 */

'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home, BookOpen } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface BlogLayoutProps {
  children: ReactNode;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
  showSidebar?: boolean;
  sidebar?: ReactNode;
  className?: string;
}

export default function BlogLayout({ 
  children, 
  breadcrumbs = [], 
  showSidebar = false,
  sidebar,
  className = ''
}: BlogLayoutProps) {
  const pathname = usePathname();

  // Generate default breadcrumbs based on path
  const defaultBreadcrumbs = generateBreadcrumbs(pathname);
  const finalBreadcrumbs = breadcrumbs.length > 0 ? breadcrumbs : defaultBreadcrumbs;

  return (
    <div className={`min-h-screen bg-background ${className}`}>
      {/* Blog Navigation Header */}
      <header className="bg-card border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/blog"
                className="flex items-center space-x-2 text-lg font-semibold text-foreground hover:text-primary transition-colors"
              >
                <BookOpen className="w-6 h-6" />
                <span>電影部落格</span>
              </Link>
              
              <Separator orientation="vertical" className="h-6" />
              
              <nav className="hidden md:flex items-center space-x-6">
                <BlogNavLink href="/blog" active={pathname === '/blog'}>
                  首頁
                </BlogNavLink>
                <BlogNavLink href="/blog/category/news" active={pathname.includes('/blog/category/news')}>
                  新片速報
                </BlogNavLink>
                <BlogNavLink href="/blog/category/bonus" active={pathname.includes('/blog/category/bonus')}>
                  特典情報
                </BlogNavLink>
                <BlogNavLink href="/blog/category/theater" active={pathname.includes('/blog/category/theater')}>
                  影城導覽
                </BlogNavLink>
                <BlogNavLink href="/blog/category/review" active={pathname.includes('/blog/category/review')}>
                  觀影推薦
                </BlogNavLink>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link 
                href="/blog/search"
                className="px-4 py-2 text-sm bg-muted hover:bg-muted/80 rounded-md transition-colors"
              >
                搜尋文章
              </Link>
              
              <Link 
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                回到首頁
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumbs */}
      {finalBreadcrumbs.length > 0 && (
        <div className="bg-muted/50 border-b">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center space-x-2 text-sm">
              {finalBreadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center space-x-2">
                  {index > 0 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                  {crumb.href ? (
                    <Link 
                      href={crumb.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-foreground font-medium">
                      {crumb.label}
                    </span>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-8">
        {showSidebar ? (
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              {children}
            </div>
            <aside className="lg:col-span-1">
              {sidebar}
            </aside>
          </div>
        ) : (
          children
        )}
      </main>

      {/* Blog Footer */}
      <footer className="bg-card border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-4">熱門分類</h3>
              <nav className="space-y-2">
                <Link href="/blog/category/news" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  新片速報
                </Link>
                <Link href="/blog/category/bonus" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  特典情報
                </Link>
                <Link href="/blog/category/theater" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  影城導覽
                </Link>
                <Link href="/blog/category/review" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  觀影推薦
                </Link>
              </nav>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">更多功能</h3>
              <nav className="space-y-2">
                <Link href="/blog/search" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  文章搜尋
                </Link>
                <Link href="/blog/rss.xml" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  RSS 訂閱
                </Link>
                <Link href="/movie" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  電影特典
                </Link>
                <Link href="/admin" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  管理後台
                </Link>
              </nav>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">關於我們</h3>
              <p className="text-sm text-muted-foreground mb-4">
                特典速報致力於提供最完整的台灣電影特典資訊，
                讓每位影迷都不錯過任何精彩好康。
              </p>
              <div className="flex space-x-4">
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Facebook
                </Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  LINE
                </Link>
              </div>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 特典速報 パルパル. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Helper component for navigation links
function BlogNavLink({ 
  href, 
  children, 
  active = false 
}: { 
  href: string; 
  children: ReactNode; 
  active?: boolean; 
}) {
  return (
    <Link 
      href={href}
      className={`text-sm font-medium transition-colors hover:text-primary ${
        active ? 'text-primary' : 'text-muted-foreground'
      }`}
    >
      {children}
    </Link>
  );
}

// Helper function to generate breadcrumbs from pathname
function generateBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [
    { label: '首頁', href: '/' }
  ];

  if (segments.length === 0) return breadcrumbs;

  // Add blog home
  breadcrumbs.push({ label: '部落格', href: '/blog' });

  // Process path segments
  for (let i = 1; i < segments.length; i++) {
    const segment = segments[i];
    const path = '/' + segments.slice(0, i + 1).join('/');
    
    let label = segment;
    
    // Map common segments to Chinese labels
    switch (segment) {
      case 'category':
        label = '分類';
        break;
      case 'tag':
        label = '標籤';
        break;
      case 'search':
        label = '搜尋';
        break;
      case 'news':
        label = '新片速報';
        break;
      case 'bonus':
        label = '特典情報';
        break;
      case 'theater':
        label = '影城導覽';
        break;
      case 'review':
        label = '觀影推薦';
        break;
      case 'boxoffice':
        label = '票房快訊';
        break;
      default:
        // Decode URL-encoded strings
        label = decodeURIComponent(segment);
    }

    // Don't add href for last segment (current page)
    breadcrumbs.push({
      label,
      href: i === segments.length - 1 ? undefined : path
    });
  }

  return breadcrumbs;
}