yarn run v1.22.19
$ /mnt/sdb1/projects/fega_web/node_modules/.bin/supabase gen types typescript --project-id pzgmyzmoqyprzuruuksa
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      cameras: {
        Row: {
          description: string
          id: string
          image_poster: string
          link: string
          name: string
          original_camera: string | null
          video: boolean
        }
        Insert: {
          description: string
          id: string
          image_poster: string
          link: string
          name: string
          original_camera?: string | null
          video: boolean
        }
        Update: {
          description?: string
          id?: string
          image_poster?: string
          link?: string
          name?: string
          original_camera?: string | null
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
          uid: string
        }
        Insert: {
          created_at?: string
          group_id: string
          id?: string
          message: string
          uid?: string
        }
        Update: {
          created_at?: string
          group_id?: string
          id?: string
          message?: string
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
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_messages_uid_fkey"
            columns: ["uid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
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
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_participants_uid_fkey"
            columns: ["uid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      groups: {
        Row: {
          created_at: string
          created_by: string
          icon_url: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          created_by?: string
          icon_url?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string
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
          }
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
            foreignKeyName: "post_votes_uid_fkey"
            columns: ["uid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
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
          }
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      group_participants_view: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          group_id: string | null
          uid: string | null
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
            foreignKeyName: "group_participants_uid_fkey"
            columns: ["uid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      group_view: {
        Row: {
          created_at: string | null
          created_by: string | null
          icon_url: string | null
          id: string | null
          is_owner: boolean | null
          name: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          icon_url?: string | null
          id?: string | null
          is_owner?: never
          name?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          icon_url?: string | null
          id?: string | null
          is_owner?: never
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "groups_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Functions: {
      get_post_votes: {
        Args: {
          post_id: string
        }
        Returns: number
      }
      get_posts_with_data: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          uid: string
          created_at: string
          description: string
          images: string[]
          full_name: string
          avatar_url: string
          vote_type: Database["public"]["Enums"]["post_vote_type"]
          votes: number
        }[]
      }
      is_group_participant: {
        Args: {
          group_id: string
          uid: string
        }
        Returns: boolean
      }
      user_can_post: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      post_vote_type: "up" | "down"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
Done in 2.63s.
