// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // Tambahkan empty turbopack config
  turbopack: {},
  
  // Webpack configuration (akan diabaikan jika turbopack aktif)
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('@google/earthengine');
    }
    return config;
  },
  
  // Server external packages
  serverExternalPackages: ['@google/earthengine'],
  
  typescript: {
    ignoreBuildErrors: true,
  },
  
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
    ];
  },
};

export default nextConfig;