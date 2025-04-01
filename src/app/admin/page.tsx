'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Download, Search, RefreshCw, LogOut } from 'lucide-react';
import * as XLSX from 'xlsx';
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
  const [searchTerm, setSearchTerm] = useState('');
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

  const exportToExcel = () => {
    const exportData = registrations.map(reg => ({
      'Anmeldedatum': formatDate(reg.created_at),
      'Code': reg.code,
      'Schule': reg.school,
      'Klasse': reg.class,
      'Kontaktperson': reg.contact_person,
      'E-Mail': reg.email,
      'Telefon': reg.phone_number,
      'Schüler': reg.student_count,
      'Begleiter': reg.accompanist_count,
      'Reisedatum': new Date(reg.travel_date).toLocaleDateString('de-CH'),
      'Ankunftszeit': reg.arrival_time,
      'Zusätzliche Notizen': reg.additional_notes || ''
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Anmeldungen');
    
    // Setze UTF-8 Encoding
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ZVV-Anmeldungen-${new Date().toISOString().split('T')[0]}.xlsx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  // Lade die Daten beim ersten Rendern
  useEffect(() => {
    fetchRegistrations();
  }, []);

  const getStats = () => {
    const totalStudents = registrations.reduce((sum, reg) => sum + reg.student_count, 0);
    const totalAccompanists = registrations.reduce((sum, reg) => sum + reg.accompanist_count, 0);
    const uniqueSchools = new Set(registrations.map(reg => reg.school)).size;
    
    return { totalStudents, totalAccompanists, uniqueSchools, totalRegistrations: registrations.length };
  };

  const filteredRegistrations = registrations.filter(reg => 
    reg.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedRegistrations = filteredRegistrations.reduce((groups, reg) => {
    const date = new Date(reg.travel_date).toLocaleDateString('de-CH');
    if (!groups[date]) groups[date] = [];
    groups[date].push(reg);
    return groups;
  }, {} as Record<string, Registration[]>);

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">ZVV-Entdeckungsreise</h1>
          <p className="text-muted-foreground">Verwaltung der Anmeldungen</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={fetchRegistrations} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Aktualisieren
          </Button>
          <Button variant="outline" onClick={exportToExcel}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Abmelden
          </Button>
        </div>
      </div>

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(getStats()).map(([key, value]) => (
            <Card key={key} className="bg-white shadow-sm">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{value}</div>
                <div className="text-muted-foreground">
                  {key === 'totalStudents' && 'Schüler'}
                  {key === 'totalAccompanists' && 'Begleiter'}
                  {key === 'uniqueSchools' && 'Schulen'}
                  {key === 'totalRegistrations' && 'Anmeldungen'}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="bg-white shadow-sm">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Anmeldungen</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Suchen..."
                className="pl-10 max-w-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <TableSkeleton />
          ) : error ? (
            <div className="p-4 bg-destructive/10 text-destructive rounded-md">
              {error}
            </div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="p-4 text-center">
              <p>Keine Anmeldungen gefunden.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedRegistrations).map(([date, regs]) => (
                <div key={date} className="rounded-md border">
                  <div className="bg-muted px-4 py-2 font-medium">
                    Reisedatum: {date} ({regs.length} Anmeldungen)
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Anmeldedatum</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>Schule</TableHead>
                        <TableHead>Kontaktperson</TableHead>
                        <TableHead className="text-right">Schüler</TableHead>
                        <TableHead className="text-right">Begleiter</TableHead>
                        <TableHead>Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {regs.map((reg) => (
                        <TableRow key={reg.id}>
                          <TableCell className="font-medium">
                            {new Date(reg.created_at).toLocaleDateString('de-CH')}
                          </TableCell>
                          <TableCell>{reg.code}</TableCell>
                          <TableCell>{reg.school}</TableCell>
                          <TableCell>
                            <div>{reg.contact_person}</div>
                            <div className="text-sm text-muted-foreground">{reg.email}</div>
                          </TableCell>
                          <TableCell className="text-right">{reg.student_count}</TableCell>
                          <TableCell className="text-right">{reg.accompanist_count}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 