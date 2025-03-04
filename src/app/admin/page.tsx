'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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

  // Skeleton-Loader für die Tabelle
  const TableSkeleton = () => (
    <div className="space-y-2">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-full" />
      </div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-2xl font-bold">ZVV-Entdeckungsreise Anmeldungen</CardTitle>
            <CardDescription>
              Übersicht aller eingegangenen Anmeldungen für die ZVV-Entdeckungsreise
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={fetchRegistrations} disabled={loading}>
              Aktualisieren
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Abmelden
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <TableSkeleton />
          ) : error ? (
            <div className="p-4 bg-destructive/10 text-destructive rounded-md">
              {error}
            </div>
          ) : registrations.length === 0 ? (
            <div className="p-4 text-center">
              <p>Keine Anmeldungen gefunden.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Datum</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Schule</TableHead>
                    <TableHead>Kontaktperson</TableHead>
                    <TableHead>E-Mail</TableHead>
                    <TableHead>Telefon</TableHead>
                    <TableHead>Klasse</TableHead>
                    <TableHead className="text-right">Schüler</TableHead>
                    <TableHead className="text-right">Begleiter</TableHead>
                    <TableHead>Reisedatum</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrations.map((reg) => (
                    <TableRow key={reg.id}>
                      <TableCell className="font-medium">{formatDate(reg.created_at)}</TableCell>
                      <TableCell>{reg.code}</TableCell>
                      <TableCell>{reg.school}</TableCell>
                      <TableCell>{reg.contact_person}</TableCell>
                      <TableCell>{reg.email}</TableCell>
                      <TableCell>{reg.phone_number}</TableCell>
                      <TableCell>{reg.class}</TableCell>
                      <TableCell className="text-right">{reg.student_count}</TableCell>
                      <TableCell className="text-right">{reg.accompanist_count}</TableCell>
                      <TableCell>{new Date(reg.travel_date).toLocaleDateString('de-CH')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 