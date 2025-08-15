import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserVideo, UserPodcast } from '@/types/profile';

export const useUserProfile = (userId?: string) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userVideos, setUserVideos] = useState<UserVideo[]>([]);
  const [userPodcasts, setUserPodcasts] = useState<UserPodcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
      fetchUserContent();
      checkFollowStatus();
      fetchFollowCounts();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const fetchUserProfile = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchUserContent = async () => {
    if (!userId) return;

    try {
      // Fetch user videos
      const { data: videos, error: videosError } = await supabase
        .from('videos')
        .select('id, title, thumbnail_url, like_count, view_count, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (videosError) throw videosError;
      setUserVideos(videos || []);

      // Fetch user podcasts
      const { data: podcasts, error: podcastsError } = await supabase
        .from('podcasts')
        .select('id, title, description, content_type, thumbnail_url, like_count, play_count, subscriber_count, monthly_fee, created_at')
        .eq('user_id', userId)
        .in('content_type', ['audio_podcast', 'video_podcast'])
        .order('created_at', { ascending: false });

      if (podcastsError) throw podcastsError;
      setUserPodcasts((podcasts || []) as UserPodcast[]);
    } catch (error) {
      console.error('Error fetching user content:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkFollowStatus = async () => {
    if (!userId) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setIsFollowing(!!data);
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };

  const fetchFollowCounts = async () => {
    if (!userId) return;

    try {
      // Get follower count
      const { count: followers, error: followerError } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', userId);

      if (followerError) throw followerError;
      setFollowerCount(followers || 0);

      // Get following count
      const { count: following, error: followingError } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', userId);

      if (followingError) throw followingError;
      setFollowingCount(following || 0);
    } catch (error) {
      console.error('Error fetching follow counts:', error);
    }
  };

  const toggleFollow = async () => {
    if (!userId) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (isFollowing) {
        await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', userId);
        
        setIsFollowing(false);
        setFollowerCount(prev => prev - 1);
      } else {
        await supabase
          .from('follows')
          .insert({
            follower_id: user.id,
            following_id: userId
          });
        
        setIsFollowing(true);
        setFollowerCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  return {
    profile,
    userVideos,
    userPodcasts,
    loading,
    isFollowing,
    followerCount,
    followingCount,
    toggleFollow,
    refreshProfile: fetchUserProfile,
    refreshContent: fetchUserContent
  };
};