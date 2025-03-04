# Einrichtung der Umgebungsvariablen in Vercel

Um die Anwendung erfolgreich auf Vercel zu deployen, müssen die folgenden Umgebungsvariablen konfiguriert werden:

## Erforderliche Umgebungsvariablen

| Variable | Beschreibung | Beispiel |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Die URL deines Supabase-Projekts | `https://abcdefghijklm.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Der Service-Role-Key deines Supabase-Projekts | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `RESEND_API_KEY` | Der API-Schlüssel für den Resend-E-Mail-Dienst | `re_123456789` |
| `EMAIL_FROM` | Die E-Mail-Adresse, die als Absender verwendet wird | `noreply@zvv.ch` |
| `ADMIN_EMAIL` | Die E-Mail-Adresse, an die Benachrichtigungen gesendet werden | `admin@example.com` |

## Anleitung zur Einrichtung

1. Gehe zum [Vercel Dashboard](https://vercel.com/dashboard)
2. Wähle dein Projekt aus
3. Klicke auf "Settings" in der oberen Navigation
4. Wähle "Environment Variables" aus dem Menü auf der linken Seite
5. Füge jede der oben genannten Variablen hinzu:
   - Klicke auf "Add New"
   - Gib den Namen der Variable ein (z.B. `NEXT_PUBLIC_SUPABASE_URL`)
   - Gib den Wert der Variable ein
   - Wähle die Umgebungen aus, in denen die Variable verfügbar sein soll (Production, Preview, Development)
   - Klicke auf "Save"
6. Wiederhole den Vorgang für alle erforderlichen Variablen
7. Nachdem alle Variablen hinzugefügt wurden, deploye die Anwendung erneut

## Fehlerbehebung

Wenn du nach dem Hinzufügen der Umgebungsvariablen immer noch Fehler erhältst:

1. Überprüfe, ob alle Variablen korrekt eingegeben wurden
2. Stelle sicher, dass du die Anwendung nach dem Hinzufügen der Variablen neu deployt hast
3. Überprüfe die Logs in Vercel, um spezifische Fehlermeldungen zu sehen

Bei Problemen mit der Supabase-Verbindung:
- Stelle sicher, dass die Supabase-URL korrekt ist und mit `https://` beginnt
- Überprüfe, ob der Service-Role-Key gültig ist
- Stelle sicher, dass die Tabellen `codes` und `registrations` in deiner Supabase-Datenbank existieren

Bei Problemen mit dem E-Mail-Versand:
- Überprüfe, ob der Resend API-Schlüssel gültig ist
- Stelle sicher, dass die E-Mail-Adressen korrekt formatiert sind 