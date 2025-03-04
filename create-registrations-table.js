// Skript zum Erstellen der registrations-Tabelle in Supabase
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Supabase-Konfiguration aus Umgebungsvariablen
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Fehler: Supabase-Umgebungsvariablen nicht gefunden.');
  console.error('Stelle sicher, dass NEXT_PUBLIC_SUPABASE_URL und SUPABASE_SERVICE_ROLE_KEY in .env.local definiert sind.');
  process.exit(1);
}

// Supabase-Client erstellen
const supabase = createClient(supabaseUrl, supabaseKey);

async function createRegistrationsTable() {
  console.log('Erstelle registrations-Tabelle in Supabase...');

  try {
    // SQL-Befehl zum Erstellen der Tabelle
    const { data, error } = await supabase.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS registrations (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          code TEXT REFERENCES codes(code),
          school TEXT NOT NULL,
          student_count INTEGER NOT NULL,
          travel_date DATE NOT NULL,
          additional_notes TEXT,
          created_at TIMESTAMP DEFAULT now()
        );
        
        CREATE INDEX IF NOT EXISTS idx_registrations_code ON registrations(code);
        
        COMMENT ON TABLE registrations IS 'Tabelle für Anmeldungen zur ZVV-Entdeckungsreise';
        COMMENT ON COLUMN registrations.id IS 'Eindeutige ID für jede Anmeldung';
        COMMENT ON COLUMN registrations.code IS 'Referenz zum eingelösten Ticketcode';
        COMMENT ON COLUMN registrations.school IS 'Name der Schule';
        COMMENT ON COLUMN registrations.student_count IS 'Anzahl der Schüler';
        COMMENT ON COLUMN registrations.travel_date IS 'Gewünschtes Reisedatum';
        COMMENT ON COLUMN registrations.additional_notes IS 'Zusätzliche Anmerkungen';
        COMMENT ON COLUMN registrations.created_at IS 'Zeitpunkt der Anmeldung';
      `
    });

    if (error) {
      console.error('Fehler beim Erstellen der Tabelle:', error);
      process.exit(1);
    }

    console.log('registrations-Tabelle erfolgreich erstellt!');
    console.log('Du kannst jetzt das Anmeldeformular verwenden.');
  } catch (err) {
    console.error('Unerwarteter Fehler:', err);
    process.exit(1);
  }
}

// Führe die Funktion aus
createRegistrationsTable(); 