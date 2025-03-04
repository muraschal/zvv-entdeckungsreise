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
      codes: {
        Row: {
          id: string
          code: string
          status: string
          created_at: string
          expires_at: string | null
        }
        Insert: {
          id?: string
          code: string
          status?: string
          created_at?: string
          expires_at?: string | null
        }
        Update: {
          id?: string
          code?: string
          status?: string
          created_at?: string
          expires_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 