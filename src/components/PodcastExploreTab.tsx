import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Play, Users, Video, Mic, DollarSign } from 'lucide-react';
import { usePodcasts } from '@/hooks/usePodcasts';
import { usePodcastPlayer } from '@/hooks/usePodcastPlayer';
import TipJar from './TipJar';
import PodcastPlayer from './PodcastPlayer';

const PodcastExploreTab = () => {
  const { podcasts, loading, toggleSubscription, incrementPlay } = usePodcasts();
  const { currentPodcast, isPlayerOpen, playPodcast, closePodcast } = usePodcastPlayer();

  // Listen for podcast uploads to refresh feed
  useEffect(() => {
    const handlePodcastUpload = () => {
      // Refresh podcasts when new ones are uploaded
      window.location.reload();
    };
    
    window.addEventListener('podcastUploaded', handlePodcastUpload);
    
    return () => {
      window.removeEventListener('podcastUploaded', handlePodcastUpload);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 pb-20 bg-white">
      <Tabs defaultValue="audio" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100">
          <TabsTrigger value="audio" className="data-[state=active]:bg-white data-[state=active]:text-pink-600">
            Audio Podcasts
          </TabsTrigger>
          <TabsTrigger value="video" className="data-[state=active]:bg-white data-[state=active]:text-pink-600">
            Video Podcasts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="audio" className="space-y-4">
          {podcasts
            .filter(podcast => podcast.content_type === 'audio_podcast')
            .map((podcast) => (
              <Card key={podcast.id} className="border-pink-200 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-pink-100 rounded-lg flex items-center justify-center">
                      <Mic size={24} className="text-pink-600" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-800">{podcast.title}</h3>
                        {podcast.monthly_fee > 0 ? (
                          <Badge className="bg-green-100 text-green-700 text-xs">
                            ${podcast.monthly_fee}/month
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">Free</Badge>
                        )}
                      </div>
                      
                      {podcast.description && (
                        <p className="text-sm text-gray-600">{podcast.description}</p>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Heart size={12} className="text-pink-500" />
                          <span>{podcast.like_count}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Play size={12} className="text-blue-500" />
                          <span>{podcast.play_count}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users size={12} className="text-green-500" />
                          <span>{podcast.subscriber_count} subscribers</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => {
                            incrementPlay(podcast.id);
                            playPodcast(podcast);
                          }}
                          size="sm"
                          className="bg-pink-500 hover:bg-pink-600 text-white"
                        >
                          <Play size={16} className="mr-1" />
                          Play
                        </Button>
                        
                        {podcast.monthly_fee > 0 && !podcast.is_subscribed && (
                          <Button
                            onClick={() => toggleSubscription(podcast.id, podcast.user_id, podcast.monthly_fee)}
                            size="sm"
                            variant="outline"
                            className="border-pink-300 text-pink-600"
                          >
                            <DollarSign size={16} className="mr-1" />
                            Subscribe
                          </Button>
                        )}
                        
                        <TipJar 
                          creatorId={podcast.user_id}
                          creatorName={podcast.username}
                          contentId={podcast.id}
                          contentType="podcast"
                          variant="button"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="video" className="space-y-4">
          {podcasts
            .filter(podcast => podcast.content_type === 'video_podcast')
            .map((podcast) => (
              <Card key={podcast.id} className="border-pink-200 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-pink-100 rounded-lg flex items-center justify-center">
                      <Video size={24} className="text-pink-600" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-800">{podcast.title}</h3>
                        {podcast.monthly_fee > 0 ? (
                          <Badge className="bg-green-100 text-green-700 text-xs">
                            ${podcast.monthly_fee}/month
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">Free</Badge>
                        )}
                      </div>
                      
                      {podcast.description && (
                        <p className="text-sm text-gray-600">{podcast.description}</p>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Heart size={12} className="text-pink-500" />
                          <span>{podcast.like_count}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Play size={12} className="text-blue-500" />
                          <span>{podcast.play_count}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users size={12} className="text-green-500" />
                          <span>{podcast.subscriber_count} subscribers</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => {
                            incrementPlay(podcast.id);
                            playPodcast(podcast);
                          }}
                          size="sm"
                          className="bg-pink-500 hover:bg-pink-600 text-white"
                        >
                          <Play size={16} className="mr-1" />
                          Watch
                        </Button>
                        
                        {podcast.monthly_fee > 0 && !podcast.is_subscribed && (
                          <Button
                            onClick={() => toggleSubscription(podcast.id, podcast.user_id, podcast.monthly_fee)}
                            size="sm"
                            variant="outline"
                            className="border-pink-300 text-pink-600"
                          >
                            <DollarSign size={16} className="mr-1" />
                            Subscribe
                          </Button>
                        )}
                        
                        <TipJar 
                          creatorId={podcast.user_id}
                          creatorName={podcast.username}
                          contentId={podcast.id}
                          contentType="podcast"
                          variant="button"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>
      </Tabs>
      
      {/* Podcast Player */}
      <PodcastPlayer
        podcast={currentPodcast}
        isOpen={isPlayerOpen}
        onClose={closePodcast}
        onSubscribe={toggleSubscription}
      />
    </div>
  );
};

export default PodcastExploreTab;