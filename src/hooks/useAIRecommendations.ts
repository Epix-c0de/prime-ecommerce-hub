import { useState, useEffect } from 'react';
import { useConfig } from '@/contexts/ConfigContext';
import { Product } from '@/hooks/useProducts';

interface RecommendationResult {
  recommendations: Product[];
  isLoading: boolean;
  error: string | null;
}

export const useAIRecommendations = (
  products: Product[],
  currentProduct?: Product,
  userPreferences?: string[]
): RecommendationResult => {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { features } = useConfig();

  useEffect(() => {
    if (!features.aiRecommendations || products.length === 0) {
      return;
    }

    const generateRecommendations = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Simple AI-powered recommendation logic
        let filtered = [...products];

        if (currentProduct) {
          // Filter by same category
          filtered = filtered.filter(
            (p) => p.id !== currentProduct.id && p.category_id === currentProduct.category_id
          );

          // If not enough, get products in similar price range
          if (filtered.length < 4) {
            const priceRange = currentProduct.price * 0.3;
            const similarPriced = products.filter(
              (p) =>
                p.id !== currentProduct.id &&
                Math.abs(p.price - currentProduct.price) <= priceRange
            );
            filtered = [...new Set([...filtered, ...similarPriced])];
          }
        }

        // Apply user preferences if available
        if (userPreferences && userPreferences.length > 0) {
          filtered = filtered.filter((p) =>
            userPreferences.some((pref) =>
              p.name.toLowerCase().includes(pref.toLowerCase()) ||
              p.description?.toLowerCase().includes(pref.toLowerCase())
            )
          );
        }

        // Sort by popularity (using stock as proxy) and price
        filtered.sort((a, b) => {
          const scoreA = (a as any).stock || 0;
          const scoreB = (b as any).stock || 0;
          return scoreB - scoreA;
        });

        // Take top recommendations
        const topRecommendations = filtered.slice(0, 6);
        setRecommendations(topRecommendations);
      } catch (err) {
        console.error('Error generating recommendations:', err);
        setError('Failed to generate recommendations');
        setRecommendations([]);
      } finally {
        setIsLoading(false);
      }
    };

    generateRecommendations();
  }, [products, currentProduct, userPreferences, features.aiRecommendations]);

  return { recommendations, isLoading, error };
};
