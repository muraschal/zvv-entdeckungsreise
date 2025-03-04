-- Füge Testcodes in die Datenbank ein
INSERT INTO codes (code, expires_at) 
VALUES 
  ('TEST123', now() + interval '3 years'),
  ('SCHULE456', now() + interval '3 years'),
  ('ZVV2023', now() + interval '3 years'),
  ('DEMO789', now() + interval '3 years');

-- Zeige alle Codes an
SELECT * FROM codes; 