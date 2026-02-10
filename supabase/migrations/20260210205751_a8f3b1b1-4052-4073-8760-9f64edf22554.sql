-- Drop existing restrictive policies on themes if any
DO $$
BEGIN
  -- Try dropping policies that might exist
  DROP POLICY IF EXISTS "Themes are viewable by everyone" ON public.themes;
  DROP POLICY IF EXISTS "Admins can insert themes" ON public.themes;
  DROP POLICY IF EXISTS "Admins can update themes" ON public.themes;
  DROP POLICY IF EXISTS "Admins can delete themes" ON public.themes;
  DROP POLICY IF EXISTS "Anyone can read themes" ON public.themes;
END $$;

-- Allow anyone to read themes (stores need to fetch their theme)
CREATE POLICY "Anyone can read themes"
ON public.themes FOR SELECT
USING (true);

-- Allow authenticated users with admin/super_admin role to manage themes
CREATE POLICY "Admins can insert themes"
ON public.themes FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "Admins can update themes"
ON public.themes FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "Admins can delete themes"
ON public.themes FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role IN ('admin', 'super_admin')
  )
);