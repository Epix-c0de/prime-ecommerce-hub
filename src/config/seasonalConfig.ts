/**
 * Seasonal & Festive Configuration
 * Controls seasonal themes, campaigns, and limited-time visual changes
 */

export type SeasonalMode = 
  | 'normal'
  | 'christmas'
  | 'eid'
  | 'valentine'
  | 'black-friday'
  | 'new-year'
  | 'easter'
  | 'halloween'
  | 'diwali';

export interface SeasonalConfig {
  mode: SeasonalMode;
  active: boolean;
  name: string;
  startDate?: Date;
  endDate?: Date;
  theme: {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
    };
    effects: {
      particles?: 'snow' | 'hearts' | 'sparkles' | 'confetti' | 'leaves';
      animation?: string;
      backgroundPattern?: string;
    };
    banner?: {
      text: string;
      backgroundColor: string;
      textColor: string;
    };
  };
  messaging: {
    heroTitle?: string;
    heroSubtitle?: string;
    ctaText?: string;
  };
}

export const seasonalPresets: Record<SeasonalMode, SeasonalConfig> = {
  normal: {
    mode: 'normal',
    active: false,
    name: 'Default',
    theme: {
      colors: {
        primary: '222.2 47.4% 11.2%',
        secondary: '210 40% 96.1%',
        accent: '210 40% 96.1%',
      },
      effects: {},
    },
    messaging: {},
  },
  christmas: {
    mode: 'christmas',
    active: false,
    name: 'Christmas',
    theme: {
      colors: {
        primary: '0 72% 51%',
        secondary: '142 71% 45%',
        accent: '43 96% 56%',
      },
      effects: {
        particles: 'snow',
        backgroundPattern: 'url(/patterns/christmas.svg)',
      },
      banner: {
        text: '🎄 Holiday Sale - Up to 50% Off!',
        backgroundColor: 'hsl(0 72% 51%)',
        textColor: 'white',
      },
    },
    messaging: {
      heroTitle: 'Make This Christmas Special',
      heroSubtitle: 'Unwrap amazing deals on everything you love',
      ctaText: 'Shop Holiday Gifts',
    },
  },
  eid: {
    mode: 'eid',
    active: false,
    name: 'Eid',
    theme: {
      colors: {
        primary: '142 71% 45%',
        secondary: '43 96% 56%',
        accent: '280 70% 60%',
      },
      effects: {
        particles: 'sparkles',
      },
      banner: {
        text: '✨ Eid Mubarak - Special Offers Inside!',
        backgroundColor: 'hsl(142 71% 45%)',
        textColor: 'white',
      },
    },
    messaging: {
      heroTitle: 'Celebrate Eid in Style',
      heroSubtitle: 'Discover exclusive deals for the blessed occasion',
      ctaText: 'Shop Eid Collection',
    },
  },
  valentine: {
    mode: 'valentine',
    active: false,
    name: "Valentine's Day",
    theme: {
      colors: {
        primary: '340 82% 52%',
        secondary: '330 81% 60%',
        accent: '0 72% 51%',
      },
      effects: {
        particles: 'hearts',
      },
      banner: {
        text: '💝 Love is in the Air - Valentine Specials!',
        backgroundColor: 'hsl(340 82% 52%)',
        textColor: 'white',
      },
    },
    messaging: {
      heroTitle: 'Share the Love',
      heroSubtitle: 'Perfect gifts for your special someone',
      ctaText: 'Find the Perfect Gift',
    },
  },
  'black-friday': {
    mode: 'black-friday',
    active: false,
    name: 'Black Friday',
    theme: {
      colors: {
        primary: '0 0% 10%',
        secondary: '43 96% 56%',
        accent: '0 72% 51%',
      },
      effects: {
        animation: 'pulse',
      },
      banner: {
        text: '⚡ BLACK FRIDAY - Up to 70% Off Everything!',
        backgroundColor: 'hsl(0 0% 10%)',
        textColor: 'hsl(43 96% 56%)',
      },
    },
    messaging: {
      heroTitle: 'Biggest Sale of the Year',
      heroSubtitle: 'Unbeatable deals you can\'t miss',
      ctaText: 'Shop Black Friday Deals',
    },
  },
  'new-year': {
    mode: 'new-year',
    active: false,
    name: 'New Year',
    theme: {
      colors: {
        primary: '280 70% 60%',
        secondary: '43 96% 56%',
        accent: '0 72% 51%',
      },
      effects: {
        particles: 'confetti',
      },
      banner: {
        text: '🎉 New Year, New Deals - Start Fresh!',
        backgroundColor: 'hsl(280 70% 60%)',
        textColor: 'white',
      },
    },
    messaging: {
      heroTitle: 'Welcome 2025',
      heroSubtitle: 'Start the year with amazing savings',
      ctaText: 'Shop New Year Sale',
    },
  },
  easter: {
    mode: 'easter',
    active: false,
    name: 'Easter',
    theme: {
      colors: {
        primary: '280 70% 60%',
        secondary: '142 71% 45%',
        accent: '43 96% 56%',
      },
      effects: {
        backgroundPattern: 'url(/patterns/easter.svg)',
      },
      banner: {
        text: '🐰 Easter Savings - Hop to It!',
        backgroundColor: 'hsl(280 70% 60%)',
        textColor: 'white',
      },
    },
    messaging: {
      heroTitle: 'Spring into Savings',
      heroSubtitle: 'Fresh deals for the season',
      ctaText: 'Discover Easter Deals',
    },
  },
  halloween: {
    mode: 'halloween',
    active: false,
    name: 'Halloween',
    theme: {
      colors: {
        primary: '25 95% 53%',
        secondary: '0 0% 10%',
        accent: '280 70% 60%',
      },
      effects: {
        particles: 'leaves',
        backgroundPattern: 'url(/patterns/halloween.svg)',
      },
      banner: {
        text: '🎃 Spooky Savings - Treats Inside!',
        backgroundColor: 'hsl(25 95% 53%)',
        textColor: 'hsl(0 0% 10%)',
      },
    },
    messaging: {
      heroTitle: 'Frighteningly Good Deals',
      heroSubtitle: 'No tricks, just treats',
      ctaText: 'Shop Halloween Sale',
    },
  },
  diwali: {
    mode: 'diwali',
    active: false,
    name: 'Diwali',
    theme: {
      colors: {
        primary: '43 96% 56%',
        secondary: '0 72% 51%',
        accent: '280 70% 60%',
      },
      effects: {
        particles: 'sparkles',
      },
      banner: {
        text: '🪔 Festival of Lights - Illuminate Your Savings!',
        backgroundColor: 'hsl(43 96% 56%)',
        textColor: 'hsl(0 0% 10%)',
      },
    },
    messaging: {
      heroTitle: 'Celebrate Diwali in Style',
      heroSubtitle: 'Brighten your home with festive deals',
      ctaText: 'Shop Diwali Offers',
    },
  },
};

export const getActiveSeasonalMode = (): SeasonalMode => {
  const now = new Date();
  
  // Check which seasonal mode should be active based on dates
  for (const [mode, config] of Object.entries(seasonalPresets)) {
    if (mode === 'normal') continue;
    
    if (config.startDate && config.endDate) {
      if (now >= config.startDate && now <= config.endDate) {
        return mode as SeasonalMode;
      }
    }
  }
  
  return 'normal';
};
