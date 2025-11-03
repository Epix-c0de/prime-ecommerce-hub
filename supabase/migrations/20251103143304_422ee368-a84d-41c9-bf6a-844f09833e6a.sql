-- Fix RLS policy on user_roles to prevent privilege escalation
-- Only admins can insert new roles, preventing users from self-promoting

CREATE POLICY "Only admins can insert roles"
ON public.user_roles
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Update existing policy description for clarity
COMMENT ON POLICY "Admins can manage all roles" ON public.user_roles IS 
'Allows admins to update and delete roles. Combined with insert policy, ensures complete admin control over role management.';