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
          video: boolean
        }
        Insert: {
          description: string
          id: string
          image_poster: string
          link: string
          name: string
          video: boolean
        }
        Update: {
          description?: string
          id?: string
          image_poster?: string
          link?: string
          name?: string
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
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_messages_uid_fkey"
            columns: ["uid"]
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
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_participants_uid_fkey"
            columns: ["uid"]
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
          id: string
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
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_group_participant: {
        Args: {
          group_id: string
          uid: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
