
import { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Mic, MicOff, Video, VideoOff, Upload, DollarSign, Users, Play, Clock, Square, RotateCcw, Volume2, Heart, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useMyPodcasts } from '@/hooks/useMyPodcasts';
import { usePodcastPlayer } from '@/hooks/usePodcastPlayer';
import PodcastPlayer from './PodcastPlayer';

const PodcastTab = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoPodcast, setIsVideoPodcast] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecordedContent, setHasRecordedContent] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [bitrate, setBitrate] = useState([128]);

  const [podcastForm, setPodcastForm] = useState({
    title: '',
    description: '',
    subscriptionFee: '',
    category: '',
    episodeNumber: '',
    seasonNumber: ''
  });

  const { podcasts: myPodcasts, loading: podcastsLoading, refreshPodcasts } = useMyPodcasts();
  const { currentPodcast, isPlayerOpen, playPodcast, closePodcast } = usePodcastPlayer();

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user } = useAuth();

  const startCamera = useCallback(async () => {
    if (!isVideoPodcast) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: true
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setupAudioLevelMonitoring(stream);
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive"
      });
    }
  }, [isVideoPodcast]);

  const startAudioRecording = useCallback(async () => {
    if (isVideoPodcast) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        }
      });
      
      streamRef.current = stream;
      setupAudioLevelMonitoring(stream);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Microphone Error",
        description: "Unable to access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  }, [isVideoPodcast]);

  const setupAudioLevelMonitoring = (stream: MediaStream) => {
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);
      
      const updateAudioLevel = () => {
        if (!analyserRef.current) return;
        
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setAudioLevel(Math.min(100, (average / 255) * 100));
        
        if (isRecording) {
          requestAnimationFrame(updateAudioLevel);
        }
      };
      
      updateAudioLevel();
    } catch (error) {
      console.error('Error setting up audio monitoring:', error);
    }
  };

  useEffect(() => {
    if (isVideoPodcast) {
      startCamera();
    } else {
      startAudioRecording();
    }
    
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [isVideoPodcast, startCamera, startAudioRecording]);

  const startRecording = () => {
    if (!streamRef.current) return;

    const mimeType = isVideoPodcast ? 'video/webm;codecs=vp8,opus' : 'audio/webm;codecs=opus';
    const mediaRecorder = new MediaRecorder(streamRef.current, {
      mimeType,
      audioBitsPerSecond: bitrate[0] * 1000
    });

    mediaRecorderRef.current = mediaRecorder;
    setRecordedChunks([]);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setRecordedChunks(prev => [...prev, event.data]);
      }
    };

    mediaRecorder.onstop = () => {
      setHasRecordedContent(true);
    };

    mediaRecorder.start();
    setIsRecording(true);
    setRecordingTime(0);

    recordingIntervalRef.current = setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= 3540) { // 59 minutes
          stopRecording();
          return 3540;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setAudioLevel(0);
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  const resetRecording = () => {
    setRecordedChunks([]);
    setHasRecordedContent(false);
    setRecordingTime(0);
    setPodcastForm({
      title: '',
      description: '',
      subscriptionFee: '',
      category: '',
      episodeNumber: '',
      seasonNumber: ''
    });
    
    if (isVideoPodcast) {
      startCamera();
    } else {
      startAudioRecording();
    }
  };

  const previewRecording = () => {
    if (recordedChunks.length === 0) return;

    const blob = new Blob(recordedChunks, { 
      type: isVideoPodcast ? 'video/webm' : 'audio/webm' 
    });
    const url = URL.createObjectURL(blob);

    if (isVideoPodcast && videoRef.current) {
      videoRef.current.src = url;
      videoRef.current.srcObject = null;
    } else if (!isVideoPodcast && audioRef.current) {
      audioRef.current.src = url;
    }
  };

  const uploadContent = async (file: Blob, isFileUpload = false) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to upload podcasts.",
        variant: "destructive"
      });
      return;
    }

    if (!podcastForm.title) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your podcast.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      const fileExtension = isVideoPodcast ? 'webm' : (isFileUpload ? 'mp3' : 'webm');
      const filename = `${user.id}/${Date.now()}_${podcastForm.title.replace(/[^a-zA-Z0-9]/g, '_')}.${fileExtension}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('podcasts')
        .upload(filename, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('podcasts')
        .getPublicUrl(uploadData.path);

      // Save to database
      const { error: dbError } = await supabase
        .from('podcasts')
        .insert({
          user_id: user.id,
          title: podcastForm.title,
          description: podcastForm.description,
          content_url: publicUrl,
          content_type: isVideoPodcast ? 'video_podcast' : 'audio_podcast',
          duration_seconds: recordingTime,
          monthly_fee: podcastForm.subscriptionFee ? parseFloat(podcastForm.subscriptionFee) : 0,
          episode_number: podcastForm.episodeNumber ? parseInt(podcastForm.episodeNumber) : null,
          season_number: podcastForm.seasonNumber ? parseInt(podcastForm.seasonNumber) : null,
          privacy_level: 'public'
        });

      if (dbError) throw dbError;

      toast({
        title: "Upload Successful!",
        description: `Your ${isVideoPodcast ? 'video' : 'audio'} podcast has been uploaded successfully.`
      });

      // Trigger feed refresh by dispatching a custom event
      window.dispatchEvent(new CustomEvent('podcastUploaded'));
      
      resetRecording();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your podcast.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRecordedUpload = async () => {
    if (recordedChunks.length === 0) return;
    const blob = new Blob(recordedChunks, { 
      type: isVideoPodcast ? 'video/webm' : 'audio/webm' 
    });
    await uploadContent(blob);
  };

  const handleFileUpload = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validAudioTypes = ['audio/mp3', 'audio/wav', 'audio/m4a', 'audio/mpeg'];
    const validVideoTypes = ['video/mp4', 'video/mov', 'video/webm'];
    
    const isValidFile = isVideoPodcast 
      ? validVideoTypes.includes(file.type)
      : validAudioTypes.includes(file.type);

    if (!isValidFile) {
      toast({
        title: "Invalid File Type",
        description: `Please select a valid ${isVideoPodcast ? 'video' : 'audio'} file.`,
        variant: "destructive"
      });
      return;
    }

    // Check file size (max 500MB)
    if (file.size > 500 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select a file smaller than 500MB.",
        variant: "destructive"
      });
      return;
    }

    await uploadContent(file, true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCreatePodcast = () => {
    if (!podcastForm.title || !podcastForm.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Podcast Series Created!",
      description: `Your ${isVideoPodcast ? 'video' : 'audio'} podcast series has been successfully created.`,
    });

    setPodcastForm({
      title: '',
      description: '',
      subscriptionFee: '',
      category: '',
      episodeNumber: '',
      seasonNumber: ''
    });
  };

  return (
    <div className="p-4 space-y-4 pb-20 bg-white">
      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100 mb-6">
          <TabsTrigger value="create" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-pink-600">
            <Video size={16} />
            Create
          </TabsTrigger>
          <TabsTrigger value="manage" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-pink-600">
            <Users size={16} />
            My Podcasts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-4">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 pink-text">
                {isVideoPodcast ? <Video size={20} /> : <Mic size={20} />}
                Create New {isVideoPodcast ? 'Video' : 'Audio'} Podcast
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Podcast Type Toggle */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Mic size={16} className="pink-text" />
                  <span className="text-sm font-medium">Audio Podcast</span>
                </div>
                <Switch
                  checked={isVideoPodcast}
                  onCheckedChange={setIsVideoPodcast}
                  className="data-[state=checked]:bg-pink-500"
                />
                <div className="flex items-center gap-2">
                  <Video size={16} className="pink-text" />
                  <span className="text-sm font-medium">Video Podcast</span>
                </div>
              </div>

              {/* Recording Quality Settings */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Audio Quality: {bitrate[0]} kbps
                </Label>
                <Slider
                  value={bitrate}
                  onValueChange={setBitrate}
                  max={320}
                  min={64}
                  step={64}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>64 kbps (Lower quality, smaller file)</span>
                  <span>320 kbps (Higher quality, larger file)</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Podcast Title *
                </label>
                <Input
                  placeholder="Enter podcast title"
                  value={podcastForm.title}
                  onChange={(e) => setPodcastForm({...podcastForm, title: e.target.value})}
                  className="border-gray-300 focus:border-pink-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Description *
                </label>
                <Textarea
                  placeholder="Describe your podcast..."
                  value={podcastForm.description}
                  onChange={(e) => setPodcastForm({...podcastForm, description: e.target.value})}
                  className="border-gray-300 focus:border-pink-500"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Episode Number
                  </label>
                  <Input
                    type="number"
                    placeholder="1"
                    value={podcastForm.episodeNumber}
                    onChange={(e) => setPodcastForm({...podcastForm, episodeNumber: e.target.value})}
                    className="border-gray-300 focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Season Number
                  </label>
                  <Input
                    type="number"
                    placeholder="1"
                    value={podcastForm.seasonNumber}
                    onChange={(e) => setPodcastForm({...podcastForm, seasonNumber: e.target.value})}
                    className="border-gray-300 focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Monthly Subscription Fee ($)
                </label>
                <div className="relative">
                  <DollarSign size={16} className="absolute left-3 top-3 text-gray-400" />
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={podcastForm.subscriptionFee}
                    onChange={(e) => setPodcastForm({...podcastForm, subscriptionFee: e.target.value})}
                    className="pl-10 border-gray-300 focus:border-pink-500"
                    step="0.01"
                    min="0"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty for free podcast
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Category
                </label>
                <Input
                  placeholder="e.g., Education, Entertainment, Business"
                  value={podcastForm.category}
                  onChange={(e) => setPodcastForm({...podcastForm, category: e.target.value})}
                  className="border-gray-300 focus:border-pink-500"
                />
              </div>

              <Button 
                onClick={handleCreatePodcast}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white"
              >
                Create {isVideoPodcast ? 'Video' : 'Audio'} Podcast Series
              </Button>
            </CardContent>
          </Card>

          {/* Recording Section */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 pink-text">
                {isVideoPodcast ? <Video size={20} /> : <Mic size={20} />}
                Record Episode
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Video Preview or Audio Visualizer */}
              {isVideoPodcast ? (
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  {isRecording && (
                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      <span className="text-sm font-medium">{formatTime(recordingTime)} / 59:00</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 bg-gray-100 rounded-lg flex flex-col items-center space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Volume2 size={20} className="text-pink-500" />
                      <div className="w-32 h-2 bg-gray-300 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-pink-500 transition-all duration-100"
                          style={{ width: `${audioLevel}%` }}
                        />
                      </div>
                    </div>
                    {isRecording && (
                      <span className="text-sm font-medium text-gray-700">
                        {formatTime(recordingTime)} / 59:00
                      </span>
                    )}
                  </div>
                  {!isVideoPodcast && (
                    <audio ref={audioRef} controls className="hidden" />
                  )}
                </div>
              )}

              {/* Recording Controls */}
              {!hasRecordedContent ? (
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={isRecording ? stopRecording : startRecording}
                    size="lg"
                    className={`${
                      isRecording 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-pink-500 hover:bg-pink-600'
                    } text-white px-8`}
                  >
                    {isRecording ? (
                      <>
                        <Square size={20} className="mr-2" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        {isVideoPodcast ? <Video size={20} className="mr-2" /> : <Mic size={20} className="mr-2" />}
                        Start Recording
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-center gap-2">
                    <Button
                      onClick={previewRecording}
                      variant="outline"
                      size="sm"
                    >
                      <Play size={16} className="mr-2" />
                      Preview
                    </Button>
                    <Button
                      onClick={resetRecording}
                      variant="outline"
                      size="sm"
                      disabled={isUploading}
                    >
                      <RotateCcw size={16} className="mr-2" />
                      Retake
                    </Button>
                  </div>
                  
                  <Button
                    onClick={handleRecordedUpload}
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white"
                    disabled={isUploading}
                  >
                    <Upload size={20} className="mr-2" />
                    {isUploading ? 'Uploading...' : 'Upload Episode'}
                  </Button>
                </div>
              )}

              {/* File Upload Option */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or</span>
                </div>
              </div>

              <Button 
                onClick={handleFileUpload}
                variant="outline" 
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                disabled={isUploading}
              >
                <Upload size={16} className="mr-2" />
                Upload {isVideoPodcast ? 'Video' : 'Audio'} File
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                accept={isVideoPodcast ? "video/*" : "audio/*"}
                onChange={handleFileSelect}
                className="hidden"
              />
            </CardContent>
          </Card>

          {/* Recording Tips */}
          <Card className="bg-pink-50 border-pink-200">
            <CardContent className="p-4">
              <h3 className="font-semibold text-pink-800 mb-2">Recording Tips:</h3>
              <ul className="text-sm text-pink-700 space-y-1">
                <li>• Episodes are limited to 59 minutes maximum</li>
                <li>• Use headphones to prevent echo and feedback</li>
                <li>• Record in a quiet environment for best quality</li>
                <li>• {isVideoPodcast ? 'Ensure good lighting for video podcasts' : 'Speak clearly and at a consistent volume'}</li>
                <li>• You can upload pre-recorded files in MP3, WAV{isVideoPodcast ? ', MP4, or MOV' : ''} format</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="space-y-4">
          {myPodcasts.map((podcast) => (
            <Card key={podcast.id} className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-800">{podcast.title}</h3>
                      <Badge variant="outline" className="text-xs border-pink-300 text-pink-600">
                        {podcast.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{podcast.description}</p>
                  </div>
                  <Badge 
                    variant={podcast.isActive ? "default" : "secondary"}
                    className={podcast.isActive ? "bg-green-500" : ""}
                  >
                    {podcast.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center mb-4">
                  <div>
                    <div className="flex items-center justify-center gap-1">
                      <Users size={14} className="text-pink-500" />
                      <span className="text-sm font-semibold">{podcast.subscribers}</span>
                    </div>
                    <p className="text-xs text-gray-500">Subscribers</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1">
                      <DollarSign size={14} className="text-green-500" />
                      <span className="text-sm font-semibold">${podcast.monthlyFee}</span>
                    </div>
                    <p className="text-xs text-gray-500">Monthly</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1">
                      <Play size={14} className="text-blue-500" />
                      <span className="text-sm font-semibold">{podcast.episodes}</span>
                    </div>
                    <p className="text-xs text-gray-500">Episodes</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 border-gray-300 text-gray-700">
                    Edit
                  </Button>
                  <Button size="sm" className="flex-1 bg-pink-500 hover:bg-pink-600 text-white">
                    Add Episode
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PodcastTab;
