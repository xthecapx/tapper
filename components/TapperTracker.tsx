import { useState, useEffect } from 'react'
import { useSupabaseClient, Session } from '@supabase/auth-helpers-react'
import { User, TapperLog, TabType } from './types'
import TrackingTab from './TrackingTab'
import KingsTab from './KingsTab'
import TableTab from './TableTab'
import InfoTab from './InfoTab'

interface TapperTrackerProps {
  session: Session
}

export default function TapperTracker({ session }: TapperTrackerProps) {
  const supabase = useSupabaseClient()
  const [users, setUsers] = useState<User[]>([])
  const [tapperLogs, setTapperLogs] = useState<TapperLog[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [activeTab, setActiveTab] = useState<TabType>('tracking')

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
        .order('log_date', { ascending: false })
      
      if (error) throw error
      setTapperLogs(data as TapperLog[] || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching tapper logs:', error)
      setLoading(false)
    }
  }



  if (loading) {
    return <div className="text-center p-4">Cargando el salón de la vergüenza... 😈</div>
  }

  const TabButton = ({ id, label, icon, isActive, onClick }: {
    id: string
    label: string
    icon: string
    isActive: boolean
    onClick: () => void
  }) => (
    <button
      onClick={onClick}
      className={`flex-1 py-3 px-2 text-xs sm:text-sm font-medium text-center border-b-2 transition-all duration-200 ${
        isActive
          ? 'border-red-500 text-red-600 bg-red-50'
          : 'border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`}
    >
      <div className="flex flex-col items-center">
        <span className="text-lg sm:text-xl mb-1">{icon}</span>
        <span>{label}</span>
      </div>
    </button>
  )



  return (
    <div className="w-full max-w-6xl mx-auto p-2 sm:p-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 text-gray-800">
        Rastreador de Tappers 🍔
      </h1>
      <div className="text-center mb-4 p-2 sm:p-3 bg-red-100 rounded-lg border-2 border-red-300">
        <p className="text-sm sm:text-lg font-bold text-red-800">
          ¡SALÓN DE LA VERGÜENZA! 😈
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-t-lg shadow-lg border-b">
        <div className="flex">
          <TabButton
            id="tracking"
            label="Seguimiento"
            icon="📅"
            isActive={activeTab === 'tracking'}
            onClick={() => setActiveTab('tracking')}
          />
          <TabButton
            id="cards"
            label="Reyes"
            icon="👑"
            isActive={activeTab === 'cards'}
            onClick={() => setActiveTab('cards')}
          />
          <TabButton
            id="table"
            label="Tabla"
            icon="📊"
            isActive={activeTab === 'table'}
            onClick={() => setActiveTab('table')}
          />
          <TabButton
            id="info"
            label="Info"
            icon="ℹ️"
            isActive={activeTab === 'info'}
            onClick={() => setActiveTab('info')}
          />
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-b-lg shadow-lg min-h-96 p-4">
        
        {/* Tracking Tab */}
        {activeTab === 'tracking' && (
          <TrackingTab 
            users={users} 
            tapperLogs={tapperLogs} 
            session={session} 
            onRefresh={fetchTapperLogs} 
          />
        )}

        {/* Cards Tab - Kings of Shame */}
        {activeTab === 'cards' && (
          <KingsTab users={users} tapperLogs={tapperLogs} />
        )}

        {/* Table Tab - Detailed Rankings */}
        {activeTab === 'table' && (
          <TableTab users={users} tapperLogs={tapperLogs} />
        )}

        {/* Info Tab */}
        {activeTab === 'info' && <InfoTab />}
      </div>
    </div>
  )
} 