import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface CMSPage {
  id: string;
  store_id: string | null;
  title: string;
  slug: string;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string[] | null;
  og_image: string | null;
  content: any[];
  is_published: boolean;
  is_homepage: boolean;
  template: string;
  custom_css: string | null;
  custom_js: string | null;
  created_by: string;
  updated_by: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export function useCMSPages(storeId?: string) {
  return useQuery({
    queryKey: ['cms-pages', storeId],
    queryFn: async () => {
      let query = supabase.from('cms_pages').select('*');
      
      if (storeId) {
        query = query.eq('store_id', storeId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data as CMSPage[];
    },
  });
}

export function useCMSPage(slug: string, storeId?: string) {
  return useQuery({
    queryKey: ['cms-page', slug, storeId],
    queryFn: async () => {
      let query = supabase
        .from('cms_pages')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true);

      if (storeId) {
        query = query.eq('store_id', storeId);
      }

      const { data, error } = await query.single();

      if (error) throw error;
      return data as CMSPage;
    },
  });
}

export function useCreateCMSPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (pageData: Partial<CMSPage>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('cms_pages')
        .insert([{
          store_id: pageData.store_id,
          title: pageData.title || '',
          slug: pageData.slug || '',
          meta_title: pageData.meta_title,
          meta_description: pageData.meta_description,
          meta_keywords: pageData.meta_keywords,
          og_image: pageData.og_image,
          content: pageData.content || [],
          is_published: pageData.is_published ?? false,
          is_homepage: pageData.is_homepage ?? false,
          template: pageData.template || 'default',
          custom_css: pageData.custom_css,
          custom_js: pageData.custom_js,
          created_by: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-pages'] });
      toast({
        title: "Page created",
        description: "Your new page has been created.",
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

export function useUpdateCMSPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<CMSPage> }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('cms_pages')
        .update({ ...updates, updated_by: user.id })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-pages'] });
      toast({
        title: "Page updated",
        description: "Changes have been saved.",
      });
    },
  });
}

export function useDeleteCMSPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (pageId: string) => {
      const { error } = await supabase
        .from('cms_pages')
        .delete()
        .eq('id', pageId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-pages'] });
      toast({
        title: "Page deleted",
        description: "The page has been removed.",
      });
    },
  });
}

export function usePublishPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (pageId: string) => {
      const { data, error } = await supabase
        .from('cms_pages')
        .update({ is_published: true, published_at: new Date().toISOString() })
        .eq('id', pageId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-pages'] });
      toast({
        title: "Page published",
        description: "Your page is now live.",
      });
    },
  });
}