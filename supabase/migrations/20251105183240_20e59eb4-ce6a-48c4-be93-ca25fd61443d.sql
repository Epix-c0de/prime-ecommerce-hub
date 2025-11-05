-- Create tables for Admin Dashboard sync system

-- Themes table
CREATE TABLE IF NOT EXISTS public.themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_type TEXT NOT NULL CHECK (store_type IN ('tech', 'lifestyle', 'both')),
  primary_color TEXT NOT NULL,
  secondary_color TEXT,
  background_color TEXT,
  font_family TEXT,
  header_layout TEXT,
  footer_layout TEXT,
  animation_style TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Texts table for dynamic content
CREATE TABLE IF NOT EXISTS public.texts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_type TEXT NOT NULL CHECK (store_type IN ('tech', 'lifestyle', 'both')),
  section TEXT NOT NULL, -- 'hero', 'banner', 'footer', etc.
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(store_type, section, key)
);

-- Layout configuration
CREATE TABLE IF NOT EXISTS public.layout_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_type TEXT NOT NULL CHECK (store_type IN ('tech', 'lifestyle', 'both')),
  homepage_order JSONB, -- array of section names
  banner_settings JSONB,
  carousel_settings JSONB,
  grid_layout TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Promotions and campaigns
CREATE TABLE IF NOT EXISTS public.promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_type TEXT NOT NULL CHECK (store_type IN ('tech', 'lifestyle', 'both')),
  title TEXT NOT NULL,
  description TEXT,
  discount_percentage INTEGER,
  banner_image_url TEXT,
  is_festive BOOLEAN DEFAULT false,
  festive_theme TEXT, -- 'christmas', 'eid', 'valentine', etc.
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- SEO metadata
CREATE TABLE IF NOT EXISTS public.seo_meta (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_type TEXT NOT NULL CHECK (store_type IN ('tech', 'lifestyle', 'both')),
  page TEXT NOT NULL, -- 'home', 'products', 'category', etc.
  title TEXT NOT NULL,
  description TEXT,
  keywords TEXT[],
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(store_type, page)
);

-- AI settings
CREATE TABLE IF NOT EXISTS public.ai_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  primary_ai_active BOOLEAN DEFAULT true,
  backup_ai_active BOOLEAN DEFAULT false,
  primary_ai_model TEXT DEFAULT 'google/gemini-2.5-flash',
  backup_ai_model TEXT DEFAULT 'google/gemini-2.5-flash-lite',
  credits_threshold INTEGER DEFAULT 100,
  personalization_enabled BOOLEAN DEFAULT true,
  recommendations_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Magic Mode settings
CREATE TABLE IF NOT EXISTS public.magic_mode (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_type TEXT NOT NULL CHECK (store_type IN ('tech', 'lifestyle', 'both')),
  mode TEXT NOT NULL CHECK (mode IN ('holiday', 'sale', 'minimal', 'vibrant', 'normal')),
  is_active BOOLEAN DEFAULT false,
  auto_deactivate_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.texts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.layout_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_meta ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.magic_mode ENABLE ROW LEVEL SECURITY;

-- Public read access for all stores (admin write access would be added later)
CREATE POLICY "Public can read themes"
  ON public.themes FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Public can read texts"
  ON public.texts FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Public can read layout_config"
  ON public.layout_config FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Public can read active promotions"
  ON public.promotions FOR SELECT
  TO public
  USING (
    is_active = true 
    AND (start_date IS NULL OR start_date <= now())
    AND (end_date IS NULL OR end_date >= now())
  );

CREATE POLICY "Public can read seo_meta"
  ON public.seo_meta FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Public can read ai_settings"
  ON public.ai_settings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can read magic_mode"
  ON public.magic_mode FOR SELECT
  TO public
  USING (is_active = true);

-- Admin policies (for users with admin role)
CREATE POLICY "Admins can manage themes"
  ON public.themes FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage texts"
  ON public.texts FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage layout_config"
  ON public.layout_config FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage promotions"
  ON public.promotions FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage seo_meta"
  ON public.seo_meta FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage ai_settings"
  ON public.ai_settings FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage magic_mode"
  ON public.magic_mode FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_themes_updated_at BEFORE UPDATE ON public.themes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_texts_updated_at BEFORE UPDATE ON public.texts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_layout_config_updated_at BEFORE UPDATE ON public.layout_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_promotions_updated_at BEFORE UPDATE ON public.promotions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_seo_meta_updated_at BEFORE UPDATE ON public.seo_meta
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_settings_updated_at BEFORE UPDATE ON public.ai_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_magic_mode_updated_at BEFORE UPDATE ON public.magic_mode
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.themes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.texts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.layout_config;
ALTER PUBLICATION supabase_realtime ADD TABLE public.promotions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.seo_meta;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.magic_mode;

-- Insert default data
INSERT INTO public.ai_settings (primary_ai_active, backup_ai_active, primary_ai_model, backup_ai_model)
VALUES (true, false, 'google/gemini-2.5-flash', 'google/gemini-2.5-flash-lite')
ON CONFLICT DO NOTHING;