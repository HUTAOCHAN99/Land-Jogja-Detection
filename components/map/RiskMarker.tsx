// components/map/RiskMarker.tsx - COMPACT VERSION
'use client'

import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { RiskData } from '@/types'

interface RiskMarkerProps {
  position: [number, number]
  riskData: RiskData
  onClose?: () => void
}

const createRiskIcon = (riskLevel: RiskData['riskLevel'], accuracy: number) => {
  const color = riskLevel === 'high' ? '#ef4444' : riskLevel === 'medium' ? '#f59e0b' : '#10b981'
  
  return L.divIcon({
    className: 'custom-risk-icon',
    html: `
      <div style="
        position: relative;
        background-color: ${color}; 
        width: 24px; 
        height: 24px; 
        border-radius: 50%; 
        border: 2px solid white; 
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: white;
        font-size: 11px;
      ">
        ${riskLevel === 'high' ? '!' : riskLevel === 'medium' ? '~' : '✓'}
        <div style="
          position: absolute;
          bottom: -2px;
          right: -2px;
          background: ${accuracy >= 80 ? '#10b981' : accuracy >= 60 ? '#f59e0b' : '#ef4444'};
          color: white;
          border-radius: 50%;
          width: 8px;
          height: 8px;
          border: 1px solid white;
        "></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  })
}

export function RiskMarker({ position, riskData, onClose }: RiskMarkerProps) {
  const handlePopupClose = () => {
    if (onClose) onClose()
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <Marker 
      position={position} 
      icon={createRiskIcon(riskData.riskLevel, riskData.accuracy)}
    >
      <Popup 
        className="custom-popup min-w-[260px] max-w-xs"
        autoClose={false}
        closeOnEscapeKey={true}
      >
        <div className="p-2.5">
          {/* Header */}
          <div className="flex justify-between items-center mb-1.5">
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-1.5 ${
                riskData.riskLevel === 'high' ? 'bg-red-500' :
                riskData.riskLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
              }`}></div>
              <h3 className="font-bold text-gray-800 text-xs">
                Analisis Risiko
              </h3>
            </div>
            <button 
              onClick={handlePopupClose}
              className="text-gray-400 hover:text-gray-600 p-0.5"
              title="Tutup"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Address - Compact */}
          <div className="mb-2">
            <div className="text-[10px] text-gray-500 mb-0.5">📍 Lokasi</div>
            <div className="text-xs text-gray-700 line-clamp-2">{riskData.address}</div>
            <div className="text-[10px] text-gray-400 mt-0.5 font-mono">
              {position[0].toFixed(4)}, {position[1].toFixed(4)}
            </div>
          </div>

          {/* Main Metrics - Grid */}
          <div className="grid grid-cols-4 gap-1 mb-2">
            <div className="text-center p-1 bg-blue-50 rounded">
              <div className="text-[10px] text-blue-600">Elevasi</div>
              <div className="font-bold text-blue-800 text-sm">{riskData.elevation}m</div>
            </div>
            
            <div className="text-center p-1 bg-orange-50 rounded">
              <div className="text-[10px] text-orange-600">Kemiringan</div>
              <div className="font-bold text-orange-800 text-sm">{riskData.slope.toFixed(0)}°</div>
            </div>
            
            <div className="text-center p-1 bg-green-50 rounded">
              <div className="text-[10px] text-green-600">Hujan</div>
              <div className="font-bold text-green-800 text-sm">{riskData.rainfall}mm</div>
            </div>
            
            <div className={`text-center p-1 rounded ${
              riskData.riskLevel === 'high' ? 'bg-red-50' :
              riskData.riskLevel === 'medium' ? 'bg-yellow-50' : 'bg-green-50'
            }`}>
              <div className="text-[10px]">Skor</div>
              <div className="font-bold text-sm">{riskData.riskScore}</div>
            </div>
          </div>

          {/* Risk Level Bar */}
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[10px] text-gray-600">Level Risiko:</span>
            <div className="flex items-center">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                riskData.riskLevel === 'high' ? 'bg-red-100 text-red-700' :
                riskData.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {riskData.riskLevel === 'high' ? 'TINGGI' : 
                 riskData.riskLevel === 'medium' ? 'SEDANG' : 'RENDAH'}
              </span>
            </div>
          </div>

          {/* Land & Soil Info */}
          <div className="grid grid-cols-2 gap-1 mb-2">
            <div className="p-1 bg-gray-50 rounded">
              <div className="text-[10px] text-gray-500">Tutupan Lahan</div>
              <div className="text-[10px] font-medium text-gray-700 truncate">{riskData.landCover}</div>
            </div>
            <div className="p-1 bg-gray-50 rounded">
              <div className="text-[10px] text-gray-500">Jenis Tanah</div>
              <div className="text-[10px] font-medium text-gray-700 truncate">{riskData.soilType}</div>
            </div>
          </div>

          {/* Geological Risk - Compact */}
          {riskData.geologicalRisk && (
            <div className="mb-2">
              <div className="text-[10px] text-gray-500 mb-0.5">📋 Rekomendasi</div>
              <div className="text-[10px] text-gray-700 bg-yellow-50 p-1.5 rounded border border-yellow-100">
                {riskData.geologicalRisk.split('.')[0]}.
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="pt-1 border-t border-gray-100">
            <div className="flex justify-between items-center text-[9px] text-gray-400">
              <div className="flex items-center">
                <div className={`w-1.5 h-1.5 rounded-full mr-1 ${
                  riskData.accuracy >= 80 ? 'bg-green-400' :
                  riskData.accuracy >= 60 ? 'bg-yellow-400' : 'bg-red-400'
                }`}></div>
                <span>Akurasi: {riskData.accuracy}%</span>
              </div>
              <span>{formatTime(riskData.timestamp)}</span>
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  )
}

// CSS untuk styling
const popupStyles = `
.custom-popup .leaflet-popup-content-wrapper {
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border: 1px solid #e5e7eb;
}

.custom-popup .leaflet-popup-tip {
  background: white;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.custom-popup .leaflet-popup-content {
  margin: 0;
  line-height: 1.2;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
`

// Inject styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = popupStyles
  document.head.appendChild(style)
}