// lib/geocoding.ts - Geocoding helper dengan environment variables
export interface AddressResult {
  address: string;
  components: {
    road?: string;
    village?: string;
    hamlet?: string;
    suburb?: string;
    city_district?: string;
    city?: string;
    town?: string;
    province?: string;
    postcode?: string;
  };
  source: 'nominatim' | 'fallback';
}

/**
 * Get address from coordinates using Nominatim
 */
export async function getAddress(latitude: number, longitude: number): Promise<AddressResult> {
  const nominatimUrl = process.env.NEXT_PUBLIC_NOMINATIM_URL;
  
  // Jika URL Nominatim tidak dikonfigurasi, langsung ke fallback
  if (!nominatimUrl) {
    console.warn('⚠️ Nominatim URL not configured, using fallback address');
    const fallback = getFallbackAddress(latitude, longitude);
    return {
      address: fallback.address,
      components: fallback.components,
      source: 'fallback'
    };
  }
  
  try {
    // Tambahkan delay untuk menghindari rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const response = await fetch(
      `${nominatimUrl}/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=16&addressdetails=1&accept-language=id`,
      {
        headers: {
          'User-Agent': 'DIY-Risk-Analysis-App/1.0 (https://github.com/your-repo)',
          'Accept': 'application/json',
          'Accept-Language': 'id-ID,id;q=0.9,en;q=0.8'
        },
        signal: AbortSignal.timeout(5000)
      }
    );
    
    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Format alamat dari OSM
    const address = data.address || {};
    const components = {
      road: address.road,
      village: address.village,
      hamlet: address.hamlet,
      suburb: address.suburb,
      city_district: address.city_district,
      city: address.city || address.town,
      town: address.town,
      province: address.state || 'Daerah Istimewa Yogyakarta',
      postcode: address.postcode
    };
    
    const addressParts = [
      address.road ? `Jalan ${address.road}` : null,
      address.village ? `Desa ${address.village}` : null,
      address.hamlet ? `Dusun ${address.hamlet}` : null,
      address.suburb,
      address.city_district ? `Kecamatan ${address.city_district}` : null,
      address.city || address.town,
      'Daerah Istimewa Yogyakarta',
      address.postcode ? `Kode Pos ${address.postcode}` : null
    ].filter(Boolean);

    const fullAddress = addressParts.join(', ') || getFallbackAddress(latitude, longitude).address;
    
    return {
      address: fullAddress,
      components,
      source: 'nominatim'
    };
    
  } catch (error) {
    console.error('❌ Geocoding failed:', error);
    return getFallbackAddress(latitude, longitude);
  }
}

/**
 * Fallback address system untuk DIY
 */
