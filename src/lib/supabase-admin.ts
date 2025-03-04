import supabase from './supabase';
import { generateRandomCode, calculateExpiryDate } from './utils';
import { Code } from '../types/index';

/**
 * Generiert einen neuen Ticketcode und speichert ihn in der Datenbank
 * @returns Der generierte Code oder null im Fehlerfall
 */
export async function generateAndStoreCode(): Promise<Code | null> {
  try {
    // Generiere einen zufälligen Code
    const code = generateRandomCode();
    
    // Berechne das Ablaufdatum (3 Jahre ab jetzt)
    const expiryDate = calculateExpiryDate();
    
    // Speichere den Code in der Datenbank
    const { data, error } = await supabase
      .from('codes')
      .insert({
        code,
        status: 'unused',
        expires_at: expiryDate
      })
      .select()
      .single();
    
    if (error) {
      console.error('Fehler beim Speichern des Codes:', error);
      return null;
    }
    
    return data as Code;
  } catch (error) {
    console.error('Unerwarteter Fehler:', error);
    return null;
  }
}

/**
 * Validiert einen Ticketcode
 * @param code Der zu validierende Code
 * @returns Ein Objekt mit dem Validierungsergebnis
 */
export async function validateCode(code: string): Promise<{ valid: boolean; message: string; data?: Code }> {
  try {
    // Suche den Code in der Datenbank
    const { data, error } = await supabase
      .from('codes')
      .select('*')
      .eq('code', code)
      .single();
    
    // Fehlerbehandlung bei der Datenbankabfrage
    if (error) {
      return { valid: false, message: 'Ungültiger Code.' };
    }
    
    // Überprüfe, ob der Code bereits verwendet wurde
    if (data.status === 'used') {
      return { valid: false, message: 'Dieser Code wurde bereits verwendet.' };
    }
    
    // Überprüfe, ob der Code abgelaufen ist
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return { valid: false, message: 'Dieser Code ist abgelaufen.' };
    }
    
    // Code ist gültig
    return { valid: true, message: 'Code ist gültig.', data: data as Code };
  } catch (error) {
    console.error('Unerwarteter Fehler:', error);
    return { valid: false, message: 'Ein unerwarteter Fehler ist aufgetreten.' };
  }
}

/**
 * Löst einen Ticketcode ein
 * @param code Der einzulösende Code
 * @returns Ein Objekt mit dem Einlöseergebnis
 */
export async function redeemCode(code: string): Promise<{ success: boolean; message: string }> {
  try {
    // Validiere den Code zuerst
    const validation = await validateCode(code);
    
    if (!validation.valid) {
      return { success: false, message: validation.message };
    }
    
    // Aktualisiere den Status des Codes auf 'used'
    const { error } = await supabase
      .from('codes')
      .update({ status: 'used' })
      .eq('id', validation.data!.id);
    
    // Fehlerbehandlung bei der Aktualisierung
    if (error) {
      console.error('Fehler beim Einlösen des Codes:', error);
      return { success: false, message: 'Fehler beim Einlösen des Codes.' };
    }
    
    // Code erfolgreich eingelöst
    return { success: true, message: 'Code erfolgreich eingelöst.' };
  } catch (error) {
    console.error('Unerwarteter Fehler:', error);
    return { success: false, message: 'Ein unerwarteter Fehler ist aufgetreten.' };
  }
} 