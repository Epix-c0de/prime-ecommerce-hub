-- Create storage bucket for marketing banners and media
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('banners', 'banners', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('products', 'products', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'model/gltf-binary', 'model/gltf+json'])
ON CONFLICT (id) DO NOTHING;

-- RLS policies for banners bucket
CREATE POLICY "Public can view banners"
ON storage.objects FOR SELECT
USING (bucket_id = 'banners');

CREATE POLICY "Admins can upload banners"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'banners' AND
  (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'marketing_manager'))
);

CREATE POLICY "Admins can update banners"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'banners' AND
  (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'marketing_manager'))
);

CREATE POLICY "Admins can delete banners"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'banners' AND
  (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'marketing_manager'))
);

-- RLS policies for products bucket
CREATE POLICY "Public can view products media"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');

CREATE POLICY "Admins can upload products media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'products' AND
  (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'inventory_manager'))
);

CREATE POLICY "Admins can update products media"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'products' AND
  (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'inventory_manager'))
);

CREATE POLICY "Admins can delete products media"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'products' AND
  (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'inventory_manager'))
);

-- Create promotions table to store banners data
CREATE TABLE IF NOT EXISTS public.banners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'hero',
  image_url TEXT,
  link_url TEXT,
  title TEXT,
  subtitle TEXT,
  is_active BOOLEAN DEFAULT true,
  store_type TEXT NOT NULL DEFAULT 'tech',
  display_order INTEGER DEFAULT 0,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on banners
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- Public can view active banners
CREATE POLICY "Public can view active banners"
ON public.banners FOR SELECT
USING (is_active = true);

-- Admins can manage banners
CREATE POLICY "Admins can manage banners"
ON public.banners FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'super_admin') OR 
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'marketing_manager')
)
WITH CHECK (
  public.has_role(auth.uid(), 'super_admin') OR 
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'marketing_manager')
);

-- Add updated_at trigger
CREATE TRIGGER update_banners_updated_at
BEFORE UPDATE ON public.banners
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();