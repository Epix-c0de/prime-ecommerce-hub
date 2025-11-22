-- Add username field to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;

-- Create index on username for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- Create function to get user by username or email
CREATE OR REPLACE FUNCTION public.get_user_by_username_or_email(identifier TEXT)
RETURNS TABLE (
  user_id UUID,
  email TEXT,
  username TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id as user_id,
    au.email::TEXT,
    p.username
  FROM public.profiles p
  JOIN auth.users au ON au.id = p.id
  WHERE p.username = identifier OR au.email = identifier
  LIMIT 1;
END;
$$;