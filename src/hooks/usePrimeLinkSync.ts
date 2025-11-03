import { useEffect, useState, useCallback } from "react";
import { PrimeLinkHub, SyncMessage } from "@/shared/PrimeLinkHub";
import { toast } from "sonner";

interface SyncHandlers {
  onThemeUpdate?: (theme: any) => void;
  onTextUpdate?: (text: any) => void;
  onLayoutUpdate?: (layout: any) => void;
  onAnimationUpdate?: (animation: any) => void;
  onCategoryUpdate?: (categories: any) => void;
  onDiscountUpdate?: (discounts: any) => void;
  onBannerUpdate?: (banner: any) => void;
  onSEOUpdate?: (seo: any) => void;
  onLocalizationUpdate?: (locale: any) => void;
  onMagicModeUpdate?: (mode: any) => void;
}

export const usePrimeLinkSync = (
  currentStore: "tech" | "lifestyle",
  handlers: SyncHandlers = {}
) => {
  const [isConnected, setIsConnected] = useState(PrimeLinkHub.isConnected());
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  const applyTheme = useCallback((theme: any) => {
    if (!theme) return;
    
    // Apply CSS custom properties for theme
    const root = document.documentElement;
    if (theme.primaryColor) {
      root.style.setProperty("--primary", theme.primaryColor);
    }
    if (theme.secondaryColor) {
      root.style.setProperty("--secondary", theme.secondaryColor);
    }
    if (theme.backgroundColor) {
      root.style.setProperty("--background", theme.backgroundColor);
    }
    
    handlers.onThemeUpdate?.(theme);
  }, [handlers]);

  const updateTextContent = useCallback((text: any) => {
    handlers.onTextUpdate?.(text);
  }, [handlers]);

  const updateLayout = useCallback((layout: any) => {
    handlers.onLayoutUpdate?.(layout);
  }, [handlers]);

  const updateAnimation = useCallback((animation: any) => {
    handlers.onAnimationUpdate?.(animation);
  }, [handlers]);

  const updateCategory = useCallback((categories: any) => {
    handlers.onCategoryUpdate?.(categories);
  }, [handlers]);

  const updateDiscounts = useCallback((discounts: any) => {
    handlers.onDiscountUpdate?.(discounts);
  }, [handlers]);

  const updateBanner = useCallback((banner: any) => {
    handlers.onBannerUpdate?.(banner);
  }, [handlers]);

  const updateSEO = useCallback((seo: any) => {
    if (!seo) return;
    
    // Update meta tags
    if (seo.title) {
      document.title = seo.title;
    }
    if (seo.description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.setAttribute("name", "description");
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute("content", seo.description);
    }
    
    handlers.onSEOUpdate?.(seo);
  }, [handlers]);

  const applyLanguage = useCallback((locale: any) => {
    if (locale?.language) {
      document.documentElement.lang = locale.language;
    }
    handlers.onLocalizationUpdate?.(locale);
  }, [handlers]);

  const triggerMagicMode = useCallback((mode: any) => {
    if (!mode?.value) return;

    const body = document.body;
    
    // Remove existing magic mode classes
    body.classList.remove("holiday-mode", "sale-mode", "minimal-mode", "vibrant-mode");
    
    // Apply new magic mode
    switch (mode.value) {
      case "holiday":
        body.classList.add("holiday-mode");
        break;
      case "sale":
        body.classList.add("sale-mode");
        break;
      case "minimal":
        body.classList.add("minimal-mode");
        break;
      case "vibrant":
        body.classList.add("vibrant-mode");
        break;
    }
    
    handlers.onMagicModeUpdate?.(mode);
  }, [handlers]);

  const handleMessage = useCallback((message: SyncMessage) => {
    const { type, payload, storeTarget } = message;

    // Check if message is for this store
    if (storeTarget && storeTarget !== "both" && storeTarget !== currentStore) {
      return;
    }

    setLastUpdate(Date.now());

    switch (type) {
      case "UPDATE_THEME":
        applyTheme(payload);
        toast.success("🎨 Theme updated");
        break;
      case "UPDATE_TEXT":
        updateTextContent(payload);
        toast.success("📝 Content updated");
        break;
      case "UPDATE_LAYOUT":
        updateLayout(payload);
        toast.success("📐 Layout updated");
        break;
      case "UPDATE_ANIMATION":
        updateAnimation(payload);
        toast.success("✨ Animations updated");
        break;
      case "UPDATE_CATEGORY":
        updateCategory(payload);
        toast.success("📂 Categories updated");
        break;
      case "UPDATE_DISCOUNT":
        updateDiscounts(payload);
        toast.success("💰 Discounts updated");
        break;
      case "UPDATE_BANNER":
        updateBanner(payload);
        toast.success("🎯 Banner updated");
        break;
      case "UPDATE_SEO":
        updateSEO(payload);
        toast.success("🔍 SEO updated");
        break;
      case "UPDATE_LOCALIZATION":
        applyLanguage(payload);
        toast.success("🌍 Language updated");
        break;
      case "UPDATE_MAGIC_MODE":
        triggerMagicMode(payload);
        toast.success("🪄 Magic Mode activated");
        break;
      default:
        console.warn("Unhandled update:", message);
    }
  }, [currentStore, applyTheme, updateTextContent, updateLayout, updateAnimation, 
      updateCategory, updateDiscounts, updateBanner, updateSEO, applyLanguage, triggerMagicMode]);

  // Listen to real-time updates
  useEffect(() => {
    const unsubscribe = PrimeLinkHub.listen(handleMessage);
    setIsConnected(PrimeLinkHub.isConnected());

    return () => {
      unsubscribe();
    };
  }, [handleMessage]);

  // Cross-session sync check (every 10 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      const persistedState = PrimeLinkHub.getPersistedState();
      if (persistedState.timestamp > lastUpdate) {
        // Apply persisted updates
        if (persistedState.theme) applyTheme(persistedState.theme);
        if (persistedState.seo) updateSEO(persistedState.seo);
        if (persistedState.locale) applyLanguage(persistedState.locale);
        if (persistedState.magicMode) triggerMagicMode({ value: persistedState.magicMode });
        
        setLastUpdate(persistedState.timestamp);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [lastUpdate, applyTheme, updateSEO, applyLanguage, triggerMagicMode]);

  // Load initial persisted state
  useEffect(() => {
    const persistedState = PrimeLinkHub.getPersistedState();
    if (persistedState.theme) applyTheme(persistedState.theme);
    if (persistedState.seo) updateSEO(persistedState.seo);
    if (persistedState.locale) applyLanguage(persistedState.locale);
    if (persistedState.magicMode) triggerMagicMode({ value: persistedState.magicMode });
  }, [applyTheme, updateSEO, applyLanguage, triggerMagicMode]);

  return {
    isConnected,
    lastUpdate,
    send: PrimeLinkHub.send.bind(PrimeLinkHub),
  };
};
