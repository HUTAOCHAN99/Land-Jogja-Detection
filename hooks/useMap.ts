/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';
import L from 'leaflet';
import { RiskData, ViewportBounds } from '@/types';

export const useMapConfig = () => {
  const [clickedPosition, setClickedPosition] = useState<[number, number] | null>(null);
  const [riskData, setRiskData] = useState<RiskData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showRiskZones, setShowRiskZones] = useState<boolean>(true);
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [map, setMap] = useState<L.Map | null>(null);

  const DIY_BOUNDS: ViewportBounds = {
    southWest: [-8.2, 110.1],
    northEast: [-7.5, 110.7]
  };

  const fixLeafletIcon = () => {
    if (typeof window !== 'undefined') {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
    }
  };

  useEffect(() => {
    fixLeafletIcon();
  }, []);

  // Set bounds restriction ketika map ready
  const initMapBounds = useCallback((mapInstance: L.Map) => {
    const bounds = L.latLngBounds(
      L.latLng(DIY_BOUNDS.southWest[0], DIY_BOUNDS.southWest[1]),
      L.latLng(DIY_BOUNDS.northEast[0], DIY_BOUNDS.northEast[1])
    );
    
    mapInstance.setMaxBounds(bounds);
    mapInstance.on('drag', () => {
      mapInstance.panInsideBounds(bounds, { animate: false });
    });
    
    // Set view ke tengah DIY
    mapInstance.setView([-7.7972, 110.3688], 10);
  }, [DIY_BOUNDS.northEast, DIY_BOUNDS.southWest]);

  const handleMapClick = async (lat: number, lng: number): Promise<void> => {
    // Validasi klik masih dalam bounds DIY
    const bounds = L.latLngBounds(
      L.latLng(DIY_BOUNDS.southWest[0], DIY_BOUNDS.southWest[1]),
      L.latLng(DIY_BOUNDS.northEast[0], DIY_BOUNDS.northEast[1])
    );
    
    if (!bounds.contains(L.latLng(lat, lng))) {
      // Tampilkan alert atau toast message
      if (typeof window !== 'undefined') {
        alert('Silakan pilih lokasi dalam wilayah DIY (Daerah Istimewa Yogyakarta)');
      }
      return;
    }
    
    setClickedPosition([lat, lng]);
    setLoading(true);
    
    try {
      const response = await fetch('/api/risk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latitude: lat, longitude: lng })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch risk data');
      }
      
      const data: RiskData = await response.json();
      setRiskData(data);
    } catch (error) {
      console.error('Error fetching risk data:', error);
      
      // FALLBACK DATA YANG SESUAI DENGAN INTERFACE RiskData
      const fallbackData: RiskData = {
        slope: 10 + Math.random() * 20,
        landCover: 'Data tidak tersedia',
        rainfall: 150 + Math.random() * 50,
        elevation: 100 + Math.random() * 200,
        riskLevel: 'medium',
        riskScore: 40 + Math.random() * 30,
        soilType: 'Latosol',
        geologicalRisk: 'Data terbatas',
        address: 'Lokasi di DIY',
        accuracy: 50 + Math.random() * 30,
        timestamp: new Date().toISOString()
      };
      
      setRiskData(fallbackData);
      
      // Tampilkan error ke user
      if (typeof window !== 'undefined' && error instanceof Error) {
        alert(`Analisis risiko: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to clear risk data (untuk handle close marker)
  const clearRiskData = () => {
    setRiskData(null);
    setClickedPosition(null);
  };

  return {
    clickedPosition,
    riskData,
    loading,
    showRiskZones,
    showHeatmap,
    setShowRiskZones,
    setShowHeatmap,
    handleMapClick,
    initMapBounds,
    map,
    setMap,
    clearRiskData,
    setRiskData
  };
};