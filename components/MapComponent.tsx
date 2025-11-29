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
import { MapContainer, TileLayer } from 'react-leaflet';
import type { MapContainerProps } from 'react-leaflet';

// Define tile layer options
const tileLayers = {
  standard: {
    name: 'Standar',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: 'OpenStreetMap'
  },
  satellite: {
    name: 'Satelit', 
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Esri'
  },
  terrain: {
    name: 'Topografi',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: 'OpenTopoMap'
  }
} as const;

type TileLayerKey = keyof typeof tileLayers;

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
    clearHistory
  } = useMapConfig();

  const { geoJSON, diyFeature, loading: geoJSONLoading, error, sourceUsed } = useDIYGeoJSON();
  
  const [activeTileLayer, setActiveTileLayer] = useState<TileLayerKey>('standard');

  const handleTileLayerChange = (layer: string) => {
    setActiveTileLayer(layer as TileLayerKey);
  };

  const handleRiskMarkerClose = () => {
    clearRiskData();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleHistoryMarkerClick = (point: any) => {
    // Optional: Bisa digunakan untuk focus ke marker tertentu
    console.log('History marker clicked:', point);
  };

  const mapContainerProps: MapContainerProps = {
    center: [-7.7972, 110.3688] as [number, number],
    zoom: 10,
    style: { height: '100%', width: '100%' },
    scrollWheelZoom: true,
    className: "z-0"
  };

  return (
    <div className="relative h-full">
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
        showHeatmap={false} 
        onHeatmapChange={function (): void {
          throw new Error('Function not implemented.')
        }} 
      />

      <MapContainer {...mapContainerProps}>
        <TileLayer
          attribution={tileLayers[activeTileLayer].attribution}
          url={tileLayers[activeTileLayer].url}
        />
      
        {/* History Markers - TITIK ANALISIS SEBELUMNYA */}
        <HistoryMarkers 
          points={mapHistory.analyzedPoints}
          visible={mapHistory.showHistory}
          onMarkerClick={handleHistoryMarkerClick}
        />
        
        {/* Batas DIY */}
        {!geoJSONLoading && diyFeature && (
          <PreciseDIYBoundary 
            diyFeature={diyFeature} 
            allProvinces={geoJSON || undefined}
            source={sourceUsed}
          />
        )}
        
        {(!diyFeature || error) && <DIYBoundaryFallback />}
        
        <MapClickHandler onMapClick={handleMapClick} />
        
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

      <LoadingIndicator loading={loading} />
      <InfoPanel />
    </div>
  );
}