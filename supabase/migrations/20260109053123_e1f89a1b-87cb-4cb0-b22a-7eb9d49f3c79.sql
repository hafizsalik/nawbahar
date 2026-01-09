-- Fix search_path for new functions (security warnings)
DROP FUNCTION IF EXISTS public.get_follower_count(UUID);
DROP FUNCTION IF EXISTS public.get_following_count(UUID);

CREATE OR REPLACE FUNCTION public.get_follower_count(target_user_id UUID)
RETURNS INTEGER
LANGUAGE SQL
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT COUNT(*)::INTEGER FROM public.follows WHERE following_id = target_user_id;
$$;

CREATE OR REPLACE FUNCTION public.get_following_count(target_user_id UUID)
RETURNS INTEGER
LANGUAGE SQL
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT COUNT(*)::INTEGER FROM public.follows WHERE follower_id = target_user_id;
$$;

-- Fix articles RLS policy to allow instant publishing
DROP POLICY IF EXISTS "Users can create articles with pending status" ON public.articles;

CREATE POLICY "Users can create their own articles"
ON public.articles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = author_id);