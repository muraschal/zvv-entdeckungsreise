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
          id: number
          code: string
          status: 'unused' | 'used'
          expires_at: string
          created_at: string
        }
        Insert: {
          id?: number
          code: string
          status?: 'unused' | 'used'
          expires_at: string
          created_at?: string
        }
        Update: {
          id?: number
          code?: string
          status?: 'unused' | 'used'
          expires_at?: string
          created_at?: string
        }
      }
      registrations: {
        Row: {
          id: string
          code: string
          school: string
          student_count: number
          travel_date: string
          additional_notes?: string
          email: string
          class: string
          contact_person: string
          phone_number: string
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
          additional_notes?: string
          email: string
          class: string
          contact_person: string
          phone_number: string
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
          additional_notes?: string
          email?: string
          class?: string
          contact_person?: string
          phone_number?: string
          accompanist_count?: number
          arrival_time?: string
          created_at?: string
        }
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
  }
} 