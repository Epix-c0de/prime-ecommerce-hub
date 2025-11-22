import { Palette, Settings, Sparkles, Store, LayoutDashboard, Bot, Activity, BarChart3, Package, FolderTree, ShoppingCart, Shield, Boxes, Layout, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

type AdminSection = 'dashboard' | 'theme' | 'features' | 'seasonal' | 'store' | 'ai' | 'activity' | 'analytics' | 'products' | 'categories' | 'orders' | 'roles' | 'theme-studio' | 'pages';

interface AdminSidebarProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
}

const menuItems = [
  { id: 'dashboard' as AdminSection, title: 'Dashboard', icon: LayoutDashboard },
  { id: 'orders' as AdminSection, title: 'Orders', icon: ShoppingCart },
  { id: 'products' as AdminSection, title: 'Products', icon: Package },
  { id: 'categories' as AdminSection, title: 'Categories', icon: FolderTree },
  { id: 'pages' as AdminSection, title: 'Content Pages', icon: FileText },
  { id: 'roles' as AdminSection, title: 'User Roles', icon: Shield },
  { id: 'theme-studio' as AdminSection, title: 'Theme Studio', icon: Palette },
  { id: 'theme' as AdminSection, title: 'Quick Themes', icon: Palette },
  { id: 'features' as AdminSection, title: 'Feature Toggles', icon: Settings },
  { id: 'seasonal' as AdminSection, title: 'Seasonal Modes', icon: Sparkles },
  { id: 'store' as AdminSection, title: 'Store Settings', icon: Store },
  { id: 'ai' as AdminSection, title: 'AI Management', icon: Bot },
  { id: 'analytics' as AdminSection, title: 'Analytics', icon: BarChart3 },
  { id: 'activity' as AdminSection, title: 'Activity Feed', icon: Activity },
];

const advancedFeatures = [
  { title: 'Multi-Store Manager', icon: Boxes, path: '/admin/multi-store', description: 'Manage multiple storefronts' },
  { title: 'CMS Page Builder', icon: Layout, path: '/admin/multi-store', description: 'Build custom pages' },
];

export function AdminSidebar({ activeSection, onSectionChange }: AdminSidebarProps) {
  const { open } = useSidebar();

  return (
    <Sidebar className={open ? 'w-60' : 'w-14'} collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Controls</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onSectionChange(item.id)}
                    className={activeSection === item.id ? "bg-muted text-primary" : ""}
                  >
                    <item.icon className="h-4 w-4" />
                    {open && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Advanced</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {advancedFeatures.map((feature) => (
                <SidebarMenuItem key={feature.title}>
                  <SidebarMenuButton asChild>
                    <Link to={feature.path} className="flex items-center gap-2">
                      <feature.icon className="h-4 w-4" />
                      {open && <span>{feature.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
