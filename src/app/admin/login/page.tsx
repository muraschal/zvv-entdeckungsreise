'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);
  const router = useRouter();
  
  // Erstelle einen Supabase-Client für den Browser
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Erfolgreich eingeloggt
      router.push('/admin');
      router.refresh(); // Aktualisiere die Seite, um den neuen Auth-Status zu reflektieren
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    if (!email) {
      setError('Bitte gib deine E-Mail-Adresse ein');
      setLoading(false);
      return;
    }
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });
      
      if (error) throw error;
      
      setMessage('Eine E-Mail zum Zurücksetzen des Passworts wurde gesendet. Bitte überprüfe deinen Posteingang.');
      setShowResetForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">ZVV-Entdeckungsreise Admin</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {message && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {message}
        </div>
      )}
      
      {!showResetForm ? (
        <>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="email" className="block font-medium mb-1">E-Mail</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block font-medium mb-1">Passwort</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0479cc] hover:bg-[#035999] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {loading ? 'Anmeldung...' : 'Anmelden'}
            </button>
          </form>
          
          <div className="mt-4 text-center">
            <button 
              onClick={() => setShowResetForm(true)}
              className="text-[#0479cc] hover:underline"
            >
              Passwort vergessen?
            </button>
          </div>
        </>
      ) : (
        <>
          <form onSubmit={handleResetPassword}>
            <div className="mb-4">
              <label htmlFor="reset-email" className="block font-medium mb-1">E-Mail für Passwort-Reset</label>
              <input
                type="email"
                id="reset-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0479cc] hover:bg-[#035999] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {loading ? 'Senden...' : 'Passwort-Reset-Link senden'}
            </button>
          </form>
          
          <div className="mt-4 text-center">
            <button 
              onClick={() => setShowResetForm(false)}
              className="text-[#0479cc] hover:underline"
            >
              Zurück zur Anmeldung
            </button>
          </div>
        </>
      )}
    </div>
  );
} 