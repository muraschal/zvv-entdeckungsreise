import { createClient } from '@supabase/supabase-js';

// Supabase-Konfiguration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Erstelle einen Supabase-Client mit den Umgebungsvariablen
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase; 