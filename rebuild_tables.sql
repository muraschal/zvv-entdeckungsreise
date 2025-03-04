-- Lösche bestehende Tabellen (in umgekehrter Reihenfolge der Abhängigkeiten)
DROP TABLE IF EXISTS registrations;
DROP TABLE IF EXISTS codes;

-- Erstelle die codes-Tabelle
CREATE TABLE codes (
    code TEXT PRIMARY KEY,
    status TEXT DEFAULT 'unused' CHECK (status IN ('unused', 'used')),
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);

-- Kommentare für die codes-Tabelle
COMMENT ON TABLE codes IS 'Tabelle für Ticketcodes der ZVV-Entdeckungsreise';
COMMENT ON COLUMN codes.code IS 'Eindeutiger Ticketcode';
COMMENT ON COLUMN codes.status IS 'Status des Codes: unused oder used';
COMMENT ON COLUMN codes.expires_at IS 'Ablaufdatum des Codes';
COMMENT ON COLUMN codes.created_at IS 'Erstellungsdatum des Codes';

-- Erstelle die registrations-Tabelle
CREATE TABLE registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT REFERENCES codes(code),
    school TEXT NOT NULL,
    student_count INTEGER NOT NULL,
    travel_date DATE NOT NULL,
    additional_notes TEXT,
    email TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);

-- Erstelle einen Index für schnellere Abfragen nach dem Code
CREATE INDEX idx_registrations_code ON registrations(code);

-- Kommentare für die registrations-Tabelle
COMMENT ON TABLE registrations IS 'Tabelle für Anmeldungen zur ZVV-Entdeckungsreise';
COMMENT ON COLUMN registrations.id IS 'Eindeutige ID für jede Anmeldung';
COMMENT ON COLUMN registrations.code IS 'Referenz zum eingelösten Ticketcode';
COMMENT ON COLUMN registrations.school IS 'Name der Schule';
COMMENT ON COLUMN registrations.student_count IS 'Anzahl der Schüler';
COMMENT ON COLUMN registrations.travel_date IS 'Gewünschtes Reisedatum';
COMMENT ON COLUMN registrations.additional_notes IS 'Zusätzliche Anmerkungen';
COMMENT ON COLUMN registrations.email IS 'E-Mail-Adresse für die Bestätigung';
COMMENT ON COLUMN registrations.created_at IS 'Zeitpunkt der Anmeldung';

-- Füge Testcodes in die Datenbank ein
INSERT INTO codes (code, expires_at) 
VALUES 
  ('TEST123', now() + interval '3 years'),
  ('SCHULE456', now() + interval '3 years'),
  ('ZVV2023', now() + interval '3 years'),
  ('DEMO789', now() + interval '3 years');

-- Zeige alle Codes an
SELECT * FROM codes; 