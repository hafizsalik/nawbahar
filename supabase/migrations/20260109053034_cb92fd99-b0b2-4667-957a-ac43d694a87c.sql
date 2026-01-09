-- Add social profile fields for WhatsApp and Facebook
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS whatsapp_number TEXT,
ADD COLUMN IF NOT EXISTS facebook_url TEXT;

-- Add followers/following count functions for better performance
CREATE OR REPLACE FUNCTION public.get_follower_count(target_user_id UUID)
RETURNS INTEGER
LANGUAGE SQL
STABLE
AS $$
  SELECT COUNT(*)::INTEGER FROM public.follows WHERE following_id = target_user_id;
$$;

CREATE OR REPLACE FUNCTION public.get_following_count(target_user_id UUID)
RETURNS INTEGER
LANGUAGE SQL
STABLE
AS $$
  SELECT COUNT(*)::INTEGER FROM public.follows WHERE follower_id = target_user_id;
$$;