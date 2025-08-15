
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Play, Users, Video, Mic } from 'lucide-react';
import { UserProfile, UserVideo, UserPodcast } from '@/types/profile';
import { useVideoNavigation } from '@/hooks/useVideoNavigation';
import { useNavigate } from 'react-router-dom';
import { usePodcastPlayer } from '@/hooks/usePodcastPlayer';
import PodcastPlayer from './PodcastPlayer';

interface ProfileContentProps {
  profile: UserProfile;
  userVideos: UserVideo[];
  userPodcasts: UserPodcast[];
  onVideoClick?: (videoId: string) => void;
  onPodcastClick?: (podcastId: string) => void;
}

const ProfileContent = ({ profile, userVideos, userPodcasts, onVideoClick, onPodcastClick }: ProfileContentProps) => {
  const navigate = useNavigate();
  const { setSourceVideo } = useVideoNavigation();
  const { currentPodcast, isPlayerOpen, playPodcast, closePodcast } = usePodcastPlayer();
  const subscriptions = [
    { id: '1', name: 'Daily Motivation', price: 4.99, isActive: true },
    { id: '2', name: 'Tech Talk Weekly', price: 9.99, isActive: true }
  ];

  return (
    <Tabs defaultValue={!profile.hide_videos_tab ? "videos" : "podcasts"} className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-gray-100">
        {!profile.hide_videos_tab && (
          <TabsTrigger value="videos" className="data-[state=active]:bg-white data-[state=active]:text-pink-600">
            Videos
          </TabsTrigger>
        )}
        <TabsTrigger value="podcasts" className="data-[state=active]:bg-white data-[state=active]:text-pink-600">
          Podcasts
        </TabsTrigger>
        {!profile.hide_subscriptions_tab && (
          <TabsTrigger value="subscriptions" className="data-[state=active]:bg-white data-[state=active]:text-pink-600">
            Subscriptions
          </TabsTrigger>
        )}
      </TabsList>

      {!profile.hide_videos_tab && (
        <TabsContent value="videos" className="mt-4">
          {userVideos.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {userVideos.map((video, index) => (
                <div 
                  key={video.id} 
                  className="relative aspect-[3/4] rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => {
                    setSourceVideo({
                      id: video.id,
                      index: index,
                      tab: 'whats-happening'
                    });
                     navigate('/', { state: { activeTab: 'whats-happening', videoIndex: index, autoPlay: true } });
                   }}
                 >
                   <img 
                     src={video.thumbnail_url || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&h=400&fit=crop'} 
                     alt="Video thumbnail"
                     className="w-full h-full object-cover"
                   />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-2 left-2">
                    <Play size={16} className="text-white" />
                  </div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="flex items-center justify-between text-white text-xs">
                      <div className="flex items-center gap-1">
                        <Heart size={12} />
                        <span>{video.like_count || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Play size={12} />
                        <span>{video.view_count || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Video size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No videos yet</p>
              <p className="text-sm text-gray-500">Start creating to see your videos here</p>
            </div>
          )}
        </TabsContent>
      )}

      <TabsContent value="podcasts" className="mt-4 space-y-3">
        {userPodcasts.length > 0 ? (
          userPodcasts.map((podcast) => (
            <Card key={podcast.id} className="border-pink-200 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => playPodcast({
                    id: podcast.id,
                    user_id: profile.id,
                    title: podcast.title,
                    description: podcast.description,
                    content_url: podcast.content_url || '',
                    content_type: podcast.content_type,
                    thumbnail_url: podcast.thumbnail_url,
                    monthly_fee: podcast.monthly_fee,
                    subscriber_count: podcast.subscriber_count,
                    play_count: podcast.play_count,
                    like_count: podcast.like_count,
                    created_at: podcast.created_at,
                    is_subscribed: podcast.monthly_fee === 0, // Assume subscribed if free
                    user: { username: profile.username, avatar_url: profile.avatar_url }
                  })}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 bg-pink-100 rounded-lg flex items-center justify-center">
                    {podcast.content_type === 'video_podcast' ? (
                      <Video size={24} className="text-pink-600" />
                    ) : (
                      <Mic size={24} className="text-pink-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-800">{podcast.title}</h3>
                      <Badge variant="outline" className="text-xs border-pink-300 text-pink-600">
                        {podcast.content_type === 'video_podcast' ? 'Video' : 'Audio'}
                      </Badge>
                      {podcast.monthly_fee > 0 && (
                        <Badge className="bg-green-100 text-green-700 text-xs">
                          ${podcast.monthly_fee}/mo
                        </Badge>
                      )}
                    </div>
                    {podcast.description && (
                      <p className="text-sm text-gray-600 mb-2">{podcast.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Heart size={12} className="text-pink-500" />
                        <span>{podcast.like_count || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Play size={12} className="text-blue-500" />
                        <span>{podcast.play_count || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={12} className="text-green-500" />
                        <span>{podcast.subscriber_count || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8">
            <Mic size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No podcasts yet</p>
            <p className="text-sm text-gray-500">Start podcasting to see your content here</p>
          </div>
        )}
      </TabsContent>

      {!profile.hide_subscriptions_tab && (
        <TabsContent value="subscriptions" className="mt-4 space-y-3">
          {subscriptions.map((subscription) => (
            <Card key={subscription.id} className="border-pink-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                      <Play size={16} className="text-pink-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{subscription.name}</h3>
                      <p className="text-sm text-gray-600">${subscription.price}/month</p>
                    </div>
                  </div>
                  <Badge 
                    variant={subscription.isActive ? "default" : "secondary"}
                    className={subscription.isActive ? "bg-green-500" : ""}
                  >
                    {subscription.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <Card className="border-gray-200 border-dashed">
            <CardContent className="p-4 text-center">
              <Users size={24} className="mx-auto text-pink-400 mb-2" />
              <p className="text-sm text-gray-600 mb-2">Find new podcasts to subscribe to</p>
              <Button size="sm" className="bg-pink-500 hover:bg-pink-600 text-white">
                Explore Podcasts
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      )}
      
      {/* Podcast Player */}
      <PodcastPlayer
        podcast={currentPodcast}
        isOpen={isPlayerOpen}
        onClose={closePodcast}
      />
    </Tabs>
  );
};

export default ProfileContent;
