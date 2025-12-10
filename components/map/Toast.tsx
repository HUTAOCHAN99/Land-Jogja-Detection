// components/map/Toast.tsx
'use client'

import { useEffect, useState } from 'react'

interface ToastProps {
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  onClose: () => void
  duration?: number
}

export function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true)
      setTimeout(() => {
        setIsVisible(false)
        onClose()
      }, 300) // Wait for fade out animation
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50 border-green-200',
          text: 'text-green-800',
          icon: '✅',
          border: 'border-l-4 border-green-500'
        }
      case 'error':
        return {
          bg: 'bg-red-50 border-red-200',
          text: 'text-red-800',
          icon: '❌',
          border: 'border-l-4 border-red-500'
        }
      case 'warning':
        return {
          bg: 'bg-yellow-50 border-yellow-200',
          text: 'text-yellow-800',
          icon: '⚠️',
          border: 'border-l-4 border-yellow-500'
        }
      case 'info':
        return {
          bg: 'bg-blue-50 border-blue-200',
          text: 'text-blue-800',
          icon: 'ℹ️',
          border: 'border-l-4 border-blue-500'
        }
      default:
        return {
          bg: 'bg-gray-50 border-gray-200',
          text: 'text-gray-800',
          icon: '💡',
          border: 'border-l-4 border-gray-500'
        }
    }
  }

  const styles = getTypeStyles()

  if (!isVisible) return null

  return (
    <div className={`fixed top-4 right-4 z-[2000] ${isExiting ? 'animate-slideOutRight' : 'animate-slideInRight'}`}>
      <div className={`${styles.bg} ${styles.border} rounded-r-lg shadow-lg p-4 max-w-xs transition-all duration-300 border-t border-r border-b`}>
        <div className="flex items-start">
          <span className="text-lg mr-3 flex-shrink-0">{styles.icon}</span>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium ${styles.text} break-words`}>{message}</p>
          </div>
          <button
            onClick={() => {
              setIsExiting(true)
              setTimeout(() => {
                setIsVisible(false)
                onClose()
              }, 300)
            }}
            className="ml-3 text-gray-400 hover:text-gray-600 flex-shrink-0"
            aria-label="Tutup notifikasi"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {/* Progress bar */}
        <div className="mt-3 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full ${type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'}`}
            style={{
              animation: `shrink ${duration}ms linear forwards`
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }
        .animate-slideOutRight {
          animation: slideOutRight 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}