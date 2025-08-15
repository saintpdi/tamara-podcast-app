
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VideoCard from './VideoCard';
import { useVideos } from '@/hooks/useVideos';

const mockVideos = [
  {
    id: '1',
    user_id: 'user1',
    username: 'sarah_dance',
    description: 'Learning this new dance trend! What do you think? 💃 #dance #viral #fyp #shetalks',
    likes: 12400,
    comments: 892,
    shares: 234,
    music: '♪ Dance Monkey - Tones and I',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=150&h=150&fit=crop&crop=face',
    isFollowing: true
  },
  {
    id: '2',
    user_id: 'user2',
    username: 'foodie_mike',
    description: 'Making the perfect pasta from scratch 🍝 Recipe in comments! #cooking #foodie #shetalks',
    likes: 8900,
    comments: 445,
    shares: 178,
    music: '♪ Cooking Time - Original Sound',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    isFollowing: true
  },
  {
    id: '3',
    user_id: 'user3',
    username: 'art_lover_emma',
    description: 'Painting this sunset in 60 seconds ⏰🎨 #speedpaint #art #sunset #creative #shetalks',
    likes: 15200,
    comments: 1205,
    shares: 456,
    music: '♪ Peaceful Vibes - Chill Mix',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    isFollowing: false
  },
  {
    id: '4',
    user_id: 'user4',
    username: 'tech_guru_alex',
    description: 'Mind-blowing iPhone tricks you didn\'t know! 📱✨ #techtips #iphone #lifehacks #shetalks',
    likes: 22100,
    comments: 1876,
    shares: 892,
    music: '♪ Tech Vibes - Electronic Beat',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    isFollowing: false
  },
  {
    id: '5',
    user_id: 'user5',
    username: 'fitness_jane',
    description: '5-minute morning workout routine! No equipment needed 💪 #fitness #morning #workout #shetalks',
    likes: 9800,
    comments: 623,
    shares: 287,
    music: '♪ Pump It Up - Workout Mix',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    isFollowing: true
  },
  {
    id: '6',
    user_id: 'user6',
    username: 'yap_queen',
    description: 'Real talk about life in your 20s 💬 Anyone else feeling this? #yap #life #relatable #shetalks',
    likes: 18500,
    comments: 2340,
    shares: 567,
    music: '♪ Chill Vibes - Lo-fi Mix',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    isFollowing: false
  }
];

const ExploreTab = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeTab, setActiveTab] = useState('following');
  
  // Check for navigation state from profile back navigation
  useEffect(() => {
    const state = window.history.state?.usr;
    if (state?.activeTab && state?.videoIndex !== undefined) {
      setActiveTab(state.activeTab);
      setCurrentVideoIndex(state.videoIndex);
      // Clear the state
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  const { 
    videos: followingVideos, 
    loading: followingLoading, 
    toggleLike: toggleFollowingLike, 
    toggleFollow: toggleFollowingFollow,
    incrementView: incrementFollowingView
  } = useVideos('following');

  const { 
    videos: trendingVideos, 
    loading: trendingLoading, 
    toggleLike: toggleTrendingLike, 
    toggleFollow: toggleTrendingFollow,
    incrementView: incrementTrendingView
  } = useVideos('trending');

  // Get current videos based on active tab
  const currentVideos = activeTab === 'following' ? followingVideos : trendingVideos;
  const isLoading = activeTab === 'following' ? followingLoading : trendingLoading;
  const toggleLike = activeTab === 'following' ? toggleFollowingLike : toggleTrendingLike;
  const toggleFollow = activeTab === 'following' ? toggleFollowingFollow : toggleTrendingFollow;
  const incrementView = activeTab === 'following' ? incrementFollowingView : incrementTrendingView;

  useEffect(() => {
    // Reset video index when switching tabs
    setCurrentVideoIndex(0);
  }, [activeTab]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioning) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setIsTransitioning(true);
        setCurrentVideoIndex(prev => (prev + 1) % currentVideos.length);
        setTimeout(() => setIsTransitioning(false), 300);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setIsTransitioning(true);
        setCurrentVideoIndex(prev => prev === 0 ? currentVideos.length - 1 : prev - 1);
        setTimeout(() => setIsTransitioning(false), 300);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isTransitioning) return;

      setIsTransitioning(true);
      
      if (e.deltaY > 0) {
        setCurrentVideoIndex(prev => (prev + 1) % currentVideos.length);
      } else {
        setCurrentVideoIndex(prev => prev === 0 ? currentVideos.length - 1 : prev - 1);
      }

      setTimeout(() => setIsTransitioning(false), 300);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [isTransitioning, currentVideos.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isTransitioning) return;
    
    const startY = e.touches[0].clientY;
    
    const handleTouchEnd = (endEvent: TouchEvent) => {
      const endY = endEvent.changedTouches[0].clientY;
      const diff = startY - endY;
      
      if (Math.abs(diff) > 100) {
        setIsTransitioning(true);
        
        if (diff > 0) {
          setCurrentVideoIndex(prev => (prev + 1) % currentVideos.length);
        } else {
          setCurrentVideoIndex(prev => prev === 0 ? currentVideos.length - 1 : prev - 1);
        }

        setTimeout(() => setIsTransitioning(false), 300);
      }
      
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchend', handleTouchEnd);
  };

  return (
    <div className="h-screen overflow-hidden relative bg-black">
      {/* Top Tab Navigation */}
      <div className="absolute top-0 left-0 right-0 z-40 bg-gradient-to-b from-black/70 to-transparent">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-transparent border-0 h-16 pt-8">
            <TabsTrigger 
              value="following" 
              className="text-white data-[state=active]:text-pink-400 data-[state=active]:bg-transparent border-b-2 border-transparent data-[state=active]:border-pink-400 rounded-none font-semibold"
            >
              Following
            </TabsTrigger>
            <TabsTrigger 
              value="whats-happening"
              className="text-white data-[state=active]:text-pink-400 data-[state=active]:bg-transparent border-b-2 border-transparent data-[state=active]:border-pink-400 rounded-none font-semibold"
            >
              What's Happening
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div 
        className="transition-transform duration-300 ease-out"
        style={{ 
          transform: `translateY(-${currentVideoIndex * 100}vh)`,
          height: `${currentVideos.length * 100}vh`
        }}
        onTouchStart={handleTouchStart}
      >
        {currentVideos.map((video, index) => (
          <div key={`${activeTab}-${video.id}`} className="h-screen">
            <VideoCard 
              video={video} 
              onLike={toggleLike}
              onFollow={toggleFollow}
              onView={incrementView}
              isActive={index === currentVideoIndex}
              videoIndex={index}
              currentTab={activeTab === 'following' ? 'following' : 'whats-happening'}
            />
          </div>
        ))}
      </div>
      
      {/* Video indicator dots */}
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-2 z-30">
        {currentVideos.map((_, index) => (
          <div
            key={index}
            className={`w-1 h-6 rounded-full transition-colors ${
              index === currentVideoIndex ? 'bg-pink-500' : 'bg-white/30'
            }`}
          />
        ))}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-50">
          <div className="text-center text-white p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading videos...</p>
          </div>
        </div>
      )}

      {/* Empty state for Following tab when no followed creators */}
      {activeTab === 'following' && !isLoading && currentVideos.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-50">
          <div className="text-center text-white p-8">
            <h3 className="text-xl font-semibold mb-2">No videos from followed creators</h3>
            <p className="text-gray-300 mb-4">Follow some creators to see their content here!</p>
            <button 
              onClick={() => setActiveTab('whats-happening')}
              className="bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition-colors"
            >
              Explore What's Happening
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExploreTab;
