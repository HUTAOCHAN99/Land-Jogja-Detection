// app/api/risk/route.ts
import { NextRequest, NextResponse } from 'next/server';
import type { RiskData } from '@/types';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { latitude, longitude } = await request.json();

    // Validasi input
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return NextResponse.json(
        { error: 'Latitude dan longitude harus berupa angka' },
        { status: 400 }
      );
    }

    // Validasi koordinat DIY
    if (latitude < -8.2 || latitude > -7.5 || longitude < 110.1 || longitude > 110.7) {
      return NextResponse.json(
        { error: 'Koordinat di luar area analisis DIY' },
        { status: 400 }
      );
    }

    // Hitung elevasi dari data lokal DIY
    const elevation = getElevationFromDIYData(latitude, longitude);
    const slope = calculateSlope(latitude, longitude, elevation);
    const rainfall = getRainfallData(latitude, longitude);
    const landCover = getLandCoverType(latitude, longitude);
    const soilType = getSoilType(latitude, longitude);
    const riskScore = calculateRiskScore(slope, rainfall, landCover, soilType);
    
    const riskData: RiskData = {
      slope: slope,
      landCover: landCover,
      rainfall: rainfall,
      elevation: elevation,
      riskLevel: riskScore > 70 ? 'high' : riskScore > 30 ? 'medium' : 'low',
      riskScore: riskScore,
      soilType: soilType,
      geologicalRisk: getGeologicalRisk(latitude, longitude, elevation, slope),
      address: getAddress(latitude, longitude),
      accuracy: 85,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(riskData);
  } catch (error) {
    console.error('Error calculating risk:', error);
    return NextResponse.json(
      { error: 'Failed to calculate risk' }, 
      { status: 500 }
    );
  }
}

// Tambahkan fungsi-fungsi helper yang diperlukan:

function getElevationFromDIYData(lat: number, lng: number): number {
  let elevation = 150; // Default untuk DIY
  
  // Semakin ke UTARA, semakin TINGGI (kearah Merapi)
  const northFactor = (lat + 8.2) / 0.7; // -8.2 to -7.5 = 0 to 1
  elevation += northFactor * 400; // +400m dari selatan ke utara
  
  // Semakin ke TIMUR, semakin TINGGI (kearah Pegunungan Sewu)
  const eastFactor = (lng - 110.1) / 0.6; // 110.1 to 110.7 = 0 to 1
  elevation += eastFactor * 200; // +200m dari barat ke timur
  
  // Area khusus Merapi - elevasi sangat tinggi
  if (lat > -7.58 && lng > 110.42) {
    elevation = 800 + Math.random() * 700; // 800-1500m
  }
  
  // Area khusus Pegunungan Selatan
  if (lat < -8.05 && lng > 110.35) {
    elevation = 300 + Math.random() * 200; // 300-500m
  }
  
  // Kota Yogyakarta - dataran rendah
  if (lat > -7.78 && lat < -7.82 && lng > 110.35 && lng < 110.40) {
    elevation = 100 + Math.random() * 30; // 100-130m
  }
  
  return Math.round(elevation);
}

function calculateSlope(lat: number, lng: number, elevation: number): number {
  let slope = 5; // Default landai
  
  if (elevation > 500) {
    slope = 25 + Math.random() * 20; // 25-45° untuk area tinggi
  } else if (elevation > 200) {
    slope = 10 + Math.random() * 15; // 10-25° untuk perbukitan
  } else {
    slope = 2 + Math.random() * 8; // 2-10° untuk dataran
  }
  
  // Area Merapi khusus - slope sangat tinggi
  if (lat > -7.58 && lng > 110.42) {
    slope = 30 + Math.random() * 15; // 30-45°
  }
  
  return Number(slope.toFixed(1));
}

function getSoilType(lat: number, lng: number): string {
  if (lat > -7.55 && lat < -7.65 && lng > 110.40 && lng < 110.50) {
    return "Andosol (Vulkanik)";
  }
  if (lat > -7.65 && lat < -7.80 && lng > 110.35 && lng < 110.50) {
    return "Latosol (Merah)";
  }
  if (lat < -8.00 && lng > 110.30 && lng < 110.50) {
    return "Grumusol (Liat Kapur)";
  }
  if (lat > -7.85 && lat < -8.00 && lng > 110.30 && lng < 110.45) {
    return "Mediteran";
  }
  return "Latosol";
}

function getGeologicalRisk(lat: number, lng: number, elevation: number, slope: number): string {
  if ((lat > -7.55 && lat < -7.60) || (slope > 30)) {
    return "Zona Rawan Tinggi";
  }
  if ((lat > -7.60 && lat < -7.70) || (slope > 15 && elevation > 200)) {
    return "Zona Rawan Sedang";
  }
  return "Zona Relatif Stabil";
}

function getAddress(lat: number, lng: number): string {
  if (lat > -7.75 && lat < -7.85 && lng > 110.35 && lng < 110.45) {
    return "Kota Yogyakarta, DIY";
  }
  if (lat > -7.60 && lat < -7.75 && lng > 110.35 && lng < 110.50) {
    return "Sleman, DIY";
  }
  if (lat > -7.85 && lat < -8.00 && lng > 110.30 && lng < 110.45) {
    return "Bantul, DIY";
  }
  if (lat < -8.00 && lng > 110.30 && lng < 110.50) {
    return "Gunungkidul, DIY";
  }
  if (lat > -7.75 && lat < -7.90 && lng < 110.25) {
    return "Kulon Progo, DIY";
  }
  if (lat > -7.55 && lat < -7.65 && lng > 110.40 && lng < 110.50) {
    return "Lereng Merapi, Sleman";
  }
  return "Daerah Istimewa Yogyakarta";
}

function calculateRiskScore(slope: number, rainfall: number, landCover: string, soilType: string): number {
  let score = 0;
  
  // Slope factor (40%)
  score += (slope / 45) * 40;
  
  // Rainfall factor (30%)
  score += (rainfall / 300) * 30;
  
  // Land cover factor (20%)
  if (landCover.includes("Hutan")) score += 5;
  else if (landCover.includes("Sawah")) score += 10;
  else if (landCover.includes("Permukiman")) score += 15;
  else score += 20; // Lahan terbuka
  
  // Soil type factor (10%)
  if (soilType.includes("Andosol")) score += 10;
  else if (soilType.includes("Grumusol")) score += 8;
  else if (soilType.includes("Mediteran")) score += 7;
  else score += 5; // Latosol
  
  return Math.min(score, 100);
}

// Fungsi yang sudah ada tetap dipertahankan
function getLandCoverType(lat: number, lng: number): string {
  const landCovers = ['Hutan', 'Pemukiman', 'Pertanian', 'Lahan Terbuka'];
  const seed = Math.abs(Math.sin(lat * lng * 1000));
  const index = Math.floor(seed * landCovers.length) % landCovers.length;
  return landCovers[index];
}

function getRainfallData(lat: number, lng: number): number {
  let baseRainfall = 100 + Math.random() * 200;
  if (lat > -7.8 && lat < -7.6 && lng > 110.3 && lng < 110.5) {
    baseRainfall += 50;
  }
  return Math.round(baseRainfall);
}