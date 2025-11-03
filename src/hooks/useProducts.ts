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
}

export function useProducts(storeType?: 'tech' | 'lifestyle', featured?: boolean) {
  return useQuery({
    queryKey: ['products', storeType, featured],
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

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data as Product[];
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
