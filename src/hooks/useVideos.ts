import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface VideoData {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  music?: string;
  hashtags?: string[];
  like_count: number;
  view_count: number;
  comment_count: number;
  shares: number;
  created_at: string;
  // Profile data
  username?: string;
  display_name?: string;
  avatar_url?: string;
  is_verified?: boolean;
  // User interaction state
  is_liked?: boolean;
  is_following?: boolean;
}

export const useVideos = (feedType: 'following' | 'trending' = 'trending') => {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchVideos();
    
    // Listen for video uploads to refresh feed
    const handleVideoUpload = () => {
      fetchVideos();
    };
    
    window.addEventListener('videoUploaded', handleVideoUpload);
    
    return () => {
      window.removeEventListener('videoUploaded', handleVideoUpload);
    };
  }, [user, feedType]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('videos')
        .select(`
          id,
          user_id,
          title,
          description,
          video_url,
          thumbnail_url,
          music,
          hashtags,
          like_count,
          view_count,
          comment_count,
          shares,
          created_at
        `)
        .eq('privacy_level', 'public')
        .order('created_at', { ascending: false })
        .limit(20);

      // If following feed and user is logged in, get videos from followed users
      if (feedType === 'following' && user) {
        const { data: followedUsers } = await supabase
          .from('follows')
          .select('following_id')
          .eq('follower_id', user.id);

        if (followedUsers && followedUsers.length > 0) {
          const followedUserIds = followedUsers.map(f => f.following_id);
          query = query.in('user_id', followedUserIds);
        } else {
          // No followed users, return empty array
          setVideos([]);
          setLoading(false);
          return;
        }
      }

      // Smart algorithm for "What's Happening" (trending with personalization)
      if (feedType === 'trending' && user) {
        // Get hashtags from videos of users the current user follows
        const { data: followedUsers } = await supabase
          .from('follows')
          .select('following_id')
          .eq('follower_id', user.id);

        if (followedUsers && followedUsers.length > 0) {
          const followedUserIds = followedUsers.map(f => f.following_id);
          
          // Get hashtags from followed users' videos
          const { data: followedVideos } = await supabase
            .from('videos')
            .select('hashtags')
            .in('user_id', followedUserIds)
            .not('hashtags', 'is', null);

          if (followedVideos && followedVideos.length > 0) {
            // Extract and count hashtags
            const hashtagFrequency: { [key: string]: number } = {};
            followedVideos.forEach(video => {
              if (video.hashtags) {
                video.hashtags.forEach(tag => {
                  hashtagFrequency[tag] = (hashtagFrequency[tag] || 0) + 1;
                });
              }
            });

            // Get top hashtags
            const topHashtags = Object.keys(hashtagFrequency)
              .sort((a, b) => hashtagFrequency[b] - hashtagFrequency[a])
              .slice(0, 10);

            if (topHashtags.length > 0) {
              // Find trending videos with similar hashtags
              query = query
                .not('user_id', 'in', `(${followedUserIds.join(',')})`) // Exclude followed users
                .overlaps('hashtags', topHashtags)
                .order('like_count', { ascending: false });
            }
          }
        }
      }

      const { data, error } = await query;

      if (error) throw error;

      // If no videos found, create mock data for demo
      let videosData = data;
      if (!videosData || videosData.length === 0) {
        videosData = [
          {
            id: '1',
            user_id: 'demo-user-1',
            title: 'Amazing Dance Tutorial',
            description: 'Learning this new dance trend! What do you think? 💃 #dance #viral #fyp #shetalks',
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            thumbnail_url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=600&fit=crop',
            music: '♪ Dance Monkey - Tones and I',
            hashtags: ['dance', 'viral', 'fyp', 'shetalks'],
            like_count: 1240,
            view_count: 8500,
            comment_count: 89,
            shares: 23,
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            user_id: 'demo-user-2',
            title: 'Perfect Pasta Recipe',
            description: 'Making the perfect pasta from scratch 🍝 Recipe in comments! #cooking #foodie #shetalks',
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            thumbnail_url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=600&fit=crop',
            music: '♪ Cooking Time - Original Sound',
            hashtags: ['cooking', 'foodie', 'shetalks'],
            like_count: 890,
            view_count: 5200,
            comment_count: 44,
            shares: 17,
            created_at: new Date().toISOString()
          },
          {
            id: '3',
            user_id: 'demo-user-3',
            title: 'Speed Painting Sunset',
            description: 'Painting this sunset in 60 seconds ⏰🎨 #speedpaint #art #sunset #creative #shetalks',
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            thumbnail_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=600&fit=crop',
            music: '♪ Peaceful Vibes - Chill Mix',
            hashtags: ['speedpaint', 'art', 'sunset', 'creative', 'shetalks'],
            like_count: 1520,
            view_count: 12000,
            comment_count: 120,
            shares: 45,
            created_at: new Date().toISOString()
          },
          {
            id: '4',
            user_id: 'demo-user-4',
            title: 'iPhone Tips & Tricks',
            description: 'Mind-blowing iPhone tricks you didn\'t know! 📱✨ #techtips #iphone #lifehacks #shetalks',
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            thumbnail_url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=600&fit=crop',
            music: '♪ Tech Vibes - Electronic Beat',
            hashtags: ['techtips', 'iphone', 'lifehacks', 'shetalks'],
            like_count: 2210,
            view_count: 18500,
            comment_count: 187,
            shares: 89,
            created_at: new Date().toISOString()
          },
          {
            id: '5',
            user_id: 'demo-user-5',
            title: 'Morning Workout Routine',
            description: '5-minute morning workout routine! No equipment needed 💪 #fitness #morning #workout #shetalks',
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            thumbnail_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop',
            music: '♪ Pump It Up - Workout Mix',
            hashtags: ['fitness', 'morning', 'workout', 'shetalks'],
            like_count: 980,
            view_count: 6800,
            comment_count: 62,
            shares: 28,
            created_at: new Date().toISOString()
          }
        ];
      }

      // Mock user profiles for demo
      const mockProfiles: { [key: string]: any } = {
        'demo-user-1': { username: 'sarah_dance', display_name: 'Sarah Johnson', avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=150&h=150&fit=crop&crop=face', is_verified: true },
        'demo-user-2': { username: 'foodie_mike', display_name: 'Mike Chen', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', is_verified: true },
        'demo-user-3': { username: 'art_lover_emma', display_name: 'Emma Wilson', avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', is_verified: true },
        'demo-user-4': { username: 'tech_guru_alex', display_name: 'Alex Rodriguez', avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', is_verified: true },
        'demo-user-5': { username: 'fitness_jane', display_name: 'Jane Smith', avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face', is_verified: true }
      };

      // Get user interactions if logged in
      const videosWithInteractions = await Promise.all(
        videosData.map(async (video) => {
          let isLiked = false;
          let isFollowing = false;

          if (user) {
            // Check if user liked this video
            const { data: likeData } = await supabase
              .from('likes')
              .select('id')
              .eq('user_id', user.id)
              .eq('video_id', video.id)
              .single();

            isLiked = !!likeData;

            // Check if user follows this creator
            const { data: followData } = await supabase
              .from('follows')
              .select('id')
              .eq('follower_id', user.id)
              .eq('following_id', video.user_id)
              .single();

            isFollowing = !!followData;
          }

          const profile = mockProfiles[video.user_id] || { username: 'unknown', display_name: 'Unknown User', avatar_url: '', is_verified: false };

          return {
            ...video,
            username: profile.username,
            display_name: profile.display_name,
            avatar_url: profile.avatar_url,
            is_verified: profile.is_verified,
            is_liked: isLiked,
            is_following: isFollowing,
          };
        })
      );

      setVideos(videosWithInteractions);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (videoId: string) => {
    if (!user) return;

    try {
      const video = videos.find(v => v.id === videoId);
      if (!video) return;

      // Optimistic update
      const optimisticUpdate = (prev: VideoData[]) => prev.map(v => 
        v.id === videoId 
          ? { 
              ...v, 
              is_liked: !video.is_liked, 
              like_count: video.is_liked ? v.like_count - 1 : v.like_count + 1 
            }
          : v
      );
      
      setVideos(optimisticUpdate);

      if (video.is_liked) {
        // Unlike
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('user_id', user.id)
          .eq('video_id', videoId);

        if (error) throw error;

        // Like count is updated automatically via trigger
      } else {
        // Like
        const { error } = await supabase
          .from('likes')
          .insert({
            user_id: user.id,
            video_id: videoId
          });

        if (error) throw error;

        // Like count is updated automatically via trigger
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert optimistic update on error
      const video = videos.find(v => v.id === videoId);
      if (video) {
        setVideos(prev => prev.map(v => 
          v.id === videoId 
            ? { 
                ...v, 
                is_liked: video.is_liked, 
                like_count: video.like_count 
              }
            : v
        ));
      }
    }
  };

  const toggleFollow = async (userId: string) => {
    if (!user || userId === user.id) return;

    try {
      const video = videos.find(v => v.user_id === userId);
      if (!video) return;

      // Optimistic update
      const optimisticUpdate = (prev: VideoData[]) => prev.map(v => 
        v.user_id === userId 
          ? { ...v, is_following: !video.is_following }
          : v
      );
      
      setVideos(optimisticUpdate);

      if (video.is_following) {
        // Unfollow
        const { error } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', userId);

        if (error) throw error;
      } else {
        // Follow
        const { error } = await supabase
          .from('follows')
          .insert({
            follower_id: user.id,
            following_id: userId
          });

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      // Revert optimistic update on error
      const video = videos.find(v => v.user_id === userId);
      if (video) {
        setVideos(prev => prev.map(v => 
          v.user_id === userId 
            ? { ...v, is_following: video.is_following }
            : v
        ));
      }
    }
  };

  const incrementView = async (videoId: string) => {
    try {
      // Optimistic update
      setVideos(prev => prev.map(v => 
        v.id === videoId 
          ? { ...v, view_count: v.view_count + 1 }
          : v
      ));

      await supabase.rpc('increment_view_count', { video_id: videoId });
    } catch (error) {
      console.error('Error incrementing view:', error);
      // Revert optimistic update on error
      setVideos(prev => prev.map(v => 
        v.id === videoId 
          ? { ...v, view_count: Math.max(0, v.view_count - 1) }
          : v
      ));
    }
  };

  return {
    videos,
    loading,
    toggleLike,
    toggleFollow,
    incrementView,
    refreshVideos: fetchVideos
  };
};