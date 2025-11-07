/**
 * Store-Specific Configuration
 * Defines categories, branding, and behavior for Tech and Lifestyle stores
 */

export type StoreType = 'tech' | 'lifestyle';

export interface StoreConfig {
  id: StoreType;
  name: string;
  tagline: string;
  description: string;
  categories: CategoryConfig[];
  branding: {
    logo?: string;
    primaryColor: string;
    accentColor: string;
  };
  features: {
    ar: boolean;
    personalization: boolean;
    giftRegistry: boolean;
    styleQuiz: boolean;
  };
}

export interface CategoryConfig {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  featured: boolean;
}

export const storeConfigs: Record<StoreType, StoreConfig> = {
  tech: {
    id: 'tech',
    name: 'Prime Tech',
    tagline: 'Innovation at Your Fingertips',
    description: 'Cutting-edge electronics, smart devices, and tech essentials',
    categories: [
      {
        id: 'smartphones',
        name: 'Smartphones',
        slug: 'smartphones',
        description: 'Latest mobile technology',
        image: '/assets/categories/smartphones.jpg',
        featured: true,
      },
      {
        id: 'computing',
        name: 'Computing',
        slug: 'computing',
        description: 'Laptops, desktops, and accessories',
        image: '/assets/categories/computing.jpg',
        featured: true,
      },
      {
        id: 'tv-audio',
        name: 'TV & Audio',
        slug: 'tv-audio',
        description: 'Entertainment systems',
        image: '/assets/categories/tv-audio.jpg',
        featured: true,
      },
      {
        id: 'cameras',
        name: 'Cameras',
        slug: 'cameras',
        description: 'Photography equipment',
        image: '/assets/categories/cameras.jpg',
        featured: false,
      },
      {
        id: 'home-appliances',
        name: 'Home Appliances',
        slug: 'home-appliances',
        description: 'Smart home devices',
        image: '/assets/categories/home-appliances.jpg',
        featured: false,
      },
    ],
    branding: {
      primaryColor: '222.2 47.4% 11.2%',
      accentColor: '217 91% 60%',
    },
    features: {
      ar: true,
      personalization: true,
      giftRegistry: false,
      styleQuiz: false,
    },
  },
  lifestyle: {
    id: 'lifestyle',
    name: 'Prime Lifestyle',
    tagline: 'Live Your Best Life',
    description: 'Fashion, beauty, home essentials, and lifestyle products',
    categories: [
      {
        id: 'fashion',
        name: 'Fashion',
        slug: 'fashion',
        description: 'Clothing and accessories',
        image: '/assets/categories/fashion.jpg',
        featured: true,
      },
      {
        id: 'beauty',
        name: 'Beauty',
        slug: 'beauty',
        description: 'Skincare and cosmetics',
        image: '/assets/categories/beauty.jpg',
        featured: true,
      },
      {
        id: 'toys',
        name: 'Toys & Games',
        slug: 'toys',
        description: 'Fun for all ages',
        image: '/assets/categories/toys.jpg',
        featured: true,
      },
      {
        id: 'home',
        name: 'Home & Kitchen',
        slug: 'home',
        description: 'Living essentials',
        image: '/assets/categories/home-appliances.jpg',
        featured: false,
      },
    ],
    branding: {
      primaryColor: '340 82% 52%',
      accentColor: '280 70% 60%',
    },
    features: {
      ar: false,
      personalization: true,
      giftRegistry: true,
      styleQuiz: true,
    },
  },
};

export const getStoreConfig = (storeType: StoreType): StoreConfig => {
  return storeConfigs[storeType];
};
