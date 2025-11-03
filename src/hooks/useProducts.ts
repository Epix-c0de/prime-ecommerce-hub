import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  original_price: number | null;
  category_id: string | null;
  brand: string | null;
  sku: string | null;
  stock: number;
  images: string[];
  tags: string[];
  is_featured: boolean;
  is_flash_sale: boolean;
  flash_sale_ends_at: string | null;
  store_type: 'tech' | 'lifestyle';
  specifications: any;
  rating?: number;
  model_url?: string | null;
  ar_enabled?: boolean;
  personalization_enabled?: boolean;
  personalization_options?: any;
}

export interface ProductFilters {
  categoryId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  minRating?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'rating';
}

export function useProducts(
  storeType?: 'tech' | 'lifestyle', 
  featured?: boolean,
  filters?: ProductFilters
) {
  return useQuery({
    queryKey: ['products', storeType, featured, filters],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*')
        .gt('stock', 0);

      if (storeType) {
        query = query.eq('store_type', storeType);
      }

      if (featured !== undefined) {
        query = query.eq('is_featured', featured);
      }

      if (filters?.categoryId) {
        query = query.eq('category_id', filters.categoryId);
      }

      if (filters?.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }

      if (filters?.minPrice !== undefined) {
        query = query.gte('price', filters.minPrice);
      }

      if (filters?.maxPrice !== undefined) {
        query = query.lte('price', filters.maxPrice);
      }

      if (filters?.brand) {
        query = query.eq('brand', filters.brand);
      }

      // Sorting
      if (filters?.sortBy === 'price_asc') {
        query = query.order('price', { ascending: true });
      } else if (filters?.sortBy === 'price_desc') {
        query = query.order('price', { ascending: false });
      } else if (filters?.sortBy === 'rating') {
        query = query.order('rating', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Filter by rating on client side if needed
      let filteredData = data as Product[];
      if (filters?.minRating) {
        filteredData = filteredData.filter(p => (p.rating || 0) >= filters.minRating!);
      }

      return filteredData;
    },
  });
}

export function useBrands(storeType?: 'tech' | 'lifestyle') {
  return useQuery({
    queryKey: ['brands', storeType],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('brand')
        .not('brand', 'is', null);

      if (storeType) {
        query = query.eq('store_type', storeType);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Get unique brands
      const brands = [...new Set(data.map(p => p.brand).filter(Boolean))];
      return brands as string[];
    },
  });
}

export function useFlashSaleProducts(storeType?: 'tech' | 'lifestyle') {
  return useQuery({
    queryKey: ['flash-sale-products', storeType],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*')
        .eq('is_flash_sale', true)
        .gt('stock', 0)
        .gte('flash_sale_ends_at', new Date().toISOString());

      if (storeType) {
        query = query.eq('store_type', storeType);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Product[];
    },
  });
}

export function useProductBySlug(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data as Product;
    },
  });
}

export function useCategories(storeType?: 'tech' | 'lifestyle') {
  return useQuery({
    queryKey: ['categories', storeType],
    queryFn: async () => {
      let query = supabase
        .from('categories')
        .select('*');

      if (storeType) {
        query = query.or(`store_type.eq.${storeType},store_type.eq.both`);
      }

      const { data, error } = await query.order('name');

      if (error) throw error;
      return data;
    },
  });
}
