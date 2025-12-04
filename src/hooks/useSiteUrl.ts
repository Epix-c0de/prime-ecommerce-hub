import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SiteSettings {
  id: string;
  site_url: string;
  admin_url: string | null;
  api_base_url: string | null;
  last_updated: string;
  updated_by: string | null;
}

const DEFAULT_SITE_URL = import.meta.env.VITE_SITE_URL || 'https://preview--prime-ecommerce-hub.lovable.app';

export function useSiteUrl() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (data) {
        setSettings(data as SiteSettings);
      } else {
        // Use default if no settings exist
        setSettings({
          id: '',
          site_url: DEFAULT_SITE_URL,
          admin_url: `${DEFAULT_SITE_URL}/admin`,
          api_base_url: `${DEFAULT_SITE_URL}/api`,
          last_updated: new Date().toISOString(),
          updated_by: null,
        });
      }
    } catch (err) {
      console.error('Error fetching site settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch site settings');
      // Fallback to default
      setSettings({
        id: '',
        site_url: DEFAULT_SITE_URL,
        admin_url: `${DEFAULT_SITE_URL}/admin`,
        api_base_url: `${DEFAULT_SITE_URL}/api`,
        last_updated: new Date().toISOString(),
        updated_by: null,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSiteUrl = useCallback(async (newUrl: string, userId?: string) => {
    try {
      setError(null);

      // Check if settings exist
      const { data: existing } = await supabase
        .from('site_settings')
        .select('id')
        .limit(1)
        .maybeSingle();

      if (existing) {
        // Update existing
        const { error: updateError } = await supabase
          .from('site_settings')
          .update({
            site_url: newUrl,
            admin_url: `${newUrl}/admin`,
            api_base_url: `${newUrl}/api`,
            last_updated: new Date().toISOString(),
            updated_by: userId || null,
          })
          .eq('id', existing.id);

        if (updateError) throw updateError;
      } else {
        // Insert new
        const { error: insertError } = await supabase
          .from('site_settings')
          .insert({
            site_url: newUrl,
            admin_url: `${newUrl}/admin`,
            api_base_url: `${newUrl}/api`,
            updated_by: userId || null,
          });

        if (insertError) throw insertError;
      }

      await fetchSettings();
      return { success: true };
    } catch (err) {
      console.error('Error updating site URL:', err);
      const message = err instanceof Error ? err.message : 'Failed to update site URL';
      setError(message);
      return { success: false, error: message };
    }
  }, [fetchSettings]);

  const testConnection = useCallback(async (url: string): Promise<{ success: boolean; latency?: number; error?: string }> => {
    try {
      const startTime = Date.now();
      const response = await fetch(url, { 
        method: 'HEAD',
        mode: 'no-cors'
      });
      const latency = Date.now() - startTime;
      
      return { success: true, latency };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Connection failed' 
      };
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    siteUrl: settings?.site_url || DEFAULT_SITE_URL,
    apiBaseUrl: settings?.api_base_url || `${DEFAULT_SITE_URL}/api`,
    adminUrl: settings?.admin_url || `${DEFAULT_SITE_URL}/admin`,
    loading,
    error,
    updateSiteUrl,
    testConnection,
    refresh: fetchSettings,
  };
}
