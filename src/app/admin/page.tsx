'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

// Typdefinition für eine Registrierung
interface Registration {
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

export default function AdminPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  
  // Erstelle einen Supabase-Client für den Browser
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Funktion zum Formatieren des Datums
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-CH') + ' ' + date.toLocaleTimeString('de-CH');
  };

  // Funktion zum Abrufen der Registrierungen
  const fetchRegistrations = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Prüfe, ob der Benutzer angemeldet ist
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/admin/login');
        return;
      }
      
      // Hole die Registrierungen direkt aus der Datenbank
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setRegistrations(data || []);
    } catch (err) {
      setError('Fehler beim Laden der Daten: ' + (err instanceof Error ? err.message : 'Unbekannter Fehler'));
    } finally {
      setLoading(false);
    }
  };

  // Abmelden
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  // Lade die Daten beim ersten Rendern
  useEffect(() => {
    fetchRegistrations();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">ZVV-Entdeckungsreise Anmeldungen</h1>
        <button
          onClick={handleLogout}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
        >
          Abmelden
        </button>
      </div>
      
      {loading ? (
        <p>Daten werden geladen...</p>
      ) : error ? (
        <div className="p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      ) : registrations.length === 0 ? (
        <p>Keine Anmeldungen gefunden.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border text-left">Datum</th>
                <th className="py-2 px-4 border text-left">Code</th>
                <th className="py-2 px-4 border text-left">Schule</th>
                <th className="py-2 px-4 border text-left">Kontaktperson</th>
                <th className="py-2 px-4 border text-left">E-Mail</th>
                <th className="py-2 px-4 border text-left">Telefon</th>
                <th className="py-2 px-4 border text-left">Klasse</th>
                <th className="py-2 px-4 border text-left">Schüler</th>
                <th className="py-2 px-4 border text-left">Begleiter</th>
                <th className="py-2 px-4 border text-left">Reisedatum</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((reg) => (
                <tr key={reg.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border">{formatDate(reg.created_at)}</td>
                  <td className="py-2 px-4 border">{reg.code}</td>
                  <td className="py-2 px-4 border">{reg.school}</td>
                  <td className="py-2 px-4 border">{reg.contact_person}</td>
                  <td className="py-2 px-4 border">{reg.email}</td>
                  <td className="py-2 px-4 border">{reg.phone_number}</td>
                  <td className="py-2 px-4 border">{reg.class}</td>
                  <td className="py-2 px-4 border">{reg.student_count}</td>
                  <td className="py-2 px-4 border">{reg.accompanist_count}</td>
                  <td className="py-2 px-4 border">{new Date(reg.travel_date).toLocaleDateString('de-CH')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 