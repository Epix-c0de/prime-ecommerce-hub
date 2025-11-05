import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface RealtimeSyncConfig {
  storeType: "tech" | "lifestyle";
  onThemeUpdate?: (theme: any) => void;
  onTextUpdate?: (text: any) => void;
  onLayoutUpdate?: (layout: any) => void;
  onPromotionUpdate?: (promotion: any) => void;
  onSeoUpdate?: (seo: any) => void;
  onMagicModeUpdate?: (mode: any) => void;
}

export const useRealtimeSync = (config: RealtimeSyncConfig) => {
  const { storeType, onThemeUpdate, onTextUpdate, onLayoutUpdate, onPromotionUpdate, onSeoUpdate, onMagicModeUpdate } = config;
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  // Apply theme to DOM
  const applyTheme = (theme: any) => {
    if (!theme) return;
    
    const root = document.documentElement;
    if (theme.primary_color) root.style.setProperty("--primary", theme.primary_color);
    if (theme.secondary_color) root.style.setProperty("--secondary", theme.secondary_color);
    if (theme.background_color) root.style.setProperty("--background", theme.background_color);
    if (theme.font_family) root.style.setProperty("--font-sans", theme.font_family);
    
    onThemeUpdate?.(theme);
  };

  // Apply SEO metadata
  const applySeo = (seo: any) => {
    if (!seo) return;
    
    if (seo.title) document.title = seo.title;
    
    if (seo.description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.setAttribute("name", "description");
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute("content", seo.description);
    }
    
    onSeoUpdate?.(seo);
  };

  // Apply magic mode
  const applyMagicMode = (mode: any) => {
    if (!mode) return;
    
    const body = document.body;
    body.classList.remove("holiday-mode", "sale-mode", "minimal-mode", "vibrant-mode");
    
    if (mode.mode !== "normal") {
      body.classList.add(`${mode.mode}-mode`);
    }
    
    onMagicModeUpdate?.(mode);
  };

  // Load initial data from database
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load active theme
        const { data: themes } = await supabase
          .from('themes')
          .select('*')
          .eq('store_type', storeType)
          .eq('is_active', true)
          .or(`store_type.eq.${storeType},store_type.eq.both`)
          .limit(1)
          .maybeSingle();

        if (themes) applyTheme(themes);

        // Load SEO data
        const { data: seo } = await supabase
          .from('seo_meta')
          .select('*')
          .eq('store_type', storeType)
          .eq('page', 'home')
          .eq('is_active', true)
          .or(`store_type.eq.${storeType},store_type.eq.both`)
          .limit(1)
          .maybeSingle();

        if (seo) applySeo(seo);

        // Load magic mode
        const { data: magicMode } = await supabase
          .from('magic_mode')
          .select('*')
          .eq('store_type', storeType)
          .eq('is_active', true)
          .or(`store_type.eq.${storeType},store_type.eq.both`)
          .limit(1)
          .maybeSingle();

        if (magicMode) applyMagicMode(magicMode);

        setIsConnected(true);
      } catch (error) {
        console.error('Error loading initial data:', error);
        setIsConnected(false);
      }
    };

    loadInitialData();
  }, [storeType]);

  // Subscribe to realtime updates
  useEffect(() => {
    const channels: any[] = [];

    // Theme updates
    const themeChannel = supabase
      .channel('themes-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'themes',
          filter: `store_type=in.(${storeType},both)`
        },
        (payload) => {
          console.log('Theme update:', payload);
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            applyTheme(payload.new);
            toast.success("🎨 Theme updated");
            setLastUpdate(Date.now());
          }
        }
      )
      .subscribe();

    channels.push(themeChannel);

    // Text updates
    const textChannel = supabase
      .channel('texts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'texts',
          filter: `store_type=in.(${storeType},both)`
        },
        (payload) => {
          console.log('Text update:', payload);
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            onTextUpdate?.(payload.new);
            toast.success("📝 Content updated");
            setLastUpdate(Date.now());
          }
        }
      )
      .subscribe();

    channels.push(textChannel);

    // Layout updates
    const layoutChannel = supabase
      .channel('layout-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'layout_config',
          filter: `store_type=in.(${storeType},both)`
        },
        (payload) => {
          console.log('Layout update:', payload);
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            onLayoutUpdate?.(payload.new);
            toast.success("📐 Layout updated");
            setLastUpdate(Date.now());
          }
        }
      )
      .subscribe();

    channels.push(layoutChannel);

    // Promotion updates
    const promotionChannel = supabase
      .channel('promotions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'promotions',
          filter: `store_type=in.(${storeType},both)`
        },
        (payload) => {
          console.log('Promotion update:', payload);
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            onPromotionUpdate?.(payload.new);
            toast.success("💰 Promotion updated");
            setLastUpdate(Date.now());
          }
        }
      )
      .subscribe();

    channels.push(promotionChannel);

    // SEO updates
    const seoChannel = supabase
      .channel('seo-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'seo_meta',
          filter: `store_type=in.(${storeType},both)`
        },
        (payload) => {
          console.log('SEO update:', payload);
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            applySeo(payload.new);
            toast.success("🔍 SEO updated");
            setLastUpdate(Date.now());
          }
        }
      )
      .subscribe();

    channels.push(seoChannel);

    // Magic mode updates
    const magicModeChannel = supabase
      .channel('magic-mode-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'magic_mode',
          filter: `store_type=in.(${storeType},both)`
        },
        (payload) => {
          console.log('Magic mode update:', payload);
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            applyMagicMode(payload.new);
            toast.success("🪄 Magic Mode activated");
            setLastUpdate(Date.now());
          }
        }
      )
      .subscribe();

    channels.push(magicModeChannel);

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [storeType, onThemeUpdate, onTextUpdate, onLayoutUpdate, onPromotionUpdate, onSeoUpdate, onMagicModeUpdate]);

  return {
    isConnected,
    lastUpdate
  };
};
