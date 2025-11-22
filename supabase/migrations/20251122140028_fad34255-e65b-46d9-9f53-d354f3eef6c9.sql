-- Multi-Store Management System
CREATE TABLE public.stores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  store_type TEXT NOT NULL CHECK (store_type IN ('tech', 'lifestyle', 'custom')),
  domain TEXT UNIQUE,
  logo_url TEXT,
  favicon_url TEXT,
  is_active BOOLEAN DEFAULT true,
  theme_config JSONB DEFAULT '{}',
  seo_config JSONB DEFAULT '{}',
  social_links JSONB DEFAULT '{}',
  contact_info JSONB DEFAULT '{}',
  owner_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

-- Store owners can manage their stores
CREATE POLICY "Store owners can manage their stores"
ON public.stores
FOR ALL
USING (auth.uid() = owner_id);

-- Public can view active stores
CREATE POLICY "Public can view active stores"
ON public.stores
FOR SELECT
USING (is_active = true);

-- Product Variants System
CREATE TABLE public.variant_options (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL, -- e.g., "Size", "Color", "Material"
  values TEXT[] NOT NULL, -- e.g., ["Small", "Medium", "Large"]
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.variant_options ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view variant options"
ON public.variant_options
FOR SELECT
USING (true);

CREATE TABLE public.product_variants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  sku TEXT UNIQUE,
  name TEXT NOT NULL, -- e.g., "Small / Red"
  options JSONB NOT NULL, -- e.g., {"Size": "Small", "Color": "Red"}
  price_adjustment NUMERIC DEFAULT 0, -- Price difference from base product
  stock INTEGER DEFAULT 0,
  images TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active variants"
ON public.product_variants
FOR SELECT
USING (is_active = true);

-- CMS Page Builder System
CREATE TABLE public.cms_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT[],
  og_image TEXT,
  content JSONB NOT NULL DEFAULT '[]', -- Array of page blocks/components
  is_published BOOLEAN DEFAULT false,
  is_homepage BOOLEAN DEFAULT false,
  template TEXT DEFAULT 'default',
  custom_css TEXT,
  custom_js TEXT,
  created_by UUID NOT NULL,
  updated_by UUID,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(store_id, slug)
);

ALTER TABLE public.cms_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published pages"
ON public.cms_pages
FOR SELECT
USING (is_published = true);

CREATE POLICY "Store owners can manage pages"
ON public.cms_pages
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.stores
    WHERE stores.id = cms_pages.store_id
    AND stores.owner_id = auth.uid()
  )
);

-- Page Builder Component Library
CREATE TABLE public.cms_components (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'hero', 'gallery', 'text', 'products', 'form', etc.
  description TEXT,
  icon TEXT,
  default_props JSONB DEFAULT '{}',
  schema JSONB NOT NULL, -- JSON schema for component props
  preview_image TEXT,
  is_system BOOLEAN DEFAULT false, -- System components can't be deleted
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.cms_components ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view components"
ON public.cms_components
FOR SELECT
USING (true);

-- Bulk Operations Log
CREATE TABLE public.bulk_operations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
  operation_type TEXT NOT NULL, -- 'import', 'export', 'bulk_edit', 'bulk_delete'
  entity_type TEXT NOT NULL, -- 'products', 'variants', 'categories'
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  total_items INTEGER,
  processed_items INTEGER DEFAULT 0,
  failed_items INTEGER DEFAULT 0,
  error_log JSONB DEFAULT '[]',
  result_data JSONB,
  file_url TEXT,
  performed_by UUID NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.bulk_operations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their bulk operations"
ON public.bulk_operations
FOR SELECT
USING (auth.uid() = performed_by);

CREATE POLICY "Users can create bulk operations"
ON public.bulk_operations
FOR INSERT
WITH CHECK (auth.uid() = performed_by);

-- Add store_id to existing products table (migration approach)
ALTER TABLE public.products ADD COLUMN store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE;
ALTER TABLE public.products ADD COLUMN has_variants BOOLEAN DEFAULT false;
ALTER TABLE public.products ADD COLUMN variant_options JSONB DEFAULT '[]';

-- Create indexes for performance
CREATE INDEX idx_stores_owner ON public.stores(owner_id);
CREATE INDEX idx_stores_slug ON public.stores(slug);
CREATE INDEX idx_product_variants_product ON public.product_variants(product_id);
CREATE INDEX idx_cms_pages_store ON public.cms_pages(store_id);
CREATE INDEX idx_cms_pages_slug ON public.cms_pages(slug);
CREATE INDEX idx_bulk_operations_store ON public.bulk_operations(store_id);

-- Update timestamp trigger function (if not exists)
CREATE TRIGGER update_stores_updated_at
BEFORE UPDATE ON public.stores
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_variant_options_updated_at
BEFORE UPDATE ON public.variant_options
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_product_variants_updated_at
BEFORE UPDATE ON public.product_variants
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cms_pages_updated_at
BEFORE UPDATE ON public.cms_pages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cms_components_updated_at
BEFORE UPDATE ON public.cms_components
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();