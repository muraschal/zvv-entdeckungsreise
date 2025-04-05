import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Prüfe ob wir in der INT-Umgebung sind
    if (process.env.VERCEL_ENV !== 'preview') {
      return NextResponse.json(
        { error: 'Testcode-Bereinigung ist nur in der INT-Umgebung möglich' },
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

    // Lösche alle INT-Testcodes, die älter als 24 Stunden sind
    const { error, count } = await supabase
      .from('codes')
      .delete({ count: 'exact' })
      .like('code', 'INT_%')
      .lt('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (error) {
      console.error('Database delete error:', error);
      throw error;
    }

    return NextResponse.json({ 
      message: `${count} alte Testcodes wurden erfolgreich bereinigt` 
    });

  } catch (error) {
    console.error('Fehler beim Bereinigen der Testcodes:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
} 