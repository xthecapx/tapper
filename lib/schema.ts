export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          created_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          created_at?: string
        }
      }
      tapper_logs: {
        Row: {
          id: number
          user_id: string
          log_date: string
          is_tapper: boolean
          is_exercise: boolean
          logged_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          log_date: string
          is_tapper?: boolean
          is_exercise?: boolean
          logged_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          log_date?: string
          is_tapper?: boolean
          is_exercise?: boolean
          logged_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      todos: {
        Row: {
          id: number
          inserted_at: string
          is_complete: boolean | null
          task: string | null
          user_id: string
        }
        Insert: {
          id?: number
          inserted_at?: string
          is_complete?: boolean | null
          task?: string | null
          user_id: string
        }
        Update: {
          id?: number
          inserted_at?: string
          is_complete?: boolean | null
          task?: string | null
          user_id?: string
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
