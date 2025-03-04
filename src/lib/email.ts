import { Resend } from 'resend';

// Initialisiere Resend mit dem API-Key aus den Umgebungsvariablen
const resend = new Resend(process.env.RESEND_API_KEY);

// E-Mail-Absender
const FROM_EMAIL = process.env.EMAIL_FROM || 'noreply@zvv.ch';

/**
 * Sendet eine Bestätigungs-E-Mail nach erfolgreicher Anmeldung
 */
export async function sendConfirmationEmail({
  to,
  school,
  studentCount,
  travelDate,
  code
}: {
  to: string;
  school: string;
  studentCount: number;
  travelDate: string;
  code: string;
}) {
  try {
    // Formatiere das Datum für die Anzeige
    const formattedDate = new Date(travelDate).toLocaleDateString('de-CH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: `Bestätigung deiner Anmeldung zur ZVV-Entdeckungsreise`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0066cc;">ZVV-Entdeckungsreise Anmeldung bestätigt</h1>
          
          <p>Vielen Dank für deine Anmeldung zur ZVV-Entdeckungsreise!</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h2 style="margin-top: 0;">Deine Anmeldedaten:</h2>
            <ul style="padding-left: 20px;">
              <li><strong>Schule:</strong> ${school}</li>
              <li><strong>Anzahl Schüler:</strong> ${studentCount}</li>
              <li><strong>Gewünschtes Reisedatum:</strong> ${formattedDate}</li>
              <li><strong>Verwendeter Code:</strong> ${code}</li>
            </ul>
          </div>
          
          <p>Wir werden uns in Kürze mit weiteren Informationen bei dir melden.</p>
          
          <p>Bei Fragen kannst du uns jederzeit kontaktieren.</p>
          
          <p style="margin-top: 30px;">
            Mit freundlichen Grüßen,<br>
            Das ZVV-Entdeckungsreise Team
          </p>
          
          <div style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
            <p>Dies ist eine automatisch generierte E-Mail. Bitte antworte nicht auf diese Nachricht.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Fehler beim Senden der E-Mail:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Unerwarteter Fehler beim Senden der E-Mail:', error);
    return { success: false, error };
  }
}

/**
 * Sendet eine Benachrichtigungs-E-Mail an den Administrator
 */
export async function sendAdminNotificationEmail({
  adminEmail,
  school,
  studentCount,
  travelDate,
  code,
  additionalNotes
}: {
  adminEmail: string;
  school: string;
  studentCount: number;
  travelDate: string;
  code: string;
  additionalNotes?: string;
}) {
  try {
    // Formatiere das Datum für die Anzeige
    const formattedDate = new Date(travelDate).toLocaleDateString('de-CH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [adminEmail],
      subject: `Neue Anmeldung zur ZVV-Entdeckungsreise: ${school}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0066cc;">Neue ZVV-Entdeckungsreise Anmeldung</h1>
          
          <p>Es wurde eine neue Anmeldung zur ZVV-Entdeckungsreise eingereicht:</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h2 style="margin-top: 0;">Anmeldedaten:</h2>
            <ul style="padding-left: 20px;">
              <li><strong>Schule:</strong> ${school}</li>
              <li><strong>Anzahl Schüler:</strong> ${studentCount}</li>
              <li><strong>Gewünschtes Reisedatum:</strong> ${formattedDate}</li>
              <li><strong>Verwendeter Code:</strong> ${code}</li>
              ${additionalNotes ? `<li><strong>Zusätzliche Anmerkungen:</strong> ${additionalNotes}</li>` : ''}
            </ul>
          </div>
          
          <p>Bitte überprüfe die Anmeldung und kontaktiere die Schule für weitere Absprachen.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Fehler beim Senden der Admin-Benachrichtigung:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Unerwarteter Fehler beim Senden der Admin-Benachrichtigung:', error);
    return { success: false, error };
  }
} 