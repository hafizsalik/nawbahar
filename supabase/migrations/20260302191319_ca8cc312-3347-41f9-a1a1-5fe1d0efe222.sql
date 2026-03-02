
-- Allow system (triggers with SECURITY DEFINER) to insert notifications
CREATE POLICY "System can insert notifications"
  ON public.notifications
  FOR INSERT
  WITH CHECK (true);
