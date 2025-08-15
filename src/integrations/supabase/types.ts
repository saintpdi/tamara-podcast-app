export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          email: string
          id: string
          is_active: boolean | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_active?: boolean | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean | null
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          podcast_id: string | null
          updated_at: string | null
          user_id: string
          video_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          podcast_id?: string | null
          updated_at?: string | null
          user_id: string
          video_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          podcast_id?: string | null
          updated_at?: string | null
          user_id?: string
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_podcast_id_fkey"
            columns: ["podcast_id"]
            isOneToOne: false
            referencedRelation: "podcasts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_submissions: {
        Row: {
          admin_response: string | null
          category: string | null
          created_at: string
          email: string
          id: string
          message: string
          name: string
          responded_at: string | null
          responded_by: string | null
          status: string | null
          subject: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_response?: string | null
          category?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          responded_at?: string | null
          responded_by?: string | null
          status?: string | null
          subject?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_response?: string | null
          category?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          responded_at?: string | null
          responded_by?: string | null
          status?: string | null
          subject?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      follows: {
        Row: {
          created_at: string | null
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string | null
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: []
      }
      interest_categories: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      likes: {
        Row: {
          created_at: string | null
          id: string
          podcast_id: string | null
          user_id: string
          video_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          podcast_id?: string | null
          user_id: string
          video_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          podcast_id?: string | null
          user_id?: string
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "likes_podcast_id_fkey"
            columns: ["podcast_id"]
            isOneToOne: false
            referencedRelation: "podcasts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_earnings: {
        Row: {
          created_at: string
          creator_amount: number
          creator_id: string
          fee_amount: number
          fee_percentage: number
          id: string
          original_amount: number
          transaction_id: string
          transaction_type: string
        }
        Insert: {
          created_at?: string
          creator_amount: number
          creator_id: string
          fee_amount: number
          fee_percentage: number
          id?: string
          original_amount: number
          transaction_id: string
          transaction_type: string
        }
        Update: {
          created_at?: string
          creator_amount?: number
          creator_id?: string
          fee_amount?: number
          fee_percentage?: number
          id?: string
          original_amount?: number
          transaction_id?: string
          transaction_type?: string
        }
        Relationships: []
      }
      podcast_categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      podcast_plays: {
        Row: {
          id: string
          played_at: string
          podcast_id: string
          progress_seconds: number | null
          user_id: string | null
        }
        Insert: {
          id?: string
          played_at?: string
          podcast_id: string
          progress_seconds?: number | null
          user_id?: string | null
        }
        Update: {
          id?: string
          played_at?: string
          podcast_id?: string
          progress_seconds?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "podcast_plays_podcast_id_fkey"
            columns: ["podcast_id"]
            isOneToOne: false
            referencedRelation: "podcasts"
            referencedColumns: ["id"]
          },
        ]
      }
      podcasts: {
        Row: {
          category_id: string | null
          content_type: Database["public"]["Enums"]["content_type"]
          content_url: string
          created_at: string | null
          description: string | null
          duration_seconds: number | null
          episode_number: number | null
          hashtags: string[] | null
          id: string
          like_count: number | null
          monthly_fee: number | null
          play_count: number | null
          privacy_level: Database["public"]["Enums"]["privacy_level"] | null
          season_number: number | null
          subscriber_count: number | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category_id?: string | null
          content_type: Database["public"]["Enums"]["content_type"]
          content_url: string
          created_at?: string | null
          description?: string | null
          duration_seconds?: number | null
          episode_number?: number | null
          hashtags?: string[] | null
          id?: string
          like_count?: number | null
          monthly_fee?: number | null
          play_count?: number | null
          privacy_level?: Database["public"]["Enums"]["privacy_level"] | null
          season_number?: number | null
          subscriber_count?: number | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category_id?: string | null
          content_type?: Database["public"]["Enums"]["content_type"]
          content_url?: string
          created_at?: string | null
          description?: string | null
          duration_seconds?: number | null
          episode_number?: number | null
          hashtags?: string[] | null
          id?: string
          like_count?: number | null
          monthly_fee?: number | null
          play_count?: number | null
          privacy_level?: Database["public"]["Enums"]["privacy_level"] | null
          season_number?: number | null
          subscriber_count?: number | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "podcasts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "podcast_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          hide_subscriptions_tab: boolean | null
          hide_videos_tab: boolean | null
          id: string
          is_verified: boolean | null
          profile_privacy: Database["public"]["Enums"]["privacy_level"] | null
          social_links: Json | null
          updated_at: string | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          hide_subscriptions_tab?: boolean | null
          hide_videos_tab?: boolean | null
          id: string
          is_verified?: boolean | null
          profile_privacy?: Database["public"]["Enums"]["privacy_level"] | null
          social_links?: Json | null
          updated_at?: string | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          hide_subscriptions_tab?: boolean | null
          hide_videos_tab?: boolean | null
          id?: string
          is_verified?: boolean | null
          profile_privacy?: Database["public"]["Enums"]["privacy_level"] | null
          social_links?: Json | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string | null
          creator_id: string
          ends_at: string | null
          id: string
          monthly_fee: number
          podcast_id: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["subscription_status"] | null
          subscriber_id: string
        }
        Insert: {
          created_at?: string | null
          creator_id: string
          ends_at?: string | null
          id?: string
          monthly_fee: number
          podcast_id?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          subscriber_id: string
        }
        Update: {
          created_at?: string | null
          creator_id?: string
          ends_at?: string | null
          id?: string
          monthly_fee?: number
          podcast_id?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          subscriber_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_podcast_id_fkey"
            columns: ["podcast_id"]
            isOneToOne: false
            referencedRelation: "podcasts"
            referencedColumns: ["id"]
          },
        ]
      }
      tips: {
        Row: {
          amount: number
          content_id: string | null
          content_type: string | null
          created_at: string
          creator_id: string
          id: string
          message: string | null
          status: string | null
          stripe_payment_intent_id: string | null
          tipper_id: string
        }
        Insert: {
          amount: number
          content_id?: string | null
          content_type?: string | null
          created_at?: string
          creator_id: string
          id?: string
          message?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          tipper_id: string
        }
        Update: {
          amount?: number
          content_id?: string | null
          content_type?: string | null
          created_at?: string
          creator_id?: string
          id?: string
          message?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          tipper_id?: string
        }
        Relationships: []
      }
      user_interests: {
        Row: {
          category_id: string | null
          created_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_interests_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "interest_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      videos: {
        Row: {
          comment_count: number | null
          created_at: string | null
          description: string | null
          duration_seconds: number | null
          hashtags: string[] | null
          id: string
          like_count: number | null
          music: string | null
          privacy_level: Database["public"]["Enums"]["privacy_level"] | null
          shares: number | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          user_id: string
          video_url: string
          view_count: number | null
        }
        Insert: {
          comment_count?: number | null
          created_at?: string | null
          description?: string | null
          duration_seconds?: number | null
          hashtags?: string[] | null
          id?: string
          like_count?: number | null
          music?: string | null
          privacy_level?: Database["public"]["Enums"]["privacy_level"] | null
          shares?: number | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          user_id: string
          video_url: string
          view_count?: number | null
        }
        Update: {
          comment_count?: number | null
          created_at?: string | null
          description?: string | null
          duration_seconds?: number | null
          hashtags?: string[] | null
          id?: string
          like_count?: number | null
          music?: string | null
          privacy_level?: Database["public"]["Enums"]["privacy_level"] | null
          shares?: number | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
          video_url?: string
          view_count?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_privacy_settings: {
        Args: { user_uuid: string }
        Returns: {
          hide_videos_tab: boolean
          hide_subscriptions_tab: boolean
          profile_privacy: Database["public"]["Enums"]["privacy_level"]
        }[]
      }
      increment_play_count: {
        Args: { podcast_id: string }
        Returns: undefined
      }
      increment_view_count: {
        Args: { video_id: string }
        Returns: undefined
      }
      is_admin: {
        Args: { user_email: string }
        Returns: boolean
      }
      is_following: {
        Args: { follower_uuid: string; following_uuid: string }
        Returns: boolean
      }
      record_platform_fee: {
        Args: {
          p_transaction_type: string
          p_original_amount: number
          p_fee_percentage: number
          p_transaction_id: string
          p_creator_id: string
        }
        Returns: number
      }
    }
    Enums: {
      content_type: "video" | "audio_podcast" | "video_podcast"
      privacy_level: "public" | "private" | "followers_only"
      subscription_status: "active" | "cancelled" | "expired"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      content_type: ["video", "audio_podcast", "video_podcast"],
      privacy_level: ["public", "private", "followers_only"],
      subscription_status: ["active", "cancelled", "expired"],
    },
  },
} as const
