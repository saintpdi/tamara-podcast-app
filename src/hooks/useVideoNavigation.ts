import { create } from 'zustand';

interface VideoNavigationState {
  sourceVideo?: {
    id: string;
    index: number;
    tab: 'following' | 'whats-happening';
  };
  setSourceVideo: (video: { id: string; index: number; tab: 'following' | 'whats-happening' }) => void;
  clearSourceVideo: () => void;
}

export const useVideoNavigation = create<VideoNavigationState>((set) => ({
  sourceVideo: undefined,
  setSourceVideo: (video) => set({ sourceVideo: video }),
  clearSourceVideo: () => set({ sourceVideo: undefined }),
}));