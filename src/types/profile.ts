
export interface UserProfile {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  is_verified: boolean;
  hide_videos_tab: boolean;
  hide_subscriptions_tab: boolean;
}

export interface UserVideo {
  id: string;
  title: string;
  thumbnail_url: string | null;
  like_count: number;
  view_count: number;
  created_at: string;
}

export interface UserPodcast {
  id: string;
  title: string;
  description: string | null;
  content_url?: string;
  content_type: 'audio_podcast' | 'video_podcast';
  thumbnail_url: string | null;
  like_count: number;
  play_count: number;
  subscriber_count: number;
  monthly_fee: number;
  created_at: string;
}
