import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ZVV Ticketcode-Validierung',
  description: 'API für die Validierung und das Einlösen von Ticketcodes für die ZVV-Entdeckungsreise',
  icons: {
    icon: '/favicons/icon-192x192.png',
  }
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
        <Analytics />
      </body>
    </html>
  );
} 