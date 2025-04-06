import { createAdminClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/admin/testcodes
 * Gibt alle Testcodes zurück (INT_*)
 */
export async function GET(request: NextRequest) {
  try {
    // Prüfe, ob dies die Integrationsumgebung ist
    const isIntegrationEnv = process.env.VERCEL_ENV === 'preview' || process.env.NODE_ENV === 'development';
    
    if (!isIntegrationEnv) {
      return NextResponse.json({ error: 'Nur in der Integrationsumgebung verfügbar' }, { status: 403 });
    }
    
    // Erstelle Supabase-Admin-Client
    const supabase = createAdminClient();
    
    // Hole die Testcodes aus der Datenbank
    const { data, error } = await supabase
      .from('codes')
      .select('*')
      .like('code', 'INT_%')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error loading test codes:', error);
      return NextResponse.json({ error: 'Fehler beim Laden der Testcodes' }, { status: 500 });
    }
    
    return NextResponse.json({ 
      testCodes: data || [],
      environment: 'integration'
    });
  } catch (err) {
    console.error('Error in test codes API:', err);
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 });
  }
} 