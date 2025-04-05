import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from "@vercel/analytics/react";
import { VersionInfo } from '@/components/VersionInfo';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

// Bestimme die Umgebung basierend auf der URL oder Umgebungsvariable
const isIntegration = process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview' || process.env.NODE_ENV === 'development';
const envSuffix = isIntegration ? '(INT)' : '(PRD)';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#003399',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://ticketcode.zvv.ch'),
  title: `ZVV-Entdeckungsreise | Admin-Bereich ${envSuffix}`,
  description: 'API für die Validierung und das Einlösen von Ticketcodes für die ZVV-Entdeckungsreise',
  icons: {
    icon: '/favicons/icon-192x192.png',
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: `ZVV-Entdeckungsreise | Admin-Bereich ${envSuffix}`,
    description: 'API für die Validierung und das Einlösen von Ticketcodes für die ZVV-Entdeckungsreise',
    url: 'https://ticketcode.zvv.ch',
    siteName: 'ZVV Ticketcode-Validierung',
    images: [
      {
        url: '/images/zvv-logo.png',
        width: 800,
        height: 600,
        alt: 'ZVV Logo',
      },
    ],
    locale: 'de_CH',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `ZVV-Entdeckungsreise | Admin-Bereich ${envSuffix}`,
    description: 'API für die Validierung und das Einlösen von Ticketcodes für die ZVV-Entdeckungsreise',
    images: ['/images/zvv-logo.png'],
  },
  manifest: '/manifest.json',
  keywords: ['ZVV', 'Ticketcode', 'Validierung', 'Entdeckungsreise', 'API'],
  authors: [{ name: 'ZVV' }],
  creator: 'ZVV',
  publisher: 'ZVV',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  category: 'transportation',
  classification: 'internal',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className={inter.className}>
        {children}
        <VersionInfo />
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
} 