'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Lock, CheckCircle, AlertCircle, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { adminApi, AdminApiError } from '@/lib/api-client-admin';

function ResetPasswordContent() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { toast } = useToast();

  useEffect(() => {
    if (token) {
      verifyToken();
    } else {
      setError('無效的重設連結');
      setIsVerifying(false);
    }
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await adminApi.auth.verifyResetToken(token!);
      if (response.success) {
        setTokenValid(true);
      } else {
        setError(response.error || '重設連結無效或已過期');
      }
    } catch (error) {
      console.error('Token verification error:', error);
      if (error instanceof AdminApiError) {
        setError(error.message || '重設連結無效或已過期');
      } else {
        setError('無法驗證重設連結');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: '密碼不一致',
        description: '新密碼與確認密碼不相符',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: '密碼太短',
        description: '密碼長度至少需要 6 個字元',
        variant: 'destructive',
      });
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const response = await adminApi.auth.resetPassword(token!, newPassword);

      if (response.success) {
        setSuccess(true);
        toast({
          title: '密碼重設成功',
          description: '您的密碼已成功更新，即將跳轉到登入頁面',
        });
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push('/admin/login');
        }, 2000);
      }
    } catch (error) {
      console.error('Reset password error:', error);
      
      if (error instanceof AdminApiError) {
        setError(error.message || '密碼重設失敗');
      } else {
        setError('網路連線異常，請稍後再試');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return null;
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;

    if (strength <= 2) return { level: '弱', color: 'text-red-500' };
    if (strength <= 3) return { level: '中', color: 'text-yellow-500' };
    return { level: '強', color: 'text-green-500' };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">驗證重設連結中...</p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-2">
              <div className="rounded-full bg-red-100 p-3">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">連結無效</CardTitle>
            <CardDescription className="text-center">
              {error || '此密碼重設連結無效或已過期'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              onClick={() => router.push('/admin/forgot-password')}
            >
              重新申請密碼重設
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <CardTitle className="text-2xl text-center">密碼重設成功</CardTitle>
            <CardDescription className="text-center">
              您的密碼已成功更新，即將跳轉到登入頁面...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <div className="rounded-full bg-primary/10 p-3">
              <Lock className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">重設密碼</CardTitle>
          <CardDescription className="text-center">
            請輸入您的新密碼
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="new-password">新密碼</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  autoFocus
                  className="pl-10"
                  minLength={6}
                />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  密碼長度至少需要 6 個字元
                </p>
                {passwordStrength && (
                  <p className={`text-sm ${passwordStrength.color}`}>
                    密碼強度：{passwordStrength.level}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">確認新密碼</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  className="pl-10"
                />
              </div>
              {confirmPassword && (
                <div className="flex items-center gap-1 text-sm">
                  {newPassword === confirmPassword ? (
                    <>
                      <Check className="h-3 w-3 text-green-600" />
                      <span className="text-green-600">密碼一致</span>
                    </>
                  ) : (
                    <>
                      <X className="h-3 w-3 text-destructive" />
                      <span className="text-destructive">密碼不一致</span>
                    </>
                  )}
                </div>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  重設中...
                </>
              ) : (
                '重設密碼'
              )}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={() => router.push('/admin/login')}
                className="text-sm"
              >
                返回登入頁面
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">載入中...</p>
          </div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}