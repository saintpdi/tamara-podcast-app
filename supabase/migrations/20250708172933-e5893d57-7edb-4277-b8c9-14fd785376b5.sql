-- Create increment play count function for podcasts
CREATE OR REPLACE FUNCTION increment_play_count(podcast_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE podcasts 
  SET play_count = play_count + 1 
  WHERE id = podcast_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;