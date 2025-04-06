// Typdefinitionen für die Codes-Tabelle
export interface Code {
  id: number;
  code: string;
  status: 'unused' | 'used';
  expires_at: string;
  created_at: string;
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

export interface Registration {
  id: string;
  code: string;
  school: string;
  student_count: number;
  travel_date: string;
  additional_notes?: string;
  email: string;
  class: string;
  contact_person: string;
  phone_number: string;
  accompanist_count: number;
  arrival_time: string;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
} 