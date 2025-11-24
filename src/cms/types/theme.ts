export interface ThemeTokens {
  colors: Record<string, string>;
  fonts: {
    heading?: string;
    body?: string;
  };
  spacing?: Record<string, string>;
  radii?: Record<string, string>;
  shadows?: Record<string, string>;
  animations?: Record<string, unknown>;
}

export interface Theme {
  id: string;
  name: string;
  description?: string;
  tokens: ThemeTokens;
  createdAt: string;
  updatedAt?: string;
}

