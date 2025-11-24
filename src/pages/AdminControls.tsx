import { FormEvent, useEffect, useState } from 'react';
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
import { SyncStatus } from '@/components/SyncStatus';
import { useConfig } from '@/contexts/ConfigContext';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type AdminSection = 'dashboard' | 'theme' | 'features' | 'seasonal' | 'store' | 'ai' | 'activity' | 'analytics' | 'products' | 'categories' | 'orders' | 'roles' | 'theme-studio' | 'pages' | 'footer' | 'cms-pages';

const AdminControls = () => {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [hasAdminOverride, setHasAdminOverride] = useState(false);
  const [overrideReady, setOverrideReady] = useState(false);
  const [overrideError, setOverrideError] = useState<string | null>(null);
  const [overrideSubmitting, setOverrideSubmitting] = useState(false);
  const { isConnected, lastUpdate } = useConfig();
  const { user, loading: authLoading } = useAuth();
  const { loading: roleLoading, isAdmin } = useUserRole();
  const navigate = useNavigate();

  const ADMIN_USERNAME = 'admin@prime';
  const ADMIN_PASSWORD = 'admin@gmail.com';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem('prime-admin-override') === 'true';
    setHasAdminOverride(stored);
    setOverrideReady(true);
  }, []);

  useEffect(() => {
    if (!overrideReady) return;
    if (!authLoading && !user && !hasAdminOverride) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate, hasAdminOverride, overrideReady]);

  const handleOverrideSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setOverrideSubmitting(true);
    setOverrideError(null);

    const formData = new FormData(event.currentTarget);
    const username = (formData.get('adminUsername') as string)?.trim();
    const password = (formData.get('adminPassword') as string)?.trim();

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      window.localStorage.setItem('prime-admin-override', 'true');
      setHasAdminOverride(true);
      toast.success('Admin access granted');
    } else {
      setOverrideError('Invalid admin credentials');
      toast.error('Invalid admin credentials');
    }

    setOverrideSubmitting(false);
  };

  const handleOverrideReset = () => {
    window.localStorage.removeItem('prime-admin-override');
    setHasAdminOverride(false);
    toast.success('Admin access reset');
  };

  const allowAdmin = hasAdminOverride || isAdmin;

  if (!overrideReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (authLoading || roleLoading) {
    if (!hasAdminOverride) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }
  }

  if (!user && !hasAdminOverride) {
    return null;
  }

  if (!allowAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-md bg-card border rounded-2xl p-6 space-y-4 shadow-lg">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-semibold">Admin Access Required</h2>
            <p className="text-sm text-muted-foreground">
              Enter the admin dashboard credentials to continue.
            </p>
          </div>
          <form onSubmit={handleOverrideSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="adminUsername" className="text-sm font-medium text-foreground">
                Admin Username
              </label>
              <Input
                id="adminUsername"
                name="adminUsername"
                autoComplete="username"
                placeholder="admin@prime"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="adminPassword" className="text-sm font-medium text-foreground">
                Admin Password
              </label>
              <Input
                id="adminPassword"
                name="adminPassword"
                type="password"
                autoComplete="current-password"
                placeholder="Enter admin password"
                required
              />
            </div>
            {overrideError && (
              <div className="text-sm text-destructive">{overrideError}</div>
            )}
            <Button type="submit" className="w-full" disabled={overrideSubmitting}>
              {overrideSubmitting ? 'Verifying…' : 'Unlock Admin Dashboard'}
            </Button>
          </form>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Only users with the username <strong>admin@prime</strong> and password{" "}
              <strong>admin@gmail.com</strong> may enter.
            </AlertDescription>
          </Alert>
        </div>
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
      case 'theme-studio':
        return <ThemeStudio />;
      case 'pages':
        return <PageManagement />;
      case 'cms-pages':
        return <CMSPageList />;
      case 'footer':
        return <FooterDesigner />;
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
              {hasAdminOverride && (
                <Button variant="outline" size="sm" onClick={handleOverrideReset}>
                  Reset Admin Access
                </Button>
              )}
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
