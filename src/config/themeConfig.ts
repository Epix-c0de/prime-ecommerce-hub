/**
 * Centralized Theme Configuration
 * Controls colors, fonts, animations, and visual styles across the entire app
 */

export type ThemeMode = 'default' | 'vibrant' | 'minimal' | 'festive' | 'dark';
export type AnimationSpeed = 'slow' | 'normal' | 'fast' | 'none';

export interface ThemeConfig {
  mode: ThemeMode;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  animation: {
    speed: AnimationSpeed;
    intensity: 'subtle' | 'normal' | 'bold';
  };
  effects: {
    glassmorphism: boolean;
    gradients: boolean;
    shadows: 'none' | 'soft' | 'bold';
  };
}

export const themePresets: Record<ThemeMode, Partial<ThemeConfig>> = {
  default: {
    mode: 'default',
    colors: {
      primary: '222.2 47.4% 11.2%',
      secondary: '210 40% 96.1%',
      accent: '210 40% 96.1%',
      background: '0 0% 100%',
      foreground: '222.2 84% 4.9%',
      muted: '210 40% 96.1%',
    },
    animation: {
      speed: 'normal',
      intensity: 'normal',
    },
  },
  vibrant: {
    mode: 'vibrant',
    colors: {
      primary: '340 82% 52%',
      secondary: '280 70% 60%',
      accent: '45 93% 47%',
      background: '0 0% 100%',
      foreground: '222.2 84% 4.9%',
      muted: '210 40% 96.1%',
    },
    animation: {
      speed: 'fast',
      intensity: 'bold',
    },
    effects: {
      glassmorphism: true,
      gradients: true,
      shadows: 'bold',
    },
  },
  minimal: {
    mode: 'minimal',
    colors: {
      primary: '0 0% 20%',
      secondary: '0 0% 95%',
      accent: '0 0% 60%',
      background: '0 0% 100%',
      foreground: '0 0% 10%',
      muted: '0 0% 96%',
    },
    animation: {
      speed: 'slow',
      intensity: 'subtle',
    },
    effects: {
      glassmorphism: false,
      gradients: false,
      shadows: 'soft',
    },
  },
  festive: {
    mode: 'festive',
    colors: {
      primary: '0 72% 51%',
      secondary: '142 71% 45%',
      accent: '43 96% 56%',
      background: '0 0% 100%',
      foreground: '222.2 84% 4.9%',
      muted: '210 40% 96.1%',
    },
    animation: {
      speed: 'normal',
      intensity: 'bold',
    },
    effects: {
      glassmorphism: true,
      gradients: true,
      shadows: 'bold',
    },
  },
  dark: {
    mode: 'dark',
    colors: {
      primary: '210 40% 98%',
      secondary: '217.2 32.6% 17.5%',
      accent: '217.2 32.6% 17.5%',
      background: '222.2 84% 4.9%',
      foreground: '210 40% 98%',
      muted: '217.2 32.6% 17.5%',
    },
    animation: {
      speed: 'normal',
      intensity: 'subtle',
    },
  },
};

export const defaultTheme: ThemeConfig = {
  mode: 'default',
  colors: {
    primary: '222.2 47.4% 11.2%',
    secondary: '210 40% 96.1%',
    accent: '210 40% 96.1%',
    background: '0 0% 100%',
    foreground: '222.2 84% 4.9%',
    muted: '210 40% 96.1%',
  },
  fonts: {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
  },
  animation: {
    speed: 'normal',
    intensity: 'normal',
  },
  effects: {
    glassmorphism: false,
    gradients: true,
    shadows: 'soft',
  },
};
