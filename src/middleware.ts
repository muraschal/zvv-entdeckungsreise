import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { toASCII } from './utils/punycode';

// Diese Middleware wird für alle API-Routen ausgeführt
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Konvertiere Domain-Namen wenn nötig
  const hostname = toASCII(req.headers.get('host') || '');
  
  // Erstelle einen Supabase-Client mit den Cookies der Anfrage
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => {
          return req.cookies.get(name)?.value;
        },
        set: (name, value, options) => {
          res.cookies.set({
            name,
            value,
            ...options,
            path: '/',
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production'
          });
        },
        remove: (name, options) => {
          res.cookies.set({
            name,
            value: '',
            ...options,
            path: '/',
            maxAge: -1
          });
        },
      },
    }
  );
  
  // Prüfe, ob der Benutzer angemeldet ist
  const { data: { session } } = await supabase.auth.getSession();
  
  // Wenn keine Sitzung vorhanden ist und die Route mit /admin beginnt, leite zur Login-Seite weiter
  if (!session && req.nextUrl.pathname.startsWith('/admin')) {
    // Ausnahmen für die Login-Seite und Reset-Password-Seite
    if (
      req.nextUrl.pathname === '/admin/login' || 
      req.nextUrl.pathname === '/admin/reset-password'
    ) {
      return res;
    }
    
    const redirectUrl = new URL('/admin/login', req.url);
    return NextResponse.redirect(redirectUrl);
  }
  
  // Nur für API-Routen CORS-Header hinzufügen
  if (req.nextUrl.pathname.startsWith('/api/')) {
    // Hole die Origin aus dem Request-Header
    const origin = req.headers.get('origin') || '';
    
    // Füge CORS-Header hinzu
    res.headers.set('Access-Control-Allow-Origin', '*');
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Für Preflight-Anfragen (OPTIONS) eine leere 200-Antwort zurückgeben
    if (req.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: res.headers,
      });
    }
  }
  
  return res;
}

// Konfiguriere die Middleware, um für Admin- und API-Routen zu gelten
export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
}; 