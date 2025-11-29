/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';

export interface GeoJSONFeature {
  type: "Feature";
  properties: Record<string, unknown>;
  geometry: {
    type: string;
    coordinates: unknown;
  };
}

export interface GeoJSONData {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

// Sumber data dari Natural Earth
const NATURAL_EARTH_SOURCE = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_1_states_provinces.geojson';

// Backup sources
const BACKUP_SOURCES = [
  'https://raw.githubusercontent.com/rifkyfu/GeoJSON-Indonesia/master/GeoJSON/yogyakarta.geojson',
  'https://gist.githubusercontent.com/ans-4175/66c12e36b3026c288f9759d89f2b4e12/raw/2c2e7d4d2c1b3a66c0c7d1595b8b196e3a8336e8/yogyakarta.geojson',
];

export const useDIYGeoJSON = () => {
  const [geoJSON, setGeoJSON] = useState<GeoJSONData | null>(null);
  const [diyFeature, setDiyFeature] = useState<any>(null); // Use any untuk kompatibilitas
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sourceUsed, setSourceUsed] = useState<string>('');

  // Data manual fallback untuk DIY
  const createManualDIYGeoJSON = (): any => {
    return {
      type: "Feature",
      properties: {
        name: "DI Yogyakarta",
        provinceCode: "34",
        iso_3166_2: "ID-YO",
        region: "Yogyakarta"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [110.125, -7.875], [110.183, -7.832], [110.283, -7.789], 
          [110.367, -7.724], [110.467, -7.689], [110.567, -7.654],
          [110.650, -7.602], [110.733, -7.567], [110.800, -7.532],
          [110.850, -7.480], [110.883, -7.427], [110.900, -7.375],
          [110.900, -7.323], [110.883, -7.288], [110.850, -7.253],
          [110.800, -7.218], [110.733, -7.200], [110.650, -7.183],
          [110.567, -7.165], [110.467, -7.148], [110.367, -7.130],
          [110.283, -7.113], [110.200, -7.095], [110.117, -7.095],
          [110.050, -7.113], [110.000, -7.148], [109.967, -7.183],
          [109.950, -7.235], [109.950, -7.288], [109.967, -7.340],
          [110.000, -7.392], [110.050, -7.445], [110.100, -7.497],
          [110.150, -7.532], [110.183, -7.567], [110.200, -7.619],
          [110.217, -7.671], [110.217, -7.724], [110.200, -7.776],
          [110.167, -7.829], [110.125, -7.875]
        ]]
      }
    };
  };

  const tryLoadFromSource = async (sourceUrl: string): Promise<any> => {
    try {
      console.log(`Loading GeoJSON from: ${sourceUrl}`);
      const response = await fetch(sourceUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (err) {
      console.error(`Failed to load from ${sourceUrl}:`, err);
      return null;
    }
  };

  const extractDIYFeatureFromNaturalEarth = (data: any): any => {
    if (!data || !data.features) return null;
    
    const diyFeature = data.features.find((feature: any) => {
      const props = feature.properties || {};
      
      return (
        props.iso_3166_2 === 'ID-YO' ||
        props.iso_a2 === 'ID' && props.name === 'Yogyakarta' ||
        (props.name && (
          props.name.toLowerCase().includes('yogyakarta') ||
          props.name === 'DI Yogyakarta' ||
          props.name === 'Yogyakarta Special Region'
        )) ||
        (props.name_alt && props.name_alt.toLowerCase().includes('yogyakarta')) ||
        (props.name_local && props.name_local.toLowerCase().includes('yogyakarta')) ||
        props.region === 'Yogyakarta' ||
        props.province === 'Yogyakarta' ||
        props.admin === 'Yogyakarta' ||
        (props.gn_name && props.gn_name.toLowerCase().includes('yogyakarta'))
      );
    });
    
    return diyFeature || null;
  };

  const extractDIYFeatureFromLocal = (data: any): any => {
    if (!data || !data.features) return null;
    
    const diyFeature = data.features.find((feature: any) => {
      const props = feature.properties || {};
      
      return (
        props.Propinsi?.toLowerCase().includes('yogyakarta') ||
        props.name?.toLowerCase().includes('yogyakarta') ||
        props.kode === '34' ||
        props.provinceCode === '34'
      );
    });
    
    return diyFeature || (data.features.length === 1 ? data.features[0] : null);
  };

  useEffect(() => {
    const loadGeoJSON = async () => {
      let loadedData: any = null;
      let loadedFeature: any = null;
      let usedSource = '';

      // 1. Coba Natural Earth terlebih dahulu
      console.log('Trying Natural Earth source...');
      loadedData = await tryLoadFromSource(NATURAL_EARTH_SOURCE);
      if (loadedData) {
        loadedFeature = extractDIYFeatureFromNaturalEarth(loadedData);
        if (loadedFeature) {
          usedSource = 'Natural Earth';
          console.log('Successfully loaded from Natural Earth');
        }
      }

      // 2. Jika Natural Earth gagal, coba backup sources
      if (!loadedFeature) {
        for (const sourceUrl of BACKUP_SOURCES) {
          console.log(`Trying backup source: ${sourceUrl}`);
          loadedData = await tryLoadFromSource(sourceUrl);
          if (loadedData) {
            loadedFeature = extractDIYFeatureFromLocal(loadedData);
            if (loadedFeature) {
              usedSource = `Backup: ${new URL(sourceUrl).hostname}`;
              console.log('Successfully loaded from backup source');
              break;
            }
          }
        }
      }

      // 3. Jika semua sumber eksternal gagal, gunakan data manual
      if (!loadedFeature) {
        console.log('Using manual DIY data as fallback');
        loadedFeature = createManualDIYGeoJSON();
        usedSource = 'Manual Data';
      }

      setGeoJSON(loadedData);
      setDiyFeature(loadedFeature);
      setSourceUsed(usedSource);
      setLoading(false);
      
      if (!loadedFeature) {
        setError('Could not load DIY boundary data');
      }
    };

    loadGeoJSON();
  }, []);

  return { geoJSON, diyFeature, loading, error, sourceUsed };
};