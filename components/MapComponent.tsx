// components/MapComponent.tsx
'use client'

import 'leaflet/dist/leaflet.css'
import { useMapConfig } from '@/hooks/useMap'
import { useDIYGeoJSON } from '@/hooks/useDIYGeoJSON'
import { useState } from 'react'
import { DIYBoundaryFallback } from './map/DIYBoundaryFallback'
import { InfoPanel } from './map/InfoPanel'
import { LoadingIndicator } from './map/LoadingIndicator'
import { MapClickHandler } from './map/MapClickHandler'
import { PreciseDIYBoundary } from './map/PreciseDIYBoundary'
import { RiskMarker } from './map/RiskMarker'
import { SidebarControl } from './map/SidebarControl'
import { HistoryMarkers } from './map/HistoryMarkers'
import { DataSourceInfo } from './map/DataSourceInfo'
import { MapContainer, TileLayer } from 'react-leaflet'
import type { MapContainerProps, TileLayerProps } from 'react-leaflet'
import { AnalyzedPoint, TileLayerConfig } from '@/types'
import { Toast } from './map/Toast'
import { TileLayerInfo } from './map/components/map/TileLayerInfo'


// Define tile layer options - UPDATE DENGAN QGIS LAYER
const tileLayers: Record<string, TileLayerConfig> = {
  standard: {
    name: 'Standar',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors'
  },
  satellite: {
    name: 'Satelit', 
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '© Esri'
  },
  terrain: {
    name: 'Topografi',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '© OpenTopoMap'
  },
  // Tambahkan layer custom dari QGIS
  custom_qgis: {
    name: 'Peta Khusus DIY',
    url: '/tiles/{z}/{x}/{y}.png', // Path ke tile folder di public
    attribution: 'Created by QGIS',
    minZoom: 10,
    maxZoom: 14,
    tms: false
  }
}

type TileLayerKey = keyof typeof tileLayers

interface CustomTileLayerProps extends TileLayerProps {
  minZoom?: number;
  maxZoom?: number;
  tms?: boolean;
}

function CustomTileLayer(props: CustomTileLayerProps) {
  return <TileLayer {...props} />
}

export default function MapComponent() {
  const {
    clickedPosition,
    riskData,
    loading,
    showRiskZones,
    setShowRiskZones,
    handleMapClick,
    clearRiskData,
    mapHistory,
    toggleShowHistory,
    clearHistory,
    toast,
    setToast,
    showToast,
    activeTileLayer,
    handleTileLayerChange
  } = useMapConfig()

  const { diyFeature, loading: geoJSONLoading, sourceUsed } = useDIYGeoJSON()
  
  const [showHeatmap, setShowHeatmap] = useState<boolean>(false)

  const handleRiskMarkerClose = () => {
    clearRiskData()
  }

  const handleHistoryMarkerClick = (point: AnalyzedPoint) => {
    console.log('History marker clicked:', point)
  }

  // Handler untuk map click dengan error handling
  const handleMapClickWithError = async (lat: number, lng: number, accuracy: number) => {
    try {
      await handleMapClick(lat, lng)
    } catch (error) {
      console.error('Map click error:', error)
    }
  }

  const mapContainerProps: MapContainerProps = {
    center: [-7.7972, 110.3688] as [number, number],
    zoom: 10,
    style: { height: '100%', width: '100%' },
    scrollWheelZoom: true,
    className: "z-0"
  }

  // Get current tile layer config
  const currentLayer = tileLayers[activeTileLayer]

  return (
    <div className="relative h-full">
      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)}
          duration={3000}
        />
      )}

      <SidebarControl
        showRiskZones={showRiskZones}
        onRiskZonesChange={setShowRiskZones}
        tileLayers={tileLayers}
        activeTileLayer={activeTileLayer}
        onTileLayerChange={handleTileLayerChange}
        showHistory={mapHistory.showHistory}
        onHistoryChange={toggleShowHistory}
        historyCount={mapHistory.analyzedPoints.length}
        onClearHistory={clearHistory}
        showHeatmap={showHeatmap}
        onHeatmapChange={setShowHeatmap}
      />
      
      {/* Tile Layer Info Component */}
      <TileLayerInfo 
        layer={tileLayers[activeTileLayer]}
        isActive={true}
      />

      <MapContainer {...mapContainerProps}>
        {/* Dynamic Tile Layer dengan props custom */}
        <CustomTileLayer
          attribution={currentLayer.attribution}
          url={currentLayer.url}
          minZoom={currentLayer.minZoom}
          maxZoom={currentLayer.maxZoom}
          tms={currentLayer.tms}
        />
      
        {/* History Markers */}
        <HistoryMarkers 
          points={mapHistory.analyzedPoints}
          visible={mapHistory.showHistory}
          onMarkerClick={handleHistoryMarkerClick}
        />
        
        {/* Batas DIY dengan area gelap di luar DIY */}
        {!geoJSONLoading && diyFeature ? (
          <PreciseDIYBoundary 
            diyFeature={diyFeature} 
            source={sourceUsed}
          />
        ) : (
          <DIYBoundaryFallback />
        )}
        
        <MapClickHandler onMapClick={handleMapClickWithError} />
        
        {/* Current Marker */}
        {clickedPosition && riskData && !loading && (
          <RiskMarker 
            position={clickedPosition} 
            riskData={riskData} 
            onClose={handleRiskMarkerClose}
          />
        )}
      </MapContainer>

      {/* Status Indicators */}
      {geoJSONLoading && (
        <div className="absolute top-4 left-4 bg-white/90 p-2 rounded-lg shadow-md border border-gray-200 z-1000">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-600"></div>
            <span className="text-xs text-gray-600">Memuat batas wilayah...</span>
          </div>
        </div>
      )}

      {/* Layer info indicator */}
      <div className="absolute bottom-20 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-md border border-gray-200 z-1000">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            activeTileLayer === 'custom_qgis' ? 'bg-purple-500' :
            activeTileLayer === 'satellite' ? 'bg-green-500' :
            activeTileLayer === 'terrain' ? 'bg-orange-500' : 'bg-blue-500'
          }`}></div>
          <div>
            <span className="text-xs font-medium text-gray-700">
              {currentLayer.name}
            </span>
            <div className="text-[10px] text-gray-500">
              Zoom: {currentLayer.minZoom || 0}-{currentLayer.maxZoom || 18}
            </div>
          </div>
        </div>
      </div>

      <LoadingIndicator loading={loading} />
      <InfoPanel />
      
      {/* Data Source Info */}
      {riskData && (
        <DataSourceInfo data={{ metadata: riskData.metadata }} />
      )}
    </div>
  )
}