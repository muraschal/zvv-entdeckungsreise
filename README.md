# Entdeckungsreise Widget für zvv.ch 🚆 🧭 🎒

## Über das Projekt 
Dieses hochskalierbare Full-Stack-Microservice implementiert ein React-basiertes Anmeldeformular für die ZVV-Entdeckungsreise mit serverless Backend-Architektur. Die Lösung nutzt eine event-driven Datenverarbeitungspipeline mit PostgreSQL als persistente Speicherschicht via **Supabase** und einer **Next.js-Anwendung** mit Server-Side Rendering für optimale Performance und SEO-Metriken.

## Ziel
Implementierung einer Cloud-nativen, horizontal skalierbaren Lösung zur Verwaltung und Validierung von Ticketcodes mit **Supabase** als Backend-as-a-Service und einer **Next.js-Anwendung** auf **Vercel** als Edge-Computing-Plattform. Die Infrastruktur ist für hohe Verfügbarkeit und Ausfallsicherheit konzipiert und unterstützt die Verarbeitung von jährlich ca. **650 neuen Codes** mit einer Datenretention von **drei Jahren** unter Einhaltung strenger SLAs.

## Architektur
- **Supabase (PostgreSQL)** als **zentrale Datenbank** für Codes und Anmeldungen 📊
- **Vercel (Next.js)** für die Benutzeroberfläche und API-Endpunkte 🖥️
- **Resend** für den E-Mail-Versand von Bestätigungen und Benachrichtigungen 📧

## Technologie-Stack
- **Supabase (PostgreSQL)** für Speicherung & Validierung der Codes 🗄️
- **Next.js** für Frontend und API-Routes 🚀
- **Vercel** für Hosting und Serverless-Funktionen ☁️
- **Resend** für transaktionale E-Mails 📨

## Datenbank-Struktur (Supabase)

### Datenbankschema

Die Anwendung verwendet zwei Haupttabellen: `codes` für die Ticketcodes und `registrations` für die Anmeldungen.

#### ER-Diagramm

```mermaid
erDiagram
    CODES ||--o{ REGISTRATIONS : "hat"
    
    CODES {
        string code PK "Einzigartiger Ticketcode"
        string status "unused/used"
        timestamp expires_at "Ablaufdatum"
        timestamp created_at "Erstellungsdatum"
    }
    
    REGISTRATIONS {
        uuid id PK "Eindeutige ID"
        string code FK "Referenz zum Code"
        string school "Name der Schule"
        int student_count "Anzahl Schüler"
        date travel_date "Reisedatum"
        string additional_notes "Optionale Anmerkungen"
        string email "Kontakt-E-Mail"
        string contact_person "Ansprechpartner"
        string phone_number "Telefonnummer"
        string class "Klassenstufe"
        int accompanist_count "Anzahl Begleitpersonen"
        time arrival_time "Ankunftszeit"
        timestamp created_at "Erstellungsdatum"
    }
```

#### Tabellenstruktur

##### Tabelle: `codes`

| Spalte | Typ | Constraints | Beschreibung |
|--------|-----|-------------|-------------|
| code | TEXT | PRIMARY KEY | Einzigartiger Ticketcode |
| status | TEXT | DEFAULT 'unused', CHECK (status IN ('unused', 'used')) | Status des Codes (unused/used) |
| expires_at | TIMESTAMP | NOT NULL | Ablaufdatum des Codes (3 Jahre nach Erstellung) |
| created_at | TIMESTAMP | DEFAULT now() | Erstellungsdatum |

##### Tabelle: `registrations`

| Spalte | Typ | Constraints | Beschreibung |
|--------|-----|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Eindeutige ID der Anmeldung |
| code | TEXT | REFERENCES codes(code) | Referenz zum eingelösten Code |
| school | TEXT | NOT NULL | Name der Schule |
| student_count | INTEGER | NOT NULL | Anzahl der Schüler |
| travel_date | DATE | NOT NULL | Gewünschtes Reisedatum |
| additional_notes | TEXT | | Zusätzliche Anmerkungen (optional) |
| email | TEXT | NOT NULL | E-Mail-Adresse für die Bestätigung |
| contact_person | TEXT | NOT NULL | Name der Kontaktperson |
| phone_number | TEXT | NOT NULL | Telefonnummer der Kontaktperson |
| class | TEXT | NOT NULL | Klassenstufe (z.B. "4. Klasse") |
| accompanist_count | INTEGER | NOT NULL | Anzahl der Begleitpersonen |
| arrival_time | TIME | NOT NULL | Geplante Ankunftszeit |
| created_at | TIMESTAMP | DEFAULT now() | Erstellungsdatum der Anmeldung |

#### SQL-Definitionen

