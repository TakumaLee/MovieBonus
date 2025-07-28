'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { adminApi, AdminApiError } from '@/lib/api-client-admin';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await adminApi.auth.forgotPassword(email);

      if (response.success) {
        setSuccess(true);
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      
      if (error instanceof AdminApiError) {
        setError(error.message || '發送重設郵件失敗');
      } else {
        setError('網路連線異常，請稍後再試');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-2">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">郵件已發送</CardTitle>
            <CardDescription className="text-center">
              如果此電子郵件地址已註冊，您將收到密碼重設郵件
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                請檢查您的電子郵件信箱，並點擊郵件中的連結來重設密碼。
                郵件可能需要幾分鐘才能送達。
              </AlertDescription>
            </Alert>
            
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push('/admin/login')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回登入頁面
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">忘記密碼</CardTitle>
          <CardDescription className="text-center">
            輸入您的電子郵件地址，我們將發送密碼重設連結給您
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">電子郵件</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                  autoFocus
                  className="pl-10"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !email}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  發送中...
                </>
              ) : (
                '發送重設郵件'
              )}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={() => router.push('/admin/login')}
                className="text-sm"
              >
                <ArrowLeft className="mr-1 h-3 w-3" />
                返回登入
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}