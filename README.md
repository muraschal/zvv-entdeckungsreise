# ZVV Ticketcode-Validierung mit Supabase & Zapier

## 💡 Problemstellung
Aktuell wird die Bestellcode-Verwaltung für die ZVV-Entdeckungsreise über Google Sheets und Zapier gehandhabt. Google Sheets hat jedoch eine **500-Zeilen-Grenze**, was langfristig zu Skalierungsproblemen führt. Jährlich werden ca. **650 neue Codes generiert** und diese bleiben **drei Jahre gültig**. Das bestehende Modell ist nicht nachhaltig.

## 🚀 Ziel
Eine skalierbare, performante Lösung zur Verwaltung und Validierung von Ticketcodes unter Nutzung von **Supabase** als zentrale Datenbank und einer **Webhook-gesteuerten API** auf **Vercel** zur Kommunikation mit Zapier.

## 💪 Architektur
- **Supabase (PostgreSQL)** als **zentrale Datenbank** für Codes.
- **Vercel (Serverless API)** für schnelle Code-Validierung via Webhooks.
- **Zapier** als Automatisierungsplattform für den Bestellprozess.

## 🔧 Technologie-Stack
- **Supabase (PostgreSQL)** für Speicherung & Validierung der Codes.
- **Vercel** mit **Next.js API Routes** für REST-Schnittstelle.
- **Zapier** zur Anbindung von Typeform und Benachrichtigung.

## 🎯 Datenbank-Struktur (Supabase)
Tabelle: `codes`
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

## 🛠️ API-Schnittstellen (Vercel)
### **1. `POST /validate`** (Validierung eines Codes)
#### Request
```json
{
  "code": "XYZ12345"
}
```
#### Response
```json
{
  "valid": true,
  "message": "Code is valid."
}
```
- Falls **ungültig**, gibt API `valid: false` und eine Fehlermeldung zurück.

### **2. `POST /redeem`** (Einlösen eines Codes)
#### Request
```json
{
  "code": "XYZ12345"
}
```
#### Response
```json
{
  "success": true,
  "message": "Code redeemed successfully."
}
```
- Setzt `status` des Codes in Supabase auf `used`.

## 🚨 Best Practices
- API ist **stateless** und optimiert für schnelle Antwortzeiten (<200ms).
- **Supabase Row-Level Security (RLS)** aktivieren, um Datenzugriff abzusichern.
- **Logging und Monitoring** über Vercel & Supabase einrichten.

## 🏢 Nächste Schritte
1. **Supabase DB einrichten** (inkl. Testdaten füllen).
2. **Vercel API entwickeln** (Next.js API Routes oder Express.js).
3. **Zapier integrieren** (Typeform -> API -> Bestätigungs-E-Mail).

## 🎉 Fazit
Diese Lösung macht den Bestellprozess **skalierbar, sicher und automatisiert**. Supabase bietet eine performante Alternative zu Google Sheets, während Vercel die API effizient und kostengünstig hostet. Zapier sorgt für eine reibungslose Integration in den bestehenden Workflow.
