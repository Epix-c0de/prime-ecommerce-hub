import { Palette, Settings, Sparkles, Store } from 'lucide-react';
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

type AdminSection = 'theme' | 'features' | 'seasonal' | 'store';

interface AdminSidebarProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
}

const menuItems = [
  { id: 'theme' as AdminSection, title: 'Theme Settings', icon: Palette },
  { id: 'features' as AdminSection, title: 'Feature Toggles', icon: Settings },
  { id: 'seasonal' as AdminSection, title: 'Seasonal Modes', icon: Sparkles },
  { id: 'store' as AdminSection, title: 'Store Settings', icon: Store },
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
      </SidebarContent>
    </Sidebar>
  );
}
