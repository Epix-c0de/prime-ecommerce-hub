-- Create site_settings table for dynamic URL management
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_url TEXT NOT NULL DEFAULT 'https://preview--prime-ecommerce-hub.lovable.app',
  admin_url TEXT,
  api_base_url TEXT,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Public can read site settings
CREATE POLICY "Anyone can read site settings"
ON public.site_settings
FOR SELECT
USING (true);

-- Only admins can update site settings
CREATE POLICY "Admins can update site settings"
ON public.site_settings
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role IN ('super_admin', 'admin')
  )
);

-- Only admins can insert site settings
CREATE POLICY "Admins can insert site settings"
ON public.site_settings
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role IN ('super_admin', 'admin')
  )
);

-- Insert default settings
INSERT INTO public.site_settings (site_url, admin_url, api_base_url)
VALUES (
  'https://preview--prime-ecommerce-hub.lovable.app',
  'https://preview--prime-ecommerce-hub.lovable.app/admin',
  'https://preview--prime-ecommerce-hub.lovable.app/api'
);