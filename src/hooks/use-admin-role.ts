'use client';

import { useState, useEffect, useCallback } from 'react';
import { adminApiClient, AdminApiError } from '@/lib/api-client-admin';

interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'super_admin';
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_sign_in_at?: string;
  email_confirmed_at?: string;
  invited_by?: string;
}

interface UseAdminRoleReturn {
  adminUser: AdminUser | null;
  role: 'admin' | 'super_admin' | null;
  isLoading: boolean;
  error: string | null;
  isSuperAdmin: boolean;
  canManageUsers: boolean;
  refetchRole: () => Promise<void>;
}

/**
 * Hook for managing admin role and permissions
 * Fetches the current admin's role and provides permission checking methods
 */
export function useAdminRole(): UseAdminRoleReturn {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAdminRole = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await adminApiClient.get<{ profile: AdminUser }>('/api/admin/profile');
      
      if (response.success && response.data && (response.data as any).profile) {
        setAdminUser((response.data as any).profile);
      } else {
        throw new Error(response.error || 'Failed to fetch admin profile');
      }
    } catch (err) {
      const errorMessage = err instanceof AdminApiError 
        ? err.message 
        : err instanceof Error 
          ? err.message 
          : 'Failed to fetch admin role';
      
      setError(errorMessage);
      setAdminUser(null);
      
      // If it's a 401 error, the API client will handle redirect
      if (err instanceof AdminApiError && err.status === 401) {
        console.warn('Admin not authenticated - will be redirected to login');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminRole();
  }, [fetchAdminRole]);

  const role = adminUser?.role || null;
  const isSuperAdmin = role === 'super_admin';
  const canManageUsers = isSuperAdmin; // Only super admins can manage users

  return {
    adminUser,
    role,
    isLoading,
    error,
    isSuperAdmin,
    canManageUsers,
    refetchRole: fetchAdminRole,
  };
}