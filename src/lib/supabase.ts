import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// Prüfe, ob die Umgebungsvariablen vorhanden sind
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('supabaseUrl is required. Please set NEXT_PUBLIC_SUPABASE_URL environment variable.');
}

if (!supabaseKey) {
  throw new Error('supabaseKey is required. Please set SUPABASE_SERVICE_ROLE_KEY environment variable.');
}

// Erstelle den Supabase-Client
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export default supabase; 