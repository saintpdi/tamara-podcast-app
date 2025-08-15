import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Volume2, VolumeX, X, DollarSign, Users } from 'lucide-react';
import { PodcastData } from '@/hooks/usePodcasts';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface PodcastPlayerProps {
  podcast: PodcastData | null;
  isOpen: boolean;
  onClose: () => void;
  onSubscribe?: (podcastId: string, creatorId: string, monthlyFee: number) => void;
}

const PodcastPlayer = ({ podcast, isOpen, onClose, onSubscribe }: PodcastPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showSubscriptionPrompt, setShowSubscriptionPrompt] = useState(false);
  const [previewEnded, setPreviewEnded] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const { user } = useAuth();
  const { createCheckout } = useSubscription();

  useEffect(() => {
    if (!podcast || !isOpen) return;
    
    const mediaRef = podcast.content_type === 'video_podcast' ? videoRef.current : audioRef.current;
    if (!mediaRef) return;

    mediaRef.src = podcast.content_url;
    mediaRef.load();
    
    // For paid content, set up preview limit (30 seconds)
    if (podcast.monthly_fee > 0 && !podcast.is_subscribed) {
      const handleTimeUpdate = () => {
        if (mediaRef.currentTime >= 30 && !previewEnded) {
          mediaRef.pause();
          setIsPlaying(false);
          setPreviewEnded(true);
          setShowSubscriptionPrompt(true);
        }
      };
      
      mediaRef.addEventListener('timeupdate', handleTimeUpdate);
      return () => mediaRef.removeEventListener('timeupdate', handleTimeUpdate);
    } else {
      // Auto-play free content or subscribed content
      mediaRef.play().catch(console.error);
      setIsPlaying(true);
    }
  }, [podcast, isOpen, previewEnded]);

  const togglePlay = () => {
    const mediaRef = podcast?.content_type === 'video_podcast' ? videoRef.current : audioRef.current;
    if (!mediaRef) return;

    if (isPlaying) {
      mediaRef.pause();
    } else {
      // Check if this is paid content and user hasn't subscribed
      if (podcast?.monthly_fee > 0 && !podcast.is_subscribed && currentTime >= 30) {
        setShowSubscriptionPrompt(true);
        return;
      }
      mediaRef.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSubscribe = async () => {
    if (!podcast || !user) return;
    
    try {
      const { url } = await createCheckout(
        Math.round(podcast.monthly_fee * 100), // Convert to cents
        `${podcast.title} - Monthly Subscription`,
        podcast.id,
        'podcast'
      );
      
      if (url) {
        window.open(url, '_blank');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create subscription checkout",
        variant: "destructive"
      });
    }
  };

  const handleBuyEpisode = async () => {
    if (!podcast || !user) return;
    
    try {
      const episodePrice = 2.99; // Fixed price for individual episodes
      const { url } = await createCheckout(
        Math.round(episodePrice * 100), // Convert to cents
        `${podcast.title} - Single Episode`,
        podcast.id,
        'podcast_episode'
      );
      
      if (url) {
        window.open(url, '_blank');
      }
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to create episode purchase checkout",
        variant: "destructive"
      });
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!podcast) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{podcast.title}</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X size={20} />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Media Player */}
          <div className="relative bg-black rounded-lg overflow-hidden">
            {podcast.content_type === 'video_podcast' ? (
              <video
                ref={videoRef}
                className="w-full aspect-video"
                onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            ) : (
              <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-pink-500 to-purple-600">
                <div className="text-center text-white">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play size={32} />
                  </div>
                  <h3 className="text-xl font-semibold">{podcast.title}</h3>
                  <p className="text-white/80">Audio Podcast</p>
                </div>
                <audio
                  ref={audioRef}
                  onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                  onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
              </div>
            )}

            {/* Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePlay}
                  className="text-white hover:bg-white/20"
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </Button>
                
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-white text-sm">{formatTime(currentTime)}</span>
                  <div className="flex-1 h-1 bg-white/20 rounded">
                    <div 
                      className="h-full bg-white rounded"
                      style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-white text-sm">{formatTime(duration)}</span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-white hover:bg-white/20"
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </Button>
              </div>
            </div>
          </div>

          {/* Podcast Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-pink-300 text-pink-600">
                {podcast.content_type === 'video_podcast' ? 'Video' : 'Audio'}
              </Badge>
              {podcast.monthly_fee > 0 && (
                <Badge className="bg-green-100 text-green-700">
                  ${podcast.monthly_fee}/month
                </Badge>
              )}
            </div>
            
            {podcast.description && (
              <p className="text-gray-600">{podcast.description}</p>
            )}
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Users size={14} />
                <span>{podcast.subscriber_count} subscribers</span>
              </div>
              <div className="flex items-center gap-1">
                <Play size={14} />
                <span>{podcast.play_count} plays</span>
              </div>
            </div>
          </div>

          {/* Subscription Prompt */}
          {showSubscriptionPrompt && podcast.monthly_fee > 0 && !podcast.is_subscribed && (
            <Card className="border-pink-200 bg-pink-50">
              <CardContent className="p-4 text-center">
                <h3 className="font-semibold text-pink-800 mb-2">Premium Content</h3>
                <p className="text-pink-700 text-sm mb-4">
                  You've reached the free preview limit. Subscribe to continue listening.
                </p>
                <div className="flex gap-2 justify-center">
                  <Button 
                    onClick={handleSubscribe}
                    className="bg-pink-500 hover:bg-pink-600 text-white"
                  >
                    <Users size={16} className="mr-1" />
                    Subscribe (${podcast.monthly_fee}/month)
                  </Button>
                  <Button 
                    onClick={handleBuyEpisode}
                    variant="outline"
                    className="border-pink-300 text-pink-600"
                  >
                    <DollarSign size={16} className="mr-1" />
                    Buy Episode ($2.99)
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PodcastPlayer;