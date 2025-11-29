import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { RiskData } from '@/types';

interface RiskMarkerProps {
  position: [number, number];
  riskData: RiskData;
  onClose?: () => void;
}

const createRiskIcon = (riskLevel: RiskData['riskLevel'], accuracy: number) => {
  const color = riskLevel === 'high' ? 'red' : riskLevel === 'medium' ? 'orange' : 'green';
  const pulseClass = riskLevel === 'high' ? 'risk-marker-pulse' : '';
  
  const accuracyIndicator = accuracy >= 80 ? '✓' : accuracy >= 60 ? '~' : '?';
  
  return L.divIcon({
    className: `custom-risk-icon ${pulseClass}`,
    html: `
      <div style="
        position: relative;
        background-color: ${color}; 
        width: 28px; 
        height: 28px; 
        border-radius: 50%; 
        border: 2px solid white; 
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: white;
        font-size: 12px;
      ">
        ${riskLevel === 'high' ? '!' : riskLevel === 'medium' ? '~' : '✓'}
        <div style="
          position: absolute;
          top: -1px;
          right: -1px;
          background: ${accuracy >= 80 ? '#10b981' : accuracy >= 60 ? '#f59e0b' : '#ef4444'};
          color: white;
          border-radius: 50%;
          width: 10px;
          height: 10px;
          font-size: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid white;
        ">
          ${accuracyIndicator}
        </div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

// Fungsi helper untuk kategori
const getElevationCategory = (elevation: number): string => {
  if (elevation > 500) return 'Sangat Tinggi';
  if (elevation > 200) return 'Tinggi';
  if (elevation > 100) return 'Sedang';
  return 'Rendah';
};

const getSlopeCategory = (slope: number): string => {
  if (slope > 30) return 'Sangat Curam';
  if (slope > 15) return 'Curam';
  if (slope > 5) return 'Landai';
  return 'Datar';
};

const getRainfallCategory = (rainfall: number): string => {
  if (rainfall > 250) return 'Sangat Tinggi';
  if (rainfall > 150) return 'Tinggi';
  if (rainfall > 100) return 'Sedang';
  return 'Rendah';
};

const getRiskColor = (riskLevel: RiskData['riskLevel']): string => {
  switch(riskLevel) {
    case 'low': return 'bg-green-500';
    case 'medium': return 'bg-yellow-500';
    case 'high': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

const getRiskDescription = (riskLevel: RiskData['riskLevel']): string => {
  switch(riskLevel) {
    case 'low': return 'Rendah';
    case 'medium': return 'Sedang'; 
    case 'high': return 'Tinggi';
    default: return 'Tidak Diketahui';
  }
};

const getMitigationRecommendations = (riskData: RiskData): string[] => {
  const recommendations: string[] = [];
  
  if (riskData.riskLevel === 'high') {
    recommendations.push('⛔ Evakuasi - hubungi BPBD');
    recommendations.push('📢 Peringatan area rawan');
    recommendations.push('🚧 Batasi akses area');
  } else if (riskData.riskLevel === 'medium') {
    recommendations.push('👀 Pantau pergerakan tanah');
    recommendations.push('🌳 Tanam vegetasi penahan');
    recommendations.push('📐 Survei geoteknik');
  } else {
    recommendations.push('✅ Waspada saat hujan deras');
    recommendations.push('🌿 Jaga vegetasi existing');
  }

  if (riskData.slope > 25) {
    recommendations.push('🏗️ Buat terasering');
  }
  
  if (riskData.rainfall > 200) {
    recommendations.push('💧 Perbaiki drainase');
  }
  
  if (riskData.soilType?.includes('Andosol') ?? false) {
    recommendations.push('🌋 Material vulkanik mudah erosi');
  }

  return recommendations;
};

export function RiskMarker({ position, riskData, onClose }: RiskMarkerProps) {
  // Safe data dengan default values
  const safeRiskData = {
    slope: riskData.slope || 0,
    landCover: riskData.landCover || 'Data tidak tersedia',
    rainfall: riskData.rainfall || 0,
    elevation: riskData.elevation || 0,
    riskLevel: riskData.riskLevel || 'medium',
    riskScore: riskData.riskScore || 0,
    soilType: riskData.soilType || 'Latosol',
    geologicalRisk: riskData.geologicalRisk || 'Data terbatas',
    address: riskData.address || 'Lokasi di DIY',
    accuracy: riskData.accuracy || 50,
    timestamp: riskData.timestamp || new Date().toISOString()
  };

  const recommendations = getMitigationRecommendations(safeRiskData);

  const handlePopupClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <Marker 
      position={position} 
      icon={createRiskIcon(safeRiskData.riskLevel, safeRiskData.accuracy)}
    >
      <Popup 
        className="custom-popup min-w-[280px] max-w-sm"
        autoClose={false}
        closeOnEscapeKey={true}
      >
        <div className="p-3">
          {/* Header Compact */}
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-gray-800 text-sm flex items-center">
              <span className="mr-1">🏔️</span>
              Analisis Risiko
            </h3>
            <button 
              onClick={handlePopupClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-0.5"
              title="Tutup"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Alamat Compact */}
          <div className="text-xs text-gray-600 bg-gray-50 p-1.5 rounded border border-gray-200 mb-3">
            <div className="font-medium truncate">📍 {safeRiskData.address}</div>
            <div className="font-mono text-[10px] mt-0.5">
              {position[0].toFixed(4)}, {position[1].toFixed(4)}
            </div>
          </div>

          <div className="space-y-2 text-xs">
            {/* Indikator Akurasi Compact */}
            <div className="flex justify-between items-center bg-blue-50 p-1.5 rounded border border-blue-200">
              <span className="font-medium text-blue-700">Akurasi Data:</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                safeRiskData.accuracy >= 80 ? 'bg-green-100 text-green-700' :
                safeRiskData.accuracy >= 60 ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {safeRiskData.accuracy}%
              </span>
            </div>

            {/* Parameter Utama Compact */}
            <div className="grid grid-cols-4 gap-1.5">
              {/* Elevasi */}
              <div className="bg-blue-50 p-1.5 rounded border border-blue-200 text-center">
                <div className="text-[10px] text-blue-600 font-medium">Elevasi</div>
                <div className="font-bold text-blue-800 text-sm">{safeRiskData.elevation}m</div>
                <div className="text-[9px] text-blue-700 mt-0.5">DPL</div>
              </div>
              
              {/* Kemiringan */}
              <div className="bg-orange-50 p-1.5 rounded border border-orange-200 text-center">
                <div className="text-[10px] text-orange-600 font-medium">Kemiringan</div>
                <div className="font-bold text-orange-800 text-sm">{safeRiskData.slope.toFixed(0)}°</div>
              </div>
              
              {/* Curah Hujan */}
              <div className="bg-green-50 p-1.5 rounded border border-green-200 text-center">
                <div className="text-[10px] text-green-600 font-medium">Hujan</div>
                <div className="font-bold text-green-800 text-sm">{safeRiskData.rainfall}mm</div>
              </div>
              
              {/* Skor Risiko */}
              <div className={`p-1.5 rounded border text-center ${
                safeRiskData.riskLevel === 'high' ? 'bg-red-50 border-red-200' :
                safeRiskData.riskLevel === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                'bg-green-50 border-green-200'
              }`}>
                <div className="text-[10px] font-medium">Skor</div>
                <div className="font-bold text-sm">{safeRiskData.riskScore.toFixed(0)}</div>
              </div>
            </div>

            {/* Level Risiko Compact */}
            <div className="flex justify-between items-center p-1.5 bg-gray-50 rounded border border-gray-200">
              <span className="font-medium text-gray-700">Level Risiko:</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white ${getRiskColor(safeRiskData.riskLevel)}`}>
                {getRiskDescription(safeRiskData.riskLevel)}
              </span>
            </div>

            {/* Informasi Lahan Compact */}
            <div className="grid grid-cols-2 gap-1.5">
              <div className="bg-purple-50 p-1.5 rounded border border-purple-200">
                <div className="text-[10px] text-purple-600 font-medium">Lahan</div>
                <div className="font-semibold text-purple-800 text-[10px] truncate">{safeRiskData.landCover}</div>
              </div>
              <div className="bg-amber-50 p-1.5 rounded border border-amber-200">
                <div className="text-[10px] text-amber-600 font-medium">Tanah</div>
                <div className="font-semibold text-amber-800 text-[10px] truncate">{safeRiskData.soilType}</div>
              </div>
            </div>

            {/* Keterangan Parameter */}
            <div className="bg-gray-50 p-1.5 rounded border border-gray-200">
              <div className="text-[10px] text-gray-600 space-y-0.5">
                <div className="flex justify-between">
                  <span>Elevasi:</span>
                  <span className="font-medium">{getElevationCategory(safeRiskData.elevation)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Kemiringan:</span>
                  <span className="font-medium">{getSlopeCategory(safeRiskData.slope)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Curah Hujan:</span>
                  <span className="font-medium">{getRainfallCategory(safeRiskData.rainfall)}</span>
                </div>
              </div>
            </div>

            
            {/* Footer Compact */}
            <div className="pt-1 border-t border-gray-200">
              <div className="flex justify-between items-center text-[10px] text-gray-500">
                <span>Update:</span>
                <span>{new Date(safeRiskData.timestamp).toLocaleTimeString('id-ID', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}</span>
              </div>
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

// CSS untuk animasi pulse
const pulseStyles = `
@keyframes pulse-high-risk {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.risk-marker-pulse {
  animation: pulse-high-risk 2s infinite;
}

.custom-popup .leaflet-popup-content-wrapper {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.custom-popup .leaflet-popup-tip {
  box-shadow: none;
}

.custom-popup .leaflet-popup-content {
  margin: 0;
  line-height: 1.3;
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = pulseStyles;
  document.head.appendChild(style);
}