
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useVideoPlayer } from '@/hooks/useVideoPlayer';
import { useVideoNavigation } from '@/hooks/useVideoNavigation';
import type { VideoData } from '@/hooks/useVideos';
import TipJar from './TipJar';

interface VideoCardProps {
  video: VideoData;
  onLike?: (videoId: string) => void;
  onFollow?: (userId: string) => void;
  onView?: (videoId: string) => void;
  isActive?: boolean;
  videoIndex?: number;
  currentTab?: 'following' | 'whats-happening';
}

const VideoCard = ({ video, onLike, onFollow, onView, isActive = false, videoIndex, currentTab }: VideoCardProps) => {
  const navigate = useNavigate();
  const { setSourceVideo } = useVideoNavigation();
  const { 
    videoRef, 
    isPlaying, 
    currentTime, 
    duration, 
    volume, 
    isMuted, 
    togglePlay, 
    seek, 
    setVolume, 
    toggleMute 
  } = useVideoPlayer();

  const [hasViewed, setHasViewed] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleUsernameClick = () => {
    if (videoIndex !== undefined && currentTab) {
      setSourceVideo({
        id: video.id,
        index: videoIndex,
        tab: currentTab
      });
    }
    navigate(`/profile/${video.user_id}`);
  };

  // Auto-play when active
  useEffect(() => {
    if (isActive && videoRef.current) {
      videoRef.current.play();
      
      // Track view after 3 seconds
      const viewTimer = setTimeout(() => {
        if (!hasViewed && onView) {
          onView(video.id);
          setHasViewed(true);
        }
      }, 3000);

      return () => clearTimeout(viewTimer);
    } else if (!isActive && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isActive, onView, video.id, hasViewed]);

  const handleLike = () => {
    onLike?.(video.id);
  };

  const handleFollow = () => {
    onFollow?.(video.user_id);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: video.title || 'Check out this video!',
          text: video.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleVideoTap = () => {
    togglePlay();
    setShowControls(true);
    
    // Clear existing timeout
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }
    
    // Hide controls after 3 seconds
    const timeout = setTimeout(() => {
      setShowControls(false);
    }, 3000);
    
    setControlsTimeout(timeout);
  };

  return (
    <div className="relative w-full h-screen bg-black flex items-center justify-center">
      {/* Video Player */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src={video.video_url}
        poster={video.thumbnail_url}
        loop
        playsInline
        muted={isMuted}
        onClick={handleVideoTap}
      />
      
      {/* Video Controls Overlay - Only show when user taps */}
      {showControls && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30">
          {/* Play/Pause Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              variant="ghost"
              size="lg"
              onClick={handleVideoTap}
              className="w-20 h-20 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-opacity"
            >
              {isPlaying ? (
                <Pause size={32} className="text-white" />
              ) : (
                <Play size={32} className="text-white ml-1" />
              )}
            </Button>
          </div>

          {/* Progress Bar - Much smaller and only visible when controls show */}
          {duration > 0 && (
            <div className="absolute bottom-32 left-4 right-20 flex items-center gap-2">
              <span className="text-xs text-white/70">{formatTime(currentTime)}</span>
              <div 
                className="flex-1 h-0.5 bg-white/20 rounded-full cursor-pointer"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const progress = (e.clientX - rect.left) / rect.width;
                  seek(progress * duration);
                }}
              >
                <div 
                  className="h-full bg-white rounded-full transition-all"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>
              <span className="text-xs text-white/70">{formatTime(duration)}</span>
            </div>
          )}
        </div>
      )}
      
      {/* Content overlay */}
      <div className="absolute inset-0">
        <div className="absolute bottom-20 left-0 right-0 p-4 text-white">
          <div className="flex items-end justify-between">
            <div className="flex-1 max-w-xs">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="w-10 h-10 border-2 border-white">
                  <AvatarImage src={video.avatar_url} />
                  <AvatarFallback className="bg-gray-600 text-white">
                    {(video.username || 'U')[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <button 
                  className="font-semibold text-lg pink-text hover:underline cursor-pointer"
                  onClick={handleUsernameClick}
                >
                  @{video.username} {video.is_verified && '✓'}
                </button>
              </div>
              
              <p className="text-sm mb-3 leading-relaxed">{video.description || video.title}</p>
            </div>
            
            <div className="flex flex-col items-center gap-6 ml-4">
              <div className="flex flex-col items-center">
                 <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={`p-3 rounded-full ${video.is_liked ? 'bg-pink-500' : 'bg-white/20'} backdrop-blur-sm hover:bg-white/30 border-0`}
                >
                  <Heart 
                    size={28} 
                    className={video.is_liked ? 'text-white fill-current' : 'text-white'} 
                  />
                </Button>
                <span className="text-xs font-semibold mt-1 pink-text">{video.like_count.toLocaleString()}</span>
              </div>
              
              <div className="flex flex-col items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border-0"
                >
                  <MessageCircle size={28} className="text-white" />
                </Button>
                <span className="text-xs font-semibold mt-1 pink-text">{video.comment_count.toLocaleString()}</span>
              </div>
              
              <div className="flex flex-col items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border-0"
                >
                  <Share size={28} className="text-white" />
                </Button>
                <span className="text-xs font-semibold mt-1 pink-text">{video.shares.toLocaleString()}</span>
              </div>
              
              <div className="flex flex-col items-center">
                <TipJar 
                  creatorId={video.user_id}
                  creatorName={video.username}
                  contentId={video.id}
                  contentType="video"
                  variant="button"
                />
              </div>
              
              {/* Follow Button - only show if not own video */}
              {video.user_id !== video.user_id && (
                <div className="flex flex-col items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleFollow}
                    className={`p-3 rounded-full ${video.is_following ? 'bg-gray-500' : 'bg-pink-500'} backdrop-blur-sm hover:bg-pink-600 border-0`}
                  >
                    <span className="text-white text-sm font-semibold">
                      {video.is_following ? '✓' : '+'}
                    </span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
