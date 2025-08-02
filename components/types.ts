export interface User {
  id: string
  name: string
  email: string
}

export interface TapperLog {
  id: number
  user_id: string
  log_date: string
  is_tapper: boolean
  is_slacker: boolean | null
  logged_by: string
  created_at: string
  updated_at: string
  users: User
}

export type TabType = 'tracking' | 'cards' | 'table' | 'info' 