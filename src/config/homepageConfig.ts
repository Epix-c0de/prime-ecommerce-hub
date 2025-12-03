// Homepage Configuration - JSON-driven layout system
export interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  cta: string;
  ctaLink: string;
  gradient?: string;
}

export interface AnnouncementTicker {
  id: string;
  text: string;
  link?: string;
  type: 'promo' | 'shipping' | 'flash' | 'launch' | 'collection';
}

export interface CategoryCard {
  id: string;
  name: string;
  image: string;
  link: string;
  icon?: string;
}

export interface FeaturedBlock {
  id: string;
  title: string;
  type: 'banner' | 'grid' | 'mixed';
  items: Array<{
    image: string;
    title: string;
    link: string;
  }>;
  cta?: string;
  ctaLink?: string;
  background?: string;
}

export interface ProductCarouselConfig {
  id: string;
  title: string;
  type: 'best-sellers' | 'trending' | 'deals' | 'recommended' | 'flash-sale' | 'category';
  categoryId?: string;
  limit: number;
  showTimer?: boolean;
}

export interface SpotlightSection {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  categories: Array<{
    name: string;
    link: string;
    image: string;
  }>;
}

export interface AdPlacement {
  id: string;
  type: 'horizontal' | 'sidebar' | 'inline' | 'sponsored';
  image: string;
  link: string;
  title?: string;
}

export interface HomepageConfig {
  storeType: 'tech' | 'lifestyle';
  hero: HeroSlide[];
  tickers: AnnouncementTicker[];
  categories: CategoryCard[];
  featuredBlocks: FeaturedBlock[];
  productCarousels: ProductCarouselConfig[];
  spotlight: SpotlightSection[];
  ads: AdPlacement[];
  showRecommendations: boolean;
  showRecentlyViewed: boolean;
  showSocialProof: boolean;
  showNewsletter: boolean;
}

