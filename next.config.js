/** @type {import('next').NextConfig} */
const nextConfig = {
  // Aktiviere Output-Caching für schnellere Builds
  output: 'standalone',
  
  // Optimiere den Build-Prozess
  experimental: {
    optimizePackageImports: [
      '@radix-ui/react-dialog',
      '@radix-ui/react-label',
      '@radix-ui/react-slot',
      'lucide-react'
    ]
  },

  // Konfiguriere statische Dateien
  async rewrites() {
    return [
      {
        source: '/dist/:path*',
        destination: '/public/dist/:path*'
      }
    ]
  },

  // Konfiguriere Header für statische Dateien
  async headers() {
    return [
      {
        source: '/dist/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ]
  }
};

module.exports = nextConfig; 