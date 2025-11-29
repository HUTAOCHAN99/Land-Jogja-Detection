// data/riskZones.ts
import { RiskHeatmapZone } from '@/types';

export const riskZonesData: RiskHeatmapZone[] = [
  // ==================== ZONA RISIKO TINGGI ====================
  {
    id: 'high-1',
    name: 'Lereng Merapi - Sleman Utara',
    riskLevel: 'high',
    riskScore: 88,
    coordinates: [
      [-7.55, 110.42], [-7.55, 110.48], [-7.60, 110.48],
      [-7.60, 110.45], [-7.62, 110.45], [-7.62, 110.42],
      [-7.55, 110.42]
    ],
    population: 12500,
    area: 38.5
  },
  {
    id: 'high-2',
    name: 'Gunungkidul Timur - Pegunungan Baturagung',
    riskLevel: 'high',
    riskScore: 82,
    coordinates: [
      [-8.05, 110.45], [-8.05, 110.55], [-8.15, 110.55],
      [-8.15, 110.50], [-8.12, 110.50], [-8.12, 110.45],
      [-8.05, 110.45]
    ],
    population: 18000,
    area: 95.2
  },
  {
    id: 'high-3',
    name: 'Kulon Progo Barat - Perbukitan Menoreh',
    riskLevel: 'high',
    riskScore: 79,
    coordinates: [
      [-7.70, 110.10], [-7.70, 110.18], [-7.80, 110.18],
      [-7.80, 110.15], [-7.85, 110.15], [-7.85, 110.10],
      [-7.70, 110.10]
    ],
    population: 9500,
    area: 67.8
  },

  // ==================== ZONA RISIKO SEDANG ====================
  {
    id: 'medium-1',
    name: 'Sleman Tengah - Perbukitan',
    riskLevel: 'medium',
    riskScore: 65,
    coordinates: [
      [-7.60, 110.35], [-7.60, 110.42], [-7.68, 110.42],
      [-7.68, 110.38], [-7.65, 110.38], [-7.65, 110.35],
      [-7.60, 110.35]
    ],
    population: 45000,
    area: 88.3
  },
  {
    id: 'medium-2',
    name: 'Gunungkidul Barat - Wonosari',
    riskLevel: 'medium',
    riskScore: 58,
    coordinates: [
      [-7.95, 110.35], [-7.95, 110.45], [-8.05, 110.45],
      [-8.05, 110.40], [-8.02, 110.40], [-8.02, 110.35],
      [-7.95, 110.35]
    ],
    population: 52000,
    area: 120.7
  },
  {
    id: 'medium-3',
    name: 'Bantul Selatan - Imogiri',
    riskLevel: 'medium',
    riskScore: 62,
    coordinates: [
      [-7.85, 110.35], [-7.85, 110.42], [-7.92, 110.42],
      [-7.92, 110.38], [-7.90, 110.38], [-7.90, 110.35],
      [-7.85, 110.35]
    ],
    population: 38000,
    area: 75.4
  },
  {
    id: 'medium-4',
    name: 'Kulon Progo Timur - Sentolo',
    riskLevel: 'medium',
    riskScore: 55,
    coordinates: [
      [-7.80, 110.18], [-7.80, 110.25], [-7.85, 110.25],
      [-7.85, 110.22], [-7.83, 110.22], [-7.83, 110.18],
      [-7.80, 110.18]
    ],
    population: 32000,
    area: 58.9
  },

  // ==================== ZONA RISIKO RENDAH ====================
  {
    id: 'low-1',
    name: 'Kota Yogyakarta - Pusat Kota',
    riskLevel: 'low',
    riskScore: 22,
    coordinates: [
      [-7.78, 110.36], [-7.78, 110.40], [-7.82, 110.40],
      [-7.82, 110.37], [-7.80, 110.37], [-7.80, 110.36],
      [-7.78, 110.36]
    ],
    population: 380000,
    area: 28.7
  },
  {
    id: 'low-2',
    name: 'Sleman Selatan - Depok',
    riskLevel: 'low',
    riskScore: 28,
    coordinates: [
      [-7.68, 110.38], [-7.68, 110.42], [-7.75, 110.42],
      [-7.75, 110.40], [-7.72, 110.40], [-7.72, 110.38],
      [-7.68, 110.38]
    ],
    population: 220000,
    area: 65.2
  },
  {
    id: 'low-3',
    name: 'Bantul Utara - Kasihan',
    riskLevel: 'low',
    riskScore: 25,
    coordinates: [
      [-7.82, 110.37], [-7.82, 110.42], [-7.85, 110.42],
      [-7.85, 110.39], [-7.83, 110.39], [-7.83, 110.37],
      [-7.82, 110.37]
    ],
    population: 150000,
    area: 45.8
  },
  {
    id: 'low-4',
    name: 'Sleman Barat - Gamping',
    riskLevel: 'low',
    riskScore: 32,
    coordinates: [
      [-7.75, 110.30], [-7.75, 110.35], [-7.80, 110.35],
      [-7.80, 110.32], [-7.77, 110.32], [-7.77, 110.30],
      [-7.75, 110.30]
    ],
    population: 95000,
    area: 42.3
  },
  {
    id: 'low-5',
    name: 'Bantul Timur - Piyungan',
    riskLevel: 'low',
    riskScore: 35,
    coordinates: [
      [-7.82, 110.42], [-7.82, 110.48], [-7.85, 110.48],
      [-7.85, 110.45], [-7.84, 110.45], [-7.84, 110.42],
      [-7.82, 110.42]
    ],
    population: 68000,
    area: 52.6
  }
];

