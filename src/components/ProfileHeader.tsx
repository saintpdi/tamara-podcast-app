
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, Settings } from 'lucide-react';
import { UserProfile, UserVideo, UserPodcast } from '@/types/profile';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ProfileHeaderProps {
  profile: UserProfile;
  userVideos: UserVideo[];
  userPodcasts: UserPodcast[];
}

const ProfileHeader = ({ profile, userVideos, userPodcasts }: ProfileHeaderProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  
  const totalLikes = userVideos.reduce((sum, video) => sum + (video.like_count || 0), 0) +
                    userPodcasts.reduce((sum, podcast) => sum + (podcast.like_count || 0), 0);

  useEffect(() => {
    if (profile.id) {
      fetchFollowCounts();
    }
  }, [profile.id]);

  const fetchFollowCounts = async () => {
    try {
      // Get follower count
      const { count: followers, error: followerError } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', profile.id);

      if (followerError) throw followerError;
      setFollowerCount(followers || 0);

      // Get following count
      const { count: following, error: followingError } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', profile.id);

      if (followingError) throw followingError;
      setFollowingCount(following || 0);
    } catch (error) {
      console.error('Error fetching follow counts:', error);
    }
  };

  return (
    <div className="bg-gradient-to-br from-pink-50 to-white p-6">
      <div className="flex items-center gap-4 mb-4">
        <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
          <AvatarImage src={profile.avatar_url || ''} />
          <AvatarFallback className="bg-pink-100 text-pink-600 text-xl">
            {profile.display_name?.[0] || profile.username[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-800">{profile.display_name || profile.username}</h1>
          <p className="text-gray-600">@{profile.username}</p>
          {profile.is_verified && (
            <Badge className="bg-pink-500 text-white mt-1">
              <Crown size={12} className="mr-1" />
              Creator
            </Badge>
          )}
        </div>
        <Button 
          size="sm" 
          variant="outline" 
          className="border-pink-300 text-pink-600 hover:bg-pink-50"
          onClick={() => navigate('/settings')}
        >
          <Settings size={16} />
        </Button>
      </div>

      {profile.bio && (
        <p className="text-gray-700 mb-4">{profile.bio}</p>
      )}

      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-lg font-bold pink-text">{userVideos.length + userPodcasts.length}</div>
          <div className="text-sm text-gray-600">Posts</div>
        </div>
        <div>
          <div className="text-lg font-bold pink-text">{followerCount}</div>
          <div className="text-sm text-gray-600">Followers</div>
        </div>
        <div>
          <div className="text-lg font-bold pink-text">{totalLikes}</div>
          <div className="text-sm text-gray-600">Likes</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
