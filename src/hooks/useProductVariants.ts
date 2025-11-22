import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string | null;
  name: string;
  options: Record<string, string>;
  price_adjustment: number;
  stock: number;
  images: string[] | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface VariantOption {
  id: string;
  name: string;
  values: string[];
  store_id: string | null;
  created_at: string;
  updated_at: string;
}

export function useProductVariants(productId?: string) {
  return useQuery({
    queryKey: ['product-variants', productId],
    queryFn: async () => {
      if (!productId) return [];
      
      const { data, error } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', productId)
        .order('name');

      if (error) throw error;
      return data as ProductVariant[];
    },
    enabled: !!productId,
  });
}

export function useVariantOptions(storeId?: string) {
  return useQuery({
    queryKey: ['variant-options', storeId],
    queryFn: async () => {
      let query = supabase.from('variant_options').select('*');
      
      if (storeId) {
        query = query.eq('store_id', storeId);
      }

      const { data, error } = await query.order('name');

      if (error) throw error;
      return data as VariantOption[];
    },
  });
}

export function useCreateVariant() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (variantData: Partial<ProductVariant>) => {
      const { data, error } = await supabase
        .from('product_variants')
        .insert([{
          product_id: variantData.product_id || '',
          name: variantData.name || '',
          sku: variantData.sku,
          options: variantData.options || {},
          price_adjustment: variantData.price_adjustment || 0,
          stock: variantData.stock || 0,
          images: variantData.images,
          is_active: variantData.is_active ?? true,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['product-variants', variables.product_id] });
      toast({
        title: "Variant created",
        description: "Product variant has been added.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateVariant() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ProductVariant> }) => {
      const { data, error } = await supabase
        .from('product_variants')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-variants'] });
      toast({
        title: "Variant updated",
        description: "Changes have been saved.",
      });
    },
  });
}

export function useDeleteVariant() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (variantId: string) => {
      const { error } = await supabase
        .from('product_variants')
        .delete()
        .eq('id', variantId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-variants'] });
      toast({
        title: "Variant deleted",
        description: "The variant has been removed.",
      });
    },
  });
}