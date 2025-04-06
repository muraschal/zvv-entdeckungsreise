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
  }
};

module.exports = nextConfig; 