-- Create gift registries table
CREATE TABLE public.gift_registries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_date DATE,
  description TEXT,
  is_public BOOLEAN DEFAULT true,
  share_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create registry items table
CREATE TABLE public.registry_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  registry_id UUID NOT NULL REFERENCES public.gift_registries(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity_requested INTEGER NOT NULL DEFAULT 1,
  quantity_purchased INTEGER NOT NULL DEFAULT 0,
  priority TEXT DEFAULT 'medium',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(registry_id, product_id)
);

-- Add 3D model support to products
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS model_url TEXT,
ADD COLUMN IF NOT EXISTS ar_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS personalization_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS personalization_options JSONB DEFAULT '[]'::jsonb;

-- Enable RLS
ALTER TABLE public.gift_registries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registry_items ENABLE ROW LEVEL SECURITY;

-- Policies for gift registries
CREATE POLICY "Users can view public registries"
ON public.gift_registries FOR SELECT
USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can create their own registries"
ON public.gift_registries FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own registries"
ON public.gift_registries FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own registries"
ON public.gift_registries FOR DELETE
USING (auth.uid() = user_id);

-- Policies for registry items
CREATE POLICY "Users can view items from accessible registries"
ON public.registry_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.gift_registries
    WHERE id = registry_items.registry_id
    AND (is_public = true OR user_id = auth.uid())
  )
);

CREATE POLICY "Users can manage items in their own registries"
ON public.registry_items FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.gift_registries
    WHERE id = registry_items.registry_id
    AND user_id = auth.uid()
  )
);

-- Function to generate unique share codes
CREATE OR REPLACE FUNCTION generate_share_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    code := upper(substring(md5(random()::text) from 1 for 8));
    SELECT EXISTS(SELECT 1 FROM public.gift_registries WHERE share_code = code) INTO exists;
    EXIT WHEN NOT exists;
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate share codes
CREATE OR REPLACE FUNCTION set_share_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.share_code IS NULL OR NEW.share_code = '' THEN
    NEW.share_code := generate_share_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_registry_share_code
BEFORE INSERT ON public.gift_registries
FOR EACH ROW
EXECUTE FUNCTION set_share_code();

-- Trigger for updated_at
CREATE TRIGGER update_gift_registries_updated_at
BEFORE UPDATE ON public.gift_registries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();