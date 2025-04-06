"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Download, Search, RefreshCw, ChevronRight, Users, Calendar, School, FileSpreadsheet, Key } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from 'next/link';

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

// UserButton Komponente für den Header
const UserButton = () => {
  return (
    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
      <span className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full">
        <span className="flex h-full w-full items-center justify-center rounded-full bg-muted">
          <span className="font-medium">A</span>
        </span>
      </span>
    </Button>
  );
};

// ExportButton Komponente
const ExportButton = ({ registrations }: { registrations: Registration[] }) => {
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Anmeldungen');
    
    worksheet.columns = [
      { header: 'Code', key: 'code', width: 20 },
      { header: 'Schule', key: 'school', width: 30 },
      { header: 'Kontaktperson', key: 'contact_person', width: 25 },
      { header: 'E-Mail', key: 'email', width: 30 },
      { header: 'Telefon', key: 'phone_number', width: 20 },
      { header: 'Klasse', key: 'class', width: 15 },
      { header: 'Schüler', key: 'student_count', width: 10 },
      { header: 'Begleiter', key: 'accompanist_count', width: 10 },
      { header: 'Anmeldedatum', key: 'created_at', width: 20 },
      { header: 'Reisedatum', key: 'travel_date', width: 20 },
      { header: 'Ankunftszeit', key: 'arrival_time', width: 15 },
      { header: 'Anmerkungen', key: 'additional_notes', width: 40 },
    ];

    // Daten hinzufügen
    registrations.forEach(reg => {
      worksheet.addRow({
        ...reg,
        created_at: new Date(reg.created_at).toLocaleDateString('de-CH'),
        travel_date: new Date(reg.travel_date).toLocaleDateString('de-CH'),
      });
    });

    // Styling
    worksheet.getRow(1).font = { bold: true };
    
    // Excel-Datei herunterladen
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ZVV-Entdeckungsreise-Anmeldungen-${new Date().toISOString().split('T')[0]}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Button
      onClick={exportToExcel}
      variant="outline"
      size="sm"
      className="h-8 gap-1"
    >
      <Download className="h-3.5 w-3.5" />
      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Export</span>
    </Button>
  );
};

