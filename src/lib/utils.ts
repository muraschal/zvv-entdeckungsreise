import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generiert einen zufälligen alphanumerischen Code
 * @param length Die Länge des zu generierenden Codes (Standard: 8)
 * @returns Der generierte Code
 */
export function generateRandomCode(length: number = 8): string {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Ohne ähnlich aussehende Zeichen (0, O, 1, I)
  let result = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  
  return result;
}

/**
 * Berechnet ein Ablaufdatum für einen Code
 * @param yearsFromNow Anzahl der Jahre ab jetzt (Standard: 3)
 * @returns Das berechnete Ablaufdatum als ISO-String
 */
export function calculateExpiryDate(yearsFromNow: number = 3): string {
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + yearsFromNow);
  return expiryDate.toISOString();
}
