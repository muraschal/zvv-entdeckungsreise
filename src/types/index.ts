// Typdefinitionen für die Codes-Tabelle
export interface Code {
  id: string;
  code: string;
  status: 'unused' | 'used';
  created_at: string;
  expires_at: string | null;
}

// Typdefinitionen für die API-Anfragen und -Antworten
export interface ValidateRequest {
  code: string;
}

export interface ValidateResponse {
  valid: boolean;
  message: string;
}

export interface RedeemRequest {
  code: string;
}

export interface RedeemResponse {
  success: boolean;
  message: string;
} 