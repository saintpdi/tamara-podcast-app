
import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Camera, Square, RotateCcw, Upload, Palette, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface VideoFilter {
  name: string;
  cssFilter: string;
}

const VIDEO_FILTERS: VideoFilter[] = [
  { name: 'None', cssFilter: '' },
  { name: 'Sepia', cssFilter: 'sepia(100%)' },
  { name: 'Grayscale', cssFilter: 'grayscale(100%)' },
  { name: 'Vintage', cssFilter: 'sepia(50%) contrast(1.2) brightness(0.9)' },
  { name: 'Cool', cssFilter: 'hue-rotate(180deg) saturate(1.3)' },
  { name: 'Warm', cssFilter: 'hue-rotate(30deg) saturate(1.2) brightness(1.1)' },
  { name: 'Contrast', cssFilter: 'contrast(1.5) brightness(1.1)' },
  { name: 'Blur', cssFilter: 'blur(2px)' }
];

const VideoCreationTab = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(VIDEO_FILTERS[0]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [hasRecordedVideo, setHasRecordedVideo] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { user } = useAuth();

  const startCamera = useCallback(async () => {
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
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive"
      });
    }
  }, []);

  useEffect(() => {
    startCamera();
    
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, [startCamera]);

  const startRecording = () => {
    if (!streamRef.current) return;

    const mediaRecorder = new MediaRecorder(streamRef.current, {
      mimeType: 'video/webm;codecs=vp8,opus'
    });

    mediaRecorderRef.current = mediaRecorder;
    setRecordedChunks([]);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setRecordedChunks(prev => [...prev, event.data]);
      }
    };

    mediaRecorder.onstop = () => {
      setHasRecordedVideo(true);
    };

    mediaRecorder.start();
    setIsRecording(true);
    setRecordingTime(0);

    // Start recording timer (max 60 seconds)
    recordingIntervalRef.current = setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= 59) {
          stopRecording();
          return 60;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  const resetRecording = () => {
    setRecordedChunks([]);
    setHasRecordedVideo(false);
    setRecordingTime(0);
    setVideoTitle('');
    setVideoDescription('');
    startCamera();
  };

  const takePhoto = async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    if (context) {
      // Apply filter to canvas
      context.filter = selectedFilter.cssFilter;
      context.drawImage(videoRef.current, 0, 0);
      
      canvas.toBlob(async (blob) => {
        if (blob && user) {
          await uploadFile(blob, 'photo', `photo_${Date.now()}.jpg`);
        }
      }, 'image/jpeg', 0.8);
    }
  };

  const uploadFile = async (file: Blob, type: 'video' | 'photo', filename: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to upload content.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('videos')
        .upload(`${user.id}/${filename}`, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(uploadData.path);

      // Save to database
      const { error: dbError } = await supabase
        .from('videos')
        .insert({
          user_id: user.id,
          title: videoTitle || (type === 'video' ? 'Untitled Video' : 'Photo'),
          description: videoDescription,
          video_url: publicUrl,
          thumbnail_url: publicUrl,
          duration_seconds: type === 'video' ? recordingTime : null,
          privacy_level: 'public'
        });

      if (dbError) throw dbError;

      toast({
        title: "Upload Successful!",
        description: `Your ${type} has been uploaded successfully.`
      });

      // Trigger feed refresh by dispatching a custom event
      window.dispatchEvent(new CustomEvent('videoUploaded'));
      
      resetRecording();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your content.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleVideoUpload = async () => {
    if (recordedChunks.length === 0) return;

    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const filename = `video_${Date.now()}.webm`;
    
    await uploadFile(blob, 'video', filename);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="pb-20 bg-white">
      <div className="relative">
        {/* Camera Preview */}
        <div className="relative aspect-[9/16] bg-black rounded-lg overflow-hidden mx-4 mt-20">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
            style={{ filter: selectedFilter.cssFilter }}
          />
          
          {/* Recording indicator */}
          {isRecording && (
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-sm font-medium">{formatTime(recordingTime)} / 1:00</span>
            </div>
          )}

          {/* Filter name */}
          {selectedFilter.name !== 'None' && (
            <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
              {selectedFilter.name}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="p-4 space-y-4">
          {/* Filter Toggle */}
          <div className="flex justify-center">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Palette size={16} />
              Filters
            </Button>
          </div>

          {/* Filter Selection */}
          {showFilters && (
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-4 gap-2">
                  {VIDEO_FILTERS.map((filter) => (
                    <button
                      key={filter.name}
                      onClick={() => setSelectedFilter(filter)}
                      className={`p-2 rounded text-xs border ${
                        selectedFilter.name === filter.name
                          ? 'border-pink-500 bg-pink-50 text-pink-600'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {filter.name}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Video Details Form */}
          {hasRecordedVideo && (
            <Card>
              <CardContent className="p-4 space-y-4">
                <div>
                  <Label htmlFor="title">Video Title</Label>
                  <Input
                    id="title"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    placeholder="Enter video title..."
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input
                    id="description"
                    value={videoDescription}
                    onChange={(e) => setVideoDescription(e.target.value)}
                    placeholder="Add a description..."
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            {!hasRecordedVideo ? (
              <>
                <Button
                  onClick={takePhoto}
                  variant="outline"
                  size="lg"
                  className="flex-1 max-w-32"
                  disabled={isRecording}
                >
                  <Camera size={20} />
                </Button>
                
                <Button
                  onClick={isRecording ? stopRecording : startRecording}
                  size="lg"
                  className={`flex-1 max-w-32 ${
                    isRecording 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-pink-500 hover:bg-pink-600'
                  }`}
                >
                  {isRecording ? <Square size={20} /> : <div className="w-5 h-5 bg-white rounded-full" />}
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={resetRecording}
                  variant="outline"
                  size="lg"
                  disabled={isUploading}
                >
                  <RotateCcw size={20} />
                  Retake
                </Button>
                
                <Button
                  onClick={handleVideoUpload}
                  size="lg"
                  className="bg-pink-500 hover:bg-pink-600"
                  disabled={isUploading}
                >
                  <Upload size={20} />
                  {isUploading ? 'Uploading...' : 'Upload Video'}
                </Button>
              </>
            )}
          </div>

          {/* Recording Tips */}
          <Card className="bg-pink-50 border-pink-200">
            <CardContent className="p-4">
              <h3 className="font-semibold text-pink-800 mb-2">Recording Tips:</h3>
              <ul className="text-sm text-pink-700 space-y-1">
                <li>• Videos are limited to 1 minute maximum</li>
                <li>• Hold your phone vertically for best results</li>
                <li>• Ensure good lighting for quality videos</li>
                <li>• Try different filters to enhance your content</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VideoCreationTab;