function getFallbackAddress(latitude: number, longitude: number): AddressResult {
  // Database lokasi DIY yang diketahui berdasarkan koordinat
  const knownLocations: Array<{
    name: string;
    type: 'kota' | 'kabupaten' | 'kecamatan' | 'kelurahan' | 'desa' | 'kawasan' | 'jalan';
    bounds: [number, number, number, number]; // [minLat, minLng, maxLat, maxLng]
    components: {
      road?: string;
      village?: string;
      city_district?: string;
      city?: string;
      province?: string;
      postcode?: string;
    };
  }> = [
    // Kota Yogyakarta
    {
      name: "Kota Yogyakarta",
      type: "kota",
      bounds: [-7.85, 110.35, -7.75, 110.42],
      components: {
        city: "Yogyakarta",
        province: "Daerah Istimewa Yogyakarta",
        postcode: "55111"
      }
    },
    
    // Kabupaten Sleman
    {
      name: "Sleman",
      type: "kabupaten",
      bounds: [-7.75, 110.35, -7.55, 110.42],
      components: {
        city_district: "Sleman",
        province: "Daerah Istimewa Yogyakarta",
        postcode: "55511"
      }
    },
    {
      name: "Depok",
      type: "kecamatan",
      bounds: [-7.765, 110.370, -7.745, 110.395],
      components: {
        city_district: "Depok",
        city: "Sleman",
        province: "Daerah Istimewa Yogyakarta",
        postcode: "55281"
      }
    },
    {
      name: "Kaliurang",
      type: "kawasan",
      bounds: [-7.600, 110.430, -7.590, 110.440],
      components: {
        village: "Kaliurang",
        city_district: "Cangkringan",
        city: "Sleman",
        province: "Daerah Istimewa Yogyakarta",
        postcode: "55583"
      }
    },
    
    // Kabupaten Bantul
    {
      name: "Bantul",
      type: "kabupaten",
      bounds: [-7.95, 110.30, -7.75, 110.40],
      components: {
        city_district: "Bantul",
        province: "Daerah Istimewa Yogyakarta",
        postcode: "55711"
      }
    },
    {
      name: "Kasihan",
      type: "kecamatan",
      bounds: [-7.850, 110.320, -7.830, 110.340],
      components: {
        city_district: "Kasihan",
        city: "Bantul",
        province: "Daerah Istimewa Yogyakarta",
        postcode: "55181"
      }
    },
    
    // Kabupaten Gunungkidul
    {
      name: "Gunungkidul",
      type: "kabupaten",
      bounds: [-8.20, 110.40, -7.95, 110.60],
      components: {
        city_district: "Gunungkidul",
        province: "Daerah Istimewa Yogyakarta",
        postcode: "55811"
      }
    },
    {
      name: "Wonosari",
      type: "kecamatan",
      bounds: [-7.970, 110.550, -7.950, 110.570],
      components: {
        city_district: "Wonosari",
        city: "Gunungkidul",
        province: "Daerah Istimewa Yogyakarta",
        postcode: "55811"
      }
    },
    
    // Kabupaten Kulon Progo
    {
      name: "Kulon Progo",
      type: "kabupaten",
      bounds: [-7.95, 110.10, -7.75, 110.30],
      components: {
        city_district: "Kulon Progo",
        province: "Daerah Istimewa Yogyakarta",
        postcode: "55611"
      }
    },
    {
      name: "Wates",
      type: "kecamatan",
      bounds: [-7.870, 110.140, -7.850, 110.160],
      components: {
        city_district: "Wates",
        city: "Kulon Progo",
        province: "Daerah Istimewa Yogyakarta",
        postcode: "55611"
      }
    },
    
    // Lokasi spesifik terkenal
    {
      name: "Alun-Alun Utara",
      type: "kawasan",
      bounds: [-7.802, 110.363, -7.800, 110.365],
      components: {
        road: "Alun-Alun Utara",
        city_district: "Gedong Tengen",
        city: "Yogyakarta",
        province: "Daerah Istimewa Yogyakarta",
        postcode: "55122"
      }
    },
    {
      name: "Tugu Yogyakarta",
      type: "kawasan",
      bounds: [-7.783, 110.367, -7.782, 110.368],
      components: {
        road: "Jalan Margo Utomo",
        city_district: "Jetis",
        city: "Yogyakarta",
        province: "Daerah Istimewa Yogyakarta",
        postcode: "55133"
      }
    }
  ];
  
  // Cari lokasi yang sesuai dengan koordinat
  for (const location of knownLocations) {
    const [minLat, minLng, maxLat, maxLng] = location.bounds;
    if (latitude >= minLat && latitude <= maxLat && 
        longitude >= minLng && longitude <= maxLng) {
      
      const addressParts = [
        location.components.road,
        location.name !== location.components.city_district ? location.name : null,
        location.components.city_district,
        location.components.city,
        location.components.province,
        location.components.postcode ? `Kode Pos ${location.components.postcode}` : null
      ].filter(Boolean);
      
      return {
        address: addressParts.join(', '),
        components: location.components,
        source: 'fallback'
      };
    }
  }
  
  // Jika tidak ditemukan dalam database, gunakan zona geografis
  const zone = getGeographicZone(latitude, longitude);
  
  return {
    address: `${zone}, Daerah Istimewa Yogyakarta`,
    components: {
      province: 'Daerah Istimewa Yogyakarta'
    },
    source: 'fallback'
  };
}

/**
 * Mendapatkan zona geografis berdasarkan koordinat
 */
