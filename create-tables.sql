-- Erstelle die codes-Tabelle
CREATE TABLE IF NOT EXISTS codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    status TEXT CHECK (status IN ('unused', 'used')) DEFAULT 'unused',
    created_at TIMESTAMP DEFAULT now(),
    expires_at TIMESTAMP
);

-- Kommentar zur codes-Tabelle hinzufügen
COMMENT ON TABLE codes IS 'Tabelle für Ticketcodes der ZVV-Entdeckungsreise';
COMMENT ON COLUMN codes.id IS 'Eindeutige ID für jeden Code';
COMMENT ON COLUMN codes.code IS 'Der eigentliche Ticketcode';
COMMENT ON COLUMN codes.status IS 'Status des Codes (unused oder used)';
COMMENT ON COLUMN codes.created_at IS 'Zeitpunkt der Erstellung';
COMMENT ON COLUMN codes.expires_at IS 'Ablaufdatum des Codes';

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

-- Kommentar zur registrations-Tabelle hinzufügen
COMMENT ON TABLE registrations IS 'Tabelle für Anmeldungen zur ZVV-Entdeckungsreise';
COMMENT ON COLUMN registrations.id IS 'Eindeutige ID für jede Anmeldung';
COMMENT ON COLUMN registrations.code IS 'Referenz zum eingelösten Ticketcode';
COMMENT ON COLUMN registrations.school IS 'Name der Schule';
COMMENT ON COLUMN registrations.student_count IS 'Anzahl der Schüler';
COMMENT ON COLUMN registrations.travel_date IS 'Gewünschtes Reisedatum';
COMMENT ON COLUMN registrations.additional_notes IS 'Zusätzliche Anmerkungen';
COMMENT ON COLUMN registrations.created_at IS 'Zeitpunkt der Anmeldung';

-- Füge einen Beispiel-Code hinzu (optional)
INSERT INTO codes (code, expires_at) 
VALUES ('DEMO123', now() + interval '3 years'); 