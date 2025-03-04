'use client';

import { useState, useEffect } from 'react';

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
  const [apiKey, setApiKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
      const response = await fetch(`/api/admin?key=${apiKey}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Fehler beim Abrufen der Daten');
      }
      
      setRegistrations(data.data);
      setIsAuthenticated(true);
    } catch (err) {
      setError('Fehler beim Laden der Daten: ' + (err instanceof Error ? err.message : 'Unbekannter Fehler'));
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Authentifizierung durchführen
  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRegistrations();
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">ZVV-Entdeckungsreise Admin</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleAuthenticate} className="mb-4">
          <div className="mb-4">
            <label htmlFor="apiKey" className="block font-bold mb-1">Admin-API-Schlüssel</label>
            <input
              type="password"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-lg min-w-[160px] bg-[#0479cc] hover:bg-[#035999] text-white font-bold tracking-[0.2px] h-10 px-4 py-2 focus:shadow-[0px_0px_3px_2px_rgba(4,121,204,.32)]"
          >
            Anmelden
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">ZVV-Entdeckungsreise Anmeldungen</h1>
        <button
          onClick={() => setIsAuthenticated(false)}
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