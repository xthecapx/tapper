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

interface TrackingTabProps {
  users: User[]
  tapperLogs: TapperLog[]
  session: Session
  onRefresh: () => void
}

export default function TrackingTab({ users, tapperLogs, session, onRefresh }: TrackingTabProps) {
  const supabase = useSupabaseClient()

  // Get last 7 days for the table (Monday to Sunday)
  const getLast7Days = () => {
    const days = []
    const today = new Date()
    
    // Find the most recent Monday
    const dayOfWeek = today.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1 // Convert to Monday-based week
    
    // Start from the most recent Monday
    const startDate = new Date(today)
    startDate.setDate(today.getDate() - daysFromMonday)
    
    // Generate 7 days starting from that Monday
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      days.push(date.toISOString().split('T')[0])
    }
    
    return days
  }

  const days = getLast7Days()

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
      onRefresh()
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

  return (
    <div>
      <h2 className="text-lg sm:text-xl font-bold text-center mb-4 text-gray-800">
        Seguimiento Diario (Semana actual: Lunes a Domingo)
      </h2>
      <div className="bg-gray-50 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                {days.map(date => (
                  <th key={date} className="px-1 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    <div className="hidden sm:block">
                      {new Date(date).toLocaleDateString('es-ES', { 
                        weekday: 'short',
                        month: 'numeric',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="sm:hidden">
                      {new Date(date).toLocaleDateString('es-ES', { 
                        weekday: 'narrow'
                      })}
                      <br />
                      <span className="text-xs">
                        {new Date(date).getDate()}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-2 sm:px-4 py-2 sm:py-4 whitespace-nowrap">
                    <div className="text-xs sm:text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-xs text-gray-500 hidden sm:block">{user.email}</div>
                  </td>
                  {days.map(date => {
                    const isTapper = getTapperStatus(user.id, date)
                    return (
                      <td key={`${user.id}-${date}`} className="px-1 sm:px-4 py-2 sm:py-4 text-center">
                        <button
                          onClick={() => toggleTapper(user.id, date)}
                          className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 transition-all duration-200 text-xs sm:text-base ${
                            isTapper
                              ? 'bg-red-500 border-red-500 text-white'
                              : 'bg-white border-gray-300 hover:border-gray-400'
                          }`}
                          title={isTapper ? '¡Día de tapper! ¡Qué vergüenza!' : 'Día limpio'}
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
            No hay usuarios. ¡Regístrate con tus amigos para empezar a exponer a los tappers! 
          </p>
        </div>
      )}
    </div>
  )
} 