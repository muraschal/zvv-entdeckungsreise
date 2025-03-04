-- ZVV-Entdeckungsreise: Vollständiges Datenbank-Setup
-- Dieses Skript löscht alle bestehenden Tabellen und erstellt sie neu
-- Führe dieses Skript aus, um die Datenbank komplett neu aufzusetzen

-- 1. Bestehende Tabellen löschen (in umgekehrter Reihenfolge der Abhängigkeiten)
DROP TABLE IF EXISTS registrations;
DROP TABLE IF EXISTS codes;

-- 2. Tabelle für Codes erstellen
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

-- 3. Tabelle für Anmeldungen erstellen
CREATE TABLE registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT REFERENCES codes(code),
    school TEXT NOT NULL,
    student_count INTEGER NOT NULL,
    travel_date DATE NOT NULL,
    additional_notes TEXT,
    email TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    class TEXT NOT NULL,
    accompanist_count INTEGER NOT NULL,
    arrival_time TIME NOT NULL,
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
COMMENT ON COLUMN registrations.contact_person IS 'Name der Kontaktperson';
COMMENT ON COLUMN registrations.phone_number IS 'Telefonnummer der Kontaktperson';
COMMENT ON COLUMN registrations.class IS 'Klassenstufe';
COMMENT ON COLUMN registrations.accompanist_count IS 'Anzahl der Begleitpersonen';
COMMENT ON COLUMN registrations.arrival_time IS 'Geplante Ankunftszeit';
COMMENT ON COLUMN registrations.created_at IS 'Zeitpunkt der Anmeldung';

-- 4. Demo-Codes einfügen
INSERT INTO codes (code, expires_at) 
VALUES 
  -- Test-Codes für Entwicklung
  ('TEST123', now() + interval '3 years'),
  ('TEST456', now() + interval '3 years'),
  ('TEST789', now() + interval '3 years'),
  
  -- Demo-Codes für Schulen
  ('SCHULE2023', now() + interval '3 years'),
  ('SCHULE2024', now() + interval '3 years'),
  ('SCHULE2025', now() + interval '3 years'),
  
  -- ZVV-spezifische Codes
  ('ZVV2023', now() + interval '3 years'),
  ('ZVV2024', now() + interval '3 years'),
  ('ZVV2025', now() + interval '3 years'),
  
  -- Demo-Codes für Präsentationen
  ('DEMO001', now() + interval '3 years'),
  ('DEMO002', now() + interval '3 years'),
  ('DEMO003', now() + interval '3 years'),
  
  -- Codes für verschiedene Regionen
  ('ZUERICH01', now() + interval '3 years'),
  ('ZUERICH02', now() + interval '3 years'),
  ('WINTERTHUR01', now() + interval '3 years'),
  ('WINTERTHUR02', now() + interval '3 years'),
  ('USTER01', now() + interval '3 years'),
  ('WETZIKON01', now() + interval '3 years'),
  ('DIETIKON01', now() + interval '3 years'),
  ('HORGEN01', now() + interval '3 years');

-- 5. Überprüfen der erstellten Tabellen und eingefügten Daten
SELECT 'Anzahl der Codes: ' || COUNT(*) AS info FROM codes;
SELECT 'Anzahl der Anmeldungen: ' || COUNT(*) AS info FROM registrations;

-- 6. Beispiel-Abfragen
-- Alle verfügbaren Codes anzeigen
SELECT code, status, expires_at FROM codes WHERE status = 'unused';

-- Alle abgelaufenen Codes anzeigen
SELECT code, status, expires_at FROM codes WHERE expires_at < now();

-- Alle eingelösten Codes anzeigen
SELECT code, status, expires_at FROM codes WHERE status = 'used'; 