// Tech Store Homepage Configuration
export const techHomepageConfig: HomepageConfig = {
  storeType: 'tech',
  hero: [
    {
      id: 'hero-1',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&h=600&fit=crop',
      title: 'Next-Gen Technology',
      subtitle: 'Discover the latest in smartphones, laptops & smart devices',
      cta: 'Shop Now',
      ctaLink: '/products?category=smartphones',
      gradient: 'from-primary/80 to-transparent'
    },
    {
      id: 'hero-2',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1920&h=600&fit=crop',
      title: 'Laptop Upgrade Sale',
      subtitle: 'Save up to 30% on selected models',
      cta: 'View Deals',
      ctaLink: '/products?category=computing',
      gradient: 'from-secondary/80 to-transparent'
    },
    {
      id: 'hero-3',
      image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=1920&h=600&fit=crop',
      title: 'Smart Wearables',
      subtitle: 'Latest fitness trackers and smartwatches',
      cta: 'Explore',
      ctaLink: '/products?category=wearables',
      gradient: 'from-accent/80 to-transparent'
    }
  ],
  tickers: [
    { id: 't1', text: '🚀 FREE SHIPPING on orders over $50', type: 'shipping' },
    { id: 't2', text: '⚡ Flash Sale: Up to 40% OFF Electronics', type: 'flash' },
    { id: 't3', text: '🎁 New arrivals: iPhone 15 Pro Max now available', type: 'launch' },
    { id: 't4', text: '💳 Buy now, pay later - 0% Interest', type: 'promo' }
  ],
  categories: [
    { id: 'cat-1', name: 'Smartphones', image: '/src/assets/categories/smartphones.jpg', link: '/category/smartphones' },
    { id: 'cat-2', name: 'Computing', image: '/src/assets/categories/computing.jpg', link: '/category/computing' },
    { id: 'cat-3', name: 'TV & Audio', image: '/src/assets/categories/tv-audio.jpg', link: '/category/tv-audio' },
    { id: 'cat-4', name: 'Cameras', image: '/src/assets/categories/cameras.jpg', link: '/category/cameras' },
    { id: 'cat-5', name: 'Home Appliances', image: '/src/assets/categories/home-appliances.jpg', link: '/category/home-appliances' },
    { id: 'cat-6', name: 'Gaming', image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=300&h=200&fit=crop', link: '/category/gaming' }
  ],
  featuredBlocks: [
    {
      id: 'fb-1',
      title: 'Top Deals in Electronics',
      type: 'grid',
      items: [
        { image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=200&fit=crop', title: 'Smartphones', link: '/category/smartphones' },
        { image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=200&fit=crop', title: 'Laptops', link: '/category/computing' },
        { image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=300&h=200&fit=crop', title: 'Headphones', link: '/category/audio' },
        { image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&h=200&fit=crop', title: 'Smart TVs', link: '/category/tv' }
      ],
      cta: 'See all deals',
      ctaLink: '/deals'
    },
    {
      id: 'fb-2',
      title: 'New Arrivals',
      type: 'mixed',
      items: [
        { image: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=600&h=400&fit=crop', title: 'Latest Tech', link: '/new-arrivals' },
        { image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=200&fit=crop', title: 'Smart Watches', link: '/category/wearables' },
        { image: 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=300&h=200&fit=crop', title: 'Tablets', link: '/category/tablets' }
      ]
    }
  ],
  productCarousels: [
    { id: 'pc-1', title: 'Flash Deals', type: 'flash-sale', limit: 10, showTimer: true },
    { id: 'pc-2', title: 'Best Sellers', type: 'best-sellers', limit: 10 },
    { id: 'pc-3', title: 'Trending Now', type: 'trending', limit: 10 },
    { id: 'pc-4', title: 'Deals Under $100', type: 'deals', limit: 10 },
    { id: 'pc-5', title: 'Recommended For You', type: 'recommended', limit: 10 }
  ],
  spotlight: [
    {
      id: 'spot-1',
      title: 'Electronics Hub',
      subtitle: 'Shop by category',
      image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&h=400&fit=crop',
      categories: [
        { name: 'Smartphones', link: '/category/smartphones', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop' },
        { name: 'Laptops', link: '/category/computing', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=200&fit=crop' },
        { name: 'Smart TVs', link: '/category/tv', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=200&h=200&fit=crop' },
        { name: 'Gaming', link: '/category/gaming', image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=200&h=200&fit=crop' }
      ]
    }
  ],
  ads: [
    { id: 'ad-1', type: 'horizontal', image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&h=200&fit=crop', link: '/deals', title: 'Mega Tech Sale' },
    { id: 'ad-2', type: 'inline', image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&h=300&fit=crop', link: '/category/audio', title: 'Premium Audio' }
  ],
  showRecommendations: true,
  showRecentlyViewed: true,
  showSocialProof: true,
  showNewsletter: true
};

// Lifestyle Store Homepage Configuration
export const lifestyleHomepageConfig: HomepageConfig = {
  storeType: 'lifestyle',
  hero: [
    {
      id: 'hero-1',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=600&fit=crop',
      title: 'Summer Fashion Sale',
      subtitle: 'Up to 50% off on latest trends',
      cta: 'Shop Now',
      ctaLink: '/category/fashion',
      gradient: 'from-pink-600/80 to-transparent'
    },
    {
      id: 'hero-2',
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1920&h=600&fit=crop',
      title: 'Home Makeover',
      subtitle: 'Transform your living space',
      cta: 'Explore',
      ctaLink: '/category/home-decor',
      gradient: 'from-purple-600/80 to-transparent'
    },
    {
      id: 'hero-3',
      image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1920&h=600&fit=crop',
      title: 'Beauty Essentials',
      subtitle: 'Discover your perfect look',
      cta: 'Shop Beauty',
      ctaLink: '/category/beauty',
      gradient: 'from-rose-600/80 to-transparent'
    }
  ],
  tickers: [
    { id: 't1', text: '✨ NEW: Summer Collection 2024 is here!', type: 'collection' },
    { id: 't2', text: '🚚 FREE EXPRESS SHIPPING on orders over $75', type: 'shipping' },
    { id: 't3', text: '💄 Beauty Week: Extra 20% OFF all skincare', type: 'promo' },
    { id: 't4', text: '🏠 Home décor flash sale - ends tonight!', type: 'flash' }
  ],
  categories: [
    { id: 'cat-1', name: 'Fashion', image: '/src/assets/categories/fashion.jpg', link: '/category/fashion' },
    { id: 'cat-2', name: 'Beauty', image: '/src/assets/categories/beauty.jpg', link: '/category/beauty' },
    { id: 'cat-3', name: 'Toys', image: '/src/assets/categories/toys.jpg', link: '/category/toys' },
    { id: 'cat-4', name: 'Home Décor', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=300&h=200&fit=crop', link: '/category/home' },
    { id: 'cat-5', name: 'Fitness', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=300&h=200&fit=crop', link: '/category/fitness' },
    { id: 'cat-6', name: 'Kitchen', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop', link: '/category/kitchen' }
  ],
  featuredBlocks: [
    {
      id: 'fb-1',
      title: 'Style Picks',
      type: 'grid',
      items: [
        { image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=300&h=200&fit=crop', title: "Women's Fashion", link: '/category/womens-fashion' },
        { image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop', title: "Men's Fashion", link: '/category/mens-fashion' },
        { image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=300&h=200&fit=crop', title: 'Shoes', link: '/category/shoes' },
        { image: 'https://images.unsplash.com/photo-1523779105320-d1cd346ff52b?w=300&h=200&fit=crop', title: 'Accessories', link: '/category/accessories' }
      ],
      cta: 'Shop all fashion',
      ctaLink: '/category/fashion'
    }
  ],
  productCarousels: [
    { id: 'pc-1', title: 'Flash Deals', type: 'flash-sale', limit: 10, showTimer: true },
    { id: 'pc-2', title: 'Trending Lifestyle', type: 'trending', limit: 10 },
    { id: 'pc-3', title: 'Best Sellers', type: 'best-sellers', limit: 10 },
    { id: 'pc-4', title: 'Under $50', type: 'deals', limit: 10 },
    { id: 'pc-5', title: 'Picked For You', type: 'recommended', limit: 10 }
  ],
  spotlight: [
    {
      id: 'spot-1',
      title: 'Lifestyle Collections',
      subtitle: 'Curated for you',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop',
      categories: [
        { name: 'Fashion', link: '/category/fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&h=200&fit=crop' },
        { name: 'Beauty', link: '/category/beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop' },
        { name: 'Home', link: '/category/home', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=200&h=200&fit=crop' },
        { name: 'Fitness', link: '/category/fitness', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&h=200&fit=crop' }
      ]
    }
  ],
  ads: [
    { id: 'ad-1', type: 'horizontal', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=200&fit=crop', link: '/deals', title: 'Fashion Week Sale' }
  ],
  showRecommendations: true,
  showRecentlyViewed: true,
  showSocialProof: true,
  showNewsletter: true
};

export const getHomepageConfig = (storeType: 'tech' | 'lifestyle'): HomepageConfig => {
  return storeType === 'tech' ? techHomepageConfig : lifestyleHomepageConfig;
};
