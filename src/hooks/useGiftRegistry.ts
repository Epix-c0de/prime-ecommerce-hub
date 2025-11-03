import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface GiftRegistry {
  id: string;
  user_id: string;
  name: string;
  event_type: string;
  event_date?: string;
  description?: string;
  is_public: boolean;
  share_code: string;
  created_at: string;
  updated_at: string;
}

export interface RegistryItem {
  id: string;
  registry_id: string;
  product_id: string;
  quantity_requested: number;
  quantity_purchased: number;
  priority: string;
  notes?: string;
  products?: {
    id: string;
    name: string;
    price: number;
    images: string[];
  };
}

export function useGiftRegistry() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: registries = [], isLoading } = useQuery({
    queryKey: ['gift-registries', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('gift_registries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as GiftRegistry[];
    },
    enabled: !!user,
  });

  const createRegistry = useMutation({
    mutationFn: async (registry: Partial<GiftRegistry>) => {
      if (!user) throw new Error("Please login to create a registry");
      
      const { data, error } = await supabase
        .from('gift_registries')
        .insert([{ 
          name: registry.name || '',
          event_type: registry.event_type || '',
          event_date: registry.event_date,
          description: registry.description,
          is_public: registry.is_public ?? true,
          user_id: user.id,
          share_code: ''
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gift-registries'] });
      toast.success("Registry created successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create registry");
    },
  });

  const updateRegistry = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<GiftRegistry> }) => {
      const { data, error } = await supabase
        .from('gift_registries')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gift-registries'] });
      toast.success("Registry updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update registry");
    },
  });

  const deleteRegistry = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('gift_registries')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gift-registries'] });
      toast.success("Registry deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete registry");
    },
  });

  return {
    registries,
    isLoading,
    createRegistry: createRegistry.mutate,
    updateRegistry: updateRegistry.mutate,
    deleteRegistry: deleteRegistry.mutate,
  };
}

export function useRegistryItems(registryId: string) {
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['registry-items', registryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('registry_items')
        .select(`
          *,
          products (
            id,
            name,
            price,
            images
          )
        `)
        .eq('registry_id', registryId);
      
      if (error) throw error;
      return data as RegistryItem[];
    },
    enabled: !!registryId,
  });

  const addItem = useMutation({
    mutationFn: async (item: Partial<RegistryItem>) => {
      const { data, error } = await supabase
        .from('registry_items')
        .insert([{
          registry_id: item.registry_id || '',
          product_id: item.product_id || '',
          quantity_requested: item.quantity_requested || 1,
          quantity_purchased: item.quantity_purchased || 0,
          priority: item.priority || 'medium',
          notes: item.notes
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registry-items', registryId] });
      toast.success("Item added to registry!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to add item to registry");
    },
  });

  const updateItem = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<RegistryItem> }) => {
      const { data, error } = await supabase
        .from('registry_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registry-items', registryId] });
      toast.success("Item updated!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update item");
    },
  });

  const removeItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('registry_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registry-items', registryId] });
      toast.success("Item removed from registry");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to remove item");
    },
  });

  return {
    items,
    isLoading,
    addItem: addItem.mutate,
    updateItem: updateItem.mutate,
    removeItem: removeItem.mutate,
  };
}

export function usePublicRegistry(shareCode: string) {
  return useQuery({
    queryKey: ['public-registry', shareCode],
    queryFn: async () => {
      const { data: registry, error: registryError } = await supabase
        .from('gift_registries')
        .select('*')
        .eq('share_code', shareCode)
        .single();
      
      if (registryError) throw registryError;

      const { data: items, error: itemsError } = await supabase
        .from('registry_items')
        .select(`
          *,
          products (
            id,
            name,
            price,
            images,
            slug
          )
        `)
        .eq('registry_id', registry.id);
      
      if (itemsError) throw itemsError;

      return { registry, items };
    },
    enabled: !!shareCode,
  });
}