import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { ViewportBounds } from '@/types';

interface MapBoundsControllerProps {
  bounds: ViewportBounds;
}

export function MapBoundsController({ bounds }: MapBoundsControllerProps) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const leafletBounds = L.latLngBounds(
      L.latLng(bounds.southWest[0], bounds.southWest[1]),
      L.latLng(bounds.northEast[0], bounds.northEast[1])
    );

    // Set max bounds
    map.setMaxBounds(leafletBounds);
    
    // Force pan inside bounds jika user mencoba drag keluar
    map.on('drag', () => {
      map.panInsideBounds(leafletBounds, { animate: false });
    });

    // Set min zoom untuk mencegah zoom out terlalu jauh
    map.setMinZoom(9);
    
    // Set max zoom untuk mencegah zoom in terlalu detail
    map.setMaxZoom(16);

    // Set initial view ke tengah DIY
    map.setView([-7.7972, 110.3688], 10);

    return () => {
      map.off('drag');
    };
  }, [map, bounds]);

  return null;
}