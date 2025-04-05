/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // swcMinify ist in Next.js 15.x standardmäßig aktiviert und muss nicht mehr explizit angegeben werden
  output: 'standalone',
  
  // Aktiviere Turborepo-ähnliches Caching
  experimental: {
    turbotrace: {
      enabled: true,
    },
    // Optimiere den Build-Prozess
    optimizePackageImports: [
      '@radix-ui/react-dialog',
      '@radix-ui/react-label',
      '@radix-ui/react-slot',
      'lucide-react'
    ]
  },

  // Reduziere die Build-Größe durch Ausschluss nicht benötigter Locales
  i18n: {
    locales: ['de'],
    defaultLocale: 'de'
  }
};

module.exports = nextConfig; 