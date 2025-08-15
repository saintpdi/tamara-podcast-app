
-- Create enum types
CREATE TYPE public.content_type AS ENUM ('video', 'audio_podcast', 'video_podcast');
CREATE TYPE public.privacy_level AS ENUM ('public', 'private', 'followers_only');
CREATE TYPE public.subscription_status AS ENUM ('active', 'cancelled', 'expired');

-- Create profiles table with privacy settings
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  hide_videos_tab BOOLEAN DEFAULT FALSE,
  hide_subscriptions_tab BOOLEAN DEFAULT FALSE,
  profile_privacy privacy_level DEFAULT 'public',
  social_links JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create interest categories
CREATE TABLE public.interest_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user interests
CREATE TABLE public.user_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.interest_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, category_id)
);

-- Create videos table (short-form content)
CREATE TABLE public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration_seconds INTEGER CHECK (duration_seconds <= 60), -- Max 1 minute
  privacy_level privacy_level DEFAULT 'public',
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  hashtags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create podcasts table (long-form content)
CREATE TABLE public.podcasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content_type content_type NOT NULL, -- 'audio_podcast' or 'video_podcast'
  content_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration_seconds INTEGER CHECK (duration_seconds <= 3540), -- Max 59 minutes
  privacy_level privacy_level DEFAULT 'public',
  monthly_fee DECIMAL(10,2) DEFAULT 0,
  subscriber_count INTEGER DEFAULT 0,
  play_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  episode_number INTEGER,
  season_number INTEGER,
  hashtags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscriptions table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  podcast_id UUID REFERENCES public.podcasts(id) ON DELETE CASCADE,
  status subscription_status DEFAULT 'active',
  monthly_fee DECIMAL(10,2) NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(subscriber_id, creator_id, podcast_id)
);

-- Create follows table
CREATE TABLE public.follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Create likes table
CREATE TABLE public.likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE,
  podcast_id UUID REFERENCES public.podcasts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK ((video_id IS NOT NULL AND podcast_id IS NULL) OR (video_id IS NULL AND podcast_id IS NOT NULL))
);

-- Create comments table
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE,
  podcast_id UUID REFERENCES public.podcasts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK ((video_id IS NOT NULL AND podcast_id IS NULL) OR (video_id IS NULL AND podcast_id IS NOT NULL))
);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES
  ('videos', 'videos', true),
  ('podcasts', 'podcasts', true),
  ('avatars', 'avatars', true),
  ('thumbnails', 'thumbnails', true);

-- Insert default interest categories
INSERT INTO public.interest_categories (name, description, icon) VALUES
  ('Technology', 'Tech talks, gadgets, and innovation', 'laptop'),
  ('Lifestyle', 'Fashion, beauty, and daily life', 'heart'),
  ('Business', 'Entrepreneurship and career advice', 'briefcase'),
  ('Health & Wellness', 'Fitness, nutrition, and mental health', 'activity'),
  ('Entertainment', 'Movies, music, and pop culture', 'film'),
  ('Education', 'Learning and personal development', 'book'),
  ('Travel', 'Adventures and travel tips', 'map'),
  ('Food & Cooking', 'Recipes and culinary experiences', 'chef-hat'),
  ('Art & Creativity', 'Design, photography, and creative arts', 'palette'),
  ('Sports', 'Athletics and sports commentary', 'trophy');

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.podcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Create security definer functions to avoid RLS recursion
CREATE OR REPLACE FUNCTION public.get_user_privacy_settings(user_uuid UUID)
RETURNS TABLE(hide_videos_tab BOOLEAN, hide_subscriptions_tab BOOLEAN, profile_privacy privacy_level)
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT p.hide_videos_tab, p.hide_subscriptions_tab, p.profile_privacy
  FROM public.profiles p
  WHERE p.id = user_uuid;
$$;

CREATE OR REPLACE FUNCTION public.is_following(follower_uuid UUID, following_uuid UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.follows
    WHERE follower_id = follower_uuid AND following_id = following_uuid
  );
$$;

