import { useState } from 'react';
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
import { SyncStatus } from '@/components/SyncStatus';
import { useConfig } from '@/contexts/ConfigContext';

type AdminSection = 'dashboard' | 'theme' | 'features' | 'seasonal' | 'store' | 'ai' | 'activity' | 'analytics';

const AdminControls = () => {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const { isConnected, lastUpdate } = useConfig();

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
