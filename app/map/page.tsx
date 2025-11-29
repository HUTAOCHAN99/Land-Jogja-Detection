'use client' // Tambahkan ini di paling atas

import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">Memuat peta Yogyakarta...</p>
      </div>
    </div>
  )
});

export default function MapPage() {
  return (
    <div className="h-screen flex flex-col">
      <div className="p-4 bg-white shadow-sm border-b">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-gray-800">Peta Kerawanan Longsor DIY</h1>
          <p className="text-gray-600">Klik pada peta untuk melihat analisis risiko di lokasi tertentu</p>
        </div>
      </div>
      <div className="flex-1">
        <MapComponent />
      </div>
    </div>
  );
}