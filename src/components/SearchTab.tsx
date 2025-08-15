
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, TrendingUp, Hash, User, Clock, Video, Podcast, Play, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '@/hooks/useSearch';
import SubscriptionButton from './SubscriptionButton';

const trendingHashtags = [
  '#shetalks', '#viral', '#fyp', '#dance', '#cooking', '#art', '#tech', '#fitness', '#beauty', '#lifestyle'
];

const trendingUsers = [
  { user_id: 'user1', username: 'sarah_dance', followers: '1.2M', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=150&h=150&fit=crop&crop=face', isFollowing: false },
  { user_id: 'user2', username: 'foodie_mike', followers: '850K', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', isFollowing: true },
  { user_id: 'user3', username: 'art_lover_emma', followers: '920K', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', isFollowing: false },
  { user_id: 'user4', username: 'tech_guru_alex', followers: '1.5M', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', isFollowing: true },
];

const trendingPodcasts = [
  { title: 'Daily Motivation', host: 'sarah_positivity', subscribers: '45K', duration: '15 min' },
  { title: 'Tech Talk Weekly', host: 'alex_tech', subscribers: '78K', duration: '45 min' },
  { title: 'Cooking Masters', host: 'chef_maria', subscribers: '32K', duration: '30 min' },
  { title: 'Mindful Living', host: 'zen_coach', subscribers: '67K', duration: '25 min' },
];

const recentSearches = ['dance tutorial', 'makeup tips', 'workout routine', 'cooking hacks'];

const SearchTab = () => {
  const [activeTab, setActiveTab] = useState('videos');
  const navigate = useNavigate();
  
  const {
    searchQuery,
    setSearchQuery,
    users,
    videos,
    podcasts,
    trendingUsers,
    loading,
    toggleFollow
  } = useSearch();

  return (
    <div className="h-screen bg-white text-gray-800 pt-16 pb-20">
      <div className="p-4">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search videos, podcasts, users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-100 text-gray-800 placeholder-gray-500 pl-10 pr-4 py-3 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        {/* Content Type Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 mb-6">
            <TabsTrigger 
              value="videos" 
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-pink-600"
            >
              <Video size={16} />
              Videos
            </TabsTrigger>
            <TabsTrigger 
              value="podcasts"
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-pink-600"
            >
              <Podcast size={16} />
              Podcasts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="videos" className="mt-0">
            {!searchQuery ? (
              <div className="space-y-8">
                {/* Recent Searches */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 pink-text">
                    <Clock size={20} />
                    Recent Searches
                  </h3>
                  <div className="space-y-3">
                    {recentSearches.map((search, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg px-2 cursor-pointer"
                        onClick={() => setSearchQuery(search)}
                      >
                        <span className="text-gray-600">{search}</span>
                        <Search size={16} className="text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trending Hashtags */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 pink-text">
                    <TrendingUp size={20} />
                    Trending Hashtags
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {trendingHashtags.map((hashtag, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 cursor-pointer"
                        onClick={() => setSearchQuery(hashtag)}
                      >
                        <div className="flex items-center gap-2">
                          <Hash size={16} className="text-pink-500" />
                          <span className="text-sm">{hashtag}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trending Creators */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 pink-text">
                    <User size={20} />
                    Trending Creators
                  </h3>
                  <div className="space-y-4">
                    {trendingUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg px-2 cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={user.avatar_url} />
                            <AvatarFallback className="bg-pink-100 text-pink-600">
                              {(user.username || 'U')[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <button 
                              className="font-semibold text-gray-800 hover:text-pink-600 cursor-pointer flex items-center gap-1"
                              onClick={() => navigate(`/profile/${user.id}`)}
                            >
                              @{user.username}
                              {user.is_verified && <span className="text-blue-500">✓</span>}
                            </button>
                            <p className="text-sm text-gray-500">{user.follower_count} followers</p>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => toggleFollow(user.id)}
                          className={`${
                            user.is_following
                              ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                              : 'bg-pink-500 hover:bg-pink-600 text-white'
                          }`}
                        >
                          {user.is_following ? 'Following' : 'Follow'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* User Results */}
                {users.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 pink-text">
                      <User size={20} />
                      Users
                    </h3>
                    <div className="space-y-4">
                      {users.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg px-2"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={user.avatar_url} />
                              <AvatarFallback className="bg-pink-100 text-pink-600">
                                {(user.username || 'U')[0].toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <button 
                                className="font-semibold text-gray-800 hover:text-pink-600 cursor-pointer flex items-center gap-1"
                                onClick={() => navigate(`/profile/${user.id}`)}
                              >
                                @{user.username}
                                {user.is_verified && <span className="text-blue-500">✓</span>}
                              </button>
                              <p className="text-sm text-gray-500">{user.follower_count} followers</p>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => toggleFollow(user.id)}
                            className={`${
                              user.is_following
                                ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                                : 'bg-pink-500 hover:bg-pink-600 text-white'
                            }`}
                          >
                            {user.is_following ? 'Following' : 'Follow'}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Video Results */}
                {videos.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 pink-text">
                      <Video size={20} />
                      Videos
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {videos.map((video) => (
                        <div
                          key={video.id}
                          className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 cursor-pointer"
                        >
                          <div className="aspect-video bg-gray-200 rounded mb-2 relative">
                            {video.thumbnail_url ? (
                              <img 
                                src={video.thumbnail_url} 
                                alt={video.title}
                                className="w-full h-full object-cover rounded"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Video size={24} className="text-gray-400" />
                              </div>
                            )}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Play size={20} className="text-white drop-shadow-lg" />
                            </div>
                          </div>
                          <h4 className="font-medium text-sm mb-1 line-clamp-2">{video.title}</h4>
                          <p className="text-xs text-gray-500 mb-1">@{video.user.username}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Eye size={12} />
                            <span>{video.view_count.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Results */}
                {!loading && users.length === 0 && videos.length === 0 && (
                  <div className="text-center py-20">
                    <Video size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">No results found for "{searchQuery}"</p>
                  </div>
                )}

                {/* Loading */}
                {loading && (
                  <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-4"></div>
                    <p className="text-gray-500">Searching...</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="podcasts" className="mt-0">
            {!searchQuery ? (
              <div className="space-y-8">
                {/* Trending Podcasts */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 pink-text">
                    <TrendingUp size={20} />
                    Trending Podcasts
                  </h3>
                  <div className="space-y-4">
                    {trendingPodcasts.map((podcast, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-3 hover:bg-gray-50 rounded-lg px-3 cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                            <Podcast size={20} className="text-pink-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{podcast.title}</p>
                            <p className="text-sm text-gray-500">by @{podcast.host}</p>
                            <p className="text-xs text-gray-400">{podcast.subscribers} subscribers • {podcast.duration}</p>
                          </div>
                        </div>
                        <SubscriptionButton
                          contentId={`trending-${index}`}
                          creatorId="demo-creator"
                          monthlyFee={0}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 pink-text">
                    <Hash size={20} />
                    Categories
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {['Education', 'Entertainment', 'Business', 'Health', 'Technology', 'Lifestyle'].map((category, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 cursor-pointer text-center"
                      >
                        <span className="text-sm font-medium">{category}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Podcast Results */}
                {podcasts.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 pink-text">
                      <Podcast size={20} />
                      Podcasts
                    </h3>
                    <div className="space-y-4">
                      {podcasts.map((podcast) => (
                        <div
                          key={podcast.id}
                          className="flex items-center justify-between py-3 hover:bg-gray-50 rounded-lg px-3 cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center overflow-hidden">
                              {podcast.thumbnail_url ? (
                                <img 
                                  src={podcast.thumbnail_url} 
                                  alt={podcast.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Podcast size={20} className="text-pink-600" />
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">{podcast.title}</p>
                              <p className="text-sm text-gray-500">by @{podcast.user.username}</p>
                              <div className="flex items-center gap-2 text-xs text-gray-400">
                                <span>{podcast.subscriber_count.toLocaleString()} subscribers</span>
                                {podcast.monthly_fee && podcast.monthly_fee > 0 && (
                                  <>
                                    <span>•</span>
                                    <span>${podcast.monthly_fee}/month</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" className="border-pink-300 text-pink-600 hover:bg-pink-50">
                            {podcast.monthly_fee && podcast.monthly_fee > 0 ? 'Subscribe' : 'Follow'}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Results */}
                {!loading && podcasts.length === 0 && (
                  <div className="text-center py-20">
                    <Podcast size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">No podcasts found for "{searchQuery}"</p>
                  </div>
                )}

                {/* Loading */}
                {loading && (
                  <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-4"></div>
                    <p className="text-gray-500">Searching...</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SearchTab;
