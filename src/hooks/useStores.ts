import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Store {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  store_type: 'tech' | 'lifestyle' | 'custom';
  domain: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  is_active: boolean;
  theme_config: any;
  seo_config: any;
  social_links: any;
  contact_info: any;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export function useStores() {
  return useQuery({
    queryKey: ['stores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Store[];
    },
  });
}

export function useStore(storeId?: string) {
  return useQuery({
    queryKey: ['store', storeId],
    queryFn: async () => {
      if (!storeId) return null;
      
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('id', storeId)
        .single();

      if (error) throw error;
      return data as Store;
    },
    enabled: !!storeId,
  });
}

export function useCreateStore() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (storeData: Partial<Store>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('stores')
        .insert([{ 
          name: storeData.name || '',
          slug: storeData.slug || '',
          description: storeData.description,
          store_type: storeData.store_type || 'tech',
          domain: storeData.domain,
          logo_url: storeData.logo_url,
          favicon_url: storeData.favicon_url,
          is_active: storeData.is_active ?? true,
          theme_config: storeData.theme_config || {},
          seo_config: storeData.seo_config || {},
          social_links: storeData.social_links || {},
          contact_info: storeData.contact_info || {},
          owner_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      toast({
        title: "Store created",
        description: "Your new store has been created successfully.",
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

export function useUpdateStore() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Store> }) => {
      const { data, error } = await supabase
        .from('stores')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      toast({
        title: "Store updated",
        description: "Store settings have been saved.",
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

export function useDeleteStore() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (storeId: string) => {
      const { error } = await supabase
        .from('stores')
        .delete()
        .eq('id', storeId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      toast({
        title: "Store deleted",
        description: "The store has been removed.",
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