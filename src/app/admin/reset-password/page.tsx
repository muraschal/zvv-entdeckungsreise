'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  
  // Erstelle einen Supabase-Client für den Browser
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Überprüfe, ob der Benutzer über einen gültigen Reset-Link kommt
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error || !data.session) {
        setError('Ungültiger oder abgelaufener Reset-Link. Bitte fordere einen neuen Link an.');
      }
    };
    
    checkSession();
  }, [supabase.auth]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    // Validiere Passwörter
    if (password !== confirmPassword) {
      setError('Die Passwörter stimmen nicht überein');
      setLoading(false);
      return;
    }
    
    if (password.length < 8) {
      setError('Das Passwort muss mindestens 8 Zeichen lang sein');
      setLoading(false);
      return;
    }
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) throw error;
      
      setMessage('Dein Passwort wurde erfolgreich zurückgesetzt. Du wirst zur Anmeldeseite weitergeleitet...');
      
      // Kurze Verzögerung, damit der Benutzer die Erfolgsmeldung sehen kann
      setTimeout(() => {
        router.push('/admin/login');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Passwort zurücksetzen</h1>
      
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
      
      <form onSubmit={handleResetPassword}>
        <div className="mb-4">
          <label htmlFor="password" className="block font-medium mb-1">Neues Passwort</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
            minLength={8}
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="confirm-password" className="block font-medium mb-1">Passwort bestätigen</label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
            minLength={8}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading || !!error}
          className="w-full bg-[#0479cc] hover:bg-[#035999] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {loading ? 'Wird gespeichert...' : 'Passwort zurücksetzen'}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <button 
          onClick={() => router.push('/admin/login')}
          className="text-[#0479cc] hover:underline"
        >
          Zurück zur Anmeldung
        </button>
      </div>
    </div>
  );
} 