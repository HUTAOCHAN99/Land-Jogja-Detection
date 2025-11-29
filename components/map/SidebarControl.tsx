'use client'
import { useState } from 'react'
import { MapControlProps } from "@/types";

interface TileLayerConfig {
  name: string;
  url: string;
  attribution: string;
}

interface ExtendedMapControlProps extends MapControlProps {
  tileLayers?: Record<string, TileLayerConfig>;
  activeTileLayer?: string;
  onTileLayerChange?: (layer: string) => void;
}

export function SidebarControl({ 
  showRiskZones, 
  showHeatmap, 
  onRiskZonesChange, 
  onHeatmapChange,
  tileLayers,
  activeTileLayer,
  onTileLayerChange
}: ExtendedMapControlProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Toggle Button - Compact */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-4 right-4 z-1000 bg-white p-2 rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition-all"
        title="Kontrol Peta"
      >
        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Sidebar - Compact */}
      <div className={`absolute top-0 right-0 h-full z-1000 bg-white/95 backdrop-blur-sm shadow-lg border-l border-gray-200 transition-all duration-200 ${
        isOpen ? 'w-56' : 'w-0'
      }`}>
        <div className={`h-full overflow-y-auto ${isOpen ? 'p-4' : 'p-0 opacity-0'}`}>
          
          {/* Header Compact */}
          <div className="mb-4 pb-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">Kontrol Peta</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Tile Layer Selector - Compact */}
          {tileLayers && onTileLayerChange && (
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-900 mb-2">Peta Dasar</label>
              <select 
                value={activeTileLayer}
                onChange={(e) => onTileLayerChange(e.target.value)}
                className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 focus:ring-1 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900"
              >
                {Object.entries(tileLayers).map(([key, layer]) => (
                  <option key={key} value={key}>{layer.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Layer Toggles - Compact */}
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-900 mb-2">Layer Tampilan</h3>
            <div className="space-y-2">
              {/* Risk Zones Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-900">Zona Risiko</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showRiskZones}
                    onChange={(e) => onRiskZonesChange(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>

              {/* Heatmap Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-900">Heatmap</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showHeatmap}
                    onChange={(e) => onHeatmapChange(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Legend - Compact */}
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-900 mb-2">Legenda Risiko</h3>
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full border border-white shadow-sm"></div>
                <span className="text-xs font-medium text-gray-900">Tinggi</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full border border-white shadow-sm"></div>
                <span className="text-xs font-medium text-gray-900">Sedang</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full border border-white shadow-sm"></div>
                <span className="text-xs font-medium text-gray-900">Rendah</span>
              </div>
            </div>
          </div>

          {/* Quick Tips - Compact */}
          <div className="bg-blue-50/80 p-3 rounded border border-blue-200/50">
            <h4 className="text-xs font-semibold text-blue-800 mb-1.5">Tips Cepat</h4>
            <ul className="text-[11px] text-blue-700 space-y-0.5">
              <li>• Klik area hijau untuk analisis</li>
              <li>• Area gelap = luar DIY</li>
              <li>• Peta terkunci wilayah DIY</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Backdrop untuk klik luar sidebar */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-999 bg-black/10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}