// AdminContent Komponente für den Inhalt der Admin-Seite
function AdminContent() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const searchParams = useSearchParams();

  const fetchRegistrations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/registrations');
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Fehler beim Laden der Anmeldungen');
      }
      const data = await response.json();
      console.log('Geladene Registrierungen:', data.registrations);
      console.log('Anzahl Registrierungen:', data.registrations.length);
      
      // Berechne Gesamtzahl der Schüler und Begleitpersonen
      const studentCount = data.registrations.reduce((sum: number, reg: Registration) => sum + reg.student_count, 0);
      const accompanistCount = data.registrations.reduce((sum: number, reg: Registration) => sum + reg.accompanist_count, 0);
      console.log('Gesamtzahl Schüler:', studentCount);
      console.log('Gesamtzahl Begleitpersonen:', accompanistCount);
      
      setRegistrations(data.registrations || []);
    } catch (err) {
      console.error('Fehler beim Laden der Anmeldungen:', err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();

    const regId = searchParams.get('reg');
    if (regId) {
      // Wenn eine Registrierungs-ID in der URL ist, öffne die Details
      const selectedReg = registrations.find(r => r.id === regId);
      if (selectedReg) {
        setSelectedRegistration(selectedReg);
      }
    }
  }, [searchParams]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Admin Dashboard</h1>
      
      {loading ? (
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-36 w-full" />
          <Skeleton className="h-36 w-full" />
          <Skeleton className="h-36 w-full" />
        </div>
      ) : error ? (
        <div className="p-4 bg-destructive/15 text-destructive rounded-md">
          {error}
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Registrierungen</CardTitle>
                <Users className="h-5 w-5 text-zvv-blue" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-zvv-blue" data-testid="registrations-count">
                  {registrations.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {registrations.length > 0 
                    ? `Letzte am ${new Date(registrations[0].created_at).toLocaleDateString('de-CH')}` 
                    : 'Keine Registrierungen vorhanden'}
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" size="sm" className="btn-zvv-outline">
                  Details
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Schulen</CardTitle>
                <School className="h-5 w-5 text-zvv-blue" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-zvv-blue" data-testid="student-count">
                  {registrations.reduce((sum, reg) => sum + reg.student_count, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Inklusive {registrations.reduce((sum, reg) => sum + reg.accompanist_count, 0)} Begleitpersonen
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" size="sm" className="btn-zvv-outline">
                  Details
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Kommende Fahrten</CardTitle>
                <Calendar className="h-5 w-5 text-zvv-blue" />
              </CardHeader>
              <CardContent>
                {(() => {
                  const upcomingTrips = registrations
                    .filter(reg => new Date(reg.travel_date) >= new Date())
                    .sort((a, b) => new Date(a.travel_date).getTime() - new Date(b.travel_date).getTime());
                  
                  console.log('Kommende Fahrten:', upcomingTrips);
                  console.log('Anzahl kommende Fahrten:', upcomingTrips.length);
                  
                  if (upcomingTrips.length === 0) {
                    return (
                      <>
                        <div className="text-2xl font-bold text-zvv-blue" data-testid="upcoming-trips-empty">-</div>
                        <p className="text-xs text-muted-foreground">
                          Keine bevorstehenden Reisen
                        </p>
                      </>
                    )
                  }
                  
                  return (
                    <>
                      <div className="text-2xl font-bold text-zvv-blue" data-testid="upcoming-trips-date">
                        {new Date(upcomingTrips[0].travel_date).toLocaleDateString('de-CH')}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {upcomingTrips[0].school}, {upcomingTrips[0].student_count} Schüler
                      </p>
                    </>
                  )
                })()}
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" size="sm" className="btn-zvv-outline">
                  Details
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold tracking-tight">Registrierungen</h2>
              <div className="flex gap-2">
                <ExportButton registrations={registrations} />
                <Button variant="outline" size="sm" className="h-8 gap-1 hover:text-zvv-blue" onClick={() => fetchRegistrations()}>
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Aktualisieren</span>
                </Button>
              </div>
            </div>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Schule</TableHead>
                    <TableHead>Klasse</TableHead>
                    <TableHead>Schüler</TableHead>
                    <TableHead>Reisedatum</TableHead>
                    <TableHead>Anmeldedatum</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-6">
                        Keine Registrierungen gefunden
                      </TableCell>
                    </TableRow>
                  ) : (
                    registrations.map((reg) => (
                      <TableRow key={reg.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedRegistration(reg)}>
                        <TableCell className="font-medium">{reg.code}</TableCell>
                        <TableCell>{reg.school}</TableCell>
                        <TableCell>{reg.class}</TableCell>
                        <TableCell>{reg.student_count} (+{reg.accompanist_count})</TableCell>
                        <TableCell>{new Date(reg.travel_date).toLocaleDateString('de-CH')}</TableCell>
                        <TableCell>{new Date(reg.created_at).toLocaleDateString('de-CH')}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ChevronRight className="h-4 w-4" />
                            <span className="sr-only">Details</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          
          <div className="mt-8 space-y-4">
            <h2 className="text-xl font-bold tracking-tight">Admin-Tools</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Link href="/admin/testcodes" className="flex items-center p-4 border rounded-md shadow-sm hover:bg-zvv-light-blue hover:border-zvv-blue transition-colors">
                <div className="mr-4 rounded-md bg-zvv-light-blue p-2">
                  <Key className="h-5 w-5 text-zvv-blue" />
                </div>
                <div>
                  <h3 className="font-semibold">Testcode-Management</h3>
                  <p className="text-sm text-muted-foreground">Testcodes für INT-Umgebung verwalten</p>
                </div>
              </Link>
            </div>
          </div>
        </>
      )}
      
      <Sheet open={!!selectedRegistration} onOpenChange={() => setSelectedRegistration(null)}>
        <SheetContent className="sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>Registrierungsdetails</SheetTitle>
            <SheetDescription>Details zur Anmeldung</SheetDescription>
          </SheetHeader>
          {selectedRegistration && (
            <div className="mt-6 space-y-6">
              <div className="space-y-1">
                <h3 className="text-sm font-medium">Grundinformationen</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Code</p>
                    <p className="font-medium">{selectedRegistration.code}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Anmeldedatum</p>
                    <p className="font-medium">
                      {new Date(selectedRegistration.created_at).toLocaleDateString('de-CH')}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-sm font-medium">Schulinformationen</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Schule</p>
                    <p className="font-medium">{selectedRegistration.school}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Klasse</p>
                    <p className="font-medium">{selectedRegistration.class}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Kontaktperson</p>
                    <p className="font-medium">{selectedRegistration.contact_person}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">E-Mail</p>
                    <p className="font-medium break-all">{selectedRegistration.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Telefon</p>
                    <p className="font-medium">{selectedRegistration.phone_number}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-sm font-medium">Reiseinformationen</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Reisedatum</p>
                    <p className="font-medium">
                      {new Date(selectedRegistration.travel_date).toLocaleDateString('de-CH')}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Ankunftszeit</p>
                    <p className="font-medium">
                      {selectedRegistration.arrival_time.slice(0, 5)} Uhr
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Anzahl Schüler</p>
                    <p className="font-medium">{selectedRegistration.student_count}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Anzahl Begleitpersonen</p>
                    <p className="font-medium">{selectedRegistration.accompanist_count}</p>
                  </div>
                </div>
              </div>
              
              {selectedRegistration.additional_notes && (
                <div className="space-y-1">
                  <h3 className="text-sm font-medium">Anmerkungen</h3>
                  <p className="text-sm border p-3 rounded-md bg-muted/50 whitespace-pre-wrap">
                    {selectedRegistration.additional_notes}
                  </p>
                </div>
              )}
            </div>
          )}
          <div className="mt-6">
            <SheetClose asChild>
              <Button variant="outline" className="w-full">Schließen</Button>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

// AdminPage Komponente mit Suspense
export default function AdminPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-6"><div className="h-8 w-8 rounded-full border-2 border-t-zvv-blue animate-spin"></div></div>}>
      <AdminContent />
    </Suspense>
  );
} 