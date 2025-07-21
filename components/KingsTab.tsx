import { User, TapperLog } from './types'

interface KingsTabProps {
  users: User[]
  tapperLogs: TapperLog[]
}

export default function KingsTab({ users, tapperLogs }: KingsTabProps) {
  // Functions for different time periods
  const getTapperCountForPeriod = (userId: string, period: 'week' | 'month' | 'year'): number => {
    const now = new Date()
    let startDate: Date

    switch (period) {
      case 'week':
        // Find the start of the current week (Monday)
        const dayOfWeek = now.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1 // Convert to Monday-based week
        startDate = new Date(now)
        startDate.setDate(now.getDate() - daysFromMonday)
        startDate.setHours(0, 0, 0, 0) // Set to start of day
        break
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1)
        break
    }

    return tapperLogs.filter(log => {
      // Basic filters: user, is_tapper, and date range
      const matchesUser = log.user_id === userId
      const isTapper = log.is_tapper
      const inDateRange = new Date(log.log_date) >= startDate
      
      // Exclude Sundays from penalty calculations (Sunday is a free day)
      const logDate = new Date(log.log_date)
      const isSunday = logDate.getDay() === 0
      
      return matchesUser && isTapper && inDateRange && !isSunday
    }).length
  }

  const getKingOfPeriod = (period: 'week' | 'month' | 'year'): { user: User | null; count: number; hasTie: boolean } => {
    if (users.length === 0) return { user: null, count: 0, hasTie: false }

    const userCounts = users.map(user => ({
      user,
      count: getTapperCountForPeriod(user.id, period)
    }))

    // Find the MAXIMUM count (worst performer)
    const maxCount = Math.max(...userCounts.map(u => u.count))
    const worstPerformers = userCounts.filter(u => u.count === maxCount)

    return {
      user: worstPerformers[0]?.user || null,
      count: maxCount,
      hasTie: worstPerformers.length > 1
    }
  }

  const getPeriodTitle = (period: 'week' | 'month' | 'year'): string => {
    switch (period) {
      case 'week': return 'de la Semana'
      case 'month': return 'del Mes'
      case 'year': return 'del Año'
    }
  }

  const getPeriodEmoji = (period: 'week' | 'month' | 'year'): string => {
    switch (period) {
      case 'week': return '🗑️'
      case 'month': return '👑🐷'
      case 'year': return '🏆💩'
    }
  }

  return (
    <div>
      <h2 className="text-lg sm:text-xl font-bold text-center mb-4 text-gray-800">
        Reyes de la Vergüenza - Competencia Semanal 👑💩
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
        {(['week', 'month', 'year'] as const).map((period) => {
          const king = getKingOfPeriod(period)
          const periodTitle = getPeriodTitle(period)
          const periodEmoji = getPeriodEmoji(period)
          
          return (
            <div key={period} className="bg-gradient-to-br from-red-100 to-red-200 border-2 border-red-300 rounded-lg p-3 sm:p-4 text-center">
              <div className="text-lg sm:text-xl font-bold text-red-800 mb-2">
                {periodEmoji} Rey {periodTitle}
                {period === 'week' && (
                  <div className="text-xs normal-case text-red-600">
                    (Lun-Dom)
                  </div>
                )}
              </div>
              
              {king.user ? (
                <div>
                  <div className="text-2xl sm:text-3xl mb-2">
                    {king.hasTie ? '🤝' : '👑'}
                  </div>
                  <div className="font-bold text-gray-900 text-sm sm:text-base">
                    {king.hasTie ? '¡EMPATE!' : king.user.name}
                  </div>
                  {!king.hasTie && (
                    <div className="text-xs text-gray-600 hidden sm:block">{king.user.email}</div>
                  )}
                  <div className="text-xl sm:text-2xl font-bold text-red-600 mt-2">
                    {king.count}
                  </div>
                  <div className="text-xs text-gray-600">
                    {king.count === 1 ? 'pecado' : 'pecados'}
                  </div>
                  
                  {/* Brutal messages */}
                  <div className="mt-2 text-xs font-bold italic">
                    {king.count === 0 ? (
                      <span className="text-green-600">¡Angelito! 😇</span>
                    ) : king.count <= 2 ? (
                      <span className="text-yellow-600">¡Casi humano! 😐</span>
                    ) : king.count <= 5 ? (
                      <span className="text-orange-600">¡Sin control! 🤡</span>
                    ) : (
                      <span className="text-red-600">¡BASURA TOTAL! 🗑️</span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 text-sm">
                  Sin datos
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Brutal group message for kings */}
      <div className="text-center mb-4">
        {(() => {
          const weekKing = getKingOfPeriod('week')
          const monthKing = getKingOfPeriod('month')
          const yearKing = getKingOfPeriod('year')
          
          if (weekKing.count > 5 || monthKing.count > 15 || yearKing.count > 50) {
            return (
              <div className="bg-red-600 text-white p-3 rounded-lg animate-pulse">
                <p className="font-bold text-sm sm:text-base">
                  🚨 ¡ESTE GRUPO NECESITA TERAPIA! 🚨
                </p>
                <p className="text-xs sm:text-sm mt-1">
                  ¡Los reyes de la vergüenza están fuera de control!
                </p>
              </div>
            )
          }
          
          if (weekKing.count === 0 && monthKing.count === 0 && yearKing.count === 0) {
            return (
              <div className="bg-green-600 text-white p-3 rounded-lg">
                <p className="font-bold text-sm sm:text-base">
                  ✨ ¡GRUPO DE SANTOS! ✨
                </p>
                <p className="text-xs sm:text-sm mt-1">
                  ¡Todos son perfectos! (¿O son mentirosos?)
                </p>
              </div>
            )
          }
          
          return null
        })()}
      </div>
    </div>
  )
} 