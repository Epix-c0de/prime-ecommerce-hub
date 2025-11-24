import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type UserRole = 'super_admin' | 'admin' | 'manager' | 'content_creator' | 'inventory_manager' | 'marketing_manager' | 'support_agent' | 'user' | null;

export function useUserRole() {
  const { user } = useAuth();
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRole() {
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (error) throw error;

        if (!data || data.length === 0) {
          setRole('user');
          return;
        }

        const roleHierarchy: UserRole[] = [
          'super_admin',
          'admin',
          'manager',
          'content_creator',
          'inventory_manager',
          'marketing_manager',
          'support_agent',
          'user'
        ];

        const roles = data
          .map((record) => record.role as UserRole)
          .filter((value): value is UserRole => value !== null);

        const highestRole = roles.sort(
          (a, b) => roleHierarchy.indexOf(a) - roleHierarchy.indexOf(b)
        )[0] ?? 'user';

        setRole(highestRole);
      } catch (error) {
        console.error('Error fetching user role:', error);
        setRole(null);
      } finally {
        setLoading(false);
      }
    }

    fetchRole();
  }, [user]);

  const isSuperAdmin = role === 'super_admin';
  const isAdmin = role === 'admin' || isSuperAdmin;
  const isManager = role === 'manager' || isAdmin;
  const canManageContent = role === 'content_creator' || isManager;
  const canManageInventory = role === 'inventory_manager' || isManager;
  const canManageMarketing = role === 'marketing_manager' || isManager;
  
  return { 
    role, 
    loading, 
    isSuperAdmin,
    isAdmin, 
    isManager, 
    canManageContent,
    canManageInventory,
    canManageMarketing
  };
}
