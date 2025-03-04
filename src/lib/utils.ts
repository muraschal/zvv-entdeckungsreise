/**
 * Generiert einen zufälligen Ticketcode
 * @param length Die Länge des zu generierenden Codes
 * @returns Ein zufälliger Ticketcode
 */
export function generateRandomCode(length: number = 8): string {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Ohne ähnlich aussehende Zeichen (I, O, 0, 1)
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
}

/**
 * Berechnet das Ablaufdatum eines Codes (3 Jahre ab dem aktuellen Datum)
 * @returns Das Ablaufdatum als ISO-String
 */
export function calculateExpiryDate(): string {
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 3);
  return expiryDate.toISOString();
}

/**
 * Überprüft, ob ein Datum abgelaufen ist
 * @param dateString Das zu überprüfende Datum als ISO-String
 * @returns true, wenn das Datum abgelaufen ist, sonst false
 */
export function isExpired(dateString: string | null): boolean {
  if (!dateString) return false;
  
  const expiryDate = new Date(dateString);
  const currentDate = new Date();
  
  return expiryDate < currentDate;
} 