import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Diese Middleware wird für alle API-Routen ausgeführt
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Erstelle einen Supabase-Client mit den Cookies der Anfrage
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: (name, value, options) => {
          res.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove: (name, options) => {
          res.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );
  
  // Prüfe, ob der Benutzer angemeldet ist
  const { data: { session } } = await supabase.auth.getSession();
  
  // Wenn keine Sitzung vorhanden ist und die Route mit /admin beginnt, leite zur Login-Seite weiter
  if (!session && req.nextUrl.pathname.startsWith('/admin')) {
    // Ausnahme für die Login-Seite selbst
    if (req.nextUrl.pathname === '/admin/login') {
      return res;
    }
    
    const redirectUrl = new URL('/admin/login', req.url);
    return NextResponse.redirect(redirectUrl);
  }
  
  return res;
}

// Konfiguriere die Middleware, um nur für API-Routen zu gelten
export const config = {
  matcher: ['/admin/:path*'],
}; 