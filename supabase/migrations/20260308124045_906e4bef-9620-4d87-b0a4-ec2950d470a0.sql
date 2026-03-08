
-- Recreate like notification trigger to also send push
CREATE OR REPLACE FUNCTION public.handle_like_notification()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  target_user_id uuid;
BEGIN
  SELECT a.author_id INTO target_user_id
  FROM public.articles a
  WHERE a.id = NEW.article_id
    AND a.author_id != NEW.user_id;

  IF target_user_id IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, actor_id, type, article_id)
    VALUES (target_user_id, NEW.user_id, 'like', NEW.article_id);

    -- Send push notification via edge function
    PERFORM net.http_post(
      url := current_setting('app.settings.supabase_url', true) || '/functions/v1/send-push-notification',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
      ),
      body := jsonb_build_object(
        'user_id', target_user_id,
        'title', 'پسند جدید',
        'body', 'کسی مقاله شما را پسندید',
        'url', '/article/' || NEW.article_id
      )
    );
  END IF;
  RETURN NEW;
END;
$function$;

-- Recreate comment notification trigger to also send push
CREATE OR REPLACE FUNCTION public.handle_comment_notification()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  target_user_id uuid;
BEGIN
  SELECT a.author_id INTO target_user_id
  FROM public.articles a
  WHERE a.id = NEW.article_id
    AND a.author_id != NEW.user_id;

  IF target_user_id IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, actor_id, type, article_id)
    VALUES (target_user_id, NEW.user_id, 'comment', NEW.article_id);

    PERFORM net.http_post(
      url := current_setting('app.settings.supabase_url', true) || '/functions/v1/send-push-notification',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
      ),
      body := jsonb_build_object(
        'user_id', target_user_id,
        'title', 'نظر جدید',
        'body', 'کسی روی مقاله شما نظر داد',
        'url', '/article/' || NEW.article_id
      )
    );
  END IF;
  RETURN NEW;
END;
$function$;

-- Recreate follow notification trigger to also send push
CREATE OR REPLACE FUNCTION public.handle_follow_notification()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.notifications (user_id, actor_id, type)
  VALUES (NEW.following_id, NEW.follower_id, 'follow');

  PERFORM net.http_post(
    url := current_setting('app.settings.supabase_url', true) || '/functions/v1/send-push-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
    ),
    body := jsonb_build_object(
      'user_id', NEW.following_id,
      'title', 'دنبال‌کننده جدید',
      'body', 'کسی شما را دنبال کرد',
      'url', '/profile/' || NEW.follower_id
    )
  );
  RETURN NEW;
END;
$function$;
