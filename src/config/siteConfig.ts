// Dynamic site configuration
// Priority: Environment variable > Supabase settings > Default

export const DEFAULT_SITE_URL = 'https://preview--prime-ecommerce-hub.lovable.app';

export const getSiteUrl = (): string => {
  // First check environment variable
  if (import.meta.env.VITE_SITE_URL) {
    return import.meta.env.VITE_SITE_URL;
  }
  
  // Default fallback
  return DEFAULT_SITE_URL;
};

export const getApiBaseUrl = (siteUrl?: string): string => {
  const baseUrl = siteUrl || getSiteUrl();
  return `${baseUrl}/api`;
};

export const getAdminUrl = (siteUrl?: string): string => {
  const baseUrl = siteUrl || getSiteUrl();
  return `${baseUrl}/admin`;
};

// Check if current URL is the admin domain
export const isAdminDomain = (): boolean => {
  const adminDomains = [
    'prime-hub-admin',
    'prime_hub_adminz',
    'admin.',
  ];
  
  const currentHost = window.location.hostname;
  return adminDomains.some(domain => currentHost.includes(domain));
};

// Check if trying to access admin on main site
export const shouldRedirectToAdmin = (pathname: string): boolean => {
  if (pathname.startsWith('/admin') && !isAdminDomain()) {
    // On main site trying to access admin - redirect to admin domain
    // For now, we allow it since same domain
    return false;
  }
  return false;
};
