import { useAIRecommendations } from '@/hooks/useAIRecommendations';
import ProductCard from '@/components/ProductCard';
import { Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface AIRecommendationsProps {
  products: any[];
  currentProduct?: any;
  userPreferences?: string[];
  title?: string;
  onAddToCart?: (productId: string) => void;
}

export function AIRecommendations({
  products,
  currentProduct,
  userPreferences,
  title = 'Recommended for You',
  onAddToCart,
}: AIRecommendationsProps) {
  const { recommendations, isLoading } = useAIRecommendations(
    products,
    currentProduct,
    userPreferences
  );

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-8">
            <Sparkles className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold">{title}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[400px] rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 mb-8">
          <Sparkles className="h-6 w-6 text-primary animate-pulse" />
          <h2 className="text-3xl font-bold">{title}</h2>
          <span className="text-sm text-muted-foreground ml-2">
            Powered by AI
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recommendations.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={onAddToCart || (() => {})}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
