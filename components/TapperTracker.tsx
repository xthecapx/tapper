import { useState, useEffect } from 'react'
import { useSupabaseClient, Session } from '@supabase/auth-helpers-react'

interface User {
  id: string
  name: string
  email: string
}

interface TapperLog {
  id: number
  user_id: string
  log_date: string
  is_tapper: boolean
  logged_by: string
  users: User
}

interface TapperTrackerProps {
  session: Session
}

export default function TapperTracker({ session }: TapperTrackerProps) {
  const supabase = useSupabaseClient()
  const [users, setUsers] = useState<User[]>([])
  const [tapperLogs, setTapperLogs] = useState<TapperLog[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  // Get last 7 days for the table
  const getLast7Days = () => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      days.push(date.toISOString().split('T')[0])
    }
    return days
  }

  const days = getLast7Days()

  useEffect(() => {
    fetchUsers()
    fetchTapperLogs()
  }, [])

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('name')
      
      if (error) throw error
      setUsers(data as User[] || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const fetchTapperLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('tapper_logs')
        .select(`
          *,
          users!tapper_logs_user_id_fkey(name, email)
        `)
        .gte('log_date', days[0])
        .order('log_date', { ascending: false })
      
      if (error) throw error
      setTapperLogs(data as TapperLog[] || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching tapper logs:', error)
      setLoading(false)
    }
  }

  const toggleTapper = async (userId: string, date: string) => {
    try {
      // Check if log exists for this user and date
      const existingLog = tapperLogs.find(
        log => log.user_id === userId && log.log_date === date
      )

      if (existingLog) {
        // Update existing log
        const { error } = await supabase
          .from('tapper_logs')
          .update({ 
            is_tapper: !existingLog.is_tapper,
            logged_by: session.user.id
          })
          .eq('id', existingLog.id)
        
        if (error) throw error
      } else {
        // Create new log
        const { error } = await supabase
          .from('tapper_logs')
          .insert({
            user_id: userId,
            log_date: date,
            is_tapper: true,
            logged_by: session.user.id
          })
        
        if (error) throw error
      }

      // Refresh the data
      fetchTapperLogs()
    } catch (error) {
      console.error('Error toggling tapper:', error)
    }
  }

  const getTapperStatus = (userId: string, date: string): boolean => {
    const log = tapperLogs.find(
      log => log.user_id === userId && log.log_date === date
    )
    return log?.is_tapper || false
  }

  if (loading) {
    return <div className="text-center p-4">Loading...</div>
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Tapper Tracker 🍔
      </h1>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                {days.map(date => (
                  <th key={date} className="px-4 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                    {new Date(date).toLocaleDateString('en-US', { 
                      weekday: 'short',
                      month: 'numeric',
                      day: 'numeric'
                    })}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  {days.map(date => {
                    const isTapper = getTapperStatus(user.id, date)
                    return (
                      <td key={`${user.id}-${date}`} className="px-4 py-4 text-center">
                        <button
                          onClick={() => toggleTapper(user.id, date)}
                          className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                            isTapper
                              ? 'bg-red-500 border-red-500 text-white'
                              : 'bg-white border-gray-300 hover:border-gray-400'
                          }`}
                          title={isTapper ? 'Tapper day!' : 'Clean day'}
                        >
                          {isTapper ? '🍔' : '✅'}
                        </button>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {users.length === 0 && (
        <div className="text-center mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-yellow-800">
            No users found. Sign up more users to start tracking! 
          </p>
        </div>
      )}

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Click the circles to mark tapper days (bad eating) for each user.</p>
        <p>🍔 = Tapper day, ✅ = Clean day</p>
      </div>
    </div>
  )
} 