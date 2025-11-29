import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative z-20 bg-white border-t border-gray-200 py-8 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="bg-green-600 w-8 h-8 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">🌋</span>
            </div>
            <span className="font-semibold text-gray-800">
              Deteksi Longsor DIY
            </span>
          </div>

          <p className="text-gray-600 text-sm max-w-md mx-auto mb-4">
            Sistem analisis dan pemantauan daerah rawan longsor di Daerah
            Istimewa Yogyakarta
          </p>

          <div className="flex justify-center space-x-6 mb-4">
            <Link
              href="#"
              className="text-gray-400 hover:text-green-600 transition-colors text-sm"
            >
              Kebijakan Privasi
            </Link>
            <Link
              href="#"
              className="text-gray-400 hover:text-green-600 transition-colors text-sm"
            >
              Syarat Layanan
            </Link>
            <Link
              href="#"
              className="text-gray-400 hover:text-green-600 transition-colors text-sm"
            >
              Kontak
            </Link>
          </div>

          <p className="text-gray-400 text-xs">
            &copy; {new Date().getFullYear()} Sistem Deteksi Rawan Longsor
            Yogyakarta. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
