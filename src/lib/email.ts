import { Resend } from 'resend';

// Initialisiere den Resend-Client
const resend = new Resend(process.env.RESEND_API_KEY);

// E-Mail-Konfiguration
const FROM_EMAIL = {
  from: process.env.EMAIL_FROM || 'noreply@zvv.ch',
  name: 'ZVV-Entdeckungsreise'
};

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'ict@zvv.zh.ch';

// Interface für die E-Mail-Parameter
interface EmailParams {
  to: string;
  school: string;
  studentCount: number;
  travelDate: string;
  code: string;
  className: string;
  contactPerson: string;
  phoneNumber: string;
  accompanistCount: number;
  arrivalTime: string;
}

// Interface für die Admin-Benachrichtigung
interface AdminNotificationParams {
  school: string;
  studentCount: number;
  travelDate: string;
  code: string;
  additionalNotes?: string;
  className: string;
  contactPerson: string;
  phoneNumber: string;
  accompanistCount: number;
  arrivalTime: string;
}

// Funktion zum Senden der Bestätigungs-E-Mail
export async function sendConfirmationEmail({
  to,
  school,
  studentCount,
  travelDate,
  code,
  className,
  contactPerson,
  phoneNumber,
  accompanistCount,
  arrivalTime
}: EmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: `${FROM_EMAIL.name} <${FROM_EMAIL.from}>`,
      to: [to],
      replyTo: 'schulinfo@zvv.ch',
      subject: `Ticketbestellung ZVV-Entdeckungsreise`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <p>Danke für Ihre Ticketbestellung. Ihre Tickets für die ZVV-Entdeckungsreise werden Ihnen in den nächsten Tagen an Ihre Schulhaus-Adresse verschickt.</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h2 style="margin-top: 0;">Ihre Bestelldaten:</h2>
            <ul style="padding-left: 20px;">
              <li><strong>Schule:</strong> ${school}</li>
              <li><strong>Klasse:</strong> ${className}</li>
              <li><strong>Kontaktperson:</strong> ${contactPerson}</li>
              <li><strong>Telefon:</strong> ${phoneNumber}</li>
              <li><strong>Anzahl Schüler:</strong> ${studentCount}</li>
              <li><strong>Anzahl Begleiter:</strong> ${accompanistCount}</li>
              <li><strong>Reisedatum:</strong> ${new Date(travelDate).toLocaleDateString('de-CH')}</li>
              <li><strong>Ankunftszeit:</strong> ${arrivalTime}</li>
              <li><strong>Code:</strong> ${code}</li>
            </ul>
          </div>
          
          <p>Bei Fragen können Sie uns jederzeit kontaktieren.</p>
          
          <p>Mit freundlichen Grüssen<br>Ihr ZVV-Team</p>
        </div>
      `
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

// Funktion zum Senden der Admin-Benachrichtigung
export async function sendAdminNotificationEmail({
  school,
  studentCount,
  travelDate,
  code,
  additionalNotes,
  className,
  contactPerson,
  phoneNumber,
  accompanistCount,
  arrivalTime
}: AdminNotificationParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: `${FROM_EMAIL.name} <${FROM_EMAIL.from}>`,
      to: [ADMIN_EMAIL],
      subject: `Neue Anmeldung zur ZVV-Entdeckungsreise: ${school}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Neue Anmeldung zur ZVV-Entdeckungsreise</h2>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Anmeldedaten:</h3>
            <ul style="padding-left: 20px;">
              <li><strong>Schule:</strong> ${school}</li>
              <li><strong>Klasse:</strong> ${className}</li>
              <li><strong>Kontaktperson:</strong> ${contactPerson}</li>
              <li><strong>Telefon:</strong> ${phoneNumber}</li>
              <li><strong>E-Mail:</strong> ${contactPerson}</li>
              <li><strong>Anzahl Schüler:</strong> ${studentCount}</li>
              <li><strong>Anzahl Begleiter:</strong> ${accompanistCount}</li>
              <li><strong>Reisedatum:</strong> ${new Date(travelDate).toLocaleDateString('de-CH')}</li>
              <li><strong>Ankunftszeit:</strong> ${arrivalTime}</li>
              <li><strong>Code:</strong> ${code}</li>
              ${additionalNotes ? `<li><strong>Zusätzliche Notizen:</strong> ${additionalNotes}</li>` : ''}
            </ul>
          </div>
          
          <p>Diese E-Mail wurde automatisch generiert.</p>
        </div>
      `
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