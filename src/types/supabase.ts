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
          code: string
          status: string
          created_at: string
          expires_at: string | null
        }
        Insert: {
          code: string
          status?: string
          created_at?: string
          expires_at?: string | null
        }
        Update: {
          code?: string
          status?: string
          created_at?: string
          expires_at?: string | null
        }
        Relationships: []
      }
      registrations: {
        Row: {
          id: string
          code: string
          school: string
          student_count: number
          travel_date: string
          additional_notes: string | null
          email: string
          contact_person: string
          phone_number: string
          class: string
          accompanist_count: number
          arrival_time: string
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          school: string
          student_count: number
          travel_date: string
          additional_notes?: string | null
          email: string
          contact_person: string
          phone_number: string
          class: string
          accompanist_count: number
          arrival_time: string
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          school?: string
          student_count?: number
          travel_date?: string
          additional_notes?: string | null
          email?: string
          contact_person?: string
          phone_number?: string
          class?: string
          accompanist_count?: number
          arrival_time?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "registrations_code_fkey"
            columns: ["code"]
            referencedRelation: "codes"
            referencedColumns: ["code"]
          }
        ]
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