'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, AlertCircle, UserPlus, Mail, Shield, ShieldCheck, Loader2, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAdminRole } from '@/hooks/use-admin-role';
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

export default function UsersPage() {
  const router = useRouter();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'super_admin'>('admin');
  const [inviting, setInviting] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const { toast } = useToast();
  const { canManageUsers, isLoading: roleLoading, role } = useAdminRole();

  // 權限檢查 - 如果不能管理用戶，重定向到儀表板
  useEffect(() => {
    if (!roleLoading && !canManageUsers) {
      toast({
        title: '權限不足',
        description: '您沒有權限訪問用戶管理頁面',
        variant: 'destructive',
      });
      router.push('/admin');
      return;
    }

    if (canManageUsers) {
      fetchAdmins();
      getCurrentUser();
    }
  }, [roleLoading, canManageUsers, router, toast]);

  const getCurrentUser = async () => {
    try {
      const response = await adminApiClient.get<{ profile: AdminUser }>('/api/admin/profile');
      if (response.success && response.data && (response.data as any).profile) {
        setCurrentUser((response.data as any).profile);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const fetchAdmins = async () => {
    try {
      const response = await adminApiClient.get<{ admins: AdminUser[] }>('/api/admin/users');
      
      if (response.success && response.data && (response.data as any).admins) {
        setAdmins((response.data as any).admins || []);
      } else {
        throw new Error(response.error || '無法載入管理員列表');
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
      const errorMessage = error instanceof AdminApiError ? error.message : '無法載入管理員列表';
      toast({
        title: '載入失敗',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail) return;

    setInviting(true);
    try {
      const response = await adminApiClient.post('/api/admin/users/invite', {
        email: inviteEmail,
        role: inviteRole,
      });

      if (response.success) {
        toast({
          title: '邀請已發送',
          description: `已向 ${inviteEmail} 發送管理員邀請`,
        });

        setInviteEmail('');
        setInviteRole('admin');
        setIsInviteOpen(false);
        fetchAdmins();
      } else {
        throw new Error(response.error || '邀請失敗');
      }
    } catch (error: any) {
      const errorMessage = error instanceof AdminApiError ? error.message : '邀請失敗';
      toast({
        title: '邀請失敗',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setInviting(false);
    }
  };

  const handleToggleActive = async (adminId: string, currentStatus: boolean) => {
    try {
      const response = await adminApiClient.put(`/api/admin/users/${adminId}`, {
        is_active: !currentStatus,
      });

      if (response.success) {
        toast({
          title: '更新成功',
          description: `管理員已${!currentStatus ? '啟用' : '停用'}`,
        });

        fetchAdmins();
      } else {
        throw new Error(response.error || '更新失敗');
      }
    } catch (error: any) {
      const errorMessage = error instanceof AdminApiError ? error.message : '更新失敗';
      toast({
        title: '更新失敗',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleRoleChange = async (adminId: string, newRole: 'admin' | 'super_admin') => {
    try {
      const response = await adminApiClient.put(`/api/admin/users/${adminId}`, {
        role: newRole,
      });

      if (response.success) {
        toast({
          title: '角色更新成功',
          description: '管理員角色已更新',
        });

        fetchAdmins();
      } else {
        throw new Error(response.error || '角色更新失敗');
      }
    } catch (error: any) {
      const errorMessage = error instanceof AdminApiError ? error.message : '更新失敗';
      toast({
        title: '更新失敗',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  // 如果正在檢查權限，顯示載入中
  if (roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">檢查權限中...</p>
        </div>
      </div>
    );
  }

  // 如果沒有權限，顯示錯誤訊息
  if (!canManageUsers) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Alert className="max-w-md">
          <Lock className="h-4 w-4" />
          <AlertDescription className="font-medium">
            <div className="space-y-2">
              <p>權限不足</p>
              <p className="text-sm text-muted-foreground">
                只有超級管理員才能訪問用戶管理頁面。您的權限為：{role || '未知'}
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => router.push('/admin')}
                className="mt-2"
              >
                返回儀表板
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">管理員管理</h1>
          <p className="text-muted-foreground">管理系統管理員和權限</p>
        </div>
        <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              邀請管理員
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>邀請新管理員</DialogTitle>
              <DialogDescription>
                發送邀請郵件給新的管理員
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">電子郵件</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">角色</Label>
                <Select
                  value={inviteRole}
                  onValueChange={(value: 'admin' | 'super_admin') => setInviteRole(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">管理員</SelectItem>
                    <SelectItem value="super_admin">超級管理員</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsInviteOpen(false)}
                disabled={inviting}
              >
                取消
              </Button>
              <Button
                onClick={handleInvite}
                disabled={!inviteEmail || inviting}
              >
                {inviting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    發送中...
                  </>
                ) : (
                  '發送邀請'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            管理員列表
          </CardTitle>
          <CardDescription>
            所有系統管理員和超級管理員
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>電子郵件</TableHead>
                <TableHead>角色</TableHead>
                <TableHead>狀態</TableHead>
                <TableHead>最後登入</TableHead>
                <TableHead>加入時間</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {admin.email}
                      {currentUser && admin.id === currentUser.id && (
                        <Badge variant="secondary" className="ml-2">您</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={admin.role === 'super_admin' ? 'default' : 'secondary'}>
                      {admin.role === 'super_admin' ? (
                        <>
                          <ShieldCheck className="mr-1 h-3 w-3" />
                          超級管理員
                        </>
                      ) : (
                        <>
                          <Shield className="mr-1 h-3 w-3" />
                          管理員
                        </>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={admin.is_active ? 'success' : 'destructive'}>
                      {admin.is_active ? '啟用' : '停用'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {admin.last_sign_in_at
                      ? new Date(admin.last_sign_in_at).toLocaleString('zh-TW')
                      : '尚未登入'}
                  </TableCell>
                  <TableCell>
                    {new Date(admin.created_at).toLocaleDateString('zh-TW')}
                  </TableCell>
                  <TableCell className="text-right">
                    {currentUser && admin.id !== currentUser.id && (
                      <div className="flex items-center justify-end gap-2">
                        <Select
                          value={admin.role}
                          onValueChange={(value: 'admin' | 'super_admin') =>
                            handleRoleChange(admin.id, value)
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">管理員</SelectItem>
                            <SelectItem value="super_admin">超級管理員</SelectItem>
                          </SelectContent>
                        </Select>
                        <Switch
                          checked={admin.is_active}
                          onCheckedChange={() =>
                            handleToggleActive(admin.id, admin.is_active)
                          }
                        />
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}