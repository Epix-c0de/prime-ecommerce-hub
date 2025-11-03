import { useState, useEffect } from 'react';
import { Product } from './useProducts';

const STORAGE_KEY = 'prime_comparison';
const MAX_ITEMS = 3;

export function useComparison() {
  const [compareProducts, setCompareProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadComparison();
  }, []);

  const loadComparison = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCompareProducts(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading comparison:', error);
    }
  };

  const addToComparison = (product: Product) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      let items: Product[] = stored ? JSON.parse(stored) : [];
      
      // Check if already in comparison
      if (items.some(item => item.id === product.id)) {
        return false; // Already in comparison
      }
      
      // Check if maximum reached
      if (items.length >= MAX_ITEMS) {
        return false; // Maximum reached
      }
      
      items.push(product);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      setCompareProducts(items);
      return true;
    } catch (error) {
      console.error('Error adding to comparison:', error);
      return false;
    }
  };

  const removeFromComparison = (productId: string) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      let items: Product[] = stored ? JSON.parse(stored) : [];
      items = items.filter(item => item.id !== productId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      setCompareProducts(items);
    } catch (error) {
      console.error('Error removing from comparison:', error);
    }
  };

  const clearComparison = () => {
    localStorage.removeItem(STORAGE_KEY);
    setCompareProducts([]);
  };

  const isInComparison = (productId: string) => {
    return compareProducts.some(item => item.id === productId);
  };

  return {
    compareProducts,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
    canAddMore: compareProducts.length < MAX_ITEMS,
    compareCount: compareProducts.length,
  };
}
