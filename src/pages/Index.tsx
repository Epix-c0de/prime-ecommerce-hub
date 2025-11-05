import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "@/components/Header";
import HeroSlider from "@/components/HeroSlider";
import CategoryGrid from "@/components/CategoryGrid";
import FlashSales from "@/components/FlashSales";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { PrimeBot } from "@/components/PrimeBot";
import { QuickViewModal } from "@/components/QuickViewModal";
import { RecentlyViewed } from "@/components/RecentlyViewed";
import { BackToTop } from "@/components/BackToTop";
import { SocialProof } from "@/components/SocialProof";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { useProducts, useFlashSaleProducts } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { Product } from "@/hooks/useProducts";
import { useRealtimeSync } from "@/hooks/useRealtimeSync";

const Index = () => {
  const navigate = useNavigate();
  const { data: flashSaleProducts = [] } = useFlashSaleProducts('tech');
  const { data: popularProducts = [] } = useProducts('tech', true);
  const { cartItems, addToCart } = useCart();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  
  // Real-time sync with Admin Dashboard (now using Supabase realtime)
  const { isConnected, lastUpdate } = useRealtimeSync({
    storeType: 'tech'
  });

  const handleAddToCart = (productId: string) => {
    addToCart({ productId });
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setQuickViewOpen(true);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Visit Lifestyle Store - Top Banner */}
      <div className="bg-secondary text-white py-2 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm">Looking for Lifestyle Products?</span>
            <span className="hidden md:inline text-xs opacity-90">Fashion, beauty, toys, home décor & more!</span>
          </div>
          <Button
            onClick={() => navigate("/lifestyle")}
            variant="outline"
            size="sm"
            className="bg-white text-secondary hover:bg-white/90 border-0"
          >
            Visit Lifestyle Store
            <ArrowRight className="ml-2 h-3 w-3" />
          </Button>
        </div>
      </div>
      
      <Header 
        cartCount={cartCount} 
        onCartClick={handleCartClick} 
        storeType="tech"
        syncStatus={{ isConnected, lastUpdate }}
      />
      
      <main className="flex-grow">
        {/* Hero slider */}
        <section className="bg-card">
          <div className="container mx-auto px-4 py-4">
            <HeroSlider />
          </div>
        </section>

        {/* Categories */}
        <section className="bg-card mt-4">
          <div className="container mx-auto px-4 py-6">
            <h2 className="text-xl md:text-2xl font-bold mb-4">Shop Our Categories</h2>
            <CategoryGrid />
          </div>
        </section>

        {/* Flash sales */}
        <section className="bg-card mt-4">
          <div className="container mx-auto px-4 py-6">
            <FlashSales products={flashSaleProducts} onAddToCart={handleAddToCart} />
          </div>
        </section>

        {/* Promotional banners */}
        <section className="bg-card mt-4">
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a href="#" className="block rounded-lg overflow-hidden group">
                <div className="relative h-40 md:h-48">
                  <img
                    src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=400&fit=crop"
                    alt="Computing Sale"
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col justify-center px-6">
                    <h3 className="text-white text-lg md:text-xl font-bold mb-2">Laptop Upgrade Sale</h3>
                    <p className="text-white text-sm mb-3">Save up to 30% on selected models</p>
                    <span className="bg-card text-primary px-3 py-1 rounded-md inline-block w-max text-sm font-medium">
                      Shop Now
                    </span>
                  </div>
                </div>
              </a>
              <a href="#" className="block rounded-lg overflow-hidden group">
                <div className="relative h-40 md:h-48">
                  <img
                    src="https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&h=400&fit=crop"
                    alt="Wearables"
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col justify-center px-6">
                    <h3 className="text-white text-lg md:text-xl font-bold mb-2">Smart Wearables</h3>
                    <p className="text-white text-sm mb-3">Latest fitness trackers and smartwatches</p>
                    <span className="bg-card text-primary px-3 py-1 rounded-md inline-block w-max text-sm font-medium">
                      Explore
                    </span>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* Popular products */}
        <section className="bg-card mt-4">
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl md:text-2xl font-bold">Popular Products</h2>
              <a href="#" className="text-primary hover:underline text-sm font-medium hidden md:flex items-center gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {popularProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onQuickView={handleQuickView}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Recently Viewed */}
        <RecentlyViewed onAddToCart={handleAddToCart} />

        {/* Social Proof */}
        <SocialProof />

        {/* Newsletter */}
        <section className="bg-muted mt-4">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-xl md:text-2xl font-bold mb-2">Subscribe to Our Newsletter</h2>
              <p className="text-muted-foreground mb-4">Get updates on new products, special offers and sales</p>
              <form className="flex flex-col md:flex-row gap-2">
                <Input
                  type="email"
                  placeholder="Your email address"
                  className="flex-grow"
                />
                <Button type="submit" className="bg-primary hover:bg-primary-hover">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <PrimeBot storeType="tech" />
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
