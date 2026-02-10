
-- Create categories storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('categories', 'categories', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to category images
CREATE POLICY "Public can view category images"
ON storage.objects FOR SELECT
USING (bucket_id = 'categories');

-- Allow authenticated users to upload category images
CREATE POLICY "Authenticated users can upload category images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'categories' AND auth.role() = 'authenticated');

-- Allow authenticated users to update category images
CREATE POLICY "Authenticated users can update category images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'categories' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete category images
CREATE POLICY "Authenticated users can delete category images"
ON storage.objects FOR DELETE
USING (bucket_id = 'categories' AND auth.role() = 'authenticated');
