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
import { useProducts, useFlashSaleProducts } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { Product } from "@/hooks/useProducts";
import { useRealtimeSync } from "@/hooks/useRealtimeSync";
import { techHomepageConfig } from "@/config/homepageConfig";
import { AdOverlayBanners } from "@/components/homepage/AdOverlayBanners";

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

const Index = () => {
  const navigate = useNavigate();
  const { data: flashSaleProducts = [] } = useFlashSaleProducts('tech');
  const { data: popularProducts = [] } = useProducts('tech', true);
  const { cartItems, addToCart } = useCart();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  
  const { isConnected, lastUpdate } = useRealtimeSync({ storeType: 'tech' });
  const config = techHomepageConfig;

  const handleAddToCart = (productId: string) => addToCart({ productId });
  const handleCartClick = () => navigate("/cart");
  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setQuickViewOpen(true);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Promotional banners data
  const promoBanners = [
    {
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=400&fit=crop",
      title: "Laptop Upgrade Sale",
      subtitle: "Save up to 30% on selected models",
      link: "/category/computing"
    },
    {
      image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&h=400&fit=crop",
      title: "Smart Wearables",
      subtitle: "Latest fitness trackers and smartwatches",
      link: "/category/wearables"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      {/* Store Switch Banner */}
      <StoreSwitchBanner currentStore="tech" />
      
      {/* Announcement Ticker */}
      <AnnouncementTicker tickers={config.tickers} />
      
      <Header 
        cartCount={cartCount} 
        onCartClick={handleCartClick} 
        storeType="tech"
        syncStatus={{ isConnected, lastUpdate }}
      />
      
      <main className="flex-grow space-y-4">
        {/* Hero Carousel */}
        <section className="container mx-auto px-4 py-4">
          <HeroCarousel slides={config.hero} />
        </section>

        {/* Category Shortcuts */}
        <CategoryShortcuts categories={config.categories} />

        {/* Flash Deals Carousel */}
        {config.productCarousels.filter(c => c.type === 'flash-sale').map(carousel => (
          <ProductCarouselSection
            key={carousel.id}
            config={carousel}
            products={flashSaleProducts}
            onAddToCart={handleAddToCart}
            onQuickView={handleQuickView}
          />
        ))}

        {/* Featured Blocks */}
        <FeaturedBlocks blocks={config.featuredBlocks} />

        {/* Promotional Banners */}
        <PromotionalBanners banners={promoBanners} />

        {/* Ad Overlay Banners from Marketing Admin */}
        <AdOverlayBanners storeType="tech" />
        {/* Best Sellers & Trending Carousels */}
        {config.productCarousels.filter(c => c.type === 'best-sellers' || c.type === 'trending').map(carousel => (
          <ProductCarouselSection
            key={carousel.id}
            config={carousel}
            products={popularProducts}
            onAddToCart={handleAddToCart}
            onQuickView={handleQuickView}
          />
        ))}

        {/* Spotlight Section */}
        <SpotlightSection spotlight={config.spotlight} />

        {/* AI Recommendations */}
        {config.showRecommendations && (
          <AIRecommendations 
            products={popularProducts}
            onAddToCart={handleAddToCart}
            title="AI Recommendations Just for You"
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
      <PrimeBot storeType="tech" />
      <AIChatbot products={popularProducts} />
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

export default Index;
