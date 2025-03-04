-- Erstelle die registrations-Tabelle
CREATE TABLE IF NOT EXISTS registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT REFERENCES codes(code),
    school TEXT NOT NULL,
    student_count INTEGER NOT NULL,
    travel_date DATE NOT NULL,
    additional_notes TEXT,
    created_at TIMESTAMP DEFAULT now()
);

-- Erstelle einen Index für schnellere Abfragen nach dem Code
CREATE INDEX IF NOT EXISTS idx_registrations_code ON registrations(code);

-- Kommentar zur Tabelle hinzufügen
COMMENT ON TABLE registrations IS 'Tabelle für Anmeldungen zur ZVV-Entdeckungsreise';

-- Kommentare zu den Spalten hinzufügen
COMMENT ON COLUMN registrations.id IS 'Eindeutige ID für jede Anmeldung';
COMMENT ON COLUMN registrations.code IS 'Referenz zum eingelösten Ticketcode';
COMMENT ON COLUMN registrations.school IS 'Name der Schule';
COMMENT ON COLUMN registrations.student_count IS 'Anzahl der Schüler';
COMMENT ON COLUMN registrations.travel_date IS 'Gewünschtes Reisedatum';
COMMENT ON COLUMN registrations.additional_notes IS 'Zusätzliche Anmerkungen';
COMMENT ON COLUMN registrations.created_at IS 'Zeitpunkt der Anmeldung'; 