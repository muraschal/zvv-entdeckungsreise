# Entwicklungsanleitung

## Entwicklungsumgebung einrichten

### Voraussetzungen
- Node.js (v18 oder höher)
- npm (v9 oder höher)
- Git
- Ein Supabase-Konto
- Ein Resend-Konto für E-Mail-Funktionalität

### Installation

1. Repository klonen:
```bash
git clone https://github.com/dein-username/zvv-entdeckungsreise.git
cd zvv-entdeckungsreise
```

2. Abhängigkeiten installieren:
```bash
npm install
```

3. Umgebungsvariablen konfigurieren:
```bash
cp .env.local.example .env.local
```
Dann die Werte in `.env.local` anpassen:
```env
NEXT_PUBLIC_SUPABASE_URL=deine-supabase-url
SUPABASE_SERVICE_ROLE_KEY=dein-service-role-key
RESEND_API_KEY=dein-resend-api-key
ADMIN_EMAIL=admin@beispiel.com
```

4. Entwicklungsserver starten:
```bash
npm run dev
```

## Datenbank-Setup

### Supabase-Projekt einrichten

1. Neues Projekt in Supabase erstellen
2. SQL-Editor öffnen
3. `setup-database.sql` ausführen

### Datenbank-Schema aktualisieren

Wenn Sie das Datenbankschema ändern:

1. Änderungen in `setup-database.sql` dokumentieren
2. Typen aktualisieren:
```bash
npx supabase gen types typescript --project-id dein-projekt-id > src/types/supabase.ts
```

## Testing

### Unit Tests ausführen
```bash
npm test
```

### E2E Tests ausführen
```bash
npm run test:e2e
```

## Code-Qualität

### Linting
```bash
npm run lint
```

### Formatierung
```bash
npm run format
```

## Deployment

### Vercel Deployment

1. Vercel-CLI installieren:
```bash
npm i -g vercel
```

2. Anmelden und deployen:
```bash
vercel login
vercel
```

### Umgebungsvariablen in Vercel

Folgende Variablen in Vercel konfigurieren:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `ADMIN_EMAIL`

## Best Practices

### Git-Workflow

1. Feature-Branch erstellen:
```bash
git checkout -b feature/neue-funktion
```

2. Commits mit aussagekräftigen Nachrichten:
```bash
git commit -m "feat: Füge neue Funktion hinzu

- Implementiere Feature X
- Füge Tests hinzu
- Aktualisiere Dokumentation"
```

3. Pull Request erstellen und Review anfordern

### Code-Style

- TypeScript für type-safety
- ESLint für Code-Qualität
- Prettier für Formatierung
- Tailwind CSS für Styling

### Sicherheit

- Keine sensiblen Daten committen
- Umgebungsvariablen für Secrets verwenden
- API-Routen validieren
- CORS konfigurieren
- Rate Limiting implementieren

## Troubleshooting

### Bekannte Probleme

1. **404 bei API-Routen**
   - Server neu starten
   - Cache löschen
   - CORS-Einstellungen prüfen

2. **Supabase-Verbindungsprobleme**
   - Umgebungsvariablen prüfen
   - Netzwerkverbindung testen
   - Service-Role-Key validieren

3. **E-Mail-Versand-Probleme**
   - Resend API-Key prüfen
   - E-Mail-Templates validieren
   - Logs überprüfen

### Debugging

1. API-Routen debuggen:
```typescript
console.log('Request:', request);
console.log('Response:', response);
```

2. Supabase-Queries debuggen:
```typescript
const { data, error } = await supabase
  .from('table')
  .select('*')
  .eq('column', value);
console.log('Data:', data);
console.log('Error:', error);
``` 