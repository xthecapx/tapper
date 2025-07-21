import { useState } from 'react'
import { useSupabaseClient, Session } from '@supabase/auth-helpers-react'
import { User, TapperLog } from './types'
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

export default function TrackingTab({ users, tapperLogs, session, onRefresh }: TrackingTabProps) {
  const supabase = useSupabaseClient()

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
        Seguimiento Semanal - Competencia Actual (Lunes a Domingo) v3.0 🗓️
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
                    const isTapper = getTapperStatus(user.id, date)
                    const dateObj = new Date(date + 'T00:00:00') // Ensure local timezone
                    const isSundayDay = isSunday(dateObj)
                    const isToday = isTodayFns(dateObj)
                    
                    return (
                      <td key={`${user.id}-${date}`} className={`px-1 sm:px-4 py-2 sm:py-4 text-center ${
                        isToday ? 'bg-blue-50' : ''
                      }`}>
                        <button
                          onClick={() => toggleTapper(user.id, date)}
                          className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 transition-all duration-200 text-xs sm:text-base ${
                            isTapper
                              ? isSundayDay 
                                ? 'bg-orange-400 border-orange-400 text-white' // Sunday tapper (free day)
                                : 'bg-red-500 border-red-500 text-white' // Regular tapper
                              : 'bg-white border-gray-300 hover:border-gray-400'
                          } ${isSundayDay ? 'ring-2 ring-green-300' : ''} ${
                            isToday ? 'ring-2 ring-blue-400 shadow-lg' : ''
                          }`}
                          title={
                            isSundayDay 
                              ? isTapper 
                                ? '🎉 Domingo libre - ¡No cuenta como penalización!' 
                                : '🎉 Domingo libre - Día sin penalización'
                              : isToday
                                ? isTapper
                                  ? '¡HOY - Día de tapper! ¡Qué vergüenza!'
                                  : 'HOY - Día limpio'
                                : isTapper 
                                  ? '¡Día de tapper! ¡Qué vergüenza!' 
                                  : 'Día limpio'
                          }
                        >
                          {isTapper ? (isSundayDay ? '🎉' : '🍔') : '✅'}
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