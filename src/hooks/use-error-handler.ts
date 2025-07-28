import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { AdminApiError } from '@/lib/api-client-admin';

interface ErrorHandlerOptions {
  redirectOnAuth?: boolean;
  showToast?: boolean;
  customHandlers?: {
    [statusCode: number]: (error: AdminApiError) => void;
  };
}

export function useErrorHandler(options: ErrorHandlerOptions = {}) {
  const { toast } = useToast();
  const router = useRouter();
  const { 
    redirectOnAuth = true, 
    showToast = true,
    customHandlers = {}
  } = options;

  const handleError = useCallback((error: Error | AdminApiError) => {
    console.error('Error occurred:', error);

    // Handle AdminApiError specifically
    if (error instanceof AdminApiError) {
      // Check for custom handlers first
      if (error.status && customHandlers[error.status]) {
        customHandlers[error.status](error);
        return;
      }

      // Handle specific status codes
      switch (error.status) {
        case 401:
          if (showToast) {
            toast({
              title: '認證失敗',
              description: '請重新登入',
              variant: 'destructive',
            });
          }
          if (redirectOnAuth) {
            router.push('/admin/login');
          }
          break;

        case 403:
          if (showToast) {
            toast({
              title: '權限不足',
              description: error.message || '您沒有執行此操作的權限',
              variant: 'destructive',
            });
          }
          break;

        case 404:
          if (showToast) {
            toast({
              title: '找不到資源',
              description: error.message || '請求的資源不存在',
              variant: 'destructive',
            });
          }
          break;

        case 429:
          const retryAfter = error.response?.retryAfter;
          if (showToast) {
            toast({
              title: '請求過於頻繁',
              description: retryAfter 
                ? `請等待 ${retryAfter} 秒後再試`
                : '請稍後再試',
              variant: 'destructive',
            });
          }
          break;

        case 500:
        case 502:
        case 503:
        case 504:
          if (showToast) {
            toast({
              title: '伺服器錯誤',
              description: '系統暫時無法處理您的請求，請稍後再試',
              variant: 'destructive',
            });
          }
          break;

        default:
          if (showToast) {
            toast({
              title: '發生錯誤',
              description: error.message || '操作失敗，請稍後再試',
              variant: 'destructive',
            });
          }
      }
    } else {
      // Handle generic errors
      if (showToast) {
        toast({
          title: '系統錯誤',
          description: error.message || '發生未預期的錯誤',
          variant: 'destructive',
        });
      }
    }
  }, [toast, router, redirectOnAuth, showToast, customHandlers]);

  return { handleError };
}

// Export error boundary component
export function ErrorBoundary({ 
  children, 
  fallback 
}: { 
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
}) {
  return children; // Simplified for now, can be expanded with React Error Boundary
}