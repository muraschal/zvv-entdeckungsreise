import { createAdminClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/admin/codes
 * Gibt alle Codes zurück (sowohl Produktions- als auch Testcodes)
 */
export async function GET(request: NextRequest) {
  try {
    // Keine Umgebungsprüfung - diese Route ist in allen Umgebungen verfügbar
    
    // Erstelle Supabase-Admin-Client
    const supabase = createAdminClient();
    
    // Hole alle Codes aus der Datenbank
    const { data, error } = await supabase
      .from('codes')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error loading codes:', error);
      return NextResponse.json({ error: 'Fehler beim Laden der Codes' }, { status: 500 });
    }
    
    // Ermittle die aktuelle Umgebung für die Antwort
    const isIntegrationEnv = process.env.VERCEL_ENV === 'preview' || process.env.NODE_ENV === 'development';
    
    return NextResponse.json({ 
      codes: data || [],
      environment: isIntegrationEnv ? 'integration' : 'production'
    });
  } catch (err) {
    console.error('Error in codes API:', err);
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 });
  }
} 