// Warna untuk setiap level risiko dengan variasi yang lebih baik
export const riskLevelColors = {
  high: {
    fill: 'rgba(220, 38, 38, 0.5)',      // red-600 dengan opacity lebih baik
    border: 'rgba(185, 28, 28, 0.8)',    // red-700
    stroke: '#dc2626',
    label: 'Risiko Tinggi'
  },
  medium: {
    fill: 'rgba(245, 158, 11, 0.5)',     // amber-500
    border: 'rgba(217, 119, 6, 0.8)',    // amber-600
    stroke: '#d97706',
    label: 'Risiko Sedang'
  },
  low: {
    fill: 'rgba(34, 197, 94, 0.5)',      // green-500
    border: 'rgba(21, 128, 61, 0.8)',    // green-600
    stroke: '#16a34a',
    label: 'Risiko Rendah'
  }
};

// Data tambahan untuk referensi wilayah DIY
export const diyRegions = {
  sleman: {
    bounds: [[-7.55, 110.30], [-7.75, 110.50]],
    highRisk: ['Lereng Merapi', 'Sleman Tengah'],
    mediumRisk: ['Sleman Selatan'],
    lowRisk: ['Depok', 'Gamping']
  },
  bantul: {
    bounds: [[-7.82, 110.30], [-8.00, 110.50]],
    highRisk: [],
    mediumRisk: ['Bantul Selatan'],
    lowRisk: ['Kasihan', 'Piyungan']
  },
  gunungkidul: {
    bounds: [[-7.95, 110.35], [-8.20, 110.60]],
    highRisk: ['Pegunungan Baturagung'],
    mediumRisk: ['Wonosari'],
    lowRisk: []
  },
  kulonprogo: {
    bounds: [[-7.70, 110.10], [-7.90, 110.30]],
    highRisk: ['Perbukitan Menoreh'],
    mediumRisk: ['Sentolo'],
    lowRisk: []
  },
  kotaYogyakarta: {
    bounds: [[-7.78, 110.35], [-7.83, 110.42]],
    highRisk: [],
    mediumRisk: [],
    lowRisk: ['Pusat Kota']
  }
};