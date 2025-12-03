import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PrimeBot } from "@/components/PrimeBot";
import { AIChatbot } from "@/components/ai/AIChatbot";
import { AIRecommendations } from "@/components/ai/AIRecommendations";
import { QuickViewModal } from "@/components/QuickViewModal";
import { RecentlyViewed } from "@/components/RecentlyViewed";
import { BackToTop } from "@/components/BackToTop";
import { SocialProof } from "@/components/SocialProof";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { Product } from "@/hooks/useProducts";
import { useRealtimeSync } from "@/hooks/useRealtimeSync";
import { lifestyleHomepageConfig } from "@/config/homepageConfig";

// Homepage Components
import {
  AnnouncementTicker,
  HeroCarousel,
  CategoryShortcuts,
  FeaturedBlocks,
  ProductCarouselSection,
  SpotlightSection,
  PromotionalBanners,
  Newsletter,
  StoreSwitchBanner
} from "@/components/homepage";

const LifestyleStore = () => {
  const navigate = useNavigate();
  const { data: lifestyleProducts = [] } = useProducts('lifestyle', true);
  const { cartItems, addToCart } = useCart();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  
  const { isConnected, lastUpdate } = useRealtimeSync({ storeType: 'lifestyle' });
  const config = lifestyleHomepageConfig;

  const handleAddToCart = (productId: string) => addToCart({ productId });
  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setQuickViewOpen(true);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Promotional banners
  const promoBanners = [
    {
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop",
      title: "Summer Fashion Sale",
      subtitle: "Up to 50% off on latest trends",
      link: "/category/fashion"
    },
    {
      image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=400&fit=crop",
      title: "Home Makeover",
      subtitle: "Transform your living space",
      link: "/category/home"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      {/* Store Switch Banner */}
      <StoreSwitchBanner currentStore="lifestyle" />
      
      {/* Announcement Ticker */}
      <AnnouncementTicker tickers={config.tickers} />

      <Header 
        cartCount={cartCount} 
        onCartClick={() => navigate('/cart')} 
        storeType="lifestyle"
        syncStatus={{ isConnected, lastUpdate }}
      />
      
      <main className="flex-grow space-y-4">
        {/* Hero Carousel */}
        <section className="container mx-auto px-4 py-4">
          <HeroCarousel slides={config.hero} />
        </section>

        {/* Store Info Banner */}
        <section className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20">
          <div className="container mx-auto px-4 py-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="text-primary">Prime</span> Lifestyle Universe
            </h1>
            <p className="text-lg text-muted-foreground">
              Fashion, Beauty, Toys, Home Décor & More
            </p>
          </div>
        </section>

        {/* Category Shortcuts */}
        <CategoryShortcuts categories={config.categories} title="Shop by Category" />

        {/* Flash Deals Carousel */}
        {config.productCarousels.filter(c => c.type === 'flash-sale').map(carousel => (
          <ProductCarouselSection
            key={carousel.id}
            config={carousel}
            products={lifestyleProducts.filter(p => p.is_flash_sale)}
            onAddToCart={handleAddToCart}
            onQuickView={handleQuickView}
          />
        ))}

        {/* Featured Blocks */}
        <FeaturedBlocks blocks={config.featuredBlocks} />

        {/* Trending Carousel */}
        {config.productCarousels.filter(c => c.type === 'trending').map(carousel => (
          <ProductCarouselSection
            key={carousel.id}
            config={carousel}
            products={lifestyleProducts}
            onAddToCart={handleAddToCart}
            onQuickView={handleQuickView}
          />
        ))}

        {/* Promotional Banners */}
        <PromotionalBanners banners={promoBanners} />

        {/* Spotlight Section */}
        <SpotlightSection spotlight={config.spotlight} />

        {/* AI Recommendations */}
        {config.showRecommendations && (
          <AIRecommendations 
            products={lifestyleProducts}
            onAddToCart={handleAddToCart}
            title="Personalized Picks for Your Lifestyle"
          />
        )}

        {/* Recently Viewed */}
        {config.showRecentlyViewed && (
          <RecentlyViewed onAddToCart={handleAddToCart} />
        )}

        {/* Social Proof */}
        {config.showSocialProof && <SocialProof />}

        {/* Newsletter */}
        {config.showNewsletter && <Newsletter />}
      </main>

      <Footer />
      <PrimeBot storeType="lifestyle" />
      <AIChatbot products={lifestyleProducts} />
      <BackToTop />
      
      <QuickViewModal
        product={quickViewProduct}
        open={quickViewOpen}
        onOpenChange={setQuickViewOpen}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};

export default LifestyleStore;
