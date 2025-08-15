import { useState } from 'react';
import { PodcastData } from './usePodcasts';

export const usePodcastPlayer = () => {
  const [currentPodcast, setCurrentPodcast] = useState<PodcastData | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  const playPodcast = (podcast: PodcastData) => {
    setCurrentPodcast(podcast);
    setIsPlayerOpen(true);
  };

  const closePodcast = () => {
    setIsPlayerOpen(false);
    setCurrentPodcast(null);
  };

  return {
    currentPodcast,
    isPlayerOpen,
    playPodcast,
    closePodcast
  };
};