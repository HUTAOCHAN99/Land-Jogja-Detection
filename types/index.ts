export interface RiskData {
  slope: number;
  landCover: string;
  rainfall: number;
  elevation: number;
  riskLevel: 'low' | 'medium' | 'high';
  riskScore: number;
  soilType: string;
  geologicalRisk: string;
  address: string;
  accuracy: number;
  timestamp: string;
}

export interface RiskZone {
  center: [number, number];
  radius: number;
  risk: 'low' | 'medium' | 'high';
}

// Tile layer configuration
export interface TileLayerConfig {
  name: string;
  url: string;
  attribution: string;
}

export interface MapControlProps {
  showRiskZones: boolean;
  showHeatmap: boolean;
  onRiskZonesChange: (show: boolean) => void;
  onHeatmapChange: (show: boolean) => void;
  tileLayers?: Record<string, TileLayerConfig>;
  activeTileLayer?: string;
  onTileLayerChange?: (layer: string) => void;
}

export interface ViewportBounds {
  southWest: [number, number];
  northEast: [number, number];
}

export interface DIYBoundary {
  type: string;
  features: Array<{
    type: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    properties: any;
    geometry: {
      type: string;
      coordinates: number[][][];
    };
  }>;
}

export const DIY_BOUNDS: ViewportBounds = {
  southWest: [-8.3, 110.0],
  northEast: [-7.3, 110.9]
};

export interface DistrictData {
  name: string;
  code: string;
  type: 'kabupaten' | 'kota';
  population?: number;
  area?: number;
}

