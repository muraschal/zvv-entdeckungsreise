import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

// In-Memory-Cache für häufige Anfragen
const codeCache: Record<string, { data: any; expires: number }> = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 Minuten Cache-Dauer

export async function POST(request: Request) {
  try {
    // Performance messen
    const startTime = performance.now();

    // Extrahiere den Code aus dem Request-Body
    const { code } = await request.json();
    
    // Umgebung aus Header extrahieren (Default: PRD)
    const environment = request.headers.get('X-Environment') || 'PRD';
    console.log(`Validiere Code in Umgebung: ${environment}`);

    // Überprüfe, ob der Code vorhanden ist
    if (!code) {
      return NextResponse.json(
        { valid: false, message: 'Code ist erforderlich.' },
        { status: 400 }
      );
    }

    // Cache-Key erstellen, der Code und Umgebung berücksichtigt
    const cacheKey = `${environment}:${code}`;
    const now = Date.now();

    // Prüfen, ob der Code im Cache ist und der Cache noch gültig ist
    if (codeCache[cacheKey] && codeCache[cacheKey].expires > now) {
      console.log(`Cache-Hit für Code: ${code} in Umgebung: ${environment}`);
      const cachedData = codeCache[cacheKey].data;
      
      // Performance-Messung abschließen
      const endTime = performance.now();
      console.log(`Validierung (aus Cache) abgeschlossen in ${endTime - startTime}ms`);

      return cachedData;
    }

    // Umgebungsfilter für die Datenbankabfrage vorbereiten
    let query = supabase
      .from('codes')
      .select('*')
      .eq('code', code);

    // Wenn es sich um die Testumgebung handelt, nur Testcodes betrachten
    if (environment === 'INT') {
      // Für Testumgebung: Stelle sicher, dass der Code mit 'INT_' beginnt
      if (!code.startsWith('INT_')) {
        const response = NextResponse.json(
          { valid: false, message: 'Ungültiger Code für Testumgebung.' },
          { status: 404 }
        );
        
        codeCache[cacheKey] = {
          data: response,
          expires: now + (CACHE_DURATION / 10)
        };
        
        return response;
      }
    } else if (environment === 'PRD') {
      // Für Produktionsumgebung: Stelle sicher, dass der Code nicht mit 'INT_' beginnt
      if (code.startsWith('INT_')) {
        const response = NextResponse.json(
          { valid: false, message: 'Testcodes können nicht in der Produktionsumgebung verwendet werden.' },
          { status: 404 }
        );
        
        codeCache[cacheKey] = {
          data: response,
          expires: now + (CACHE_DURATION / 10)
        };
        
        return response;
      }
    }

    // Führe die Datenbankabfrage aus
    const { data, error } = await query.single();

    // Fehlerbehandlung bei der Datenbankabfrage
    if (error) {
      console.error('Supabase-Fehler:', error);
      return NextResponse.json(
        { valid: false, message: 'Fehler bei der Validierung des Codes.' },
        { status: 500 }
      );
    }

    // Wenn kein Code gefunden wurde
    if (!data) {
      const response = NextResponse.json(
        { valid: false, message: 'Ungültiger Code.' },
        { status: 404 }
      );
      
      // Cache für ungültige Codes (kurze Dauer)
      codeCache[cacheKey] = {
        data: response,
        expires: now + (CACHE_DURATION / 10) // Kürzere Cache-Dauer für ungültige Codes
      };
      
      // Performance-Messung abschließen
      const endTime = performance.now();
      console.log(`Validierung (ungültiger Code) abgeschlossen in ${endTime - startTime}ms`);
      
      return response;
    }

    // Überprüfe, ob der Code bereits verwendet wurde
    if (data.status === 'used') {
      const response = NextResponse.json(
        { 
          valid: false, 
          message: 'Dieser Code wurde bereits verwendet.' 
        },
        { status: 400 }
      );
      
      // Cache für verwendete Codes
      codeCache[cacheKey] = {
        data: response,
        expires: now + CACHE_DURATION
      };
      
      return response;
    }

    // Überprüfe, ob der Code abgelaufen ist
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      const response = NextResponse.json(
        { valid: false, message: 'Dieser Code ist abgelaufen.' },
        { status: 400 }
      );
      
      // Cache für abgelaufene Codes
      codeCache[cacheKey] = {
        data: response,
        expires: now + CACHE_DURATION
      };
      
      return response;
    }

    // Code ist gültig
    const response = NextResponse.json(
      { valid: true, message: 'Code ist gültig.' },
      { status: 200 }
    );
    
    // Cache für gültige Codes
    codeCache[cacheKey] = {
      data: response,
      expires: now + CACHE_DURATION
    };
    
    // Performance-Messung abschließen
    const endTime = performance.now();
    console.log(`Validierung abgeschlossen in ${endTime - startTime}ms`);
    
    return response;
  } catch (error) {
    console.error('Unerwarteter Fehler:', error);
    return NextResponse.json(
      { valid: false, message: 'Ein unerwarteter Fehler ist aufgetreten.' },
      { status: 500 }
    );
  }
} 