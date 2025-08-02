import { User, TapperLog } from './types'

interface TableTabProps {
  users: User[]
  tapperLogs: TapperLog[]
}

export default function TableTab({ users, tapperLogs }: TableTabProps) {
  // Tapper counting functions (existing logic)
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

  // Slacker counting functions (new logic)
  const getSlackerCountForUser = (userId: string): number => {
    return tapperLogs.filter(log => {
      const matchesUser = log.user_id === userId
      const isSlacker = log.is_slacker === true // Direct slacker check
      
      // Exclude Sundays from penalty calculations (Sunday is a free day)
      const logDate = new Date(log.log_date)
      const isSunday = logDate.getDay() === 0
      
      return matchesUser && isSlacker && !isSunday
    }).length
  }

  // Clean days counting (new metric) - Based on calendar days, not just logged days
  const getCleanCountForUser = (userId: string): number => {
    // Find the earliest record date dynamically
    const earliestLog = tapperLogs.reduce((earliest, log) => {
      const logDate = new Date(log.created_at)
      const earliestDate = new Date(earliest)
      return logDate < earliestDate ? log.created_at : earliest
    }, tapperLogs[0]?.created_at || new Date().toISOString())
    
    const startDate = new Date(earliestLog.split('T')[0]) // Get just the date part
    const today = new Date()
    const totalDays = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    
    // Count tapper days (bad eating days)
    const tapperDays = tapperLogs.filter(log => {
      const matchesUser = log.user_id === userId
      const isTapper = log.is_tapper
      
      // Include all days (even Sundays count against health)
      return matchesUser && isTapper
    }).length
    
    // Count slacker days (no exercise days) 
    const slackerDays = tapperLogs.filter(log => {
      const matchesUser = log.user_id === userId
      const isSlacker = log.is_slacker === true // Only count explicit slacker days
      
      // Include all days (even Sundays count against health)
      return matchesUser && isSlacker
    }).length
    
    // Clean days = Total possible days - Tapper days - Slacker days + Overlap (disaster days counted twice)
    const disasterDays = tapperLogs.filter(log => {
      const matchesUser = log.user_id === userId
      const isDisaster = log.is_tapper && log.is_slacker === true
      return matchesUser && isDisaster
    }).length
    
    // Calculate clean days: Total - Bad days + Overlap correction
    const badDays = tapperDays + slackerDays - disasterDays // Remove double-counting
    const cleanDays = Math.max(0, totalDays - badDays)
    
    return cleanDays
  }

  // Disaster days counting (both tapper and slacker)
  const getDisasterCountForUser = (userId: string): number => {
    return tapperLogs.filter(log => {
      const matchesUser = log.user_id === userId
      const isDisaster = log.is_tapper && log.is_slacker === true
      
      // Exclude Sundays from penalty calculations
      const logDate = new Date(log.log_date)
      const isSunday = logDate.getDay() === 0
      
      return matchesUser && isDisaster && !isSunday
    }).length
  }

  // Health score calculation (new metric)
  const getHealthScore = (userId: string): number => {
    const cleanDays = getCleanCountForUser(userId)
    const tapperDays = getTapperCountForUser(userId)
    const slackerDays = getSlackerCountForUser(userId)
    const disasterDays = getDisasterCountForUser(userId)
    
    // Calculate score: Clean=3pts, Tapper=1pt, Slacker=0pts, Disaster=-1pt
    const score = (cleanDays * 3) + (tapperDays * 1) + (slackerDays * 0) + (disasterDays * -1)
    return Math.max(0, score) // Don't go below 0
  }

  const getTotalStats = () => {
    const totalTappers = tapperLogs.filter(log => {
      const logDate = new Date(log.log_date)
      const isSunday = logDate.getDay() === 0
      return log.is_tapper && !isSunday
    }).length

    const totalSlackers = tapperLogs.filter(log => {
      const logDate = new Date(log.log_date)
      const isSunday = logDate.getDay() === 0
      return log.is_slacker === true && !isSunday
    }).length

    const totalDisasters = tapperLogs.filter(log => {
      const logDate = new Date(log.log_date)
      const isSunday = logDate.getDay() === 0
      return log.is_tapper && log.is_slacker === true && !isSunday
    }).length

    return { totalTappers, totalSlackers, totalDisasters }
  }

  const getOverallStatus = (tapperCount: number, slackerCount: number, disasterCount: number) => {
    const totalShame = tapperCount + slackerCount + (disasterCount * 2) // Disasters count double
    
    if (totalShame === 0) return { emoji: '😇', text: '¡Santo!', color: 'text-green-600' }
    if (totalShame <= 3) return { emoji: '😊', text: 'Buena persona', color: 'text-blue-600' }
    if (totalShame <= 8) return { emoji: '😐', text: 'Promedio', color: 'text-yellow-600' }
    if (totalShame <= 15) return { emoji: '🤡', text: 'Sin control', color: 'text-orange-600' }
    return { emoji: '🗑️', text: 'Caso perdido', color: 'text-red-600' }
  }

  const getRowColor = (tapperCount: number, slackerCount: number, disasterCount: number) => {
    const totalShame = tapperCount + slackerCount + (disasterCount * 2)
    
    if (totalShame === 0) return 'bg-green-50'
    if (totalShame <= 3) return 'bg-blue-50'
    if (totalShame <= 8) return 'bg-yellow-50'
    if (totalShame <= 15) return 'bg-orange-50'
    return 'bg-red-50'
  }

  const stats = getTotalStats()

  return (
    <div>
      <h2 className="text-lg sm:text-xl font-bold text-center mb-4 text-gray-800">
        Ranking de Vergüenza Completo - Tappers & Slackers 📊
      </h2>
      
      <div className="bg-gray-50 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-red-50 to-yellow-50">
              <tr>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-800 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-1 sm:px-2 py-2 sm:py-3 text-center text-xs sm:text-sm font-medium text-red-700 uppercase tracking-wider">
                  <span className="block">🍔</span>
                  <span className="hidden sm:inline">Tappers</span>
                  <span className="sm:hidden text-xs">T</span>
                </th>
                <th className="px-1 sm:px-2 py-2 sm:py-3 text-center text-xs sm:text-sm font-medium text-yellow-700 uppercase tracking-wider">
                  <span className="block">🥱</span>
                  <span className="hidden sm:inline">Slackers</span>
                  <span className="sm:hidden text-xs">S</span>
                </th>
                <th className="px-1 sm:px-2 py-2 sm:py-3 text-center text-xs sm:text-sm font-medium text-green-700 uppercase tracking-wider">
                  <span className="block">✅</span>
                  <span className="hidden sm:inline">Limpios</span>
                  <span className="sm:hidden text-xs">L</span>
                </th>
                <th className="px-1 sm:px-2 py-2 sm:py-3 text-center text-xs sm:text-sm font-medium text-red-800 uppercase tracking-wider">
                  <span className="block">💩</span>
                  <span className="hidden sm:inline">Desastres</span>
                  <span className="sm:hidden text-xs">D</span>
                </th>
                <th className="px-1 sm:px-2 py-2 sm:py-3 text-center text-xs sm:text-sm font-medium text-purple-700 uppercase tracking-wider">
                  <span className="hidden sm:inline">Salud</span>
                  <span className="sm:hidden text-xs">💪</span>
                  <div className="text-xs normal-case hidden sm:block">Score</div>
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-medium text-gray-700 uppercase tracking-wider">
                  <span className="hidden sm:inline">Estado</span>
                  <span className="sm:hidden text-xs">Status</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users
                .map(user => {
                  const tapperCount = getTapperCountForUser(user.id)
                  const slackerCount = getSlackerCountForUser(user.id)
                  const cleanCount = getCleanCountForUser(user.id)
                  const disasterCount = getDisasterCountForUser(user.id)
                  const healthScore = getHealthScore(user.id)
                  
                  return {
                    ...user,
                    tapperCount,
                    slackerCount,
                    cleanCount,
                    disasterCount,
                    healthScore,
                    totalShame: tapperCount + slackerCount + (disasterCount * 2)
                  }
                })
                .sort((a, b) => {
                  // Sort by health score (descending), then by total shame (ascending)
                  if (a.healthScore !== b.healthScore) {
                    return b.healthScore - a.healthScore
                  }
                  return a.totalShame - b.totalShame
                })
                .map((user, index) => {
                  const status = getOverallStatus(user.tapperCount, user.slackerCount, user.disasterCount)
                  const isTopPerformer = index === 0 && user.healthScore > 0
                  
                  return (
                    <tr key={user.id} className={`${getRowColor(user.tapperCount, user.slackerCount, user.disasterCount)} hover:opacity-75 transition-opacity`}>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          {isTopPerformer && (
                            <span className="mr-1 sm:mr-2 text-yellow-500 text-sm sm:text-base">🏆</span>
                          )}
                          <div>
                            <div className="text-xs sm:text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-xs text-gray-500 hidden sm:block">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      
                      {/* Tapper count */}
                      <td className="px-1 sm:px-2 py-2 sm:py-3 text-center">
                        <span className={`text-sm sm:text-lg font-bold ${user.tapperCount > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                          {user.tapperCount}
                        </span>
                      </td>
                      
                      {/* Slacker count */}
                      <td className="px-1 sm:px-2 py-2 sm:py-3 text-center">
                        <span className={`text-sm sm:text-lg font-bold ${user.slackerCount > 0 ? 'text-yellow-600' : 'text-gray-400'}`}>
                          {user.slackerCount}
                        </span>
                      </td>
                      
                      {/* Clean count */}
                      <td className="px-1 sm:px-2 py-2 sm:py-3 text-center">
                        <span className={`text-sm sm:text-lg font-bold ${user.cleanCount > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                          {user.cleanCount}
                        </span>
                      </td>
                      
                      {/* Disaster count */}
                      <td className="px-1 sm:px-2 py-2 sm:py-3 text-center">
                        <span className={`text-sm sm:text-lg font-bold ${user.disasterCount > 0 ? 'text-red-800' : 'text-gray-400'}`}>
                          {user.disasterCount}
                        </span>
                        {user.disasterCount > 0 && (
                          <div className="text-xs text-red-600 font-bold hidden sm:block">¡SHAME!</div>
                        )}
                      </td>
                      
                      {/* Health score */}
                      <td className="px-1 sm:px-2 py-2 sm:py-3 text-center">
                        <span className="text-sm sm:text-xl font-bold text-purple-600">
                          {user.healthScore}
                        </span>
                        <div className="text-xs text-gray-500 hidden sm:block">pts</div>
                      </td>
                      
                      {/* Status */}
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                        <div className="text-lg sm:text-2xl">{status.emoji}</div>
                        <div className={`text-xs sm:text-sm font-bold ${status.color}`}>
                          {status.text}
                        </div>
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
        
        {/* Footer Stats */}
        <div className="bg-gray-50 px-3 sm:px-6 py-3 sm:py-4 border-t">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-center text-xs sm:text-sm">
            <div>
              <div className="font-bold text-red-600 text-sm sm:text-lg">🍔 {stats.totalTappers}</div>
              <div className="text-gray-600">Total Tappers</div>
            </div>
            <div>
              <div className="font-bold text-yellow-600 text-sm sm:text-lg">🥱 {stats.totalSlackers}</div>
              <div className="text-gray-600">Total Slackers</div>
            </div>
            <div>
              <div className="font-bold text-red-800 text-sm sm:text-lg">💩 {stats.totalDisasters}</div>
              <div className="text-gray-600">Total Desastres</div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <div className="font-bold text-purple-600 text-sm sm:text-lg">
                {stats.totalTappers + stats.totalSlackers + stats.totalDisasters}
              </div>
              <div className="text-gray-600">Total Vergüenzas</div>
            </div>
          </div>
          
          {/* Group shame messages */}
          <div className="text-center mt-3">
            {stats.totalDisasters > 5 && (
              <div className="text-red-600 font-bold animate-pulse text-xs sm:text-sm">
                🚨 ¡DEMASIADOS DESASTRES! ¡ESTE GRUPO NECESITA TERAPIA! 🚨
              </div>
            )}
            {stats.totalTappers + stats.totalSlackers === 0 && (
              <div className="text-green-600 font-bold text-xs sm:text-sm">
                ✨ ¡Grupo perfecto! ¡Todos son angelitos! ✨
              </div>
            )}
            {stats.totalDisasters === 0 && (stats.totalTappers + stats.totalSlackers) > 0 && (
              <div className="text-blue-600 font-medium text-xs sm:text-sm">
                👍 ¡Al menos nadie ha tenido desastres totales!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}