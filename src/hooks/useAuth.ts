import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from './use-toast';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null
  });
  const router = useRouter();
  const { toast } = useToast();

  // Verify session
  const verifySession = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/verify', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          setAuthState({
            user: data.user,
            isLoading: false,
            error: null
          });
          return true;
        }
      }

      setAuthState({
        user: null,
        isLoading: false,
        error: '未登入'
      });
      return false;
    } catch (error) {
      console.error('Session verification error:', error);
      setAuthState({
        user: null,
        isLoading: false,
        error: '網路錯誤'
      });
      return false;
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        setAuthState({
          user: null,
          isLoading: false,
          error: null
        });
        
        toast({
          title: '登出成功',
          description: '正在跳轉到登入頁面...'
        });
        
        router.push('/admin/login');
        router.refresh();
      } else {
        throw new Error('登出失敗');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: '登出失敗',
        description: '請稍後再試',
        variant: 'destructive'
      });
    }
  }, [router, toast]);

  // Update profile
  const updateProfile = useCallback(async (name: string) => {
    try {
      const response = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name }),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setAuthState(prev => ({
          ...prev,
          user: prev.user ? { ...prev.user, name: data.profile.name } : null
        }));
        
        toast({
          title: '更新成功',
          description: '個人資料已更新'
        });
        
        return true;
      } else {
        throw new Error(data.error || '更新失敗');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      toast({
        title: '更新失敗',
        description: error instanceof Error ? error.message : '請稍後再試',
        variant: 'destructive'
      });
      return false;
    }
  }, [toast]);

  // Initial session check
  useEffect(() => {
    verifySession();
  }, [verifySession]);

  // Check session periodically (every 5 minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      if (authState.user) {
        verifySession();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [authState.user, verifySession]);

  return {
    user: authState.user,
    isLoading: authState.isLoading,
    error: authState.error,
    logout,
    updateProfile,
    refreshSession: verifySession
  };
}