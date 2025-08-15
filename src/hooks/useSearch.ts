import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface SearchUser {
  id: string;
  username: string;
  display_name?: string;
  avatar_url?: string;
  is_verified?: boolean;
  follower_count?: number;
  is_following?: boolean;
}

export interface SearchVideo {
  id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  view_count: number;
  like_count: number;
  created_at: string;
  user: {
    username: string;
    avatar_url?: string;
  };
}

export interface SearchPodcast {
  id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  play_count: number;
  subscriber_count: number;
  monthly_fee?: number;
  created_at: string;
  user: {
    username: string;
    avatar_url?: string;
  };
}

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<SearchUser[]>([]);
  const [videos, setVideos] = useState<SearchVideo[]>([]);
  const [podcasts, setPodcasts] = useState<SearchPodcast[]>([]);
  const [trendingUsers, setTrendingUsers] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Fetch trending users on mount
  useEffect(() => {
    fetchTrendingUsers();
  }, [user]);

  // Search when query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      searchContent();
    } else {
      setUsers([]);
      setVideos([]);
      setPodcasts([]);
    }
  }, [searchQuery, user]);

  const fetchTrendingUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_verified', true)
        .limit(10);

      if (error) throw error;

      // Get follower counts and follow status for each user
      const usersWithData = await Promise.all(
        (data || []).map(async (profile) => {
          // Get follower count
          const { count: followerCount } = await supabase
            .from('follows')
            .select('*', { count: 'exact', head: true })
            .eq('following_id', profile.id);

          // Check if current user follows this user
          let isFollowing = false;
          if (user) {
            const { data: followData } = await supabase
              .from('follows')
              .select('id')
              .eq('follower_id', user.id)
              .eq('following_id', profile.id)
              .single();

            isFollowing = !!followData;
          }

          return {
            id: profile.id,
            username: profile.username,
            display_name: profile.display_name,
            avatar_url: profile.avatar_url,
            is_verified: profile.is_verified,
            follower_count: followerCount || 0,
            is_following: isFollowing
          };
        })
      );

      setTrendingUsers(usersWithData);
    } catch (error) {
      console.error('Error fetching trending users:', error);
    }
  };

  const searchContent = async () => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);

      // Search users
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .or(`username.ilike.%${searchQuery}%,display_name.ilike.%${searchQuery}%`)
        .limit(10);

      if (usersError) throw usersError;

      // Get additional data for found users
      const searchUsers = await Promise.all(
        (usersData || []).map(async (profile) => {
          const { count: followerCount } = await supabase
            .from('follows')
            .select('*', { count: 'exact', head: true })
            .eq('following_id', profile.id);

          let isFollowing = false;
          if (user) {
            const { data: followData } = await supabase
              .from('follows')
              .select('id')
              .eq('follower_id', user.id)
              .eq('following_id', profile.id)
              .single();

            isFollowing = !!followData;
          }

          return {
            id: profile.id,
            username: profile.username,
            display_name: profile.display_name,
            avatar_url: profile.avatar_url,
            is_verified: profile.is_verified,
            follower_count: followerCount || 0,
            is_following: isFollowing
          };
        })
      );

      setUsers(searchUsers);

      // Search videos - simplified query first, then add mock data for demo
      let videosData: any[] = [];
      try {
        const { data, error } = await supabase
          .from('videos')
          .select('id, title, description, thumbnail_url, view_count, like_count, created_at, user_id')
          .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
          .eq('privacy_level', 'public')
          .order('view_count', { ascending: false })
          .limit(20);

        if (!error && data) {
          videosData = data;
        }
      } catch (err) {
        console.error('Error searching videos:', err);
      }

      // Add demo data if no results
      if (videosData.length === 0) {
        videosData = [
          {
            id: '1',
            title: 'Amazing Dance Tutorial',
            description: 'Learning this new dance trend! What do you think? 💃 #dance #viral #fyp #shetalks',
            thumbnail_url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=600&fit=crop',
            view_count: 8500,
            like_count: 1240,
            created_at: new Date().toISOString(),
            user_id: 'demo-user-1'
          }
        ];
      }

      const formattedVideos = videosData.map(video => ({
        id: video.id,
        title: video.title,
        description: video.description,
        thumbnail_url: video.thumbnail_url,
        view_count: video.view_count,
        like_count: video.like_count,
        created_at: video.created_at,
        user: {
          username: video.user_id === 'demo-user-1' ? 'sarah_dance' : 'unknown',
          avatar_url: video.user_id === 'demo-user-1' ? 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=150&h=150&fit=crop&crop=face' : ''
        }
      }));

      setVideos(formattedVideos);

      // Search podcasts - simplified query first
      let podcastsData: any[] = [];
      try {
        const { data, error } = await supabase
          .from('podcasts')
          .select('id, title, description, thumbnail_url, play_count, subscriber_count, monthly_fee, created_at, user_id')
          .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
          .in('content_type', ['audio_podcast', 'video_podcast'])
          .order('play_count', { ascending: false })
          .limit(20);

        if (!error && data) {
          podcastsData = data;
        }
      } catch (err) {
        console.error('Error searching podcasts:', err);
      }

      const formattedPodcasts = podcastsData.map(podcast => ({
        id: podcast.id,
        title: podcast.title,
        description: podcast.description,
        thumbnail_url: podcast.thumbnail_url,
        play_count: podcast.play_count,
        subscriber_count: podcast.subscriber_count,
        monthly_fee: podcast.monthly_fee,
        created_at: podcast.created_at,
        user: {
          username: 'demo_user',
          avatar_url: ''
        }
      }));

      setPodcasts(formattedPodcasts);

    } catch (error) {
      console.error('Error searching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFollow = async (userId: string) => {
    if (!user || userId === user.id) return;

    try {
      // Find user in current results
      const userInResults = users.find(u => u.id === userId) || 
                           trendingUsers.find(u => u.id === userId);
      
      if (!userInResults) return;

      if (userInResults.is_following) {
        // Unfollow
        await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', userId);

        // Update state
        setUsers(prev => prev.map(u => 
          u.id === userId ? { ...u, is_following: false, follower_count: (u.follower_count || 1) - 1 } : u
        ));
        setTrendingUsers(prev => prev.map(u => 
          u.id === userId ? { ...u, is_following: false, follower_count: (u.follower_count || 1) - 1 } : u
        ));
      } else {
        // Follow
        await supabase
          .from('follows')
          .insert({
            follower_id: user.id,
            following_id: userId
          });

        // Update state
        setUsers(prev => prev.map(u => 
          u.id === userId ? { ...u, is_following: true, follower_count: (u.follower_count || 0) + 1 } : u
        ));
        setTrendingUsers(prev => prev.map(u => 
          u.id === userId ? { ...u, is_following: true, follower_count: (u.follower_count || 0) + 1 } : u
        ));
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    users,
    videos,
    podcasts,
    trendingUsers,
    loading,
    toggleFollow
  };
};