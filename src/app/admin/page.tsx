'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Download, Search, RefreshCw, LogOut, ChevronDown } from 'lucide-react';
import ExcelJS from 'exceljs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";

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
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
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

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Anmeldungen');

    // Definiere die Spalten
    worksheet.columns = [
      { header: 'Anmeldedatum', key: 'created_at', width: 20 },
      { header: 'Code', key: 'code', width: 15 },
      { header: 'Schule', key: 'school', width: 30 },
      { header: 'Klasse', key: 'class', width: 15 },
      { header: 'Kontaktperson', key: 'contact_person', width: 25 },
      { header: 'E-Mail', key: 'email', width: 30 },
      { header: 'Telefon', key: 'phone_number', width: 20 },
      { header: 'Schüler', key: 'student_count', width: 10 },
      { header: 'Begleiter', key: 'accompanist_count', width: 10 },
      { header: 'Reisedatum', key: 'travel_date', width: 15 },
      { header: 'Ankunftszeit', key: 'arrival_time', width: 15 },
      { header: 'Zusätzliche Notizen', key: 'additional_notes', width: 40 }
    ];

    // Style für den Header
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    // Füge die Daten hinzu
    registrations.forEach(reg => {
      worksheet.addRow({
        created_at: new Date(reg.created_at).toLocaleDateString('de-CH'),
        code: reg.code,
        school: reg.school,
        class: reg.class,
        contact_person: reg.contact_person,
        email: reg.email,
        phone_number: reg.phone_number,
        student_count: reg.student_count,
        accompanist_count: reg.accompanist_count,
        travel_date: new Date(reg.travel_date).toLocaleDateString('de-CH'),
        arrival_time: reg.arrival_time,
        additional_notes: reg.additional_notes || ''
      });
    });

    // Rahmen für alle Zellen
    worksheet.eachRow({ includeEmpty: true }, row => {
      row.eachCell({ includeEmpty: true }, cell => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });

    // Generiere die Excel-Datei
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
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
          <Button 
            variant="outline" 
            onClick={() => {
              exportToExcel().catch(console.error);
            }}
          >
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
                className="pl-10 w-[300px]"
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
                  <div className="bg-muted px-4 py-2 font-medium flex items-center justify-between">
                    <span>Reisedatum: {date}</span>
                    <span className="text-muted-foreground text-sm">{regs.length} Anmeldungen</span>
                  </div>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[180px]">Anmeldedatum</TableHead>
                          <TableHead className="w-[120px]">Code</TableHead>
                          <TableHead className="w-[200px]">Schule</TableHead>
                          <TableHead className="w-[250px]">Kontaktperson</TableHead>
                          <TableHead className="w-[100px] text-right">Schüler</TableHead>
                          <TableHead className="w-[100px] text-right">Begleiter</TableHead>
                          <TableHead className="w-[100px]">Details</TableHead>
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
                              <div className="font-medium">{reg.contact_person}</div>
                              <div className="text-sm text-muted-foreground">{reg.email}</div>
                            </TableCell>
                            <TableCell className="text-right">{reg.student_count}</TableCell>
                            <TableCell className="text-right">{reg.accompanist_count}</TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setSelectedRegistration(reg)}
                                className="flex items-center"
                              >
                                Details
                                <ChevronDown className="ml-1 h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Sheet open={!!selectedRegistration} onOpenChange={() => setSelectedRegistration(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Anmeldungsdetails</SheetTitle>
            <SheetDescription>
              Details der Anmeldung von {selectedRegistration?.school}
            </SheetDescription>
          </SheetHeader>
          {selectedRegistration && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Code</div>
                  <div>{selectedRegistration.code}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Anmeldedatum</div>
                  <div>{new Date(selectedRegistration.created_at).toLocaleDateString('de-CH')}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Schule</div>
                  <div>{selectedRegistration.school}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Klasse</div>
                  <div>{selectedRegistration.class}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Kontaktperson</div>
                  <div>{selectedRegistration.contact_person}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">E-Mail</div>
                  <div>{selectedRegistration.email}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Telefon</div>
                  <div>{selectedRegistration.phone_number}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Reisedatum</div>
                  <div>{new Date(selectedRegistration.travel_date).toLocaleDateString('de-CH')}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Ankunftszeit</div>
                  <div>{selectedRegistration.arrival_time}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Anzahl Schüler</div>
                  <div>{selectedRegistration.student_count}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Anzahl Begleiter</div>
                  <div>{selectedRegistration.accompanist_count}</div>
                </div>
              </div>
              {selectedRegistration.additional_notes && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Zusätzliche Notizen</div>
                  <div className="mt-1 text-sm">{selectedRegistration.additional_notes}</div>
                </div>
              )}
              <div className="pt-4">
                <SheetClose asChild>
                  <Button className="w-full">Schließen</Button>
                </SheetClose>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
} 