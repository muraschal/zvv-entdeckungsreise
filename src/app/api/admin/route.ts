import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

// Einfacher API-Endpunkt zum Abrufen aller Registrierungen
export async function GET(request: Request) {
  try {
    // Einfache Authentifizierung über einen API-Schlüssel in der URL
    // In einer Produktionsumgebung sollte eine bessere Authentifizierung verwendet werden
    const { searchParams } = new URL(request.url);
    const apiKey = searchParams.get('key');
    
    // Überprüfe den API-Schlüssel (sehr einfache Implementierung)
    // In einer Produktionsumgebung sollte ein sicherer Authentifizierungsmechanismus verwendet werden
    if (apiKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json(
        { success: false, message: 'Nicht autorisiert' },
        { status: 401 }
      );
    }

    // Hole alle Registrierungen aus der Datenbank, sortiert nach Erstellungsdatum (neueste zuerst)
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase-Fehler:', error);
      return NextResponse.json(
        { success: false, message: 'Fehler beim Abrufen der Registrierungen' },
        { status: 500 }
      );
    }

    // Gib die Registrierungen zurück
    return NextResponse.json(
      { success: true, data },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unerwarteter Fehler:', error);
    return NextResponse.json(
      { success: false, message: 'Ein unerwarteter Fehler ist aufgetreten' },
      { status: 500 }
    );
  }
} 