import React from 'react'
import { clsx } from 'clsx'
import { Bell, AlertTriangle, Info, CheckCircle } from 'lucide-react'

const iconMap = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle,
  default: Bell
}

export const NotificationBadge = ({ 
  type = 'default', 
  count = 0, 
  message, 
  onDismiss,
  className = '' 
}) => {
  const Icon = iconMap[type] || iconMap.default

  const getTypeStyles = () => {
    switch (type) {
      case 'warning':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (count === 0 && !message) return null

  return (
    <div className={clsx(
      'inline-flex items-center space-x-2 px-3 py-2 rounded-lg border text-sm font-medium',
      getTypeStyles(),
      className
    )}>
      <Icon className="w-4 h-4" />
      
      {message && (
        <span>{message}</span>
      )}
      
      {count > 0 && (
        <span className={clsx(
          'inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full',
          type === 'warning' ? 'bg-red-600 text-white' :
          type === 'success' ? 'bg-green-600 text-white' :
          type === 'info' ? 'bg-blue-600 text-white' :
          'bg-gray-600 text-white'
        )}>
          {count > 99 ? '99+' : count}
        </span>
      )}
      
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="ml-2 text-current hover:opacity-70 transition-opacity"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}
