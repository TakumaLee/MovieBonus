export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'super_admin';
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_sign_in_at?: string;
  email_confirmed_at?: string;
  invited_by?: string;
  last_password_change?: string;
}

export interface AdminSession {
  user: AdminUser;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
}

export interface InviteAdminRequest {
  email: string;
  role: 'admin' | 'super_admin';
}

export interface UpdateAdminRequest {
  is_active?: boolean;
  role?: 'admin' | 'super_admin';
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}