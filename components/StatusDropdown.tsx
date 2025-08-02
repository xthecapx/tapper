import { useState, useEffect } from 'react'

export type StatusType = 'clean' | 'tapper' | 'slacker' | 'disaster'

interface StatusDropdownProps {
  currentStatus: StatusType
  onStatusChange: (status: StatusType) => void
  isToday: boolean
  isSunday: boolean
  disabled?: boolean
}

interface StatusOption {
  value: StatusType
  emoji: string
  label: string
  shortLabel: string
  bgColor: string
  textColor: string
}

const STATUS_OPTIONS: StatusOption[] = [
  {
    value: 'clean',
    emoji: '✅',
    label: 'Limpio',
    shortLabel: 'Limpio',
    bgColor: 'bg-green-500',
    textColor: 'text-white'
  },
  {
    value: 'tapper',
    emoji: '🍔',
    label: 'Tapper',
    shortLabel: 'Tapper',
    bgColor: 'bg-orange-500',
    textColor: 'text-white'
  },
  {
    value: 'slacker',
    emoji: '🥱',
    label: 'Perezoso',
    shortLabel: 'Perezoso',
    bgColor: 'bg-yellow-500',
    textColor: 'text-white'
  },
  {
    value: 'disaster',
    emoji: '💩',
    label: 'Desastre',
    shortLabel: 'Desastre',
    bgColor: 'bg-red-600',
    textColor: 'text-white'
  }
]

export function getStatusFromBooleans(is_tapper: boolean, is_slacker: boolean | null | undefined, created_at?: string): StatusType {
  // Handle NULL/undefined case (old records where slacker status wasn't tracked)
  if (is_slacker === null || is_slacker === undefined) {
    return is_tapper ? 'tapper' : 'clean' // Treat old records as either tapper or clean (no slacker shame for old data)
  }
  
  // TEMPORARY FIX: Detect old records that were incorrectly migrated
  // Records created before Aug 1, 2025 should be treated as old tapper-only records
  if (created_at && new Date(created_at) < new Date('2025-08-01') && is_tapper && is_slacker) {
    return 'tapper' // Ignore the is_slacker flag for old records
  }
  
  // Handle explicit slacker tracking - much cleaner logic!
  if (!is_tapper && !is_slacker) return 'clean'     // ✅ - No tapper, No slacker
  if (is_tapper && !is_slacker) return 'tapper'     // 🍔 - Tapper but exercised
  if (!is_tapper && is_slacker) return 'slacker'    // 🥱 - Clean eating but lazy
  if (is_tapper && is_slacker) return 'disaster'    // 💩 - Both bad behaviors
  return 'clean' // fallback
}

export function getBooleansFromStatus(status: StatusType): { is_tapper: boolean; is_slacker: boolean } {
  switch (status) {
    case 'clean':
      return { is_tapper: false, is_slacker: false }   // No bad behaviors
    case 'tapper':
      return { is_tapper: true, is_slacker: false }    // Bad eating but exercised
    case 'slacker':
      return { is_tapper: false, is_slacker: true }    // Good eating but lazy
    case 'disaster':
      return { is_tapper: true, is_slacker: true }     // Both bad behaviors
    default:
      return { is_tapper: false, is_slacker: false }
  }
}

export default function StatusDropdown({ 
  currentStatus, 
  onStatusChange, 
  isToday, 
  isSunday, 
  disabled = false 
}: StatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  
  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  const currentOption = STATUS_OPTIONS.find(opt => opt.value === currentStatus) || STATUS_OPTIONS[2] // default to slacker
  
  const handleSelect = (status: StatusType) => {
    onStatusChange(status)
    setIsOpen(false)
  }

  // Handle native select change for mobile
  const handleNativeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = event.target.value as StatusType
    onStatusChange(newStatus)
  }

  // Special styling for Sunday and today
  const getButtonClasses = () => {
    let baseClasses = `
      relative w-full text-xs sm:text-sm font-medium rounded-md border-2 transition-all duration-200 
      focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[32px] sm:min-h-[36px]
    `
    
    if (disabled) {
      baseClasses += ' opacity-50 cursor-not-allowed'
    } else {
      baseClasses += ' cursor-pointer hover:shadow-md'
    }
    
    if (isSunday) {
      baseClasses += ' ring-2 ring-green-300'
    }
    
    if (isToday) {
      baseClasses += ' ring-2 ring-blue-400 shadow-lg'
    }
    
    // Apply status-specific colors
    baseClasses += ` ${currentOption.bgColor} ${currentOption.textColor} border-transparent`
    
    return baseClasses
  }

  const getDropdownClasses = () => {
    return `
      absolute top-full left-0 right-0 mt-1 z-50 bg-white border border-gray-300 rounded-md shadow-lg
      max-h-48 overflow-auto
    `
  }

  // Render native select for mobile devices
  if (isMobile) {
    return (
      <div className="relative">
        <select
          value={currentStatus}
          onChange={handleNativeChange}
          disabled={disabled}
          className={`
            w-full text-xs font-medium rounded-md border-2 transition-all duration-200 
            focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[32px]
            appearance-none bg-no-repeat bg-right-8 bg-center
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            ${isSunday ? 'ring-2 ring-green-300' : ''}
            ${isToday ? 'ring-2 ring-blue-400 shadow-lg' : ''}
            ${currentOption.bgColor} ${currentOption.textColor} border-transparent
            px-2 py-1
          `}
          title={
            isSunday 
              ? `🎉 Domingo libre - ${currentOption.label}`
              : isToday
                ? `HOY - ${currentOption.label}`
                : currentOption.label
          }
        >
          {STATUS_OPTIONS.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              className="bg-white text-black"
            >
              {option.emoji} {option.shortLabel}
            </option>
          ))}
        </select>
        
        {/* Custom dropdown arrow for mobile */}
        {!disabled && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
    )
  }

  // Render custom dropdown for desktop
  return (
    <div className="relative">
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={getButtonClasses()}
        disabled={disabled}
        title={
          isSunday 
            ? `🎉 Domingo libre - ${currentOption.label}`
            : isToday
              ? `HOY - ${currentOption.label}`
              : currentOption.label
        }
      >
        <div className="flex items-center justify-center px-1 sm:px-2 py-1">
          <span className="text-sm sm:text-base mr-1">{currentOption.emoji}</span>
          <span className="hidden sm:inline text-xs">{currentOption.shortLabel}</span>
          {!disabled && (
            <svg className="w-3 h-3 ml-1 hidden sm:inline" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </button>
      
      {isOpen && (
        <>
          {/* Backdrop to close dropdown */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown menu */}
          <div className={getDropdownClasses()}>
            {STATUS_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`
                  w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center
                  ${currentStatus === option.value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}
                `}
              >
                <span className="text-base mr-2">{option.emoji}</span>
                <span className="hidden sm:inline">{option.label}</span>
                <span className="sm:hidden">{option.shortLabel}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}