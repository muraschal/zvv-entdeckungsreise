import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { format } from 'date-fns';

const TEST_CASES = ['VALID', 'EXPIRED', 'USED', 'SPECIAL'];

function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(request: Request) {
  try {
    // Prüfe ob wir in der INT-Umgebung sind
    if (process.env.VERCEL_ENV !== 'preview') {
      return NextResponse.json(
        { error: 'Testcodes können nur in der INT-Umgebung generiert werden' },
        { status: 403 }
      );
    }

    // Verwende Service Role für direkten DB-Zugriff
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Prüfe, ob der API-Endpunkt von der Admin-Seite aufgerufen wird
    const origin = request.headers.get('origin') || '';
    const referer = request.headers.get('referer') || '';
    
    const isLocalRequest = origin.includes('localhost') || referer.includes('localhost');
    const isValidOrigin = origin.includes('vercel.app') || referer.includes('vercel.app') || isLocalRequest;
    
    if (!isValidOrigin) {
      console.error('Ungültiger Ursprung:', origin, referer);
      return NextResponse.json(
        { error: 'Ungültiger Ursprung der Anfrage' },
        { status: 403 }
      );
    }

    const timestamp = format(new Date(), 'yyyyMMdd');
    const newCodes = TEST_CASES.map(testCase => ({
      code: `INT_${testCase}_${timestamp}_${generateRandomString(6)}`,
      status: testCase === 'USED' ? 'used' : 'unused',
      expires_at: testCase === 'EXPIRED' 
        ? new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // Gestern
        : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Morgen
      created_at: new Date().toISOString() // Explizit setzen
    }));

    // Füge die neuen Codes in die Datenbank ein
    const { error } = await supabase
      .from('codes')
      .insert(newCodes);

    if (error) {
      console.error('Database insert error:', error);
      throw error;
    }

    return NextResponse.json({ 
      message: 'Testcodes erfolgreich generiert',
      codes: newCodes 
    });

  } catch (error) {
    console.error('Fehler beim Generieren der Testcodes:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
} 