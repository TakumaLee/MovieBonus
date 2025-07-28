import { AlertCircle, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';

interface ErrorFallbackProps {
  error: Error;
  reset?: () => void;
  showBackButton?: boolean;
  showHomeButton?: boolean;
}

export function ErrorFallback({ 
  error, 
  reset,
  showBackButton = true,
  showHomeButton = true 
}: ErrorFallbackProps) {
  const router = useRouter();
  
  // Determine error type and message
  const isNetworkError = error.message.toLowerCase().includes('network') || 
                        error.message.toLowerCase().includes('fetch');
  const is404Error = error.message.includes('404');
  const is500Error = error.message.includes('500');
  
  const getErrorTitle = () => {
    if (isNetworkError) return '網路連線錯誤';
    if (is404Error) return '找不到頁面';
    if (is500Error) return '伺服器錯誤';
    return '發生錯誤';
  };
  
  const getErrorDescription = () => {
    if (isNetworkError) {
      return '無法連接到伺服器，請檢查您的網路連線或稍後再試。';
    }
    if (is404Error) {
      return '您訪問的頁面不存在或已被移除。';
    }
    if (is500Error) {
      return '伺服器暫時無法處理您的請求，請稍後再試。';
    }
    return '系統發生未預期的錯誤，請重新整理頁面或稍後再試。';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-2xl">{getErrorTitle()}</CardTitle>
          <CardDescription className="mt-2">
            {getErrorDescription()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Error details in development */}
          {process.env.NODE_ENV === 'development' && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="mt-2">
                <p className="font-mono text-xs break-all">
                  {error.message}
                </p>
              </AlertDescription>
            </Alert>
          )}
          
          {/* Action buttons */}
          <div className="flex flex-col gap-2">
            {reset && (
              <Button 
                onClick={reset} 
                className="w-full"
                variant="default"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                重新整理
              </Button>
            )}
            
            <div className="flex gap-2">
              {showBackButton && (
                <Button 
                  onClick={() => router.back()} 
                  variant="outline"
                  className="flex-1"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  返回上一頁
                </Button>
              )}
              
              {showHomeButton && (
                <Button 
                  onClick={() => router.push('/admin')} 
                  variant="outline"
                  className="flex-1"
                >
                  <Home className="mr-2 h-4 w-4" />
                  回到首頁
                </Button>
              )}
            </div>
          </div>
          
          {/* Support information */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>如果問題持續發生，請聯繫技術支援</p>
            <p className="mt-1">
              錯誤代碼：{new Date().getTime()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}