import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface MyPodcastData {
  id: string;
  title: string;
  description?: string;
  content_url: string;
  content_type: 'audio_podcast' | 'video_podcast';
  thumbnail_url?: string;
  monthly_fee: number;
  subscriber_count: number;
  play_count: number;
  like_count: number;
  created_at: string;
  duration_seconds?: number;
  // Additional properties for UI
  type?: string;
  isActive?: boolean;
  subscribers?: number;
  monthlyFee?: number;
  episodes?: number;
}

export const useMyPodcasts = () => {
  const [podcasts, setPodcasts] = useState<MyPodcastData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchMyPodcasts();
    }
  }, [user]);

  const fetchMyPodcasts = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('podcasts')
        .select(`
          id,
          title,
          description,
          content_url,
          content_type,
          thumbnail_url,
          monthly_fee,
          subscriber_count,
          play_count,
          like_count,
          created_at,
          duration_seconds
        `)
        .eq('user_id', user.id)
        .in('content_type', ['audio_podcast', 'video_podcast'])
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map the data to include additional UI properties with proper typing
      const mappedPodcasts: MyPodcastData[] = (data || []).map(podcast => ({
        id: podcast.id,
        title: podcast.title,
        description: podcast.description,
        content_url: podcast.content_url,
        content_type: podcast.content_type as 'audio_podcast' | 'video_podcast',
        thumbnail_url: podcast.thumbnail_url,
        monthly_fee: podcast.monthly_fee,
        subscriber_count: podcast.subscriber_count,
        play_count: podcast.play_count,
        like_count: podcast.like_count,
        created_at: podcast.created_at,
        duration_seconds: podcast.duration_seconds,
        type: podcast.content_type,
        isActive: true,
        subscribers: podcast.subscriber_count,
        monthlyFee: podcast.monthly_fee,
        episodes: 1 // Default to 1 episode per podcast
      }));

      setPodcasts(mappedPodcasts);
    } catch (error) {
      console.error('Error fetching my podcasts:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    podcasts,
    loading,
    refreshPodcasts: fetchMyPodcasts
  };
};