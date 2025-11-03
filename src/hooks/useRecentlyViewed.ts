import { useEffect, useState } from 'react';
import { Product } from './useProducts';

const STORAGE_KEY = 'prime_recently_viewed';
const MAX_ITEMS = 12;

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  useEffect(() => {
    loadRecentlyViewed();
  }, []);

  const loadRecentlyViewed = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setRecentlyViewed(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading recently viewed:', error);
    }
  };

  const addToRecentlyViewed = (product: Product) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      let items: Product[] = stored ? JSON.parse(stored) : [];
      
      // Remove if already exists
      items = items.filter(item => item.id !== product.id);
      
      // Add to beginning
      items.unshift(product);
      
      // Keep only MAX_ITEMS
      items = items.slice(0, MAX_ITEMS);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      setRecentlyViewed(items);
    } catch (error) {
      console.error('Error saving recently viewed:', error);
    }
  };

  const clearRecentlyViewed = () => {
    localStorage.removeItem(STORAGE_KEY);
    setRecentlyViewed([]);
  };

  return {
    recentlyViewed,
    addToRecentlyViewed,
    clearRecentlyViewed,
  };
}
