import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Shield, Crown, Users, Loader2 } from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';

interface UserWithRole {
  id: string;
  name: string;
  role: string;
  created_at: string;
}

const roleColors = {
  super_admin: 'bg-purple-500',
  admin: 'bg-red-500',
  manager: 'bg-orange-500',
  content_creator: 'bg-blue-500',
  inventory_manager: 'bg-green-500',
  marketing_manager: 'bg-pink-500',
  support_agent: 'bg-yellow-500',
  user: 'bg-gray-500'
};

const roleIcons = {
  super_admin: Crown,
  admin: Shield,
  manager: Users,
};

export function UserRoleManagement() {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const { isSuperAdmin, isAdmin } = useUserRole();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name');

      if (profileError) throw profileError;

      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role, created_at');

      if (rolesError) throw rolesError;

      const usersWithRoles: UserWithRole[] = profiles.map(profile => {
        const userRole = roles.find(r => r.user_id === profile.id);
        const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(' ') || 'Unknown User';
        
        return {
          id: profile.id,
          name: fullName,
          role: userRole?.role || 'user',
          created_at: userRole?.created_at || ''
        };
      });

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (deleteError) throw deleteError;

      const { error: insertError } = await supabase
        .from('user_roles')
        .insert([{ 
          user_id: userId, 
          role: newRole as 'super_admin' | 'admin' | 'manager' | 'content_creator' | 'inventory_manager' | 'marketing_manager' | 'support_agent' | 'user'
        }]);

      if (insertError) throw insertError;

      toast.success('Role updated successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update role');
    }
  };

  if (!isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Access Restricted
          </CardTitle>
          <CardDescription>
            Only administrators can manage user roles
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          User Role Management
        </CardTitle>
        <CardDescription>
          Manage user access levels and permissions across the platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Current Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => {
              const RoleIcon = roleIcons[user.role as keyof typeof roleIcons];
              
              return (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.name}
                    {user.role === 'super_admin' && (
                      <Badge variant="outline" className="ml-2">
                        <Crown className="h-3 w-3 mr-1" />
                        Protected
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={roleColors[user.role as keyof typeof roleColors]}>
                      {RoleIcon && <RoleIcon className="h-3 w-3 mr-1" />}
                      {user.role.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select
                      disabled={user.role === 'super_admin' && !isSuperAdmin}
                      value={user.role}
                      onValueChange={(value) => updateUserRole(user.id, value)}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {isSuperAdmin && <SelectItem value="super_admin">Super Admin</SelectItem>}
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="content_creator">Content Creator</SelectItem>
                        <SelectItem value="inventory_manager">Inventory Manager</SelectItem>
                        <SelectItem value="marketing_manager">Marketing Manager</SelectItem>
                        <SelectItem value="support_agent">Support Agent</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
