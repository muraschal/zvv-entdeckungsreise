'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Download, Search, RefreshCw, ChevronRight } from 'lucide-react';
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="space-x-2">
          <Button onClick={fetchRegistrations} disabled={loading} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Aktualisieren
          </Button>
          <Button 
            onClick={() => exportToExcel().catch(console.error)}
            variant="outline"
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(getStats()).map(([key, value]) => (
            <Card key={key}>
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

      <Card>
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
                    <div className="min-w-[950px]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[120px]">Anmeldedatum</TableHead>
                            <TableHead className="w-[180px]">Code</TableHead>
                            <TableHead className="w-[180px]">Schule</TableHead>
                            <TableHead className="w-[200px]">Kontaktperson</TableHead>
                            <TableHead className="w-[80px] text-right">Schüler</TableHead>
                            <TableHead className="w-[80px] text-right">Begleiter</TableHead>
                            <TableHead className="w-[100px]">Details</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {regs.map((reg) => (
                            <TableRow key={reg.id}>
                              <TableCell className="font-medium">
                                {new Date(reg.created_at).toLocaleDateString('de-CH')}
                              </TableCell>
                              <TableCell className="truncate max-w-[180px]" title={reg.code}>
                                {reg.code}
                              </TableCell>
                              <TableCell className="truncate max-w-[180px]" title={reg.school}>
                                {reg.school}
                              </TableCell>
                              <TableCell>
                                <div className="font-medium truncate max-w-[200px]" title={reg.contact_person}>
                                  {reg.contact_person}
                                </div>
                                <div className="text-sm text-muted-foreground truncate max-w-[200px]" title={reg.email}>
                                  {reg.email}
                                </div>
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
                                  <ChevronRight className="ml-1 h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Sheet open={!!selectedRegistration} onOpenChange={() => setSelectedRegistration(null)}>
        <SheetContent className="sm:max-w-md px-6">
          <SheetHeader className="pb-4 border-b">
            <SheetTitle>Anmeldungsdetails</SheetTitle>
            <SheetDescription>
              Details der Anmeldung von {selectedRegistration?.school}
            </SheetDescription>
          </SheetHeader>
          {selectedRegistration && (
            <div className="py-6 space-y-8 overflow-y-auto">
              <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1.5">Code</div>
                  <div className="truncate font-medium" title={selectedRegistration.code}>{selectedRegistration.code}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1.5">Anmeldedatum</div>
                  <div className="font-medium">{new Date(selectedRegistration.created_at).toLocaleDateString('de-CH')}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1.5">Schule</div>
                  <div className="font-medium">{selectedRegistration.school}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1.5">Klasse</div>
                  <div className="font-medium">{selectedRegistration.class}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1.5">Kontaktperson</div>
                  <div className="font-medium">{selectedRegistration.contact_person}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1.5">E-Mail</div>
                  <div className="truncate font-medium" title={selectedRegistration.email}>{selectedRegistration.email}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1.5">Telefon</div>
                  <div className="font-medium">{selectedRegistration.phone_number}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1.5">Reisedatum</div>
                  <div className="font-medium">{new Date(selectedRegistration.travel_date).toLocaleDateString('de-CH')}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1.5">Ankunftszeit</div>
                  <div className="font-medium">{selectedRegistration.arrival_time}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1.5">Anzahl Schüler</div>
                  <div className="font-medium">{selectedRegistration.student_count}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1.5">Anzahl Begleiter</div>
                  <div className="font-medium">{selectedRegistration.accompanist_count}</div>
                </div>
              </div>
              {selectedRegistration.additional_notes && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-2">Zusätzliche Anmerkungen</div>
                  <div className="p-4 bg-muted rounded-md">
                    {selectedRegistration.additional_notes}
                  </div>
                </div>
              )}
              <div className="pt-4 mt-auto">
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