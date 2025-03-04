# ZVV Ticketcode-Validierung mit Supabase & Next.js

## Problemstellung
Aktuell wird die Bestellcode-Verwaltung für die ZVV-Entdeckungsreise über Google Sheets gehandhabt. Google Sheets hat jedoch eine **500-Zeilen-Grenze**, was langfristig zu Skalierungsproblemen führt. Jährlich werden ca. **650 neue Codes generiert** und diese bleiben **drei Jahre gültig**. Das bestehende Modell ist nicht nachhaltig.

## Ziel
Eine skalierbare, performante Lösung zur Verwaltung und Validierung von Ticketcodes unter Nutzung von **Supabase** als zentrale Datenbank und einer **Next.js-Anwendung** auf **Vercel** für die Benutzeroberfläche und API-Funktionalität.

## Architektur
- **Supabase (PostgreSQL)** als **zentrale Datenbank** für Codes und Anmeldungen.
- **Vercel (Next.js)** für die Benutzeroberfläche und API-Endpunkte.
- **Resend** für den E-Mail-Versand von Bestätigungen und Benachrichtigungen.

## Technologie-Stack
- **Supabase (PostgreSQL)** für Speicherung & Validierung der Codes.
- **Next.js** für Frontend und API-Routes.
- **Vercel** für Hosting und Serverless-Funktionen.
- **Resend** für transaktionale E-Mails.

## Datenbank-Struktur (Supabase)
### Tabelle: `codes`
```sql
CREATE TABLE codes (
    code TEXT PRIMARY KEY,
    status TEXT DEFAULT 'unused' CHECK (status IN ('unused', 'used')),
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);
```
- `code`: Einzigartiger Ticketcode.
- `status`: Wird auf `used` gesetzt, wenn der Code eingelöst wurde.
- `expires_at`: Ablaufdatum des Codes (3 Jahre nach Erstellung).

### Tabelle: `registrations`
```sql
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
```
- `code`: Referenz zum eingelösten Ticketcode.
- `school`: Name der Schule.
- `student_count`: Anzahl der Schüler.
- `travel_date`: Gewünschtes Reisedatum.
- `additional_notes`: Zusätzliche Anmerkungen.
- `email`: E-Mail-Adresse für die Bestätigung.
- `contact_person`: Name der Kontaktperson.
- `phone_number`: Telefonnummer der Kontaktperson.
- `class`: Klassenstufe (z.B. "4. Klasse").
- `accompanist_count`: Anzahl der Begleitpersonen.
- `arrival_time`: Geplante Ankunftszeit.

## Funktionalitäten
### **1. Code-Validierung**
- API-Endpunkt: `POST /api/validate`
- Überprüft, ob ein Ticketcode gültig ist.

### **2. Code-Einlösung mit Anmeldeformular**
- Einfaches Formular mit folgenden Feldern:
  - Code
  - Schule
  - Kontaktperson
  - E-Mail-Adresse
  - Telefonnummer
  - Klasse (Dropdown-Menü)
  - Anzahl Schüler
  - Anzahl Begleitpersonen
  - Gewünschtes Reisedatum
  - Ankunftszeit
  - Zusätzliche Anmerkung
- API-Endpunkt: `POST /api/redeem`
- Validiert den Code und speichert die Anmeldedaten.

### **3. E-Mail-Benachrichtigungen**
- **Bestätigungs-E-Mail** an den Benutzer nach erfolgreicher Anmeldung.
- **Benachrichtigungs-E-Mail** an den Administrator mit den Anmeldedetails.

## Best Practices
- **Supabase Row-Level Security (RLS)** aktivieren, um Datenzugriff abzusichern.
- **Serverless-Funktionen** für optimale Skalierbarkeit.
- **Formularvalidierung** sowohl client- als auch serverseitig.
- **Transaktionale E-Mails** für Bestätigungen und Benachrichtigungen.

## Implementierte Funktionen
1. **Anmeldeformular erstellt** mit allen erforderlichen Feldern.
2. **Datenbank-Tabellen in Supabase eingerichtet** für Codes und Anmeldungen.
3. **API-Endpunkte implementiert** für Validierung und Einlösung von Codes.
4. **E-Mail-Funktionalität integriert** für Bestätigungen und Benachrichtigungen.
5. **Bestätigungsseite nach erfolgreicher Anmeldung erstellt**.

## Erste Schritte
1. Klone das Repository:
   ```bash
   git clone https://github.com/dein-username/zvv-entdeckungsreise.git
   cd zvv-entdeckungsreise
   ```

2. Installiere die Abhängigkeiten:
   ```bash
   npm install
   ```

3. Erstelle eine `.env.local` Datei mit den erforderlichen Umgebungsvariablen:
   ```
   NEXT_PUBLIC_SUPABASE_URL=deine-supabase-url
   SUPABASE_SERVICE_ROLE_KEY=dein-service-role-key
   RESEND_API_KEY=dein-resend-api-key
   ADMIN_EMAIL=admin@beispiel.com
   ```

4. Starte die Entwicklungsumgebung:
   ```bash
   npm run dev
   ```

## Fazit
Diese Lösung macht den Bestellprozess **skalierbar, sicher und benutzerfreundlich**. Durch die direkte Integration des Anmeldeformulars in die Next.js-Anwendung wird der Prozess vereinfacht und die Abhängigkeit von Drittanbietern wie Typeform und Zapier eliminiert. Die E-Mail-Funktionalität sorgt für eine nahtlose Kommunikation mit den Benutzern und Administratoren.

## Datenbank-Setup

Die Anwendung verwendet Supabase als Datenbank. Die Datenbank kann mit dem SQL-Skript `setup-database.sql` eingerichtet werden.

### Tabellen

```sql
CREATE TABLE codes (
    code TEXT PRIMARY KEY,
    status TEXT DEFAULT 'unused' CHECK (status IN ('unused', 'used')),
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);

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
```

### Demo-Codes

Das Setup-Skript fügt folgende Demo-Codes in die Datenbank ein:

| Kategorie | Codes |
|-----------|-------|
| Test-Codes | `TEST123`, `TEST456`, `TEST789` |
| Schul-Codes | `SCHULE2023`, `SCHULE2024`, `SCHULE2025` |
| ZVV-Codes | `ZVV2023`, `ZVV2024`, `ZVV2025` |
| Präsentations-Codes | `DEMO001`, `DEMO002`, `DEMO003` |
| Regionale Codes | `ZUERICH01`, `ZUERICH02`, `WINTERTHUR01`, `WINTERTHUR02`, `USTER01`, `WETZIKON01`, `DIETIKON01`, `HORGEN01` |

Alle Demo-Codes sind für 3 Jahre gültig und können für Testzwecke verwendet werden.

### Datenbank einrichten

Um die Datenbank einzurichten und Demo-Codes einzufügen, verwende die Datei `setup-database.sql`:

```bash
# Verbinde dich mit deiner Supabase-Datenbank
psql -h db.abcdefghijklm.supabase.co -p 5432 -d postgres -U postgres

# Führe das SQL-Skript aus
\i setup-database.sql
```

Alternativ kannst du die SQL-Befehle auch direkt im Supabase SQL-Editor ausführen.
