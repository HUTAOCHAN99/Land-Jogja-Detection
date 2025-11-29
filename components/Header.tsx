import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="bg-linear-to-br from-green-600 to-green-700 w-10 h-10 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">🌋</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-800">
                Deteksi Longsor DIY
              </h1>
              <p className="text-gray-500 text-xs">
                Sistem Pemantauan & Analisis
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-600 hover:text-green-600 transition-colors font-medium text-sm relative group"
            >
              Beranda
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all group-hover:w-full"></span>
            </Link>

            <Link
              href="/map"
              className="text-gray-600 hover:text-green-600 transition-colors font-medium text-sm relative group"
            >
              Peta Interaktif
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all group-hover:w-full"></span>
            </Link>

            <Link
              href="/analysis"
              className="text-gray-600 hover:text-green-600 transition-colors font-medium text-sm relative group"
            >
              Analisis
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all group-hover:w-full"></span>
            </Link>

            <Link
              href="/report"
              className="text-gray-600 hover:text-green-600 transition-colors font-medium text-sm relative group"
            >
              Laporan
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all group-hover:w-full"></span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
}