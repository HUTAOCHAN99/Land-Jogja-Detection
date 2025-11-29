// components/map/MapClickHandler.tsx
import { useMapEvents } from 'react-leaflet';

interface MapClickHandlerProps {
  onMapClick: (lat: number, lng: number, accuracy: number) => void;
}

export function MapClickHandler({ onMapClick }: MapClickHandlerProps) {
  const map = useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      const zoom = map.getZoom();
      
      // Hitung akurasi berdasarkan zoom level
      let accuracy = 70; // default
      if (zoom >= 16) accuracy = 95;
      else if (zoom >= 14) accuracy = 90;
      else if (zoom >= 12) accuracy = 85;
      else if (zoom >= 10) accuracy = 75;
      
      console.log(`Map click - Zoom: ${zoom}, Accuracy: ${accuracy}%`);
      
      onMapClick(lat, lng, accuracy);
    },
    
    zoomend: () => {
      const zoom = map.getZoom();
      console.log(`Zoom changed to: ${zoom}`);
      
      // Beri feedback visual untuk zoom optimal
      if (zoom >= 14) {
        // Tampilkan notifikasi zoom optimal
        showZoomFeedback("optimal");
      } else if (zoom >= 12) {
        showZoomFeedback("good");
      } else {
        showZoomFeedback("low");
      }
    }
  });
  
  return null;
}

function showZoomFeedback(level: "optimal" | "good" | "low") {
  // Implementasi feedback visual
  const messages = {
    optimal: "🎯 Zoom optimal untuk akurasi tinggi",
    good: "✅ Zoom baik untuk analisis",
    low: "🔍 Zoom in untuk akurasi lebih baik"
  };
  
  // Bisa menggunakan toast notification
  console.log(messages[level]);
}