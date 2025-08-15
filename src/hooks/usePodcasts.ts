import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface PodcastData {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  content_type: 'audio_podcast' | 'video_podcast';
  content_url: string;
  thumbnail_url?: string;
  duration_seconds?: number;
  episode_number?: number;
  season_number?: number;
  like_count: number;
  play_count: number;
  subscriber_count: number;
  monthly_fee?: number;
  created_at: string;
  // Profile data
  username?: string;
  display_name?: string;
  avatar_url?: string;
  is_verified?: boolean;
  // User object for profile integration
  user?: {
    username: string;
    avatar_url?: string;
  };
  // User interaction state
  is_subscribed?: boolean;
}

export const usePodcasts = (userId?: string) => {
  const [podcasts, setPodcasts] = useState<PodcastData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchPodcasts();
  }, [user, userId]);

  const fetchPodcasts = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('podcasts')
        .select(`
          id,
          user_id,
          title,
          description,
          content_type,
          content_url,
          thumbnail_url,
          duration_seconds,
          episode_number,
          season_number,
          like_count,
          play_count,
          subscriber_count,
          monthly_fee,
          created_at
        `)
        .in('content_type', ['audio_podcast', 'video_podcast'])
        .order('created_at', { ascending: false })
        .limit(20);

      // Filter by user if specified
      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Mock profiles for demo
      const mockProfiles: { [key: string]: any } = {
        'demo-user-1': { username: 'sarah_dance', display_name: 'Sarah Johnson', avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=150&h=150&fit=crop&crop=face', is_verified: true }
      };

      // Get user interactions if logged in
      const podcastsWithInteractions = await Promise.all(
        (data || []).map(async (podcast) => {
          let isSubscribed = false;

          if (user) {
            // Check if user is subscribed to this podcast
            const { data: subscriptionData } = await supabase
              .from('subscriptions')
              .select('id')
              .eq('subscriber_id', user.id)
              .eq('podcast_id', podcast.id)
              .eq('status', 'active')
              .single();

            isSubscribed = !!subscriptionData;
          }

          const profile = mockProfiles[podcast.user_id] || { username: 'unknown', display_name: 'Unknown User', avatar_url: '', is_verified: false };

          return {
            ...podcast,
            username: profile.username,
            display_name: profile.display_name,
            avatar_url: profile.avatar_url,
            is_verified: profile.is_verified,
            is_subscribed: isSubscribed,
          } as PodcastData;
        })
      );

      setPodcasts(podcastsWithInteractions);
    } catch (error) {
      console.error('Error fetching podcasts:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSubscription = async (podcastId: string, creatorId: string, monthlyFee: number = 0) => {
    if (!user) return;

    try {
      const podcast = podcasts.find(p => p.id === podcastId);
      if (!podcast) return;

      if (podcast.is_subscribed) {
        // Unsubscribe
        await supabase
          .from('subscriptions')
          .delete()
          .eq('subscriber_id', user.id)
          .eq('podcast_id', podcastId);

        setPodcasts(prev => prev.map(p => 
          p.id === podcastId 
            ? { ...p, is_subscribed: false, subscriber_count: p.subscriber_count - 1 }
            : p
        ));
      } else {
        // Subscribe
        await supabase
          .from('subscriptions')
          .insert({
            subscriber_id: user.id,
            podcast_id: podcastId,
            creator_id: creatorId,
            monthly_fee: monthlyFee,
            status: 'active'
          });

        setPodcasts(prev => prev.map(p => 
          p.id === podcastId 
            ? { ...p, is_subscribed: true, subscriber_count: p.subscriber_count + 1 }
            : p
        ));
      }
    } catch (error) {
      console.error('Error toggling subscription:', error);
    }
  };

  const incrementPlay = async (podcastId: string) => {
    try {
      // Record play in podcast_plays table
      await supabase
        .from('podcast_plays')
        .insert({
          podcast_id: podcastId,
          user_id: user?.id,
          progress_seconds: 0
        });

      // Update play count
      await supabase
        .from('podcasts')
        .update({ play_count: podcasts.find(p => p.id === podcastId)?.play_count + 1 || 1 })
        .eq('id', podcastId);
      
      setPodcasts(prev => prev.map(p => 
        p.id === podcastId 
          ? { ...p, play_count: p.play_count + 1 }
          : p
      ));
    } catch (error) {
      console.error('Error incrementing play:', error);
    }
  };

  return {
    podcasts,
    loading,
    toggleSubscription,
    incrementPlay,
    refreshPodcasts: fetchPodcasts
  };
};