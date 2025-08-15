-- Create increment view count function
CREATE OR REPLACE FUNCTION increment_view_count(video_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE videos 
  SET view_count = view_count + 1 
  WHERE id = video_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;