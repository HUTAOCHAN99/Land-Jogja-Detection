/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo } from 'react';
import { useMap, GeoJSON } from 'react-leaflet';
import L from 'leaflet';

interface PreciseDIYBoundaryProps {
  diyFeature: any;
  allProvinces?: any;
  source: string;
}

interface GeoJSONFeatureCollection {
  type: "FeatureCollection";
  features: any[];
}

export function PreciseDIYBoundary({ diyFeature, allProvinces, source }: PreciseDIYBoundaryProps) {
  const map = useMap();

  // Style untuk boundary DIY - lebih transparan agar tidak menutupi detail kabupaten
  const diyStyle: L.PathOptions = {
    color: '#10b981',
    weight: 3,
    opacity: 0.7,
    fillColor: 'rgba(16, 185, 129, 0.1)', // Lebih transparan
    fillOpacity: 0.1, // Sangat transparan
    dashArray: '8, 4'
  };

  // Style untuk area luar DIY - GELAP (tetap fokus DIY)
  const nonDiyStyle: L.PathOptions = {
    color: 'rgba(15, 23, 42, 0.9)',
    weight: 2,
    opacity: 0.9,
    fillColor: 'rgba(2, 6, 23, 0.7)',
    fillOpacity: 0.7
  };

  // Filter untuk mendapatkan hanya provinsi NON-DIY
  const getNonDIYFeatures = (allFeatures: any): any[] => {
    if (!allFeatures || !allFeatures.features) return [];
    
    return allFeatures.features.filter((feature: any) => {
      const props = feature.properties || {};
      
      const isDIY = (
        props.iso_3166_2 === 'ID-YO' ||
        (props.iso_a2 === 'ID' && props.name === 'Yogyakarta') ||
        (props.name && props.name.toLowerCase().includes('yogyakarta')) ||
        props.Propinsi?.toLowerCase().includes('yogyakarta') ||
        props.kode === '34'
      );

      return !isDIY;
    });
  };

  const nonDIYFeatures: GeoJSONFeatureCollection | null = useMemo(() => {
    if (!allProvinces) return null;
    
    const features = getNonDIYFeatures(allProvinces);
    return {
      type: "FeatureCollection" as const,
      features: features
    };
  }, [allProvinces]);

  // Event handlers untuk DIY boundary - minimal agar tidak ganggu detail kabupaten
  const onEachDIYFeature = (feature: any, layer: L.Layer) => {
    const properties = feature.properties || {};
    const provinceName = properties.name || properties.Propinsi || 'DIY';

    layer.bindTooltip(
      `📍 ${provinceName}<br>Daerah Istimewa Yogyakarta`,
      { permanent: false, direction: 'center', className: 'diy-province-tooltip' }
    );

    // Hover effect minimal
    layer.on('mouseover', () => {
      if (layer instanceof L.Path) {
        layer.setStyle({
          weight: 4,
          fillOpacity: 0.15
        });
      }
    });

    layer.on('mouseout', () => {
      if (layer instanceof L.Path) {
        layer.setStyle({
          weight: 3,
          fillOpacity: 0.1
        });
      }
    });
  };

  // Handler untuk non-DIY features - TANPA HOVER EFFECT
  const onEachNonDIYFeature = (feature: any, layer: L.Layer) => {
    const properties = feature.properties || {};
    const provinceName = properties.name || properties.Propinsi || 'Provinsi Lain';
    
    layer.bindTooltip(
      `⛔ ${provinceName}<br><small>Luar Area Analisis DIY</small>`,
      { permanent: false, direction: 'center' }
    );
  };

  useEffect(() => {
    if (diyFeature && map) {
      try {
        const diyLayer = L.geoJSON(diyFeature);
        const bounds = diyLayer.getBounds();
        
        if (bounds.isValid()) {
          const paddedBounds = bounds.pad(0.1);
          map.fitBounds(paddedBounds, { padding: [20, 20], maxZoom: 12 });
          map.setMaxBounds(bounds.pad(0.2));
          map.setMinZoom(9);
          map.setMaxZoom(16);
        }
      } catch (error) {
        console.error('Error setting bounds:', error);
        const fallbackBounds = L.latLngBounds(
          L.latLng(-8.3, 109.9),
          L.latLng(-7.4, 110.8)
        );
        map.setMaxBounds(fallbackBounds);
        map.setView([-7.7972, 110.3688], 10);
      }
    }
  }, [diyFeature, map]);

  return (
    <>
      {/* Hanya tampilkan provinsi NON-DIY dengan style gelap - TANPA HOVER */}
      {nonDIYFeatures && nonDIYFeatures.features.length > 0 && (
        <GeoJSON
          key="non-diy-provinces"
          data={nonDIYFeatures}
          style={nonDiyStyle}
          onEachFeature={onEachNonDIYFeature}
        />
      )}
      
      {/* Tampilkan DIY dengan style transparan - biarkan detail kabupaten terlihat */}
      {diyFeature && (
        <GeoJSON
          key="diy-boundary"
          data={diyFeature}
          style={diyStyle}
          onEachFeature={onEachDIYFeature}
        />
      )}
    </>
  );
}