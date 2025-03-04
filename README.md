# ZVV Ticketcode-Validierung mit Supabase & Next.js

## 💡 Problemstellung
Aktuell wird die Bestellcode-Verwaltung für die ZVV-Entdeckungsreise über Google Sheets gehandhabt. Google Sheets hat jedoch eine **500-Zeilen-Grenze**, was langfristig zu Skalierungsproblemen führt. Jährlich werden ca. **650 neue Codes generiert** und diese bleiben **drei Jahre gültig**. Das bestehende Modell ist nicht nachhaltig.

## 🚀 Ziel
Eine skalierbare, performante Lösung zur Verwaltung und Validierung von Ticketcodes unter Nutzung von **Supabase** als zentrale Datenbank und einer **Next.js-Anwendung** auf **Vercel** für die Benutzeroberfläche und API-Funktionalität.

## 💪 Architektur
- **Supabase (PostgreSQL)** als **zentrale Datenbank** für Codes und Anmeldungen.
- **Vercel (Next.js)** für die Benutzeroberfläche und API-Endpunkte.

## 🔧 Technologie-Stack
- **Supabase (PostgreSQL)** für Speicherung & Validierung der Codes.
- **Next.js** für Frontend und API-Routes.
- **Vercel** für Hosting und Serverless-Funktionen.

## 🎯 Datenbank-Struktur (Supabase)
### Tabelle: `codes`
```sql
CREATE TABLE codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    status TEXT CHECK (status IN ('unused', 'used')) DEFAULT 'unused',
    created_at TIMESTAMP DEFAULT now(),
    expires_at TIMESTAMP
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
    created_at TIMESTAMP DEFAULT now()
);
```
- `code`: Referenz zum eingelösten Ticketcode.
- `school`: Name der Schule.
- `student_count`: Anzahl der Schüler.
- `travel_date`: Gewünschtes Reisedatum.
- `additional_notes`: Zusätzliche Anmerkungen.

## 🛠️ Funktionalitäten
### **1. Code-Validierung**
- API-Endpunkt: `POST /api/validate`
- Überprüft, ob ein Ticketcode gültig ist.

### **2. Code-Einlösung mit Anmeldeformular**
- Einfaches Formular mit folgenden Feldern:
  - Code
  - Schule
  - Anzahl Schüler
  - Gewünschtes Reisedatum
  - Zusätzliche Anmerkung
- API-Endpunkt: `POST /api/redeem`
- Validiert den Code und speichert die Anmeldedaten.

## 🚨 Best Practices
- **Supabase Row-Level Security (RLS)** aktivieren, um Datenzugriff abzusichern.
- **Serverless-Funktionen** für optimale Skalierbarkeit.
- **Formularvalidierung** sowohl client- als auch serverseitig.

## 🏢 Nächste Schritte
1. **Anmeldeformular erstellen** (einfaches Design, Fokus auf Funktionalität).
2. **Registrations-Tabelle in Supabase einrichten**.
3. **API-Endpunkte für Formularverarbeitung implementieren**.
4. **Bestätigungsseite nach erfolgreicher Anmeldung erstellen**.

## 🎉 Fazit
Diese Lösung macht den Bestellprozess **skalierbar, sicher und benutzerfreundlich**. Durch die direkte Integration des Anmeldeformulars in die Next.js-Anwendung wird der Prozess vereinfacht und die Abhängigkeit von Drittanbietern wie Typeform und Zapier eliminiert.
