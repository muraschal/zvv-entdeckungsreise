import { NextResponse } from 'next/server';
import supabase from '../../../lib/supabase';

export async function POST(request: Request) {
  try {
    // Extrahiere den Code aus dem Request-Body
    const { code } = await request.json();

    // Überprüfe, ob der Code vorhanden ist
    if (!code) {
      return NextResponse.json(
        { valid: false, message: 'Code ist erforderlich.' },
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
        { valid: false, message: 'Fehler bei der Validierung des Codes.' },
        { status: 500 }
      );
    }

    // Wenn kein Code gefunden wurde
    if (!data) {
      return NextResponse.json(
        { valid: false, message: 'Ungültiger Code.' },
        { status: 404 }
      );
    }

    // Überprüfe, ob der Code bereits verwendet wurde
    if (data.status === 'used') {
      return NextResponse.json(
        { valid: false, message: 'Dieser Code wurde bereits verwendet.' },
        { status: 400 }
      );
    }

    // Überprüfe, ob der Code abgelaufen ist
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return NextResponse.json(
        { valid: false, message: 'Dieser Code ist abgelaufen.' },
        { status: 400 }
      );
    }

    // Code ist gültig
    return NextResponse.json(
      { valid: true, message: 'Code ist gültig.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unerwarteter Fehler:', error);
    return NextResponse.json(
      { valid: false, message: 'Ein unerwarteter Fehler ist aufgetreten.' },
      { status: 500 }
    );
  }
} 