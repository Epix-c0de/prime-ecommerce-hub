import { createContext, useContext, ReactNode } from 'react';
import { useSiteUrl } from '@/hooks/useSiteUrl';

interface SiteUrlContextType {
  siteUrl: string;
  apiBaseUrl: string;
  adminUrl: string;
  loading: boolean;
  error: string | null;
  updateSiteUrl: (newUrl: string, userId?: string) => Promise<{ success: boolean; error?: string }>;
  testConnection: (url: string) => Promise<{ success: boolean; latency?: number; error?: string }>;
  refresh: () => Promise<void>;
}

const SiteUrlContext = createContext<SiteUrlContextType | undefined>(undefined);

export function SiteUrlProvider({ children }: { children: ReactNode }) {
  const siteUrlData = useSiteUrl();

  return (
    <SiteUrlContext.Provider value={siteUrlData}>
      {children}
    </SiteUrlContext.Provider>
  );
}

export function useSiteUrlContext() {
  const context = useContext(SiteUrlContext);
  if (context === undefined) {
    throw new Error('useSiteUrlContext must be used within a SiteUrlProvider');
  }
  return context;
}
