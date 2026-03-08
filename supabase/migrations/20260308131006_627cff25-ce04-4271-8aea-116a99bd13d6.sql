-- ========================================
-- SECURITY HARDENING: Comprehensive RLS fixes
-- ========================================

-- 1. PROFILES: Require authentication for SELECT (was public to anonymous users)
DROP POLICY IF EXISTS "Basic profile info is public" ON public.profiles;
CREATE POLICY "Profiles visible to authenticated users"
  ON public.profiles FOR SELECT TO authenticated
  USING (true);

-- 2. FOLLOWS: Restrict to involved parties only (was visible to all auth users)
DROP POLICY IF EXISTS "Follows require authentication to view" ON public.follows;
CREATE POLICY "Users can view own follow relationships"
  ON public.follows FOR SELECT TO authenticated
  USING (auth.uid() = follower_id OR auth.uid() = following_id);

-- 3. LIKES: Restrict to own likes
DROP POLICY IF EXISTS "Likes are viewable by authenticated users" ON public.likes;
CREATE POLICY "Users can view own likes"
  ON public.likes FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- 4. REACTIONS: Keep readable for article context (needed for reaction counts/names on cards)
DROP POLICY IF EXISTS "Reactions viewable by authenticated users" ON public.reactions;
CREATE POLICY "Authenticated users can view reactions"
  ON public.reactions FOR SELECT TO authenticated
  USING (true);

-- 5. COMMENT_LIKES: Restrict to own
DROP POLICY IF EXISTS "Comment likes viewable by authenticated users" ON public.comment_likes;
CREATE POLICY "Users can view own comment likes"
  ON public.comment_likes FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- 6. Fix push notification triggers to use service role key from vault instead of hardcoded anon key
CREATE OR REPLACE FUNCTION public.handle_like_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  target_user_id uuid;
  v_service_key text;
  v_url text;
BEGIN
  SELECT a.author_id INTO target_user_id
  FROM public.articles a
  WHERE a.id = NEW.article_id
    AND a.author_id != NEW.user_id;

  IF target_user_id IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, actor_id, type, article_id)
    VALUES (target_user_id, NEW.user_id, 'like', NEW.article_id);

    SELECT decrypted_secret INTO v_service_key FROM vault.decrypted_secrets WHERE name = 'SUPABASE_SERVICE_ROLE_KEY' LIMIT 1;
    SELECT decrypted_secret INTO v_url FROM vault.decrypted_secrets WHERE name = 'SUPABASE_URL' LIMIT 1;

    IF v_service_key IS NOT NULL AND v_url IS NOT NULL THEN
      PERFORM net.http_post(
        url := v_url || '/functions/v1/send-push-notification',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || v_service_key
        ),
        body := jsonb_build_object(
          'user_id', target_user_id,
          'title', 'پسند جدید',
          'body', 'کسی مقاله شما را پسندید',
          'url', '/article/' || NEW.article_id
        )
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_comment_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  target_user_id uuid;
  v_service_key text;
  v_url text;
BEGIN
  SELECT a.author_id INTO target_user_id
  FROM public.articles a
  WHERE a.id = NEW.article_id
    AND a.author_id != NEW.user_id;

  IF target_user_id IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, actor_id, type, article_id)
    VALUES (target_user_id, NEW.user_id, 'comment', NEW.article_id);

    SELECT decrypted_secret INTO v_service_key FROM vault.decrypted_secrets WHERE name = 'SUPABASE_SERVICE_ROLE_KEY' LIMIT 1;
    SELECT decrypted_secret INTO v_url FROM vault.decrypted_secrets WHERE name = 'SUPABASE_URL' LIMIT 1;

    IF v_service_key IS NOT NULL AND v_url IS NOT NULL THEN
      PERFORM net.http_post(
        url := v_url || '/functions/v1/send-push-notification',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || v_service_key
        ),
        body := jsonb_build_object(
          'user_id', target_user_id,
          'title', 'نظر جدید',
          'body', 'کسی روی مقاله شما نظر داد',
          'url', '/article/' || NEW.article_id
        )
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_follow_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_service_key text;
  v_url text;
BEGIN
  INSERT INTO public.notifications (user_id, actor_id, type)
  VALUES (NEW.following_id, NEW.follower_id, 'follow');

  SELECT decrypted_secret INTO v_service_key FROM vault.decrypted_secrets WHERE name = 'SUPABASE_SERVICE_ROLE_KEY' LIMIT 1;
  SELECT decrypted_secret INTO v_url FROM vault.decrypted_secrets WHERE name = 'SUPABASE_URL' LIMIT 1;

  IF v_service_key IS NOT NULL AND v_url IS NOT NULL THEN
    PERFORM net.http_post(
      url := v_url || '/functions/v1/send-push-notification',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || v_service_key
      ),
      body := jsonb_build_object(
        'user_id', NEW.following_id,
        'title', 'دنبال‌کننده جدید',
        'body', 'کسی شما را دنبال کرد',
        'url', '/profile/' || NEW.follower_id
      )
    );
  END IF;
  RETURN NEW;
END;
$$;