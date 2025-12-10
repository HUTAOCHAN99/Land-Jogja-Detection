
// types/index.ts
export interface AddressDetails {
  full: string;
  display: string[];
  components: {
    road?: string;
    hamlet?: string;
    village?: string;
    neighbourhood?: string;
    suburb?: string;
    city_district?: string;
    city?: string;
    town?: string;
    county?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
  source: string;
}

export interface RiskData {
  elevation: number;
  slope: number;
  landCover: string;
  rainfall: number;
  riskLevel: 'low' | 'medium' | 'high';
  riskScore: number;
  soilType: string;
  geologicalRisk: string;
  address: string;
  addressDetails?: AddressDetails; // Tambahkan field baru
  accuracy: number;
  timestamp: string;
  metadata: {
    sources: {
      elevation: string;
      geospatial: string;
      address: string;
    };
    resolution: string;
    confidence: number;
    cached?: boolean;
    processingTime: number;
    dataSources?: string[];
  };
}
export interface AnalyzedPoint {
  id: string;
  position: [number, number];
  riskData: RiskData;
  timestamp: string;
}

export interface MapHistoryState {
  analyzedPoints: AnalyzedPoint[];
  showHistory: boolean;
}

export interface ViewportBounds {
  southWest: [number, number];
  northEast: [number, number];
}

export const DIY_BOUNDS: ViewportBounds = {
  southWest: [-8.2, 110.1],
  northEast: [-7.5, 110.7]
};

export interface MapControlProps {
  showRiskZones: boolean;
  onRiskZonesChange: (show: boolean) => void;
  showHeatmap: boolean;
  onHeatmapChange: (show: boolean) => void;
  tileLayers?: Record<string, TileLayerConfig>;
  activeTileLayer?: string;
  onTileLayerChange?: (layer: string) => void;
  showHistory?: boolean;
  onHistoryChange?: (show: boolean) => void;
  historyCount?: number;
  onClearHistory?: () => void;
}

export interface TileLayerConfig {
  name: string;
  url: string;
  attribution: string;
}

export interface Subdistrict {
  id: string;
  name: string;
  position: [number, number];
  riskData: RiskData;
}

export interface RiskHeatmapZone {
  id: string;
  name: string;
  riskLevel: 'low' | 'medium' | 'high';
  riskScore: number;
  coordinates: [number, number][];
  population?: number;
  area?: number;
}

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

// types/index.ts
export interface TileLayerConfig {
  name: string;
  url: string;
  attribution: string;
  minZoom?: number;
  maxZoom?: number;
  tms?: boolean;
}

// Tambahkan ke tileLayers di useMap
export const tileLayers = {
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
} as const;