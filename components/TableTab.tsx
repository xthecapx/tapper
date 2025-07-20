import { User, TapperLog } from './types'

interface TableTabProps {
  users: User[]
  tapperLogs: TapperLog[]
}

export default function TableTab({ users, tapperLogs }: TableTabProps) {
  const getTapperCountForUser = (userId: string): number => {
    return tapperLogs.filter(log => {
      const matchesUser = log.user_id === userId
      const isTapper = log.is_tapper
      
      // Exclude Sundays from penalty calculations (Sunday is a free day)
      const logDate = new Date(log.log_date)
      const isSunday = logDate.getDay() === 0
      
      return matchesUser && isTapper && !isSunday
    }).length
  }

  const getTotalTapperDays = (): number => {
    return tapperLogs.filter(log => {
      const isTapper = log.is_tapper
      
      // Exclude Sundays from penalty calculations (Sunday is a free day)
      const logDate = new Date(log.log_date)
      const isSunday = logDate.getDay() === 0
      
      return isTapper && !isSunday
    }).length
  }

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

  const getStatusEmoji = (tapperCount: number) => {
    if (tapperCount === 0) return '😇' // Angel
    if (tapperCount <= 2) return '😐' // Meh
    if (tapperCount <= 5) return '🤡' // Clown
    if (tapperCount <= 10) return '🐷' // Pig
    return '🗑️' // Trash
  }
  
  const getStatusText = (tapperCount: number) => {
    if (tapperCount === 0) return '¡Santo!'
    if (tapperCount <= 2) return 'Casi humano'
    if (tapperCount <= 5) return 'Sin control'
    if (tapperCount <= 10) return 'Adicto total'
    return 'Basura humana'
  }

  const getFunnyMessage = (tapperCount: number) => {
    if (tapperCount === 0) return '¡Eres un ejemplo a seguir! 🙌'
    if (tapperCount <= 2) return 'Todavía tienes algo de dignidad 😅'
    if (tapperCount <= 5) return '¿En serio? ¡Qué falta de autocontrol! 🤦‍♂️'
    if (tapperCount <= 10) return '¡Eres una vergüenza andante! 😂'
    return '¡McDonalds debería patrocinarte! 🍟'
  }

  const getRowColor = (tapperCount: number) => {
    if (tapperCount === 0) return 'bg-green-50'
    if (tapperCount <= 2) return 'bg-blue-50'
    if (tapperCount <= 5) return 'bg-yellow-50'
    return 'bg-red-50'
  }

  return (
    <div>
      <h2 className="text-lg sm:text-xl font-bold text-center mb-4 text-gray-800">
        Ranking Detallado de la Vergüenza 📊
      </h2>
      <div className="bg-gray-50 rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-red-50">
            <tr>
              <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-red-800 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-1 sm:px-3 py-2 sm:py-3 text-center text-xs sm:text-sm font-medium text-red-800 uppercase tracking-wider">
                <span className="hidden sm:inline">Semana</span>
                <span className="sm:hidden">7d</span>
                <div className="text-xs normal-case hidden sm:block text-red-600">
                  (Lun-Dom)
                </div>
              </th>
              <th className="px-1 sm:px-3 py-2 sm:py-3 text-center text-xs sm:text-sm font-medium text-red-800 uppercase tracking-wider">
                <span className="hidden sm:inline">Mes</span>
                <span className="sm:hidden">30d</span>
              </th>
              <th className="px-1 sm:px-3 py-2 sm:py-3 text-center text-xs sm:text-sm font-medium text-red-800 uppercase tracking-wider">
                <span className="hidden sm:inline">Año</span>
                <span className="sm:hidden">365d</span>
              </th>
              <th className="px-2 sm:px-6 py-2 sm:py-3 text-center text-xs sm:text-sm font-medium text-red-800 uppercase tracking-wider">
                <span className="hidden sm:inline">Total Histórico</span>
                <span className="sm:hidden">Total</span>
              </th>
              <th className="px-2 sm:px-6 py-2 sm:py-3 text-center text-xs sm:text-sm font-medium text-red-800 uppercase tracking-wider">
                <span className="hidden sm:inline">Nivel de Vergüenza</span>
                <span className="sm:hidden">Nivel</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users
              .map(user => ({
                ...user,
                tapperCount: getTapperCountForUser(user.id)
              }))
              .sort((a, b) => a.tapperCount - b.tapperCount) // Sort by least tappers first (best performers)
              .map((user, index) => {
                const tapperCount = user.tapperCount
                
                return (
                  <tr key={user.id} className={`${getRowColor(tapperCount)} hover:opacity-75 transition-opacity`}>
                    <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {index === 0 && tapperCount === 0 && (
                          <span className="mr-1 sm:mr-2 text-yellow-500 text-sm sm:text-base">🏆</span>
                        )}
                        <div>
                          <div className="text-xs sm:text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-xs text-gray-500 hidden sm:block">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    
                    {/* Week count */}
                    <td className="px-1 sm:px-3 py-3 sm:py-4 text-center">
                      <span className="text-sm sm:text-lg font-bold text-orange-600">
                        {getTapperCountForPeriod(user.id, 'week')}
                      </span>
                    </td>
                    
                    {/* Month count */}
                    <td className="px-1 sm:px-3 py-3 sm:py-4 text-center">
                      <span className="text-sm sm:text-lg font-bold text-purple-600">
                        {getTapperCountForPeriod(user.id, 'month')}
                      </span>
                    </td>
                    
                    {/* Year count */}
                    <td className="px-1 sm:px-3 py-3 sm:py-4 text-center">
                      <span className="text-sm sm:text-lg font-bold text-blue-600">
                        {getTapperCountForPeriod(user.id, 'year')}
                      </span>
                    </td>
                    
                    {/* Total historical count */}
                    <td className="px-2 sm:px-6 py-3 sm:py-4 text-center">
                      <span className="text-xl sm:text-2xl font-bold text-red-600">{tapperCount}</span>
                      <div className="text-xs text-gray-500 hidden sm:block">total histórico</div>
                      <div className="text-xs text-purple-600 font-medium mt-1 italic hidden sm:block">
                        {getFunnyMessage(tapperCount)}
                      </div>
                      {/* Mobile funny message */}
                      <div className="text-xs text-purple-600 font-medium mt-1 sm:hidden">
                        {getStatusEmoji(tapperCount)}
                      </div>
                    </td>
                    
                    {/* Status */}
                    <td className="px-2 sm:px-6 py-3 sm:py-4 text-center">
                      <div className="text-xl sm:text-2xl">{getStatusEmoji(tapperCount)}</div>
                      <div className="text-xs sm:text-sm font-bold text-gray-800">{getStatusText(tapperCount)}</div>
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
        
        {/* Footer */}
        <div className="bg-gray-50 px-3 sm:px-6 py-3 sm:py-4 border-t">
          <div className="flex justify-between items-center text-xs sm:text-sm text-gray-600">
            <span className="hidden sm:inline">Total de pecados culinarios del grupo:</span>
            <span className="sm:hidden">Total de pecados:</span>
            <span className="font-bold text-red-600 text-base sm:text-lg">{getTotalTapperDays()}</span>
          </div>
          {getTotalTapperDays() > 10 && (
            <div className="text-center mt-2 text-red-600 font-bold animate-pulse text-xs sm:text-sm">
              🚨 ¡ESTE GRUPO ES UNA VERGÜENZA TOTAL! 🚨
            </div>
          )}
          {getTotalTapperDays() === 0 && (
            <div className="text-center mt-2 text-green-600 font-bold text-xs sm:text-sm">
              ✨ ¡Grupo perfecto! ¡Todos son angelitos! ✨
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 