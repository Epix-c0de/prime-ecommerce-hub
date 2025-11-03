import { ShoppingCart, Star, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/hooks/useProducts";

export type { Product };

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
  onQuickView?: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart, onQuickView }: ProductCardProps) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const discountPercentage = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const rating = product.rating || 4.5;
  const reviews = 0; // We'll add reviews later

  return (
    <Card 
      className="group overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="relative overflow-hidden bg-muted cursor-pointer"
        onClick={() => navigate(`/product/${product.slug}`)}
      >
        <img
          src={product.images[0] || '/placeholder.svg'}
          alt={product.name}
          className="w-full h-48 object-contain p-4 transition-transform group-hover:scale-105"
        />
        {discountPercentage > 0 && (
          <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
            -{discountPercentage}%
          </Badge>
        )}
        {product.stock < 10 && product.stock > 0 && (
          <Badge className="absolute top-2 right-2 bg-warning text-warning-foreground">
            Only {product.stock} left
          </Badge>
        )}
        
        {/* Quick View Button */}
        {onQuickView && isHovered && (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            variant="secondary"
            size="sm"
            className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
          >
            <Eye className="w-4 h-4 mr-2" />
            Quick View
          </Button>
        )}
      </div>
      <div className="p-4">
        <h3 
          className="font-medium text-sm mb-2 line-clamp-2 h-10 cursor-pointer hover:text-primary"
          onClick={() => navigate(`/product/${product.slug}`)}
        >
          {product.name}
        </h3>
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${
                i < Math.floor(rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-gray-200 text-gray-200"
              }`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">({reviews})</span>
        </div>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-xl font-bold text-foreground">
            KSh {product.price.toLocaleString()}
          </span>
          {product.original_price && (
            <span className="text-sm text-muted-foreground line-through">
              KSh {product.original_price.toLocaleString()}
            </span>
          )}
        </div>
        <Button
          onClick={() => onAddToCart(product.id)}
          className="w-full bg-primary hover:bg-primary-hover"
          disabled={product.stock === 0}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
    </Card>
  );
};

export default ProductCard;
