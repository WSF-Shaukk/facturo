-- Create a new storage bucket for invoice logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('invoice-logos', 'invoice-logos', true);

-- Create policy to allow authenticated users to upload logos
CREATE POLICY "Anyone can upload invoice logos"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'invoice-logos');

-- Create policy to allow anyone to view invoice logos
CREATE POLICY "Anyone can view invoice logos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'invoice-logos');

-- Create policy to allow authenticated users to delete their own logos
CREATE POLICY "Users can delete their own invoice logos"
ON storage.objects
FOR DELETE
USING (bucket_id = 'invoice-logos' AND auth.uid() IS NOT NULL); 