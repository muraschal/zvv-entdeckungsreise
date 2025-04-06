import { createAdminClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    // Prüfe, ob dies die Integrationsumgebung ist (sonst nur in auth-geschützten Admin-Bereichen)
    const isIntegrationEnv = process.env.VERCEL_ENV === 'preview' || process.env.NODE_ENV === 'development';
    
    // Erstelle Supabase-Admin-Client
    const supabase = createAdminClient();
    
    // Hole die Registrierungen aus der Datenbank
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error loading registrations:', error);
      return NextResponse.json({ error: 'Fehler beim Laden der Anmeldungen' }, { status: 500 });
    }
    
    return NextResponse.json({ 
      registrations: data || [],
      environment: isIntegrationEnv ? 'integration' : 'production'
    });
  } catch (err) {
    console.error('Error in registrations API:', err);
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 });
  }
} 