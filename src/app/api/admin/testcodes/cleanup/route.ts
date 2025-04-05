import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  console.log('Cleaning up test codes...');
  try {
    // Prüfe ob wir in der INT-Umgebung sind
    const isIntegrationEnv = process.env.VERCEL_ENV === 'preview' || process.env.NODE_ENV === 'development';
    console.log('Umgebung:', { 
      isIntegrationEnv, 
      NODE_ENV: process.env.NODE_ENV, 
      VERCEL_ENV: process.env.VERCEL_ENV 
    });
    
    if (!isIntegrationEnv) {
      console.log('Nicht in INT-Umgebung, Anfrage abgelehnt');
      return NextResponse.json(
        { error: 'Testcodes können nur in der INT-Umgebung bereinigt werden' },
        { status: 403 }
      );
    }
    
    // Prüfe, ob der API-Endpunkt von der Admin-Seite aufgerufen wird
    const origin = request.headers.get('origin') || '';
    const referer = request.headers.get('referer') || '';
    
    const isLocalRequest = origin.includes('localhost') || referer.includes('localhost');
    const isValidOrigin = origin.includes('vercel.app') || referer.includes('vercel.app') || isLocalRequest;
    console.log('Origin Checks:', { origin, referer, isLocalRequest, isValidOrigin });
    
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

    try {
      // Zuerst die zu löschenden Codes finden
      console.log('Finde alle Testcodes, die mit INT_ beginnen');
      const { data: codesToDelete, error: fetchError } = await supabase
        .from('codes')
        .select('code')
        .like('code', 'INT\\_%');
        
      if (fetchError) {
        console.error('Fehler beim Abrufen der Testcodes:', fetchError);
        throw fetchError;
      }
      
      if (!codesToDelete || codesToDelete.length === 0) {
        console.log('Keine Testcodes zum Löschen gefunden');
        return NextResponse.json({ 
          message: 'Keine Testcodes zum Bereinigen gefunden',
          count: 0
        });
      }
      
      const codesToDeleteList = codesToDelete.map(item => item.code);
      console.log(`${codesToDeleteList.length} Testcodes zum Löschen gefunden`, 
        codesToDeleteList.length <= 5 ? codesToDeleteList : `${codesToDeleteList.slice(0, 5).join(', ')}... und weitere`);
      
      // 1. Zuerst die zugehörigen Registrierungen löschen
      console.log('Lösche zugehörige Registrierungen...');
      const { error: regDeleteError, count: regDeletedCount } = await supabase
        .from('registrations')
        .delete({ count: 'exact' })
        .in('code', codesToDeleteList);
        
      if (regDeleteError) {
        console.error('Fehler beim Löschen der Registrierungen:', regDeleteError);
        throw regDeleteError;
      }
      
      console.log(`${regDeletedCount || 0} Registrierungen gelöscht`);
      
      // 2. Jetzt die Testcodes selbst löschen
      console.log('Lösche Testcodes...');
      const { error: codesDeleteError, count: codesDeletedCount } = await supabase
        .from('codes')
        .delete({ count: 'exact' })
        .in('code', codesToDeleteList);
        
      if (codesDeleteError) {
        console.error('Fehler beim Löschen der Testcodes:', codesDeleteError);
        throw codesDeleteError;
      }
      
      console.log(`${codesDeletedCount || 0} Testcodes erfolgreich gelöscht`);
      
      return NextResponse.json({ 
        message: 'Testcodes erfolgreich bereinigt',
        count: codesDeletedCount || 0,
        registrationsDeleted: regDeletedCount || 0,
        deletedCodes: codesToDeleteList
      });
    } catch (dbError) {
      console.error('Datenbankfehler beim Löschen der Codes:', dbError);
      return NextResponse.json(
        { error: `Datenbankfehler: ${(dbError as Error).message}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Fehler beim Bereinigen der Testcodes:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
} 