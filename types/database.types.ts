export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      calendar_events: {
        Row: {
          content: string
          cover_image: string
          description: string | null
          end_date: string
          id: number
          location: number | null
          other_data: Json
          start_date: string
          title: string
        }
        Insert: {
          content?: string
          cover_image: string
          description?: string | null
          end_date: string
          id?: number
          location?: number | null
          other_data: Json
          start_date: string
          title?: string
        }
        Update: {
          content?: string
          cover_image?: string
          description?: string | null
          end_date?: string
          id?: number
          location?: number | null
          other_data?: Json
          start_date?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_calendar_events_location_fkey"
            columns: ["location"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      cameras: {
        Row: {
          description: string
          id: string
          image_poster: string
          link: string
          name: string
          original_camera_name: string | null
          original_camera_url: string | null
          video: boolean
        }
        Insert: {
          description: string
          id: string
          image_poster: string
          link: string
          name: string
          original_camera_name?: string | null
          original_camera_url?: string | null
          video: boolean
        }
        Update: {
          description?: string
          id?: string
          image_poster?: string
          link?: string
          name?: string
          original_camera_name?: string | null
          original_camera_url?: string | null
          video?: boolean
        }
        Relationships: []
      }
      group_messages: {
        Row: {
          created_at: string
          group_id: string
          id: string
          message: string
          reply_to: string | null
          uid: string
        }
        Insert: {
          created_at?: string
          group_id: string
          id?: string
          message: string
          reply_to?: string | null
          uid?: string
        }
        Update: {
          created_at?: string
          group_id?: string
          id?: string
          message?: string
          reply_to?: string | null
          uid?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "group_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "group_with_last_message_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_messages_uid_fkey"
            columns: ["uid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_group_messages_reply_message_fkey"
            columns: ["reply_to"]
            isOneToOne: false
            referencedRelation: "group_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_group_messages_reply_message_fkey"
            columns: ["reply_to"]
            isOneToOne: false
            referencedRelation: "group_messages_view"
            referencedColumns: ["id"]
          },
        ]
      }
      group_participants: {
        Row: {
          created_at: string
          group_id: string
          uid: string
        }
        Insert: {
          created_at?: string
          group_id: string
          uid: string
        }
        Update: {
          created_at?: string
          group_id?: string
          uid?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_participants_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "group_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_participants_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "group_with_last_message_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_participants_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_participants_uid_fkey"
            columns: ["uid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          created_at: string
          created_by: string | null
          icon_url: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          icon_url?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          icon_url?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "groups_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          address: string | null
          id: number
          name: string
          point: unknown
        }
        Insert: {
          address?: string | null
          id?: number
          name: string
          point: unknown
        }
        Update: {
          address?: string | null
          id?: number
          name?: string
          point?: unknown
        }
        Relationships: []
      }
      news: {
        Row: {
          content: string
          cover_image: string
          created_at: string
          created_by: string
          description: string | null
          id: string
          tags: string[] | null
          title: string
        }
        Insert: {
          content: string
          cover_image: string
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          tags?: string[] | null
          title: string
        }
        Update: {
          content?: string
          cover_image?: string
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          tags?: string[] | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_news_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      post_votes: {
        Row: {
          created_at: string
          post_id: string
          uid: string
          vote_type: Database["public"]["Enums"]["post_vote_type"] | null
        }
        Insert: {
          created_at?: string
          post_id: string
          uid?: string
          vote_type?: Database["public"]["Enums"]["post_vote_type"] | null
        }
        Update: {
          created_at?: string
          post_id?: string
          uid?: string
          vote_type?: Database["public"]["Enums"]["post_vote_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "post_votes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_votes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_votes_uid_fkey"
            columns: ["uid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          created_at: string
          description: string
          id: string
          images: string[]
          uid: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          images?: string[]
          uid?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          images?: string[]
          uid?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_uid_fkey"
            columns: ["uid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          id: number
          permission: Database["public"]["Enums"]["app_permission"]
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          id?: number
          permission: Database["public"]["Enums"]["app_permission"]
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          id?: number
          permission?: Database["public"]["Enums"]["app_permission"]
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: number
          role: Database["public"]["Enums"]["app_role"]
          uid: string
        }
        Insert: {
          id?: number
          role: Database["public"]["Enums"]["app_role"]
          uid: string
        }
        Update: {
          id?: number
          role?: Database["public"]["Enums"]["app_role"]
          uid?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_uid_fkey"
            columns: ["uid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      calendar_events_view: {
        Row: {
          content: string | null
          cover_image: string | null
          description: string | null
          end_date: string | null
          id: number | null
          location_address: string | null
          location_lat: number | null
          location_lng: number | null
          location_name: string | null
          other_data: Json | null
          short_id: string | null
          start_date: string | null
          title: string | null
        }
        Relationships: []
      }
      group_messages_view: {
        Row: {
          created_at: string | null
          group_id: string | null
          id: string | null
          message: string | null
          reply_message: string | null
          reply_to: string | null
          reply_to_uid: string | null
          uid: string | null
          user_avatar_url: string | null
          user_full_name: string | null
          user_username: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "group_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "group_with_last_message_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_messages_uid_fkey"
            columns: ["uid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_messages_uid_fkey"
            columns: ["reply_to_uid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_group_messages_reply_message_fkey"
            columns: ["reply_to"]
            isOneToOne: false
            referencedRelation: "group_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_group_messages_reply_message_fkey"
            columns: ["reply_to"]
            isOneToOne: false
            referencedRelation: "group_messages_view"
            referencedColumns: ["id"]
          },
        ]
      }
      group_participants_view: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          group_id: string | null
          uid: string | null
          username: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_participants_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_participants_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "group_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_participants_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "group_with_last_message_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_participants_uid_fkey"
            columns: ["uid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      group_view: {
        Row: {
          author_avatar_url: string | null
          author_name: string | null
          author_username: string | null
          created_at: string | null
          created_by: string | null
          icon_url: string | null
          id: string | null
          is_owner: boolean | null
          name: string | null
          participants_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "groups_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      group_with_last_message_view: {
        Row: {
          author_avatar_url: string | null
          author_name: string | null
          author_username: string | null
          created_at: string | null
          created_by: string | null
          icon_url: string | null
          id: string | null
          is_owner: boolean | null
          last_message: string | null
          last_message_at: string | null
          last_message_by: string | null
          name: string | null
          participants_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "group_messages_uid_fkey"
            columns: ["last_message_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "groups_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      news_view: {
        Row: {
          author_avatar_url: string | null
          author_full_name: string | null
          content: string | null
          cover_image: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string | null
          tags: string[] | null
          title: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_news_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      posts_view: {
        Row: {
          author_avatar_url: string | null
          author_full_name: string | null
          author_username: string | null
          created_at: string | null
          description: string | null
          id: string | null
          images: string[] | null
          uid: string | null
          user_vote_type: Database["public"]["Enums"]["post_vote_type"] | null
          votes: number | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_uid_fkey"
            columns: ["uid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      authorize: {
        Args: {
          requested_permission: Database["public"]["Enums"]["app_permission"]
        }
        Returns: boolean
      }
      custom_access_token_hook: {
        Args: {
          event: Json
        }
        Returns: Json
      }
      generate_username: {
        Args: {
          full_name: string
          email: string
        }
        Returns: string
      }
      get_post_votes: {
        Args: {
          post_id: string
        }
        Returns: number
      }
      is_group_full: {
        Args: {
          group_id: string
        }
        Returns: boolean
      }
      is_group_participant: {
        Args: {
          group_id: string
          uid: string
        }
        Returns: boolean
      }
      search_users_by_fullname: {
        Args: {
          search: string
        }
        Returns: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string | null
          username: string
        }[]
      }
      search_users_by_username: {
        Args: {
          search: string
        }
        Returns: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string | null
          username: string
        }[]
      }
      user_can_post: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_permission: "news.create" | "events.create" | "locations.create"
      app_role: "admin" | "moderator"
      post_vote_type: "up" | "down"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    ? (PublicSchema["Tables"] & PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema["Enums"] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
