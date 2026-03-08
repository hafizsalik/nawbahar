
-- Update functions to use hardcoded project URL (pg_net runs async, can't use env vars easily)
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

    PERFORM net.http_post(
      url := 'https://rubspbitfypqaeuxhvco.supabase.co/functions/v1/send-push-notification',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1YnNwYml0ZnlwcWFldXhodmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5ODc5MjAsImV4cCI6MjA4MjU2MzkyMH0.lngmDeQqDHFROJ8_9Yre6yjw1axMzE5EonlGIcT3-fc"}'::jsonb,
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
      url := 'https://rubspbitfypqaeuxhvco.supabase.co/functions/v1/send-push-notification',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1YnNwYml0ZnlwcWFldXhodmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5ODc5MjAsImV4cCI6MjA4MjU2MzkyMH0.lngmDeQqDHFROJ8_9Yre6yjw1axMzE5EonlGIcT3-fc"}'::jsonb,
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
    url := 'https://rubspbitfypqaeuxhvco.supabase.co/functions/v1/send-push-notification',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1YnNwYml0ZnlwcWFldXhodmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5ODc5MjAsImV4cCI6MjA4MjU2MzkyMH0.lngmDeQqDHFROJ8_9Yre6yjw1axMzE5EonlGIcT3-fc"}'::jsonb,
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
