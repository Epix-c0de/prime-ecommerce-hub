import { useState, useEffect, useRef } from "react";
import { ProductCarouselConfig } from "@/config/homepageConfig";
import { Product } from "@/hooks/useProducts";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface ProductCarouselSectionProps {
  config: ProductCarouselConfig;
  products: Product[];
  onAddToCart: (productId: string) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCarouselSection = ({
  config,
  products,
  onAddToCart,
  onQuickView
}: ProductCarouselSectionProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });

  // Flash sale countdown
  useEffect(() => {
    if (!config.showTimer) return;
    
    const endTime = new Date();
    endTime.setHours(23, 59, 59, 999);
    
    const updateCountdown = () => {
      const now = new Date();
      const diff = endTime.getTime() - now.getTime();
      
      if (diff <= 0) {
        setCountdown({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      setCountdown({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [config.showTimer]);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [products]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
    setTimeout(checkScroll, 300);
  };

  if (!products.length) return null;

  return (
    <section className="bg-card py-6">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl md:text-2xl font-bold">{config.title}</h2>
            
            {/* Countdown Timer */}
            {config.showTimer && (
              <div className="hidden md:flex items-center gap-2 bg-destructive/10 text-destructive px-3 py-1.5 rounded-full">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Ends in {String(countdown.hours).padStart(2, '0')}:
                  {String(countdown.minutes).padStart(2, '0')}:
                  {String(countdown.seconds).padStart(2, '0')}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Link 
              to={`/products?type=${config.type}`}
              className="hidden md:flex items-center gap-1 text-primary hover:underline text-sm font-medium"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
            
            {/* Scroll Buttons */}
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className="h-8 w-8"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className="h-8 w-8"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Timer */}
        {config.showTimer && (
          <div className="md:hidden flex items-center gap-2 bg-destructive/10 text-destructive px-3 py-1.5 rounded-full mb-3 w-fit">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">
              Ends in {String(countdown.hours).padStart(2, '0')}:
              {String(countdown.minutes).padStart(2, '0')}:
              {String(countdown.seconds).padStart(2, '0')}
            </span>
          </div>
        )}

        {/* Products Carousel */}
        <div 
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth -mx-4 px-4"
        >
          {products.slice(0, config.limit).map((product) => (
            <div 
              key={product.id} 
              className="flex-shrink-0 w-44 md:w-52"
            >
              <ProductCard
                product={product}
                onAddToCart={onAddToCart}
                onQuickView={onQuickView}
              />
            </div>
          ))}
        </div>

        {/* Mobile View All */}
        <div className="md:hidden mt-4 text-center">
          <Link 
            to={`/products?type=${config.type}`}
            className="inline-flex items-center gap-1 text-primary text-sm font-medium"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
