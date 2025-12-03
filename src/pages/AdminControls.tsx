import { useEffect, useState } from 'react';
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
import { ThemeStudio } from '@/components/admin/ThemeStudio';
import { ProductManagement } from '@/components/admin/ProductManagement';
import { CategoryManagement } from '@/components/admin/CategoryManagement';
import { OrderManagement } from '@/components/admin/OrderManagement';
import { PageManagement } from '@/components/admin/PageManagement';
import { FooterDesigner } from '@/components/admin/FooterDesigner';
import { CMSPageList } from '@/components/admin/cms/CMSPageList';
import { HomepageEditor } from '@/components/admin/HomepageEditor';
import { SuperAdminDashboard } from '@/components/admin/SuperAdminDashboard';
import { MarketingAdmin } from '@/components/admin/MarketingAdmin';
import { CustomersAdmin } from '@/components/admin/CustomersAdmin';
import { ShippingAdmin } from '@/components/admin/ShippingAdmin';
import { ReturnsAdmin } from '@/components/admin/ReturnsAdmin';
import { SupportTickets } from '@/components/admin/SupportTickets';
import { AdminSection } from '@/components/admin/AdminSidebar';
import { SyncStatus } from '@/components/SyncStatus';
import { useConfig } from '@/contexts/ConfigContext';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';

const AdminControls = () => {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const { isConnected, lastUpdate } = useConfig();
  const { user, loading: authLoading } = useAuth();
  const { loading: roleLoading, isAdmin } = useUserRole();
  const navigate = useNavigate();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Show loading state while checking auth and roles
  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect if not logged in
  if (!user) {
    return null;
  }

  // Show access denied for non-admin users
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Access denied. You don't have permission to access the admin dashboard. 
            Only users with admin role can access this area.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'super-admin':
        return <SuperAdminDashboard />;
      case 'homepage':
        return <HomepageEditor />;
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
      case 'theme-studio':
        return <ThemeStudio />;
      case 'pages':
        return <PageManagement />;
      case 'cms-pages':
        return <CMSPageList />;
      case 'footer':
        return <FooterDesigner />;
      case 'marketing':
        return <MarketingAdmin />;
      case 'customers':
        return <CustomersAdmin />;
      case 'shipping':
        return <ShippingAdmin />;
      case 'returns':
        return <ReturnsAdmin />;
      case 'support':
        return <SupportTickets />;
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
            <div className="flex items-center gap-3">
              <SyncStatus isConnected={isConnected} lastUpdate={lastUpdate} />
            </div>
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
