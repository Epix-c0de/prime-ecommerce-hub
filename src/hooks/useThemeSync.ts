import { useEffect, useState } from 'react';
import { useRealtimeSync } from '@/contexts/RealtimeSyncContext';

interface ThemeTokens {
  [key: string]: string;
}

export function useThemeSync(storeType: string = 'electronics') {
  const { subscribeToEvent } = useRealtimeSync();
  const [currentTheme, setCurrentTheme] = useState<ThemeTokens>({});

  useEffect(() => {
    // Subscribe to theme updates
    const unsubscribe = subscribeToEvent('theme_update', (payload) => {
      if (payload.store_type === storeType || payload.store_type === 'all') {
        applyThemeTokens(payload.tokens);
        setCurrentTheme(payload.tokens);
      }
    });

    return unsubscribe;
  }, [storeType, subscribeToEvent]);

  const applyThemeTokens = (tokens: any[]) => {
    const root = document.documentElement;
    
    tokens.forEach(token => {
      if (token.category === 'colors') {
        root.style.setProperty(`--${token.name}`, token.value);
      } else if (token.category === 'spacing') {
        root.style.setProperty(`--${token.name}`, token.value);
      } else if (token.category === 'typography') {
        if (token.name.startsWith('font-')) {
          root.style.setProperty(`--${token.name}`, token.value);
        }
      }
    });
  };

  return { currentTheme, applyThemeTokens };
}
