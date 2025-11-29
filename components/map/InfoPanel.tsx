'use client'
import { useState } from 'react'

export function InfoPanel() {
  const [isMinimized, setIsMinimized] = useState(false)

  if (isMinimized) {
    return (
      <div className="absolute bottom-4 left-4 bg-white p-2 rounded-lg shadow-lg border border-gray-200 z-[1000]">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMinimized(false)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Tampilkan info lengkap"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <span className="text-xs font-medium text-gray-700">Info Peta</span>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg border border-gray-200 z-1000 max-w-xs">
      {/* Header dengan minimize button */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <h4 className="font-bold text-gray-800 text-sm flex items-center">
          <span className="mr-2">💡</span>
          Area Analisis DIY
        </h4>
        <button
          onClick={() => setIsMinimized(true)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="Sembunyikan panel"
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content - lebih compact */}
      <div className="p-3 space-y-3 max-h-64 overflow-y-auto">
        {/* Status Fokus */}
        <div className="bg-green-50 p-2 rounded border border-green-200">
          <div className="text-xs text-green-800 font-medium">🎯 Fokus DIY</div>
          <div className="text-[11px] text-green-700 mt-0.5">Peta terkunci wilayah Yogyakarta</div>
        </div>

        {/* Legenda Compact */}
        <div>
          <div className="text-xs font-semibold text-gray-700 mb-2">Legenda:</div>
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full border border-white"></div>
              <span className="text-xs text-gray-600">Kota Yogyakarta</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full border border-white"></div>
              <span className="text-xs text-gray-600">Kabupaten</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full border border-white"></div>
              <span className="text-xs text-gray-600">Luar DIY</span>
            </div>
          </div>
        </div>

        {/* Interaksi Quick */}
        <div>
          <div className="text-xs font-semibold text-gray-700 mb-1">Cara Pakai:</div>
          <ul className="text-[11px] text-gray-600 space-y-0.5">
            <li>• <strong>Hover</strong> → Info daerah</li>
            <li>• <strong>Klik</strong> → Analisis risiko</li>
            <li>• <strong>Scroll</strong> → Zoom in/out</li>
          </ul>
        </div>

        {/* Daerah DIY Compact */}
        
      </div>

      {/* Footer dengan quick tips */}
      <div className="p-2 bg-gray-50 border-t border-gray-200 rounded-b-lg">
        <div className="text-[10px] text-gray-500 text-center">
          Klik <span className="font-medium">✕</span> di atas untuk minimize
        </div>
      </div>
    </div>
  )
}