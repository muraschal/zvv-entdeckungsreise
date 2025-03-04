-- Demo-Codes für die ZVV-Entdeckungsreise
-- Diese Datei enthält SQL-Befehle zum Einfügen von Demo-Codes in die Datenbank
-- Führe diese Datei aus, um die Demo-Codes in die Datenbank einzufügen

-- Lösche bestehende Demo-Codes (optional)
-- DELETE FROM codes WHERE code LIKE 'DEMO%' OR code LIKE 'TEST%' OR code LIKE 'ZVV%' OR code LIKE 'SCHULE%';

-- Füge Demo-Codes in die Datenbank ein
-- Format: (code, expires_at)
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

-- Zeige alle eingefügten Codes an
SELECT * FROM codes WHERE code LIKE 'DEMO%' OR code LIKE 'TEST%' OR code LIKE 'ZVV%' OR code LIKE 'SCHULE%' OR code LIKE '%01' OR code LIKE '%02';

-- Hinweis: Um diese Codes in der Produktion zu verwenden, sollte die Ablaufzeit angepasst werden
-- Beispiel für kürzere Ablaufzeit: now() + interval '30 days' 