/**
 * Unified Configuration Context
 * Provides global access to theme, store, features, and seasonal configs
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeConfig, ThemeMode, themePresets, defaultTheme } from '@/config/themeConfig';
import { StoreConfig, StoreType, getStoreConfig } from '@/config/storeConfig';
import { FeatureFlags, defaultFeatures, isFeatureEnabled } from '@/config/featuresConfig';
import { SeasonalConfig, SeasonalMode, seasonalPresets, getActiveSeasonalMode } from '@/config/seasonalConfig';
import { useRealtimeSync } from '@/hooks/useRealtimeSync';

interface ConfigContextType {
  // Theme
  theme: ThemeConfig;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  applyTheme: (config: Partial<ThemeConfig>) => void;

  // Store
  store: StoreConfig;
  storeType: StoreType;
  switchStore: (type: StoreType) => void;

  // Features
  features: FeatureFlags;
  isFeatureEnabled: (feature: keyof FeatureFlags) => boolean;
  toggleFeature: (feature: keyof FeatureFlags, enabled: boolean) => void;

  // Seasonal
  seasonal: SeasonalConfig;
  seasonalMode: SeasonalMode;
  setSeasonalMode: (mode: SeasonalMode) => void;

  // Sync
  isConnected: boolean;
  lastUpdate: number;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

interface ConfigProviderProps {
  children: ReactNode;
  initialStore?: StoreType;
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ 
  children, 
  initialStore = 'tech' 
}) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('default');
  const [theme, setTheme] = useState<ThemeConfig>(defaultTheme);
  const [storeType, setStoreType] = useState<StoreType>(initialStore);
  const [store, setStore] = useState<StoreConfig>(getStoreConfig(initialStore));
  const [features, setFeatures] = useState<FeatureFlags>(defaultFeatures);
  const [seasonalMode, setSeasonalMode] = useState<SeasonalMode>('normal');
  const [seasonal, setSeasonal] = useState<SeasonalConfig>(seasonalPresets.normal);

  // Initialize realtime sync
  const { isConnected, lastUpdate } = useRealtimeSync({
    storeType,
    onThemeUpdate: (themeData) => {
      if (themeData) {
        applyTheme({
          colors: {
            primary: themeData.primary_color,
            secondary: themeData.secondary_color,
            background: themeData.background_color,
            foreground: theme.colors.foreground,
            accent: theme.colors.accent,
            muted: theme.colors.muted,
          },
          fonts: {
            heading: themeData.font_family || theme.fonts.heading,
            body: themeData.font_family || theme.fonts.body,
          },
        });
      }
    },
    onMagicModeUpdate: (modeData) => {
      if (modeData && modeData.mode !== 'normal') {
        setSeasonalMode(modeData.mode as SeasonalMode);
      }
    },
  });

  // Apply theme to DOM
  const applyThemeToDom = (themeConfig: ThemeConfig) => {
    const root = document.documentElement;
    Object.entries(themeConfig.colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
    root.style.setProperty('--font-heading', themeConfig.fonts.heading);
    root.style.setProperty('--font-body', themeConfig.fonts.body);
  };

  // Theme management
  const applyTheme = (config: Partial<ThemeConfig>) => {
    const newTheme = { ...theme, ...config };
    setTheme(newTheme);
    applyThemeToDom(newTheme);
    localStorage.setItem('theme-config', JSON.stringify(newTheme));
  };

  const handleSetThemeMode = (mode: ThemeMode) => {
    setThemeMode(mode);
    const preset = themePresets[mode];
    if (preset) {
      applyTheme(preset as Partial<ThemeConfig>);
    }
  };

  // Store management
  const switchStore = (type: StoreType) => {
    setStoreType(type);
    const newStore = getStoreConfig(type);
    setStore(newStore);
    localStorage.setItem('store-type', type);
  };

  // Feature management
  const checkFeatureEnabled = (feature: keyof FeatureFlags): boolean => {
    return isFeatureEnabled(feature, features);
  };

  const toggleFeature = (feature: keyof FeatureFlags, enabled: boolean) => {
    setFeatures(prev => ({ ...prev, [feature]: enabled }));
    localStorage.setItem('features-config', JSON.stringify({ ...features, [feature]: enabled }));
  };

  // Seasonal management
  const handleSetSeasonalMode = (mode: SeasonalMode) => {
    setSeasonalMode(mode);
    const config = seasonalPresets[mode];
    setSeasonal(config);
    
    // Apply seasonal theme if not normal mode
    if (mode !== 'normal' && config.theme.colors) {
      applyTheme({
        colors: {
          primary: config.theme.colors.primary,
          secondary: config.theme.colors.secondary,
          accent: config.theme.colors.accent,
          background: theme.colors.background,
          foreground: theme.colors.foreground,
          muted: theme.colors.muted,
        },
      });
    }

    // Apply seasonal body classes
    const body = document.body;
    body.classList.remove(...Object.keys(seasonalPresets).map(m => `${m}-mode`));
    if (mode !== 'normal') {
      body.classList.add(`${mode}-mode`);
    }

    localStorage.setItem('seasonal-mode', mode);
  };

  // Initialize from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme-config');
    const savedStore = localStorage.getItem('store-type');
    const savedFeatures = localStorage.getItem('features-config');
    const savedSeasonal = localStorage.getItem('seasonal-mode');

    if (savedTheme) {
      try {
        const parsed = JSON.parse(savedTheme);
        applyTheme(parsed);
      } catch (e) {
        console.error('Failed to parse saved theme', e);
      }
    }

    if (savedStore) {
      switchStore(savedStore as StoreType);
    }

    if (savedFeatures) {
      try {
        setFeatures(JSON.parse(savedFeatures));
      } catch (e) {
        console.error('Failed to parse saved features', e);
      }
    }

    if (savedSeasonal) {
      handleSetSeasonalMode(savedSeasonal as SeasonalMode);
    } else {
      // Auto-detect seasonal mode based on date
      const autoMode = getActiveSeasonalMode();
      if (autoMode !== 'normal') {
        handleSetSeasonalMode(autoMode);
      }
    }
  }, []);

  const value: ConfigContextType = {
    theme,
    themeMode,
    setThemeMode: handleSetThemeMode,
    applyTheme,
    store,
    storeType,
    switchStore,
    features,
    isFeatureEnabled: checkFeatureEnabled,
    toggleFeature,
    seasonal,
    seasonalMode,
    setSeasonalMode: handleSetSeasonalMode,
    isConnected,
    lastUpdate,
  };

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within ConfigProvider');
  }
  return context;
};
