-- Create storage bucket for article cover images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('article-covers', 'article-covers', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for article cover uploads
CREATE POLICY "Users can upload article covers"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'article-covers' AND auth.uid() IS NOT NULL);

CREATE POLICY "Article covers are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'article-covers');

CREATE POLICY "Users can delete their own covers"
ON storage.objects FOR DELETE
USING (bucket_id = 'article-covers' AND auth.uid()::text = (storage.foldername(name))[1]);