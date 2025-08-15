import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useVideoNavigation } from '@/hooks/useVideoNavigation';
import Layout from '@/components/Layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProfileContent from '@/components/ProfileContent';

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const { sourceVideo, clearSourceVideo } = useVideoNavigation();
  const {
    profile,
    userVideos,
    userPodcasts,
    loading,
    isFollowing,
    followerCount,
    followingCount,
    toggleFollow
  } = useUserProfile(userId);

  const handleBackClick = () => {
    if (sourceVideo) {
      // Navigate back to the specific video
      navigate('/', { 
        state: { 
          activeTab: sourceVideo.tab === 'following' ? 'following' : 'whats-happening',
          videoIndex: sourceVideo.index 
        }
      });
      clearSourceVideo();
    } else {
      navigate(-1);
    }
  };

  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }

  if (!userId) {
    return <Navigate to="/" replace />;
  }

  // If viewing own profile, redirect to profile tab
  if (currentUser.id === userId) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">User not found</h2>
          <p className="text-gray-600 mb-4">The profile you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  const totalLikes = userVideos.reduce((sum, video) => sum + (video.like_count || 0), 0) +
                    userPodcasts.reduce((sum, podcast) => sum + (podcast.like_count || 0), 0);

  return (
    <Layout activeTab="profile" onTabChange={() => {}}>
      <div className="pb-20 bg-white">
        {/* Header with back button */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 p-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackClick}
              className="p-2"
            >
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-gray-800">
                {profile.display_name || profile.username}
              </h1>
              <p className="text-sm text-gray-600">
                {userVideos.length + userPodcasts.length} posts
              </p>
            </div>
          </div>
        </div>

        {/* Profile Header */}
        <div className="bg-gradient-to-br from-pink-50 to-white p-6">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
              <AvatarImage src={profile.avatar_url || ''} />
              <AvatarFallback className="bg-pink-100 text-pink-600 text-xl">
                {profile.display_name?.[0] || profile.username[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-800">
                {profile.display_name || profile.username}
              </h1>
              <p className="text-gray-600">@{profile.username}</p>
              {profile.is_verified && (
                <Badge className="bg-pink-500 text-white mt-1">
                  <Crown size={12} className="mr-1" />
                  Creator
                </Badge>
              )}
            </div>
            <Button 
              onClick={toggleFollow}
              className={`px-6 py-2 font-semibold rounded-full ${
                isFollowing 
                  ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                  : 'bg-pink-500 text-white hover:bg-pink-600'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </Button>
          </div>

          {profile.bio && (
            <p className="text-gray-700 mb-4">{profile.bio}</p>
          )}

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold pink-text">
                {userVideos.length + userPodcasts.length}
              </div>
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

        {/* Profile Content */}
        <div className="p-4">
          <ProfileContent 
            profile={profile} 
            userVideos={userVideos} 
            userPodcasts={userPodcasts}
            onPodcastClick={(podcastId) => {
              // Handle podcast click - could navigate to podcast player
              console.log('Podcast clicked:', podcastId);
            }}
          />
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;