function getGeographicZone(latitude: number, longitude: number): string {
  // Zona berdasarkan karakteristik geografis DIY
  
  // Lereng Merapi
  if (latitude > -7.55 && latitude < -7.65 && longitude > 110.42) {
    return "Lereng Gunung Merapi, Kabupaten Sleman";
  }
  
  // Kawasan Sleman Tengah
  if (latitude > -7.65 && latitude < -7.75 && longitude > 110.35) {
    return "Kawasan Sleman Tengah";
  }
  
  // Kota Yogyakarta
  if (latitude > -7.75 && latitude < -7.85 && longitude > 110.35 && longitude < 110.42) {
    return "Kota Yogyakarta";
  }
  
  // Bantul Utara (dekat kota)
  if (latitude > -7.85 && latitude < -7.90 && longitude > 110.30) {
    return "Kabupaten Bantul Utara";
  }
  
  // Bantul Selatan
  if (latitude > -7.90 && latitude < -8.00 && longitude > 110.30) {
    return "Kabupaten Bantul Selatan";
  }
  
  // Gunungkidul Timur (karst)
  if (latitude < -8.00 && longitude > 110.40) {
    return "Kawasan Karst Gunungkidul Timur";
  }
  
  // Gunungkidul Barat
  if (latitude < -8.00 && longitude <= 110.40) {
    return "Kabupaten Gunungkidul Barat";
  }
  
  // Kulon Progo
  if (longitude < 110.25) {
    return "Kabupaten Kulon Progo";
  }
  
  // Default
  return `Lokasi di ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
}

/**
 * Fungsi helper untuk mendapatkan alamat singkat
 */
export function getShortAddress(latitude: number, longitude: number): Promise<string> {
  return getAddress(latitude, longitude)
    .then(result => result.address)
    .catch(() => getFallbackAddress(latitude, longitude).address);
}

/**
 * Batch geocoding untuk multiple coordinates (dengan rate limiting)
 */
export async function batchGeocode(
  coordinates: Array<{latitude: number; longitude: number}>
): Promise<Array<AddressResult & {latitude: number; longitude: number}>> {
  
  const results = [];
  
  for (let i = 0; i < coordinates.length; i++) {
    const { latitude, longitude } = coordinates[i];
    
    try {
      // Rate limiting: tunggu 1.5 detik antara request
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
      const address = await getAddress(latitude, longitude);
      results.push({
        latitude,
        longitude,
        ...address
      });
      
    } catch (error) {
      console.error(`❌ Geocoding failed for ${latitude}, ${longitude}:`, error);
      const fallback = getFallbackAddress(latitude, longitude);
      results.push({
        latitude,
        longitude,
        ...fallback
      });
    }
  }
  
  return results;
}

/**
 * Validasi apakah koordinat berada dalam wilayah DIY
 */
export function isWithinDIY(latitude: number, longitude: number): boolean {
  // Ambil bounds dari environment variables atau gunakan default
  const diyBounds = {
    southWestLat: parseFloat(process.env.NEXT_PUBLIC_DIY_SOUTHWEST_LAT || '-8.35'),
    southWestLng: parseFloat(process.env.NEXT_PUBLIC_DIY_SOUTHWEST_LNG || '109.95'),
    northEastLat: parseFloat(process.env.NEXT_PUBLIC_DIY_NORTHEAST_LAT || '-7.35'),
    northEastLng: parseFloat(process.env.NEXT_PUBLIC_DIY_NORTHEAST_LNG || '110.85')
  };
  
  return (
    latitude >= diyBounds.southWestLat &&
    latitude <= diyBounds.northEastLat &&
    longitude >= diyBounds.southWestLng &&
    longitude <= diyBounds.northEastLng
  );
}

/**
 * Mendapatkan deskripsi zona risiko berdasarkan koordinat
 */
export function getRiskZoneDescription(latitude: number, longitude: number): string {
  const zone = getGeographicZone(latitude, longitude);
  
  const zoneDescriptions: Record<string, string> = {
    "Lereng Gunung Merapi, Kabupaten Sleman": "Zona Rawan Tinggi - Kawasan rawan longsor dan lahar",
    "Kawasan Sleman Tengah": "Zona Waspada - Perbukitan dengan potensi gerakan tanah sedang",
    "Kota Yogyakarta": "Zona Relatif Aman - Dataran rendah, risiko rendah",
    "Kabupaten Bantul Utara": "Zona Waspada - Dataran bergelombang dengan risiko sedang",
    "Kabupaten Bantul Selatan": "Zona Waspada - Perbukitan dengan risiko gerakan tanah",
    "Kawasan Karst Gunungkidul Timur": "Zona Rawan Tinggi - Batuan kapur rawan longsor",
    "Kabupaten Gunungkidul Barat": "Zona Waspada - Perbukitan dengan kondisi tanah variatif",
    "Kabupaten Kulon Progo": "Zona Waspada - Perbukitan dengan risiko gerakan tanah"
  };
  
  return zoneDescriptions[zone] || "Zona dengan karakteristik geologi variatif";
}