// hooks/useMap.ts - DENGAN GEOCODING FALLBACK YANG LEBIH BAIK
import { useState, useEffect, useCallback } from 'react';
import L from 'leaflet';
import { RiskData, ViewportBounds, AnalyzedPoint, MapHistoryState, Subdistrict } from '@/types';

export const useMapConfig = () => {
  const [clickedPosition, setClickedPosition] = useState<[number, number] | null>(null);
  const [riskData, setRiskData] = useState<RiskData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showRiskZones, setShowRiskZones] = useState<boolean>(true);
  const [map, setMap] = useState<L.Map | null>(null);
  const [mapHistory, setMapHistory] = useState<MapHistoryState>({
    analyzedPoints: [],
    showHistory: false
  });

  const DIY_BOUNDS: ViewportBounds = {
    southWest: [-8.2, 110.1],
    northEast: [-7.5, 110.7]
  };

  // Data detail untuk fallback alamat berdasarkan koordinat
  const getDetailedFallbackAddress = (lat: number, lng: number): string => {
    // Database lokasi detail di DIY berdasarkan koordinat
    const locationDatabase: Array<{
      name: string;
      type: 'kecamatan' | 'kelurahan' | 'desa' | 'kawasan' | 'jalan';
      bounds: [number, number, number, number];
      details: string;
    }> = [
      // Kota Yogyakarta
      { 
        name: "Malioboro", 
        type: "jalan", 
        bounds: [-7.793, 110.363, -7.790, 110.367],
        details: "Jalan Malioboro, Gondomanan, Yogyakarta" 
      },
      { 
        name: "Gejayan", 
        type: "jalan", 
        bounds: [-7.770, 110.370, -7.765, 110.375],
        details: "Jalan Gejayan, Depok, Sleman" 
      },
      { 
        name: "Sagan", 
        type: "jalan", 
        bounds: [-7.782, 110.375, -7.778, 110.380],
        details: "Jalan Sagan, Terban, Yogyakarta" 
      },
      
      // Kampus dan Institusi
      { 
        name: "UGM", 
        type: "kawasan", 
        bounds: [-7.770, 110.377, -7.760, 110.387],
        details: "Kawasan Universitas Gadjah Mada, Bulaksumur, Sleman" 
      },
      { 
        name: "UNY", 
        type: "kawasan", 
        bounds: [-7.775, 110.385, -7.770, 110.390],
        details: "Kawasan Universitas Negeri Yogyakarta, Karangmalang, Sleman" 
      },
      
      // Sleman - Depok
      { 
        name: "Depok", 
        type: "kecamatan", 
        bounds: [-7.765, 110.370, -7.745, 110.395],
        details: "Kecamatan Depok, Kabupaten Sleman" 
      },
      { 
        name: "Condongcatur", 
        type: "kelurahan", 
        bounds: [-7.755, 110.380, -7.750, 110.390],
        details: "Kelurahan Condongcatur, Depok, Sleman" 
      },
      
      // Sleman - Lereng Merapi
      { 
        name: "Kaliurang", 
        type: "kawasan", 
        bounds: [-7.600, 110.430, -7.590, 110.440],
        details: "Kawasan Kaliurang, Cangkringan, Sleman" 
      },
      { 
        name: "Turgo", 
        type: "desa", 
        bounds: [-7.590, 110.440, -7.580, 110.450],
        details: "Desa Turgo, Cangkringan, Sleman" 
      },
      
      // Bantul
      { 
        name: "Kasihan", 
        type: "kecamatan", 
        bounds: [-7.850, 110.320, -7.830, 110.340],
        details: "Kecamatan Kasihan, Bantul" 
      },
      { 
        name: "Sewon", 
        type: "kecamatan", 
        bounds: [-7.870, 110.350, -7.850, 110.370],
        details: "Kecamatan Sewon, Bantul" 
      },
      
      // Gunungkidul
      { 
        name: "Wonosari", 
        type: "kecamatan", 
        bounds: [-7.970, 110.550, -7.950, 110.570],
        details: "Kecamatan Wonosari, Gunungkidul" 
      },
      { 
        name: "Baron", 
        type: "kawasan", 
        bounds: [-8.120, 110.450, -8.110, 110.460],
        details: "Kawasan Pantai Baron, Gunungkidul" 
      },
      
      // Kulon Progo
      { 
        name: "Wates", 
        type: "kecamatan", 
        bounds: [-7.870, 110.140, -7.850, 110.160],
        details: "Kecamatan Wates, Kulon Progo" 
      }
    ];

    // Cari lokasi yang sesuai dengan koordinat
    for (const location of locationDatabase) {
      const [minLat, minLng, maxLat, maxLng] = location.bounds;
      if (lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng) {
        return `${location.details}, Daerah Istimewa Yogyakarta`;
      }
    }

    // Fallback berdasarkan zona geografis dengan detail lebih
    const zone = getZoneName(lat, lng);
    const zoneDetails: Record<string, string> = {
      "Lereng Merapi": "Lereng Gunung Merapi, Kecamatan Cangkringan, Kabupaten Sleman, DIY",
      "Sleman Tengah": "Kecamatan Depok, Kabupaten Sleman, Daerah Istimewa Yogyakarta",
      "Kota Yogyakarta": "Kota Yogyakarta, Daerah Istimewa Yogyakarta",
      "Bantul": "Kabupaten Bantul, Daerah Istimewa Yogyakarta", 
      "Gunungkidul Timur": "Kawasan Karst Pegunungan Sewu, Kabupaten Gunungkidul, DIY",
      "Gunungkidul Barat": "Kabupaten Gunungkidul, Daerah Istimewa Yogyakarta",
      "Kulon Progo": "Kabupaten Kulon Progo, Daerah Istimewa Yogyakarta"
    };

    return zoneDetails[zone] || `Lokasi di ${zone}, Daerah Istimewa Yogyakarta`;
  };

  const getZoneName = (lat: number, lng: number): string => {
    if (lat > -7.55 && lat < -7.65) return "Lereng Merapi";
    if (lat > -7.65 && lat < -7.75) return "Sleman Tengah";
    if (lat > -7.75 && lat < -7.85) return "Kota Yogyakarta";
    if (lat > -7.85 && lat < -8.00) return "Bantul";
    if (lat < -8.00 && lng > 110.40) return "Gunungkidul Timur";
    if (lat < -8.00) return "Gunungkidul Barat";
    if (lng < 110.25) return "Kulon Progo";
    return "DIY";
  };

  const fixLeafletIcon = () => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  const initMapBounds = useCallback((mapInstance: L.Map) => {
    const bounds = L.latLngBounds(
      L.latLng(DIY_BOUNDS.southWest[0], DIY_BOUNDS.southWest[1]),
      L.latLng(DIY_BOUNDS.northEast[0], DIY_BOUNDS.northEast[1])
    );
    
    mapInstance.setMaxBounds(bounds);
    mapInstance.on('drag', () => {
      mapInstance.panInsideBounds(bounds, { animate: false });
    });
    
    mapInstance.setView([-7.7972, 110.3688], 10);
    mapInstance.setMinZoom(9);
    mapInstance.setMaxZoom(16);
  }, [DIY_BOUNDS.northEast, DIY_BOUNDS.southWest]);

  // Fungsi retry untuk fetch dengan timeout
  const fetchWithRetry = async (url: string, options: RequestInit, retries = 2, timeout = 8000): Promise<Response> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response;
    } catch (error) {
      if (retries > 0) {
        console.log(`🔄 Retrying... ${retries} attempts left`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return fetchWithRetry(url, options, retries - 1, timeout);
      }
      throw error;
    }
  };

  const handleMapClick = async (lat: number, lng: number): Promise<void> => {
    const bounds = L.latLngBounds(
      L.latLng(DIY_BOUNDS.southWest[0], DIY_BOUNDS.southWest[1]),
      L.latLng(DIY_BOUNDS.northEast[0], DIY_BOUNDS.northEast[1])
    );
    
    if (!bounds.contains(L.latLng(lat, lng))) {
      if (typeof window !== 'undefined') {
        alert('Silakan pilih lokasi dalam wilayah DIY (Daerah Istimewa Yogyakarta)');
      }
      return;
    }
    
    setClickedPosition([lat, lng]);
    setLoading(true);
    
    try {
      console.log(`🗺️ Mengirim permintaan analisis untuk: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      
      const response = await fetchWithRetry('/api/risk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          latitude: Number(lat.toFixed(6)), 
          longitude: Number(lng.toFixed(6)) 
        })
      });
      
      if (!response.ok) {
        let errorMessage = 'Gagal mengambil data risiko';
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
          
          if (response.status === 400) {
            errorMessage += ` (Koordinat tidak valid)`;
          } else if (response.status === 500) {
            errorMessage += ` (Server error)`;
            
            // Gunakan fallback data dari server jika ada
            if (errorData.fallbackData) {
              console.log('🔄 Using fallback data from server');
              setRiskData(errorData.fallbackData);
              
              const newPoint: AnalyzedPoint = {
                id: `point-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                position: [lat, lng],
                riskData: errorData.fallbackData,
                timestamp: new Date().toISOString()
              };
              
              setMapHistory(prev => ({
                ...prev,
                analyzedPoints: [...prev.analyzedPoints, newPoint]
              }));
              
              setLoading(false);
              return;
            }
          }
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }
      
      const data: RiskData = await response.json();
      console.log('✅ Data risiko diterima:', data);
      setRiskData(data);
      
      const newPoint: AnalyzedPoint = {
        id: `point-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        position: [lat, lng],
        riskData: data,
        timestamp: new Date().toISOString()
      };
      
      setMapHistory(prev => ({
        ...prev,
        analyzedPoints: [...prev.analyzedPoints, newPoint]
      }));
      
    } catch (error) {
      console.error('❌ Error fetching risk data:', error);
      
      // Fallback data dengan alamat yang sangat detail
      const isNorthernArea = lat > -7.65;
      const isSouthernArea = lat < -8.0;
      const isKulonProgo = lng < 110.25;
      const isUrbanArea = lat > -7.78 && lat < -7.82 && lng > 110.35 && lng < 110.42;
      
      const fallbackAddress = getDetailedFallbackAddress(lat, lng);
      
      const fallbackData: RiskData = {
        slope: isNorthernArea ? 25 + Math.random() * 15 : 
               isSouthernArea ? 15 + Math.random() * 10 : 
               isKulonProgo ? 10 + Math.random() * 10 :
               isUrbanArea ? 2 + Math.random() * 3 :
               5 + Math.random() * 10,
        landCover: isNorthernArea ? 'Hutan' : 
                   isSouthernArea ? 'Lahan Kering Berbatu' : 
                   isKulonProgo ? 'Tegalan' :
                   isUrbanArea ? 'Permukiman Padat' :
                   'Permukiman',
        rainfall: isNorthernArea ? 220 + Math.random() * 60 :
                  isSouthernArea ? 130 + Math.random() * 50 :
                  isUrbanArea ? 180 + Math.random() * 40 :
                  150 + Math.random() * 50,
        elevation: isNorthernArea ? 350 + Math.random() * 250 :
                   isSouthernArea ? 220 + Math.random() * 130 :
                   isKulonProgo ? 120 + Math.random() * 80 :
                   isUrbanArea ? 115 + Math.random() * 10 :
                   100 + Math.random() * 100,
        riskLevel: isNorthernArea ? 'high' : 
                   isSouthernArea ? 'medium' : 
                   isUrbanArea ? 'low' :
                   'low',
        riskScore: isNorthernArea ? 72 + Math.random() * 18 :
                   isSouthernArea ? 45 + Math.random() * 20 :
                   isUrbanArea ? 25 + Math.random() * 15 :
                   30 + Math.random() * 20,
        soilType: isNorthernArea ? 'Andosol (Vulkanik)' :
                  isSouthernArea ? 'Grumusol (Liat Kapur)' :
                  isKulonProgo ? 'Mediteran' :
                  isUrbanArea ? 'Aluvial' :
                  'Latosol',
        geologicalRisk: 'Data Simulasi - Sistem Offline',
        address: fallbackAddress,
        accuracy: 55 + Math.random() * 25,
        timestamp: new Date().toISOString()
      };
      
      setRiskData(fallbackData);
      
      const newPoint: AnalyzedPoint = {
        id: `point-fallback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        position: [lat, lng],
        riskData: fallbackData,
        timestamp: new Date().toISOString()
      };
      
      setMapHistory(prev => ({
        ...prev,
        analyzedPoints: [...prev.analyzedPoints, newPoint]
      }));
      
      // User feedback yang lebih informatif
      if (typeof window !== 'undefined') {
        const errorMsg = error instanceof Error ? error.message : 'Koneksi terputus';
        
        if (errorMsg.includes('Koordinat tidak valid')) {
          alert('❌ Koordinat tidak valid. Silakan pilih lokasi dalam wilayah DIY.');
        } else if (errorMsg.includes('timeout') || errorMsg.includes('abort')) {
          console.warn('⏱️ Request timeout, menggunakan data simulasi');
          // Tidak tampilkan alert untuk timeout, cukup gunakan fallback data
        } else {
          console.warn(`🔄 Menggunakan data simulasi: ${errorMsg}`);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // ... (fungsi-fungsi lainnya tetap sama)

  const clearRiskData = () => {
    setRiskData(null);
    setClickedPosition(null);
  };

  const toggleShowHistory = (show: boolean) => {
    setMapHistory(prev => ({ ...prev, showHistory: show }));
  };

  const clearHistory = () => {
    setMapHistory(prev => ({ ...prev, analyzedPoints: [] }));
  };

  const handleMapReady = useCallback((mapInstance: L.Map) => {
    setMap(mapInstance);
    initMapBounds(mapInstance);
  }, [initMapBounds]);

  return {
    clickedPosition,
    riskData,
    loading,
    showRiskZones,
    map,
    mapHistory,
    setShowRiskZones,
    setMap,
    setRiskData,
    handleMapClick,
    initMapBounds,
    clearRiskData,
    handleMapReady,
    toggleShowHistory,
    clearHistory,
  };
};