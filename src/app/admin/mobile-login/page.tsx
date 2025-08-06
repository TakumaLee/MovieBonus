'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

export default function MobileLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    try {
      // Step 1: Get CSRF token without using the API client
      setMessage('獲取安全驗證中...');
      const csrfResponse = await fetch('https://moviebonus-nodejs-backend-777964931661.asia-east1.run.app/api/admin/csrf-token', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!csrfResponse.ok) {
        throw new Error(`CSRF request failed: ${csrfResponse.status}`);
      }

      const csrfData = await csrfResponse.json();
      const csrfToken = csrfData.csrfToken;

      if (!csrfToken) {
        throw new Error('No CSRF token received');
      }

      setMessage('登入中...');

      // Step 2: Attempt login
      const loginResponse = await fetch('https://moviebonus-nodejs-backend-777964931661.asia-east1.run.app/api/admin/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          csrfToken,
        }),
      });

      const loginData = await loginResponse.json();

      if (loginResponse.ok && loginData.success) {
        setMessage('登入成功！正在跳轉...');
        
        // Save auth state
        if (loginData.token) {
          localStorage.setItem('adminToken', loginData.token);
        }
        
        // Redirect after a short delay
        setTimeout(() => {
          router.push('/admin');
          router.refresh();
        }, 1000);
      } else {
        setMessage(`登入失敗: ${loginData.error || loginData.message || '未知錯誤'}`);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setMessage(`錯誤: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">手機版管理員登入</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {message && (
              <Alert>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">電子郵件</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
                autoComplete="email"
                className="h-12" // Larger touch target
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">密碼</Label>
              <Input
                id="password"
                type="password"
                placeholder="請輸入密碼"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
                autoComplete="current-password"
                className="h-12" // Larger touch target
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12" // Larger touch target
              disabled={isLoading || !email || !password}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  處理中...
                </>
              ) : (
                '登入'
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground mt-4">
              <p>如果持續無法登入，請嘗試：</p>
              <ul className="mt-2 space-y-1">
                <li>• 清除瀏覽器 cookie</li>
                <li>• 使用無痕/隱私模式</li>
                <li>• 確認已允許第三方 cookie</li>
              </ul>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}