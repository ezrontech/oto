import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          plan: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          avatar_url?: string | null
          plan?: string
        }
        Update: {
          email?: string
          name?: string
          avatar_url?: string | null
          plan?: string
          updated_at?: string
        }
      }
      agents: {
        Row: {
          id: string
          user_id: string
          name: string
          role: string
          description: string
          avatar: string
          status: string
          tone: string | null
          system_prompt: string | null
          allowed_tools: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          role: string
          description: string
          avatar: string
          status?: string
          tone?: string | null
          system_prompt?: string | null
          allowed_tools?: string[] | null
        }
        Update: {
          name?: string
          role?: string
          description?: string
          avatar?: string
          status?: string
          tone?: string | null
          system_prompt?: string | null
          allowed_tools?: string[] | null
          updated_at?: string
        }
      }
      spaces: {
        Row: {
          id: string
          user_id: string
          name: string
          type: string
          description: string
          member_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type: string
          description: string
          member_count?: number
        }
        Update: {
          name?: string
          type?: string
          description?: string
          member_count?: number
          updated_at?: string
        }
      }
      contacts: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string
          phone: string | null
          status: string
          company: string | null
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          email: string
          phone?: string | null
          status?: string
          company?: string | null
          tags?: string[] | null
        }
        Update: {
          name?: string
          email?: string
          phone?: string | null
          status?: string
          company?: string | null
          tags?: string[] | null
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          user_id: string
          agent_id: string
          title: string
          messages: any[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          agent_id: string
          title: string
          messages?: any[]
        }
        Update: {
          title?: string
          messages?: any[]
          updated_at?: string
        }
      }
      articles: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          status: string
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          status?: string
          published_at?: string | null
        }
        Update: {
          title?: string
          content?: string
          status?: string
          published_at?: string | null
          updated_at?: string
        }
      }
      newsletters: {
        Row: {
          id: string
          user_id: string
          name: string
          subject: string
          content: string
          status: string
          sent_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          subject: string
          content: string
          status?: string
          sent_at?: string | null
        }
        Update: {
          name?: string
          subject?: string
          content?: string
          status?: string
          sent_at?: string | null
          updated_at?: string
        }
      }
      subscribers: {
        Row: {
          id: string
          newsletter_id: string
          email: string
          status: string
          subscribed_at: string
        }
        Insert: {
          id?: string
          newsletter_id: string
          email: string
          status?: string
        }
        Update: {
          status?: string
        }
      }
      knowledge_documents: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          file_url: string | null
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          file_url?: string | null
          tags?: string[] | null
        }
        Update: {
          title?: string
          content?: string
          file_url?: string | null
          tags?: string[] | null
          updated_at?: string
        }
      }
      analytics: {
        Row: {
          id: string
          user_id: string
          metric_name: string
          metric_value: number
          metadata: any | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          metric_name: string
          metric_value: number
          metadata?: any | null
        }
        Update: {
          metric_name?: string
          metric_value?: number
          metadata?: any | null
        }
      }
    }
  }
}
