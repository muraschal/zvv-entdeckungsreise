import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Lade Umgebungsvariablen VOR allen anderen Imports
const envPath = resolve(process.cwd(), '.env.local');
console.log('Versuche .env.local zu laden von:', envPath);
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('Fehler beim Laden der .env.local:', result.error);
  process.exit(1);
}

console.log('Geladene Umgebungsvariablen:', result.parsed);

// Importiere E-Mail-Funktionen NACH dem Laden der Umgebungsvariablen
import { sendConfirmationEmail, sendAdminNotificationEmail } from '../lib/email';

async function testEmails() {
  console.log('\nStarte E-Mail-Tests...\n');
  console.log('Verwende E-Mail-Konfiguration:');
  console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✓ Vorhanden' : '✗ Fehlt');
  console.log('EMAIL_FROM:', process.env.EMAIL_FROM);
  console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL);
  console.log('----------------------------------------\n');

  // Test 1: Bestätigungs-E-Mail
  console.log('Test 1: Sende Bestätigungs-E-Mail...');
  const confirmationResult = await sendConfirmationEmail({
    to: 'ict@zvv.zh.ch',
    school: 'Test Schule',
    studentCount: 25,
    travelDate: '2024-06-15',
    code: 'TEST123',
    className: '4. Klasse',
    contactPerson: 'Max Mustermann',
    phoneNumber: '044 123 45 67',
    accompanistCount: 2,
    arrivalTime: '09:00'
  });

  console.log('Bestätigungs-E-Mail Ergebnis:', confirmationResult);
  console.log('----------------------------------------\n');

  // Test 2: Admin-Benachrichtigung
  console.log('Test 2: Sende Admin-Benachrichtigung...');
  const adminResult = await sendAdminNotificationEmail({
    school: 'Test Schule',
    studentCount: 25,
    travelDate: '2024-06-15',
    code: 'TEST123',
    additionalNotes: 'Dies ist ein Test für die Admin-Benachrichtigung',
    className: '4. Klasse',
    contactPerson: 'Max Mustermann',
    phoneNumber: '044 123 45 67',
    accompanistCount: 2,
    arrivalTime: '09:00'
  });

  console.log('Admin-Benachrichtigung Ergebnis:', adminResult);
  console.log('----------------------------------------\n');

  // Zusammenfassung
  console.log('Test-Zusammenfassung:');
  console.log('Bestätigungs-E-Mail:', confirmationResult.success ? '✅ Erfolgreich' : '❌ Fehlgeschlagen');
  console.log('Admin-Benachrichtigung:', adminResult.success ? '✅ Erfolgreich' : '❌ Fehlgeschlagen');
}

// Führe die Tests aus
testEmails().catch(error => {
  console.error('Fehler beim Ausführen der Tests:', error);
  process.exit(1);
}); 