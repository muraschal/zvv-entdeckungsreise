# E-Mail-Templates

## Bestätigungs-E-Mail

### Template-Variablen
```typescript
{
  school: string;
  contactPerson: string;
  travelDate: string;
  studentCount: number;
  accompanistCount: number;
  arrivalTime: string;
  code: string;
}
```

### HTML-Template
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>ZVV-Entdeckungsreise - Anmeldebestätigung</title>
</head>
<body>
  <h1>Bestätigung Ihrer Anmeldung zur ZVV-Entdeckungsreise</h1>
  
  <p>Sehr geehrte/r {contactPerson}</p>
  
  <p>Vielen Dank für Ihre Anmeldung zur ZVV-Entdeckungsreise. Hier sind Ihre Anmeldedaten:</p>
  
  <ul>
    <li>Schule: {school}</li>
    <li>Reisedatum: {travelDate}</li>
    <li>Anzahl Schüler: {studentCount}</li>
    <li>Anzahl Begleitpersonen: {accompanistCount}</li>
    <li>Ankunftszeit: {arrivalTime}</li>
    <li>Verwendeter Code: {code}</li>
  </ul>
  
  <p>Bitte bewahren Sie diese E-Mail für Ihre Unterlagen auf.</p>
  
  <p>Mit freundlichen Grüßen<br>
  Ihr ZVV-Team</p>
</body>
</html>
```

## Admin-Benachrichtigung

### Template-Variablen
```typescript
{
  school: string;
  contactPerson: string;
  email: string;
  phoneNumber: string;
  travelDate: string;
  studentCount: number;
  accompanistCount: number;
  arrivalTime: string;
  code: string;
  additionalNotes?: string;
}
```

### HTML-Template
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Neue Anmeldung zur ZVV-Entdeckungsreise</title>
</head>
<body>
  <h1>Neue Anmeldung eingegangen</h1>
  
  <h2>Anmeldedaten:</h2>
  <ul>
    <li>Schule: {school}</li>
    <li>Kontaktperson: {contactPerson}</li>
    <li>E-Mail: {email}</li>
    <li>Telefon: {phoneNumber}</li>
    <li>Reisedatum: {travelDate}</li>
    <li>Anzahl Schüler: {studentCount}</li>
    <li>Anzahl Begleitpersonen: {accompanistCount}</li>
    <li>Ankunftszeit: {arrivalTime}</li>
    <li>Verwendeter Code: {code}</li>
  </ul>
  
  {additionalNotes && (
    <>
      <h3>Zusätzliche Bemerkungen:</h3>
      <p>{additionalNotes}</p>
    </>
  )}
</body>
</html>
```

## E-Mail-Versand

### Verwendung
```typescript
import { sendConfirmationEmail, sendAdminNotificationEmail } from '@/lib/email';

// Bestätigungs-E-Mail senden
const { success, error } = await sendConfirmationEmail({
  to: email,
  school,
  contactPerson,
  travelDate,
  studentCount,
  accompanistCount,
  arrivalTime,
  code
});

// Admin-Benachrichtigung senden
const { success, error } = await sendAdminNotificationEmail({
  adminEmail: process.env.ADMIN_EMAIL,
  school,
  contactPerson,
  email,
  phoneNumber,
  travelDate,
  studentCount,
  accompanistCount,
  arrivalTime,
  code,
  additionalNotes
});
```

## Fehlerbehandlung

```typescript
if (!emailSuccess) {
  console.error('Fehler beim E-Mail-Versand:', emailError);
  // Fehler protokollieren, aber Prozess fortsetzen
}
```

## E-Mail-Styling

Die E-Mails verwenden ein responsives Design mit folgenden CSS-Klassen:

```css
/* Container */
.email-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

/* Überschriften */
h1 {
  color: #1a56db;
  font-size: 24px;
  margin-bottom: 20px;
}

/* Listen */
ul {
  padding-left: 20px;
  margin-bottom: 20px;
}

/* Links */
a {
  color: #1a56db;
  text-decoration: none;
}

/* Responsive Design */
@media screen and (max-width: 600px) {
  .email-container {
    width: 100%;
    padding: 10px;
  }
}
``` 