import { NextResponse } from 'next/server';
import supabase from '../../../lib/supabase';

export async function POST(request: Request) {
  try {
    // Extrahiere die Daten aus dem Request-Body
    const { code, school, studentCount, travelDate, additionalNotes } = await request.json();

    // Überprüfe, ob alle erforderlichen Felder vorhanden sind
    if (!code || !school || !studentCount || !travelDate) {
      return NextResponse.json(
        { success: false, message: 'Alle Pflichtfelder müssen ausgefüllt sein.' },
        { status: 400 }
      );
    }

    // Suche den Code in der Datenbank
    const { data, error } = await supabase
      .from('codes')
      .select('*')
      .eq('code', code)
      .single();

    // Fehlerbehandlung bei der Datenbankabfrage
    if (error) {
      console.error('Supabase-Fehler:', error);
      return NextResponse.json(
        { success: false, message: 'Fehler bei der Validierung des Codes.' },
        { status: 500 }
      );
    }

    // Wenn kein Code gefunden wurde
    if (!data) {
      return NextResponse.json(
        { success: false, message: 'Ungültiger Code.' },
        { status: 404 }
      );
    }

    // Überprüfe, ob der Code bereits verwendet wurde
    if (data.status === 'used') {
      return NextResponse.json(
        { success: false, message: 'Dieser Code wurde bereits verwendet.' },
        { status: 400 }
      );
    }

    // Überprüfe, ob der Code abgelaufen ist
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return NextResponse.json(
        { success: false, message: 'Dieser Code ist abgelaufen.' },
        { status: 400 }
      );
    }

    // Starte eine Transaktion, um sowohl den Code zu aktualisieren als auch die Anmeldung zu speichern
    // Da Supabase keine echten Transaktionen unterstützt, führen wir die Operationen nacheinander aus
    
    // 1. Speichere die Anmeldedaten in der registrations-Tabelle
    const { data: registrationData, error: registrationError } = await supabase
      .from('registrations')
      .insert({
        code: code,
        school: school,
        student_count: studentCount,
        travel_date: travelDate,
        additional_notes: additionalNotes || null
      })
      .select();

    // Fehlerbehandlung bei der Speicherung der Anmeldedaten
    if (registrationError) {
      console.error('Fehler beim Speichern der Anmeldedaten:', registrationError);
      return NextResponse.json(
        { success: false, message: 'Fehler beim Speichern der Anmeldedaten.' },
        { status: 500 }
      );
    }

    // 2. Aktualisiere den Status des Codes auf 'used'
    const { error: updateError } = await supabase
      .from('codes')
      .update({ status: 'used' })
      .eq('id', data.id);

    // Fehlerbehandlung bei der Aktualisierung
    if (updateError) {
      console.error('Supabase-Aktualisierungsfehler:', updateError);
      
      // Versuche, die Anmeldung rückgängig zu machen, da der Code nicht aktualisiert werden konnte
      await supabase
        .from('registrations')
        .delete()
        .eq('id', registrationData[0].id);
        
      return NextResponse.json(
        { success: false, message: 'Fehler beim Einlösen des Codes.' },
        { status: 500 }
      );
    }

    // Code erfolgreich eingelöst und Anmeldung gespeichert
    return NextResponse.json(
      { 
        success: true, 
        message: 'Anmeldung erfolgreich. Vielen Dank!',
        data: {
          registrationId: registrationData[0].id,
          school: school,
          travelDate: travelDate
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unerwarteter Fehler:', error);
    return NextResponse.json(
      { success: false, message: 'Ein unerwarteter Fehler ist aufgetreten.' },
      { status: 500 }
    );
  }
} 