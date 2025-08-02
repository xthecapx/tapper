import { useState } from 'react'
import { useSupabaseClient, Session } from '@supabase/auth-helpers-react'
import { User, TapperLog } from './types'
import StatusDropdown, { StatusType, getStatusFromBooleans, getBooleansFromStatus } from './StatusDropdown'
import { 
  startOfWeek, 
  addDays, 
  format, 
  isToday as isTodayFns,
  isSunday 
} from 'date-fns'
import { es } from 'date-fns/locale'

interface TrackingTabProps {
  users: User[]
  tapperLogs: TapperLog[]
  session: Session
  onRefresh: () => void
}

interface AnimationState {
  show: boolean
  emoji: string
  message: string
  isPositive: boolean
}

export default function TrackingTab({ users, tapperLogs, session, onRefresh }: TrackingTabProps) {
  const supabase = useSupabaseClient()
  const [animationState, setAnimationState] = useState<AnimationState>({
    show: false,
    emoji: '',
    message: '',
    isPositive: false
  })

  // Get current week (Monday to Sunday) for the table using date-fns
  const getCurrentWeek = () => {
    const today = new Date()
    
    // Get the start of the current week (Monday)
    // Note: date-fns startOfWeek with weekStartsOn: 1 means Monday = start
    const mondayOfWeek = startOfWeek(today, { weekStartsOn: 1 })
    
    // Generate 7 days starting from Monday
    const days = []
    for (let i = 0; i < 7; i++) {
      const date = addDays(mondayOfWeek, i)
      days.push(format(date, 'yyyy-MM-dd'))
    }
    
    // Get today as string for comparison
    const todayString = format(today, 'yyyy-MM-dd')
    
    // Debug output
    console.log('getCurrentWeek debug (date-fns):', {
      today: format(today, 'EEEE, d MMMM yyyy', { locale: es }),
      todayString: todayString,
      mondayOfWeek: format(mondayOfWeek, 'EEEE, d MMMM yyyy', { locale: es }),
      weekDates: days,
      todayInWeek: days.includes(todayString),
      weekRange: `${format(mondayOfWeek, 'EEE d', { locale: es })} - ${format(addDays(mondayOfWeek, 6), 'EEE d', { locale: es })}`
    })
    
    return { days, todayString }
  }

  const { days, todayString } = getCurrentWeek()

  // Helper function to get user's total tapper count (excluding Sundays)
  const getUserTapperCount = (userId: string): number => {
    return tapperLogs.filter(log => {
      const matchesUser = log.user_id === userId
      const isTapper = log.is_tapper
      
      // Exclude Sundays from penalty calculations
      const logDate = new Date(log.log_date + 'T00:00:00')
      const isSundayDay = isSunday(logDate)
      
      return matchesUser && isTapper && !isSundayDay
    }).length
  }

  // Helper function to get user's total slacker count (excluding Sundays)
  const getUserSlackerCount = (userId: string): number => {
    return tapperLogs.filter(log => {
      const matchesUser = log.user_id === userId
      const isSlacker = log.is_slacker === true // Direct slacker check!
      
      // Exclude Sundays from penalty calculations
      const logDate = new Date(log.log_date + 'T00:00:00')
      const isSundayDay = isSunday(logDate)
      
      return matchesUser && isSlacker && !isSundayDay
    }).length
  }

  // Helper function to get consecutive slacker days
  const getConsecutiveSlackerDays = (userId: string): number => {
    const userLogs = tapperLogs
      .filter(log => log.user_id === userId)
      .sort((a, b) => new Date(b.log_date).getTime() - new Date(a.log_date).getTime())
    
    let consecutive = 0
    for (const log of userLogs) {
      const logDate = new Date(log.log_date + 'T00:00:00')
      const isSundayDay = isSunday(logDate)
      
      if (!isSundayDay && log.is_slacker === true) { // Direct slacker check!
        consecutive++
      } else {
        break
      }
    }
    return consecutive
  }

  // Helper function to get slacker animation content based on consecutive days
  const getSlackerAnimationContent = (userId: string): AnimationState => {
    const consecutiveDays = getConsecutiveSlackerDays(userId) + 1 // +1 because we're adding one
    
    if (consecutiveDays === 1) {
      return {
        show: true,
        emoji: '🥱',
        message: '¡Primera pereza!',
        isPositive: false
      }
    } else if (consecutiveDays <= 3) {
      return {
        show: true,
        emoji: '🥱',
        message: '¡Demasiado flojo para moverte!',
        isPositive: false
      }
    } else if (consecutiveDays <= 5) {
      return {
        show: true,
        emoji: '🥱',
        message: '¡Solo sabes bostezar!',
        isPositive: false
      }
    } else if (consecutiveDays <= 10) {
      return {
        show: true,
        emoji: '🥱',
        message: '¡Perezoso profesional!',
        isPositive: false
      }
    } else {
      return {
        show: true,
        emoji: '🥱',
        message: '¡ADICTO AL SOFÁ!',
        isPositive: false
      }
    }
  }

  // Helper function to get animation content based on status change
  const getStatusAnimationContent = (userId: string, newStatus: StatusType, isSundayDay: boolean): AnimationState => {
    if (isSundayDay) {
      return {
        show: true,
        emoji: '🎉',
        message: '¡Día libre!',
        isPositive: true
      }
    }

    switch (newStatus) {
      case 'clean':
        return {
          show: true,
          emoji: '😇',
          message: '¡Día perfecto!',
          isPositive: true
        }
      
      case 'tapper':
        const tapperCount = getUserTapperCount(userId) + 1
        if (tapperCount === 1) {
          return {
            show: true,
            emoji: '😐',
            message: '¡Al menos te moviste!',
            isPositive: false
          }
        } else if (tapperCount <= 2) {
          return {
            show: true,
            emoji: '💪',
            message: '¡Compensado con ejercicio!',
            isPositive: false
          }
        } else {
          return {
            show: true,
            emoji: '⚖️',
            message: '¡Algo es algo!',
            isPositive: false
          }
        }
      
      case 'slacker':
        return getSlackerAnimationContent(userId)
      
      case 'disaster':
        return {
          show: true,
          emoji: '💩',
          message: '¡DESASTRE TOTAL!',
          isPositive: false
        }
      
      default:
        return {
          show: true,
          emoji: '❓',
          message: '¿Qué pasó?',
          isPositive: false
        }
    }
  }

  // Function to trigger animation based on status
  const triggerStatusAnimation = (userId: string, newStatus: StatusType, isSundayDay: boolean) => {
    const content = getStatusAnimationContent(userId, newStatus, isSundayDay)
    setAnimationState(content)
    
    // Hide animation after 2.5 seconds with fade out
    setTimeout(() => {
      setAnimationState(prev => ({ ...prev, show: false }))
    }, 2500)
  }
  
  const updateUserStatus = async (userId: string, date: string, newStatus: StatusType) => {
    try {
      // Check if log exists for this user and date
      const existingLog = tapperLogs.find(
        log => log.user_id === userId && log.log_date === date
      )

      // Get boolean values from status
      const { is_tapper, is_slacker } = getBooleansFromStatus(newStatus)
      
      // Check if it's Sunday for animation purposes
      const dateObj = new Date(date + 'T00:00:00')
      const isSundayDay = isSunday(dateObj)
      
      // Trigger animation before database call
      triggerStatusAnimation(userId, newStatus, isSundayDay)

      if (existingLog) {
        // Update existing log
        const { error } = await supabase
          .from('tapper_logs')
          .update({ 
            is_tapper,
            is_slacker,
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
            is_tapper,
            is_slacker,
            logged_by: session.user.id
          })
        
        if (error) throw error
      }

      // Refresh the data
      onRefresh()
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const getUserStatus = (userId: string, date: string): StatusType => {
    const log = tapperLogs.find(
      log => log.user_id === userId && log.log_date === date
    )
    
    if (!log) {
      return 'clean' // default to clean if no log exists
    }
    
    
    return getStatusFromBooleans(log.is_tapper, log.is_slacker, log.created_at)
  }

  return (
    <div className="relative">
      {/* Animation Popup */}
      {animationState.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div 
            className={`
              transform transition-all duration-700 ease-out
              ${animationState.show ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
            `}
            style={{
              animation: animationState.show 
                ? 'tapperPopup 2.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' 
                : 'none'
            }}
          >
            <div className={`
              rounded-2xl p-8 shadow-2xl backdrop-blur-md border-4 min-w-[280px]
              ${animationState.isPositive 
                ? 'bg-gradient-to-br from-green-50/95 to-green-100/95 border-green-400 text-green-800' 
                : 'bg-gradient-to-br from-red-50/95 to-red-100/95 border-red-400 text-red-800'
              }
            `}>
              <div className="text-center">
                <div 
                  className="text-9xl mb-4"
                  style={{
                    animation: 'emojiGrow 2.5s ease-out',
                    filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.3))'
                  }}
                >
                  {animationState.emoji}
                </div>
                <div className="text-2xl font-bold mb-2">
                  {animationState.message}
                </div>
                {!animationState.isPositive && (
                  <div className="text-sm opacity-75 italic">
                    ¡Qué vergüenza! 😈
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inline Styles for Custom Animations */}
      <style jsx>{`
        @keyframes tapperPopup {
          0% {
            transform: scale(0) rotate(-180deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.1) rotate(-5deg);
            opacity: 1;
          }
          80% {
            transform: scale(0.95) rotate(2deg);
            opacity: 1;
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        @keyframes emojiGrow {
          0% {
            transform: scale(0.5);
            filter: blur(4px);
          }
          30% {
            transform: scale(1.3);
            filter: blur(0px);
          }
          60% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>

      {/* Main Content */}
      <h2 className="text-lg sm:text-xl font-bold text-center mb-4 text-gray-800">
        Seguimiento Semanal - Tappers & Slackers (Lunes a Domingo) v4.0 🗓️🥱
      </h2>
      <div className="bg-gray-50 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                {days.map(date => {
                  const dateObj = new Date(date + 'T00:00:00') // Ensure local timezone
                  const isToday = isTodayFns(dateObj)
                  const isSundayDay = isSunday(dateObj)
                  
                  return (
                    <th key={date} className={`px-1 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-medium uppercase tracking-wider ${
                      isToday ? 'bg-blue-100 text-blue-800' : 'text-gray-500'
                    }`}>
                      <div className="hidden sm:block">
                        {format(dateObj, 'EEE, d/M', { locale: es })}
                        {isSundayDay && isToday ? (
                          <div className="text-xs normal-case text-green-600 font-bold">
                            🎉 HOY LIBRE
                          </div>
                        ) : isSundayDay ? (
                          <div className="text-xs normal-case text-green-600 font-bold">
                            🎉 Libre
                          </div>
                        ) : isToday ? (
                          <div className="text-xs normal-case text-blue-600 font-bold">
                            HOY
                          </div>
                        ) : null}
                      </div>
                      <div className="sm:hidden">
                        {format(dateObj, 'EEEEE', { locale: es })}
                        <br />
                        <span className="text-xs">
                          {format(dateObj, 'd')}
                        </span>
                        {isSundayDay && isToday ? (
                          <div className="text-xs text-green-600 font-bold">
                            🎉HOY
                          </div>
                        ) : isSundayDay ? (
                          <div className="text-xs text-green-600">
                            🎉
                          </div>
                        ) : isToday ? (
                          <div className="text-xs text-blue-600 font-bold">
                            HOY
                          </div>
                        ) : null}
                      </div>
                    </th>
                  )
                })}
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
                    const currentStatus = getUserStatus(user.id, date)
                    const dateObj = new Date(date + 'T00:00:00') // Ensure local timezone
                    const isSundayDay = isSunday(dateObj)
                    const isToday = isTodayFns(dateObj)
                    
                    return (
                      <td key={`${user.id}-${date}`} className={`px-1 sm:px-2 py-2 text-center ${
                        isToday ? 'bg-blue-50' : ''
                      }`}>
                        <div className="w-full max-w-[80px] sm:max-w-[120px] mx-auto">
                          <StatusDropdown
                            currentStatus={currentStatus}
                            onStatusChange={(newStatus) => updateUserStatus(user.id, date, newStatus)}
                            isToday={isToday}
                            isSunday={isSundayDay}
                          />
                        </div>
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