export interface GeoJSONFeature {
  type: "Feature";
  properties: DistrictData & {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
  geometry: {
    type: string;
    coordinates: number[][][];
  };
}

export interface DetailedGeoJSON {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

// Tambahan interface untuk data geologi
export interface GeologicalData {
  rockType: string;
  faultDistance: number;
  seismicZone: string;
  landslideProne: boolean;
}

// Tambahan interface untuk data tanah
export interface SoilData {
  type: string;
  permeability: number;
  cohesion: number;
  erosionRisk: number;
  drainage: 'good' | 'moderate' | 'poor';
}

// Tambahan interface untuk analisis risiko yang lebih detail
export interface DetailedRiskAnalysis {
  basic: RiskData;
  geological: GeologicalData;
  soil: SoilData;
  mitigation: {
    recommendations: string[];
    urgency: 'low' | 'medium' | 'high';
    actions: string[];
  };
}

// Interface untuk response API risk analysis
export interface RiskAnalysisResponse {
  success: boolean;
  data: RiskData;
  metadata: {
    analysisId: string;
    processingTime: number;
    dataSources: string[];
    confidence: number;
  };
}

// Interface untuk historical risk data
export interface HistoricalRiskData {
  timestamp: string;
  location: [number, number];
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  factors: {
    slope: number;
    rainfall: number;
    landCover: string;
  };
}

// Interface untuk risk trend analysis
export interface RiskTrend {
  location: [number, number];
  historicalData: HistoricalRiskData[];
  trend: 'increasing' | 'decreasing' | 'stable';
  trendStrength: number;
}

// Interface untuk zona risiko dengan detail
export interface RiskZoneDetail {
  id: string;
  name: string;
  bounds: [number, number][];
  riskLevel: 'low' | 'medium' | 'high';
  area: number; // dalam km²
  population: number;
  criticalPoints: Array<{
    location: [number, number];
    riskScore: number;
    description: string;
  }>;
}

// Interface untuk layer kontrol yang lebih detail
export interface MapLayerControl {
  id: string;
  name: string;
  enabled: boolean;
  type: 'overlay' | 'base';
  opacity: number;
  zIndex: number;
  source?: string;
}

// Interface untuk user interaction data
export interface MapInteraction {
  type: 'click' | 'hover' | 'drag';
  coordinates: [number, number];
  timestamp: string;
  data?: RiskData;
}

// Interface untuk export data
export interface ExportData {
  format: 'geojson' | 'csv' | 'kml';
  data: RiskData[] | RiskZoneDetail[];
  timestamp: string;
  bounds: ViewportBounds;
}

// Interface untuk real-time monitoring
export interface RealTimeMonitor {
  sensorId: string;
  location: [number, number];
  readings: {
    rainfall: number;
    groundMovement: number;
    vibration: number;
    timestamp: string;
  }[];
  status: 'normal' | 'warning' | 'alert';
}

export interface RiskData {
  slope: number;
  landCover: string;
  rainfall: number;
  elevation: number; // Pastikan ini ada
  riskLevel: 'low' | 'medium' | 'high';
  riskScore: number;
  soilType: string;
  geologicalRisk: string;
  address: string;
  accuracy: number;
  timestamp: string;
}

// Interface untuk user preferences
export interface UserMapPreferences {
  tileLayer: string;
  showRiskZones: boolean;
  showHeatmap: boolean;
  showBoundaries: boolean;
  showLabels: boolean;
  riskThreshold: number;
  autoRefresh: boolean;
}

// Enum untuk tipe analisis
export enum AnalysisType {
  SLOPE = 'slope',
  RAINFALL = 'rainfall',
  LAND_COVER = 'land_cover',
  SOIL = 'soil',
  GEOLOGICAL = 'geological',
  COMPREHENSIVE = 'comprehensive'
}

// Interface untuk analisis request
export interface AnalysisRequest {
  coordinates: [number, number];
  analysisType: AnalysisType;
  includeHistorical?: boolean;
  radius?: number; // dalam meter
}

// Interface untuk batch analysis
export interface BatchAnalysis {
  id: string;
  points: Array<{
    coordinates: [number, number];
    elevation?: number;
  }>;
  results: RiskData[];
  summary: {
    totalPoints: number;
    highRisk: number;
    mediumRisk: number;
    lowRisk: number;
    averageScore: number;
  };
}

// Interface untuk 3D terrain data
export interface TerrainData {
  elevation: number;
  slope: number;
  aspect: number;
  curvature: number;
  coordinates: [number, number];
}

// Interface untuk visualization options
export interface VisualizationOptions {
  colorScheme: 'standard' | 'warning' | 'accessibility';
  opacity: number;
  scale: 'linear' | 'logarithmic';
  classification: 'equal_interval' | 'quantile' | 'jenks';
  classes: number;
}

// Utility types untuk response handling
export type ApiResponse<T> = {
  data: T;
  error?: never;
} | {
  data?: never;
  error: string;
};

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Props untuk komponen peta
export interface MapComponentProps {
  initialCenter?: [number, number];
  initialZoom?: number;
  showControls?: boolean;
  onRiskAnalysis?: (data: RiskData) => void;
  onMapClick?: (coordinates: [number, number]) => void;
  interactive?: boolean;
  maxBounds?: ViewportBounds;
}

// Props untuk risk visualization
export interface RiskVisualizationProps {
  riskData: RiskData[];
  bounds: ViewportBounds;
  options?: VisualizationOptions;
  onPointSelect?: (point: RiskData) => void;
}

// Type guards
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isRiskData(obj: any): obj is RiskData {
  return (
    obj &&
    typeof obj.slope === 'number' &&
    typeof obj.landCover === 'string' &&
    typeof obj.rainfall === 'number' &&
    typeof obj.riskLevel === 'string' &&
    ['low', 'medium', 'high'].includes(obj.riskLevel)
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isRiskZoneDetail(obj: any): obj is RiskZoneDetail {
  return (
    obj &&
    typeof obj.id === 'string' &&
    Array.isArray(obj.bounds) &&
    typeof obj.riskLevel === 'string'
  );
}

// Tambahkan di types/index.ts
export interface ElevationAPIResponse {
  results?: Array<{
    latitude: number;
    longitude: number;
    elevation: number;
  }>;
}

export interface ReverseGeocodingResponse {
  address: {
    village?: string;
    hamlet?: string;
    subdistrict?: string;
    city_district?: string;
    city?: string;
    town?: string;
    state?: string;
    country?: string;
  };
}

export interface RiskHeatmapZone {
  id: string;
  name: string;
  riskLevel: 'low' | 'medium' | 'high';
  coordinates: [number, number][];
  riskScore: number;
  population?: number;
  area?: number;
}

export interface HeatmapConfig {
  opacity: number;
  showLabels: boolean;
  showBorders: boolean;
  colorScheme: 'standard' | 'warning' | 'accessibility';
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


export interface Subdistrict {
  id: string;
  name: string;
  district: string;
  position: [number, number];
  riskData: RiskData;
  population?: number;
  area?: number;
}