-- RLS Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (profile_privacy = 'public');

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can view profiles of people they follow" ON public.profiles
  FOR SELECT USING (
    profile_privacy = 'followers_only' AND 
    public.is_following(auth.uid(), id)
  );

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for user_interests
CREATE POLICY "Users can manage their own interests" ON public.user_interests
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for videos
CREATE POLICY "Public videos are viewable by everyone" ON public.videos
  FOR SELECT USING (privacy_level = 'public');

CREATE POLICY "Users can view their own videos" ON public.videos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view videos from people they follow" ON public.videos
  FOR SELECT USING (
    privacy_level = 'followers_only' AND 
    public.is_following(auth.uid(), user_id)
  );

CREATE POLICY "Users can manage their own videos" ON public.videos
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for podcasts
CREATE POLICY "Public podcasts are viewable by everyone" ON public.podcasts
  FOR SELECT USING (privacy_level = 'public');

CREATE POLICY "Users can view their own podcasts" ON public.podcasts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view podcasts from people they follow" ON public.podcasts
  FOR SELECT USING (
    privacy_level = 'followers_only' AND 
    public.is_following(auth.uid(), user_id)
  );

CREATE POLICY "Subscribers can view private paid podcasts" ON public.podcasts
  FOR SELECT USING (
    privacy_level = 'private' AND 
    EXISTS (
      SELECT 1 FROM public.subscriptions s 
      WHERE s.subscriber_id = auth.uid() 
      AND s.podcast_id = id 
      AND s.status = 'active'
    )
  );

CREATE POLICY "Users can manage their own podcasts" ON public.podcasts
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for subscriptions
CREATE POLICY "Users can view their own subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid() = subscriber_id);

CREATE POLICY "Creators can view their subscribers" ON public.subscriptions
  FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Users can manage their own subscriptions" ON public.subscriptions
  FOR ALL USING (auth.uid() = subscriber_id);

-- RLS Policies for follows
CREATE POLICY "Users can view all follows" ON public.follows
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can manage their own follows" ON public.follows
  FOR ALL USING (auth.uid() = follower_id);

-- RLS Policies for likes
CREATE POLICY "Users can view all likes" ON public.likes
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can manage their own likes" ON public.likes
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for comments
CREATE POLICY "Users can view all comments on public content" ON public.comments
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can manage their own comments" ON public.comments
  FOR ALL USING (auth.uid() = user_id);

-- Storage policies
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatars" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatars" ON storage.objects
  FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatars" ON storage.objects
  FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Videos are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'videos');

CREATE POLICY "Users can upload their own videos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can manage their own videos" ON storage.objects
  FOR ALL USING (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Podcasts are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'podcasts');

CREATE POLICY "Users can upload their own podcasts" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'podcasts' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can manage their own podcasts" ON storage.objects
  FOR ALL USING (bucket_id = 'podcasts' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Thumbnails are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'thumbnails');

CREATE POLICY "Users can upload their own thumbnails" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'thumbnails' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can manage their own thumbnails" ON storage.objects
  FOR ALL USING (bucket_id = 'thumbnails' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Trigger to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', 'New User')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Functions to update counters
CREATE OR REPLACE FUNCTION public.update_video_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.video_id IS NOT NULL THEN
      UPDATE public.videos 
      SET like_count = like_count + 1 
      WHERE id = NEW.video_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.video_id IS NOT NULL THEN
      UPDATE public.videos 
      SET like_count = GREATEST(like_count - 1, 0) 
      WHERE id = OLD.video_id;
    END IF;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER video_likes_counter
  AFTER INSERT OR DELETE ON public.likes
  FOR EACH ROW EXECUTE FUNCTION public.update_video_stats();

CREATE OR REPLACE FUNCTION public.update_podcast_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.podcast_id IS NOT NULL THEN
      UPDATE public.podcasts 
      SET like_count = like_count + 1 
      WHERE id = NEW.podcast_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.podcast_id IS NOT NULL THEN
      UPDATE public.podcasts 
      SET like_count = GREATEST(like_count - 1, 0) 
      WHERE id = OLD.podcast_id;
    END IF;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER podcast_likes_counter
  AFTER INSERT OR DELETE ON public.likes
  FOR EACH ROW EXECUTE FUNCTION public.update_podcast_stats();
