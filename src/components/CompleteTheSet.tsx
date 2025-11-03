import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ShoppingCart, Plus } from 'lucide-react';
import { Product } from '@/hooks/useProducts';
import { useState } from 'react';
import { toast } from 'sonner';

interface CompleteTheSetProps {
  mainProduct: Product;
  bundleProducts: Product[];
  onAddToCart: (productId: string) => void;
}

export function CompleteTheSet({ mainProduct, bundleProducts, onAddToCart }: CompleteTheSetProps) {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([mainProduct.id]);

  if (bundleProducts.length === 0) return null;

  const toggleProduct = (productId: string) => {
    if (productId === mainProduct.id) return; // Can't deselect main product
    
    setSelectedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const calculateTotal = () => {
    const allProducts = [mainProduct, ...bundleProducts];
    return selectedProducts.reduce((sum, id) => {
      const product = allProducts.find(p => p.id === id);
      return sum + (product?.price || 0);
    }, 0);
  };

  const calculateSavings = () => {
    const allProducts = [mainProduct, ...bundleProducts];
    const originalTotal = selectedProducts.reduce((sum, id) => {
      const product = allProducts.find(p => p.id === id);
      return sum + (product?.original_price || product?.price || 0);
    }, 0);
    return originalTotal - calculateTotal();
  };

  const handleAddBundle = () => {
    selectedProducts.forEach(id => {
      if (id !== mainProduct.id) { // Don't add main product again
        onAddToCart(id);
      }
    });
    toast.success(`Added ${selectedProducts.length - 1} items to cart!`);
  };

  const savings = calculateSavings();
  const discountPercent = savings > 0 
    ? Math.round((savings / (calculateTotal() + savings)) * 100)
    : 0;

  return (
    <Card className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-2 border-primary/20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold">Complete the Set</h3>
          <p className="text-sm text-muted-foreground">
            Bundle these items together and save!
          </p>
        </div>
        {savings > 0 && (
          <Badge className="bg-destructive text-destructive-foreground text-lg px-3 py-1">
            Save {discountPercent}%
          </Badge>
        )}
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        {/* Main Product */}
        <Card 
          className="p-3 bg-background border-2 border-primary cursor-default"
        >
          <div className="relative">
            <img 
              src={mainProduct.images[0]} 
              alt={mainProduct.name}
              className="w-full h-32 object-contain mb-2"
            />
            <Badge className="absolute top-0 right-0 bg-primary">
              Main Item
            </Badge>
          </div>
          <h4 className="text-sm font-medium line-clamp-2 mb-2">
            {mainProduct.name}
          </h4>
          <p className="text-lg font-bold text-primary">
            KSh {mainProduct.price.toLocaleString()}
          </p>
        </Card>

        {/* Bundle Products */}
        {bundleProducts.slice(0, 3).map((product) => (
          <Card 
            key={product.id}
            onClick={() => toggleProduct(product.id)}
            className={`p-3 cursor-pointer transition-all hover:shadow-md ${
              selectedProducts.includes(product.id)
                ? 'bg-primary/10 border-2 border-primary'
                : 'bg-background'
            }`}
          >
            <div className="relative">
              <img 
                src={product.images[0]} 
                alt={product.name}
                className="w-full h-32 object-contain mb-2"
              />
              <Button
                size="icon"
                variant={selectedProducts.includes(product.id) ? "default" : "outline"}
                className="absolute top-0 right-0 h-6 w-6"
              >
                {selectedProducts.includes(product.id) ? (
                  <span className="text-xs">✓</span>
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </Button>
            </div>
            <h4 className="text-sm font-medium line-clamp-2 mb-2">
              {product.name}
            </h4>
            <div className="flex items-baseline gap-1">
              <p className="text-sm font-bold">
                KSh {product.price.toLocaleString()}
              </p>
              {product.original_price && (
                <p className="text-xs text-muted-foreground line-through">
                  KSh {product.original_price.toLocaleString()}
                </p>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Bundle Summary */}
      <div className="flex items-center justify-between p-4 bg-background rounded-lg">
        <div>
          <p className="text-sm text-muted-foreground">
            {selectedProducts.length} items selected
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary">
              KSh {calculateTotal().toLocaleString()}
            </span>
            {savings > 0 && (
              <span className="text-sm text-muted-foreground line-through">
                KSh {(calculateTotal() + savings).toLocaleString()}
              </span>
            )}
          </div>
        </div>
        <Button
          onClick={handleAddBundle}
          disabled={selectedProducts.length === 1}
          size="lg"
          className="bg-primary hover:bg-primary/90"
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Add Bundle to Cart
        </Button>
      </div>
    </Card>
  );
}
