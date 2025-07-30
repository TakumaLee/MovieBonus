'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  LayoutDashboard, 
  MessageSquare, 
  LogOut, 
  LogIn,
  Menu,
  ChevronRight,
  Settings,
  Users,
  Film
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { adminApi } from '@/lib/api-client-admin';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // 導航項目
  const navItems: NavItem[] = [
    {
      title: '儀表板',
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      title: '電影管理',
      href: '/admin/movies',
      icon: Film,
    },
    {
      title: '回報管理',
      href: '/admin/feedbacks',
      icon: MessageSquare,
    },
    {
      title: '使用者',
      href: '/admin/users',
      icon: Users,
    },
    {
      title: '設定',
      href: '/admin/settings',
      icon: Settings,
    },
  ];

  // 檢查是否為手機版
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // 檢查登入狀態
  useEffect(() => {
    const checkAuth = async () => {
      // 如果是登入頁面，不需要檢查
      if (pathname === '/admin/login' || pathname === '/admin/forgot-password' || pathname === '/admin/reset-password') {
        setCheckingAuth(false);
        return;
      }

      try {
        const response = await adminApi.auth.verify();
        if (response.success) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, [pathname]);

  // 如果是登入相關頁面，不顯示 layout
  if (pathname === '/admin/login' || pathname === '/admin/forgot-password' || pathname === '/admin/reset-password') {
    return <>{children}</>;
  }

  // 如果還在檢查登入狀態，顯示載入中
  if (checkingAuth) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">載入中...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      const response = await adminApi.auth.logout();

      if (response.success) {
        toast({
          title: '已登出',
          description: '您已成功登出管理後台',
        });
        
        // Clear any stored authentication data
        sessionStorage.removeItem('redirectAfterLogin');
        
        // Update authentication state
        setIsAuthenticated(false);
        
        // Redirect to login page
        router.push('/admin/login');
        router.refresh();
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: '登出失敗',
        description: '請稍後再試',
        variant: 'destructive',
      });
      
      // Update authentication state
      setIsAuthenticated(false);
      
      // Even if logout fails, redirect to login
      router.push('/admin/login');
    }
  };

  const SidebarContent = () => (
    <>
      <div className="flex h-16 items-center px-6 border-b">
        <h2 className="text-lg font-semibold">管理後台</h2>
      </div>
      <div className="flex-1 px-3 py-6">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
                           (item.href !== '/admin' && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span className="flex-1">{item.title}</span>
                {item.badge && (
                  <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="h-4 w-4" />}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="border-t p-4 space-y-2">
        {isAuthenticated ? (
          <>
            <Link href="/admin/settings/profile">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="mr-2 h-4 w-4" />
                個人設定
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              登出
            </Button>
          </>
        ) : (
          <Link href="/admin/login">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => setIsOpen(false)}
            >
              <LogIn className="mr-2 h-4 w-4" />
              登入
            </Button>
          </Link>
        )}
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside className="hidden md:flex w-64 flex-col border-r bg-card">
          <SidebarContent />
        </aside>
      )}

      {/* Mobile Sidebar */}
      {isMobile && (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side="left" className="p-0 w-64">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex h-16 items-center gap-4 border-b bg-card px-6">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div className="flex-1">
            <h1 className="text-lg font-semibold">
              {navItems.find(item => pathname.startsWith(item.href))?.title || '管理後台'}
            </h1>
          </div>
          {/* Desktop auth button */}
          {!isMobile && (
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  登出
                </Button>
              ) : (
                <Link href="/admin/login">
                  <Button
                    variant="ghost"
                    size="sm"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    登入
                  </Button>
                </Link>
              )}
            </div>
          )}
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}