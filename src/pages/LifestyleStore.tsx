import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import HeroSlider from "@/components/HeroSlider";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/ProductCard";
import { toast } from "sonner";
import { ArrowRight, Shirt, Gift, Sparkles, Home as HomeIcon, UtensilsCrossed, Bike } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";

const categories = [
  { name: "Fashion & Clothing", icon: Shirt, color: "text-pink-500" },
  { name: "Toys & Games", icon: Gift, color: "text-purple-500" },
  { name: "Beauty & Personal Care", icon: Sparkles, color: "text-yellow-500" },
  { name: "Home & Living", icon: HomeIcon, color: "text-blue-500" },
  { name: "Kitchen & Dining", icon: UtensilsCrossed, color: "text-green-500" },
  { name: "Sports & Outdoors", icon: Bike, color: "text-orange-500" },
];

const LifestyleStore = () => {
  const navigate = useNavigate();
  const { data: lifestyleProducts = [] } = useProducts('lifestyle', true);
  const { cartItems, addToCart } = useCart();

  const handleAddToCart = (productId: string) => {
    addToCart({ productId });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Store Switch Banner */}
      <div className="bg-secondary text-white text-center text-xs md:text-sm py-2 px-4">
        <p>
          Looking for electronics? 
          <button 
            onClick={() => navigate("/")}
            className="ml-2 underline font-semibold hover:text-primary transition"
          >
            Visit Tech Store →
          </button>
        </p>
      </div>

      <Header cartCount={cartItems.length} onCartClick={() => navigate("/cart")} />
      
      <main className="flex-grow">
        {/* Hero slider */}
        <section className="bg-card">
          <div className="container mx-auto px-4 py-4">
            <HeroSlider />
          </div>
        </section>

        {/* Store Info Banner */}
        <section className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 mt-4">
          <div className="container mx-auto px-4 py-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="text-primary">Prime</span> Lifestyle Universe
            </h1>
            <p className="text-lg text-muted-foreground">
              Fashion, Beauty, Toys, Home Décor & More
            </p>
          </div>
        </section>

        {/* Categories */}
        <section className="bg-card mt-4">
          <div className="container mx-auto px-4 py-6">
            <h2 className="text-xl md:text-2xl font-bold mb-4">Shop by Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <a
                    key={category.name}
                    href="#"
                    className="bg-card rounded-lg p-6 flex flex-col items-center justify-center hover:shadow-md transition-all hover:-translate-y-1 group border"
                  >
                    <Icon className={`h-12 w-12 mb-3 ${category.color} group-hover:scale-110 transition-transform`} />
                    <span className="text-sm font-medium text-center">{category.name}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="bg-card mt-4">
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl md:text-2xl font-bold">Trending Lifestyle Products</h2>
              <a href="#" className="text-primary hover:underline text-sm font-medium hidden md:flex items-center gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {lifestyleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Promotional banner */}
        <section className="bg-card mt-4">
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a href="#" className="block rounded-lg overflow-hidden group">
                <div className="relative h-40 md:h-48">
                  <img
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop"
                    alt="Fashion Sale"
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col justify-center px-6">
                    <h3 className="text-white text-lg md:text-xl font-bold mb-2">Summer Fashion Sale</h3>
                    <p className="text-white text-sm mb-3">Up to 50% off on latest trends</p>
                    <span className="bg-card text-primary px-3 py-1 rounded-md inline-block w-max text-sm font-medium">
                      Shop Now
                    </span>
                  </div>
                </div>
              </a>
              <a href="#" className="block rounded-lg overflow-hidden group">
                <div className="relative h-40 md:h-48">
                  <img
                    src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=400&fit=crop"
                    alt="Home Decor"
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col justify-center px-6">
                    <h3 className="text-white text-lg md:text-xl font-bold mb-2">Home Makeover</h3>
                    <p className="text-white text-sm mb-3">Transform your living space</p>
                    <span className="bg-card text-primary px-3 py-1 rounded-md inline-block w-max text-sm font-medium">
                      Explore
                    </span>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="bg-muted mt-4">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-xl md:text-2xl font-bold mb-2">Subscribe to Our Newsletter</h2>
              <p className="text-muted-foreground mb-4">Get updates on new arrivals and exclusive offers</p>
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

        {/* Switch Store CTA */}
        <section className="bg-card mt-4 border-t border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold">Need Electronics or Appliances?</h2>
                <p className="text-muted-foreground mt-2">
                  Visit our Tech store for smartphones, TVs, laptops, and home appliances!
                </p>
              </div>
              <Button
                onClick={() => navigate("/")}
                className="bg-secondary hover:bg-secondary-hover text-white px-6 py-3 flex items-center gap-2"
              >
                Visit Tech Store
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LifestyleStore;