```sql
-- Tabelle für Ticketcodes
CREATE TABLE codes (
    code TEXT PRIMARY KEY,
    status TEXT DEFAULT 'unused' CHECK (status IN ('unused', 'used')),
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);

-- Tabelle für Anmeldungen
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

#### Beziehungen

- Ein Code (`codes`) kann höchstens eine Anmeldung (`registrations`) haben (1:0..1)
- Eine Anmeldung (`registrations`) gehört genau zu einem Code (`codes`) (1:1)

## Funktionalitäten
### **1. Code-Validierung** ✅
- API-Endpunkt: `POST /api/validate`
- Überprüft, ob ein Ticketcode gültig ist.

### **2. Code-Einlösung mit Anmeldeformular** 📝
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

### **3. E-Mail-Benachrichtigungen** 📬
- **Bestätigungs-E-Mail** an den Benutzer nach erfolgreicher Anmeldung.
- **Benachrichtigungs-E-Mail** an den Administrator mit den Anmeldedetails.

### **4. Widget-Integration** 🔌
- **Standalone JavaScript-Widget** für die Integration in externe Websites.
- **Keine iframe-Einbindung** erforderlich, sondern direkte Integration als React-Komponente.
- **Konfigurierbare API-Basis-URL** für flexible Deployment-Szenarien.

### **5. Admin-Ansicht** 🔐
- Geschützte Seite unter `/admin` zur Überwachung der Anmeldungen.
- **Supabase Auth** für sichere Benutzerauthentifizierung mit JWT-basierter Session-Verwaltung.
- Tabellarische Übersicht aller Anmeldungen mit wichtigen Informationen.
- Direkter Datenbankzugriff mit Row-Level Security für maximale Sicherheit.
- Automatische Weiterleitung von der Root-Route zur Admin-Ansicht.

## Best Practices
- **Supabase Row-Level Security (RLS)** aktivieren, um Datenzugriff abzusichern 🔒
- **Serverless-Funktionen** für optimale Skalierbarkeit 📈
- **Formularvalidierung** sowohl client- als auch serverseitig ✓
- **Transaktionale E-Mails** für Bestätigungen und Benachrichtigungen 📩

## Implementierte Funktionen
1. **Anmeldeformular** mit allen erforderlichen Feldern und Validierung ✅
2. **Datenbank-Struktur** in Supabase für Codes und Anmeldungen ✅
3. **API-Endpunkte** für Validierung und Einlösung von Codes ✅
4. **E-Mail-System** für Bestätigungen und Benachrichtigungen ✅
5. **Bestätigungsseite** nach erfolgreicher Anmeldung ✅
6. **Widget-Integration** für nahtlose Einbindung in zvv.ch ✅

## Erste Schritte 🚀
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
   NEXT_PUBLIC_SUPABASE_ANON_KEY=dein-anon-key
   RESEND_API_KEY=dein-resend-api-key
   EMAIL_FROM=noreply@zvv.ch
   ADMIN_EMAIL=ict@zvv.zh.ch
   ```

   **Hinweis zur Konfiguration:**
   - `NEXT_PUBLIC_SUPABASE_URL`: Die URL deiner Supabase-Instanz
   - `SUPABASE_SERVICE_ROLE_KEY`: Der Service-Role-Key für den Zugriff auf die Supabase-Datenbank
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Der öffentliche Anon-Key für die Client-seitige Authentifizierung
   - `EMAIL_FROM`: Die E-Mail-Adresse, die als Absender für alle E-Mails verwendet wird (z.B. `entdeckungsreise@zvv.ch`). Fallback: `noreply@zvv.ch`
   - `ADMIN_EMAIL`: Die E-Mail-Adresse, an die Benachrichtigungen über neue Anmeldungen gesendet werden und die als Reply-To-Adresse in den Bestätigungs-E-Mails verwendet wird. Fallback: `ict@zvv.zh.ch`

4. Erstelle Admin-Benutzer in Supabase:
   - Gehe zum Supabase Dashboard → Authentication → Users
   - Klicke auf "Add User" und gib E-Mail und Passwort ein
   - Der Benutzer erhält eine Einladungs-E-Mail zur Bestätigung

5. Starte die Entwicklungsumgebung:
   ```bash
   npm run dev
   ```

## Widget-Integration 🔌

### Standalone JavaScript-Widget bauen

Um das Widget als Standalone-JavaScript-Datei zu bauen, führe folgenden Befehl aus:

```bash
npm run build:standalone
```

Dies erstellt eine Datei `dist/zvv-entdeckungsreise-widget.js`, die in externe Websites eingebunden werden kann.

### Widget in eine Website einbinden

1. **Erforderliche Skripte einbinden:**

```html
<!-- React und ReactDOM einbinden (von CDN) -->
<script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>

<!-- ZVV Entdeckungsreise Widget einbinden -->
<script src="https://entdeckungsreise.zvv.ch/zvv-entdeckungsreise-widget.js"></script>
```

2. **Container für das Widget erstellen:**

```html
<div id="zvv-entdeckungsreise-widget"></div>
```

3. **Widget initialisieren:**

```html
<script>
  document.addEventListener('DOMContentLoaded', function() {
    // Widget initialisieren
    window.initZVVEntdeckungsreiseWidget('zvv-entdeckungsreise-widget', {
      apiBaseUrl: 'https://entdeckungsreise.zvv.ch' // Optional: API-Basis-URL anpassen
    });
  });
</script>
```

### Konfigurationsoptionen

Das Widget akzeptiert folgende Konfigurationsoptionen:

| Option | Typ | Standard | Beschreibung |
|--------|-----|----------|-------------|
| apiBaseUrl | String | 'https://entdeckungsreise.zvv.ch' | Die Basis-URL für API-Anfragen |

### Beispiel

Ein vollständiges Beispiel für die Integration findest du in der Datei `examples/widget-integration.html`.

## Fazit
Diese Lösung macht den Anmeldeprozess für die ZVV-Entdeckungsreise **skalierbar, sicher und benutzerfreundlich** 🎯. Durch die direkte Integration des Anmeldeformulars als Widget wird der Prozess vereinfacht und die Benutzererfahrung verbessert. Die E-Mail-Funktionalität sorgt für eine nahtlose Kommunikation mit den Benutzern und Administratoren.

Die Widget-Integration ermöglicht eine flexible Einbindung des Anmeldeformulars in externe Websites, ohne auf iframes zurückgreifen zu müssen. Dies verbessert die Benutzererfahrung und erleichtert die Integration in bestehende Webseiten.

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
