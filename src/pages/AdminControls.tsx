import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { ThemeControls } from '@/components/admin/ThemeControls';
import { FeatureToggles } from '@/components/admin/FeatureToggles';
import { SeasonalModeControl } from '@/components/admin/SeasonalModeControl';
import { StoreSettings } from '@/components/admin/StoreSettings';
import { DashboardOverview } from '@/components/admin/DashboardOverview';
import { AISettings } from '@/components/admin/AISettings';
import { ActivityFeed } from '@/components/admin/ActivityFeed';
import { Analytics } from '@/components/admin/Analytics';
import { UserRoleManagement } from '@/components/admin/UserRoleManagement';
import { ProductManagement } from '@/components/admin/ProductManagement';
import { CategoryManagement } from '@/components/admin/CategoryManagement';
import { OrderManagement } from '@/components/admin/OrderManagement';
import { SyncStatus } from '@/components/SyncStatus';
import { useConfig } from '@/contexts/ConfigContext';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';

type AdminSection = 'dashboard' | 'theme' | 'features' | 'seasonal' | 'store' | 'ai' | 'activity' | 'analytics' | 'products' | 'categories' | 'orders' | 'roles';

const AdminControls = () => {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const { isConnected, lastUpdate } = useConfig();
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading, isAdmin, isSuperAdmin } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {user?.email === 'epixshots001@gmail.com' 
              ? 'Loading super admin privileges...' 
              : 'You don\'t have permission to access the admin dashboard. Only the super administrator can access this area.'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'theme':
        return <ThemeControls />;
      case 'features':
        return <FeatureToggles />;
      case 'seasonal':
        return <SeasonalModeControl />;
      case 'store':
        return <StoreSettings />;
      case 'ai':
        return <AISettings />;
      case 'analytics':
        return <Analytics />;
      case 'activity':
        return <ActivityFeed />;
      case 'products':
        return <ProductManagement />;
      case 'categories':
        return <CategoryManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'roles':
        return <UserRoleManagement />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />

        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b bg-card flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-2xl font-bold">Admin Controls</h1>
                <p className="text-sm text-muted-foreground">
                  Manage features, themes, and seasonal modes
                </p>
              </div>
            </div>
            <SyncStatus isConnected={isConnected} lastUpdate={lastUpdate} />
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">
            {renderSection()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminControls;
