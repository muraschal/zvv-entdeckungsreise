import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Diese Middleware wird für alle API-Routen ausgeführt
export function middleware(request: NextRequest) {
  // Überprüfe, ob die Anfrage an die API gerichtet ist
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Hier könnte eine API-Schlüssel-Validierung oder andere Sicherheitsmaßnahmen implementiert werden
    const apiKey = request.headers.get('x-api-key');
    
    // In einer Produktionsumgebung würde man den API-Schlüssel gegen einen sicheren Wert prüfen
    // Für dieses Beispiel überspringen wir die Validierung
    
    // Beispiel für eine einfache CORS-Konfiguration
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, x-api-key');
    
    return response;
  }
  
  return NextResponse.next();
}

// Konfiguriere die Middleware, um nur für API-Routen zu gelten
export const config = {
  matcher: '/api/:path*',
}; 