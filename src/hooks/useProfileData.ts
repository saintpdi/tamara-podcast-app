
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserVideo, UserPodcast } from '@/types/profile';

export const useProfileData = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userVideos, setUserVideos] = useState<UserVideo[]>([]);
  const [userPodcasts, setUserPodcasts] = useState<UserPodcast[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchUserContent();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchUserContent = async () => {
    if (!user) return;

    try {
      // Fetch user videos
      const { data: videos, error: videosError } = await supabase
        .from('videos')
        .select('id, title, thumbnail_url, like_count, view_count, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (videosError) throw videosError;
      setUserVideos(videos || []);

      // Fetch user podcasts - only audio_podcast and video_podcast types
      const { data: podcasts, error: podcastsError } = await supabase
        .from('podcasts')
        .select('id, title, description, content_type, thumbnail_url, like_count, play_count, subscriber_count, monthly_fee, created_at')
        .eq('user_id', user.id)
        .in('content_type', ['audio_podcast', 'video_podcast'])
        .order('created_at', { ascending: false });

      if (podcastsError) throw podcastsError;
      // Type assertion to tell TypeScript that filtered results only contain expected types
      setUserPodcasts((podcasts || []) as UserPodcast[]);
    } catch (error) {
      console.error('Error fetching user content:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    setProfile,
    userVideos,
    userPodcasts,
    loading,
    user
  };
};
