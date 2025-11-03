import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { X, ShoppingCart, Star, CheckCircle2, XCircle } from 'lucide-react';
import { Product } from '@/hooks/useProducts';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface ComparisonModalProps {
  products: Product[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRemove: (productId: string) => void;
  onClear: () => void;
  onAddToCart: (productId: string) => void;
}

export function ComparisonModal({ 
  products, 
  open, 
  onOpenChange,
  onRemove,
  onClear,
  onAddToCart
}: ComparisonModalProps) {
  const navigate = useNavigate();

  if (products.length === 0) return null;

  const allSpecKeys = Array.from(
    new Set(
      products
        .flatMap(p => Object.keys(p.specifications || {}))
    )
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-background">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Compare Products ({products.length})</DialogTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onClear}>
                Clear All
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="sticky left-0 bg-background p-4 text-left font-semibold border-b w-48">
                  Feature
                </th>
                {products.map((product) => (
                  <th key={product.id} className="p-4 border-b min-w-[250px]">
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={() => onRemove(product.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-32 object-contain mb-2"
                      />
                      <h3 
                        className="font-medium text-sm mb-2 line-clamp-2 cursor-pointer hover:text-primary"
                        onClick={() => {
                          navigate(`/product/${product.slug}`);
                          onOpenChange(false);
                        }}
                      >
                        {product.name}
                      </h3>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Price */}
              <tr>
                <td className="sticky left-0 bg-background p-4 font-medium border-b">
                  Price
                </td>
                {products.map((product) => (
                  <td key={product.id} className="p-4 border-b text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xl font-bold text-primary">
                        KSh {product.price.toLocaleString()}
                      </span>
                      {product.original_price && (
                        <>
                          <span className="text-sm text-muted-foreground line-through">
                            KSh {product.original_price.toLocaleString()}
                          </span>
                          <Badge variant="destructive" className="text-xs">
                            Save {Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                          </Badge>
                        </>
                      )}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Rating */}
              <tr>
                <td className="sticky left-0 bg-background p-4 font-medium border-b">
                  Rating
                </td>
                {products.map((product) => (
                  <td key={product.id} className="p-4 border-b text-center">
                    <div className="flex items-center justify-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating || 0)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-sm">
                        {(product.rating || 0).toFixed(1)}
                      </span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Brand */}
              <tr>
                <td className="sticky left-0 bg-background p-4 font-medium border-b">
                  Brand
                </td>
                {products.map((product) => (
                  <td key={product.id} className="p-4 border-b text-center">
                    {product.brand || 'N/A'}
                  </td>
                ))}
              </tr>

              {/* Stock */}
              <tr>
                <td className="sticky left-0 bg-background p-4 font-medium border-b">
                  Availability
                </td>
                {products.map((product) => (
                  <td key={product.id} className="p-4 border-b text-center">
                    {product.stock > 0 ? (
                      <div className="flex items-center justify-center gap-1 text-green-600">
                        <CheckCircle2 className="w-4 h-4" />
                        In Stock ({product.stock})
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-1 text-red-600">
                        <XCircle className="w-4 h-4" />
                        Out of Stock
                      </div>
                    )}
                  </td>
                ))}
              </tr>

              {/* Specifications */}
              {allSpecKeys.map((key) => (
                <tr key={key}>
                  <td className="sticky left-0 bg-background p-4 font-medium border-b capitalize">
                    {key.replace(/_/g, ' ')}
                  </td>
                  {products.map((product) => (
                    <td key={product.id} className="p-4 border-b text-center">
                      {product.specifications?.[key] || 'N/A'}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Add to Cart */}
              <tr>
                <td className="sticky left-0 bg-background p-4 font-medium">
                  Action
                </td>
                {products.map((product) => (
                  <td key={product.id} className="p-4 text-center">
                    <Button
                      onClick={() => {
                        onAddToCart(product.id);
                        toast.success('Added to cart!');
                      }}
                      disabled={product.stock === 0}
                      className="w-full"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
