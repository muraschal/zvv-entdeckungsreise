import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Verschiedene Testfälle, die generiert werden sollen
const TEST_CASES = ['VALID', 'EXPIRED', 'USED', 'SPECIAL'];

// Generiere einen eindeutigen, lesbaren Code
function generateUniqueCode(testCase: string): string {
  const timestamp = format(new Date(), 'yyyyMMdd');
  const randomId = uuidv4().substring(0, 8).toUpperCase();
  return `INT_${testCase}_${timestamp}_${randomId}`;
}

export async function POST(request: Request) {
  console.log('Testcode-Generierungs-Anfrage erhalten');
  try {
    // Prüfe ob wir in der INT-Umgebung sind
    const isIntegrationEnv = process.env.VERCEL_ENV === 'preview' || process.env.NODE_ENV === 'development';
    console.log('Umgebung:', { isIntegrationEnv, NODE_ENV: process.env.NODE_ENV, VERCEL_ENV: process.env.VERCEL_ENV });
    
    if (!isIntegrationEnv) {
      console.log('Nicht in INT-Umgebung, Anfrage abgelehnt');
      return NextResponse.json(
        { error: 'Testcodes können nur in der INT-Umgebung generiert werden' },
        { status: 403 }
      );
    }
    
    // Prüfe, ob der API-Endpunkt von der Admin-Seite aufgerufen wird
    const origin = request.headers.get('origin') || '';
    const referer = request.headers.get('referer') || '';
    
    const isLocalRequest = origin.includes('localhost') || referer.includes('localhost');
    const isVercelRequest = origin.includes('vercel.app') || referer.includes('vercel.app');
    const isZvvRequest = origin.includes('zvv.ch') || referer.includes('zvv.ch');
    const isValidOrigin = isLocalRequest || isVercelRequest || isZvvRequest;
    
    console.log('Origin Checks:', { origin, referer, isLocalRequest, isVercelRequest, isZvvRequest, isValidOrigin });
    
    if (!isValidOrigin) {
      console.error('Ungültiger Ursprung:', origin, referer);
      return NextResponse.json(
        { error: 'Ungültiger Ursprung der Anfrage' },
        { status: 403 }
      );
    }

    // Verwende Admin-Client für direkten DB-Zugriff
    console.log('Erstelle Supabase-Client mit ServiceRole-Schlüssel');
    const supabase = createAdminClient();
    
    if (!supabase) {
      console.error('Supabase-Client konnte nicht erstellt werden');
      return NextResponse.json(
        { error: 'Datenbankverbindung konnte nicht hergestellt werden' },
        { status: 500 }
      );
    }

    // Erstelle die Testcodes für jeden Testfall
    const now = new Date();
    const yesterday = new Date(now.getTime() - (24 * 60 * 60 * 1000));
    const tomorrow = new Date(now.getTime() + (24 * 60 * 60 * 1000));
    
    const newCodes = TEST_CASES.map(testCase => {
      // Je nach Testfall unterschiedliche Eigenschaften setzen
      let expiresAt = tomorrow;
      let status = 'unused';
      
      if (testCase === 'EXPIRED') {
        expiresAt = yesterday;
      } else if (testCase === 'USED') {
        status = 'used';
      }
      
      return {
        code: generateUniqueCode(testCase),
        status: status,
        expires_at: expiresAt.toISOString(),
        created_at: now.toISOString()
      };
    });

    console.log('Generierte Codes:', newCodes);

    // Füge die neuen Codes in die Datenbank ein
    const { data, error } = await supabase
      .from('codes')
      .insert(newCodes)
      .select();

    if (error) {
      console.error('Datenbankfehler beim Einfügen:', error);
      return NextResponse.json(
        { error: `Datenbankfehler: ${error.message}` },
        { status: 500 }
      );
    }

    console.log('Testcodes erfolgreich in Datenbank eingefügt');
    return NextResponse.json({ 
      message: 'Testcodes erfolgreich generiert',
      count: newCodes.length,
      codes: newCodes.map(code => code.code)
    });

  } catch (error) {
    console.error('Fehler beim Generieren der Testcodes:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
} 