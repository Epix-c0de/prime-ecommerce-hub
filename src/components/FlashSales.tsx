import { useEffect, useState } from "react";
import ProductCard, { Product } from "./ProductCard";
import { ArrowRight } from "lucide-react";

interface FlashSalesProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const FlashSales = ({ products, onAddToCart }: FlashSalesProps) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 12,
    minutes: 43,
    seconds: 21,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
          if (minutes < 0) {
            minutes = 59;
            hours--;
            if (hours < 0) {
              hours = 0;
              minutes = 0;
              seconds = 0;
            }
          }
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl md:text-2xl font-bold">Flash Sales</h2>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">Ends in:</p>
            <div className="flex gap-1">
              <div className="bg-dark text-white w-10 h-10 rounded flex items-center justify-center font-bold">
                {String(timeLeft.hours).padStart(2, "0")}
              </div>
              <div className="text-xl font-bold flex items-center">:</div>
              <div className="bg-dark text-white w-10 h-10 rounded flex items-center justify-center font-bold">
                {String(timeLeft.minutes).padStart(2, "0")}
              </div>
              <div className="text-xl font-bold flex items-center">:</div>
              <div className="bg-dark text-white w-10 h-10 rounded flex items-center justify-center font-bold">
                {String(timeLeft.seconds).padStart(2, "0")}
              </div>
            </div>
          </div>
        </div>
        <a href="#" className="text-primary hover:underline text-sm font-medium flex items-center gap-1">
          See All <ArrowRight className="h-4 w-4" />
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.slice(0, 5).map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
};

export default FlashSales;
