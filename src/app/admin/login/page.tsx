'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          ZVV-Entdeckungsreise
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Die ZVV-Entdeckungsreise bietet Schulklassen die Möglichkeit, den öffentlichen Verkehr spielerisch zu entdecken und zu erleben.&rdquo;
            </p>
            <footer className="text-sm">ZVV-Team</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {showResetForm ? 'Passwort zurücksetzen' : 'Admin-Bereich'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {showResetForm 
                ? 'Gib deine E-Mail-Adresse ein, um einen Reset-Link zu erhalten' 
                : 'Gib deine Anmeldedaten ein, um auf den Admin-Bereich zuzugreifen'}
            </p>
          </div>
          
          <div className="grid gap-6">
            {error && (
              <div className="p-3 bg-destructive/15 text-destructive rounded-md text-sm">
                {error}
              </div>
            )}
            
            {message && (
              <div className="p-3 bg-green-100 text-green-700 rounded-md text-sm">
                {message}
              </div>
            )}
            
            {!showResetForm ? (
              <form onSubmit={handleLogin}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label className="text-sm font-medium" htmlFor="email">
                      E-Mail
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@zvv.ch"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className="h-9"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium" htmlFor="password">
                        Passwort
                      </Label>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      className="h-9"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <svg
                          className="mr-2 h-4 w-4 animate-spin"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                        Anmeldung...
                      </>
                    ) : (
                      'Anmelden'
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPassword}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label className="text-sm font-medium" htmlFor="reset-email">
                      E-Mail
                    </Label>
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="name@zvv.ch"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className="h-9"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <svg
                          className="mr-2 h-4 w-4 animate-spin"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                        Senden...
                      </>
                    ) : (
                      'Passwort-Reset-Link senden'
                    )}
                  </Button>
                </div>
              </form>
            )}
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {!showResetForm ? 'Oder' : ''}
                </span>
              </div>
            </div>
            
            {!showResetForm ? (
              <Button 
                variant="outline" 
                onClick={() => setShowResetForm(true)}
                className="w-full"
              >
                Passwort vergessen?
              </Button>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => setShowResetForm(false)}
                className="w-full"
              >
                Zurück zur Anmeldung
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 