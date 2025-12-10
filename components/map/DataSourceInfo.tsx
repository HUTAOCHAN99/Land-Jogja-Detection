// components/map/DataSourceInfo.tsx - COMPLETE FIXED VERSION
'use client'
import { useState } from 'react'

interface DataSourceInfoProps {
  data?: {
    metadata?: {
      sources: {
        elevation: string;
        geospatial: string;
        address: string;
      };
      resolution: string;
      confidence: number;
      cached?: boolean;
    };
  };
}

export function DataSourceInfo({ data }: DataSourceInfoProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!data?.metadata) return null;

  const { metadata } = data;

  return (
    <div className="absolute bottom-4 right-4 z-1000">
      {isOpen ? (
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-4 max-w-xs">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-gray-900 flex items-center">
              <span className="mr-2">📊</span>
              Sumber Data
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-3">
            {/* Confidence Indicator */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-700">Tingkat Kepercayaan:</span>
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                metadata.confidence >= 80 ? 'bg-green-100 text-green-800' :
                metadata.confidence >= 60 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {metadata.confidence}%
              </span>
            </div>

            {/* Resolution */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-700">Resolusi Data:</span>
              <span className="text-xs text-gray-600 font-mono">{metadata.resolution}</span>
            </div>

            {/* Data Sources */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-700 mb-1">Sumber:</div>
              <div className="space-y-1 pl-2">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Elevasi: {metadata.sources.elevation}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Geospasial: {metadata.sources.geospatial}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Alamat: {metadata.sources.address}</span>
                </div>
              </div>
            </div>

            {/* Cache Status */}
            {metadata.cached && (
              <div className="bg-blue-50 p-2 rounded border border-blue-200">
                <div className="text-xs text-blue-700 flex items-center">
                  <span className="mr-1">⚡</span>
                  Data dari cache (lebih cepat)
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div className="text-[10px] text-gray-500 border-t border-gray-200 pt-2">
              Data bersumber dari Google Earth Engine dan Open-Elevation API. Update real-time.
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-md border border-gray-200 hover:bg-white transition-all flex items-center space-x-2"
          title="Lihat sumber data"
        >
          <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs font-medium text-gray-700">Sumber Data</span>
        </button>
      )}
    </div>
  );
}