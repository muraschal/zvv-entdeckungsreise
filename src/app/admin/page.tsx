"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Download, Search, RefreshCw, ChevronRight, Users, Calendar, School, FileSpreadsheet } from 'lucide-react';
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

const AdminPage = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
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
        setRegistrations(data.registrations || []);
      } catch (err) {
        console.error('Fehler beim Laden der Anmeldungen:', err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

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
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <UserButton />
      </div>
      
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full max-w-md" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      ) : error ? (
        <div className="p-4 mt-4 bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      ) : (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="overview">Übersicht</TabsTrigger>
            <TabsTrigger value="registrations">Anmeldungen</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="bg-white border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center justify-between">
                    <span>Anmeldungen</span>
                    <Users className="h-5 w-5 text-[#003399]" />
                  </CardTitle>
                  <CardDescription>Gesamtzahl der Anmeldungen</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-[#003399]">{registrations.length}</div>
                  <p className="text-sm text-muted-foreground mt-1">Letzte am {registrations.length > 0 ? new Date(registrations[0].created_at).toLocaleDateString('de-CH') : '-'}</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center justify-between">
                    <span>Schüler</span>
                    <School className="h-5 w-5 text-[#003399]" />
                  </CardTitle>
                  <CardDescription>Gesamtzahl der angemeldeten Schüler</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-[#003399]">
                    {registrations.reduce((sum, reg) => sum + reg.student_count, 0)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Inklusive {registrations.reduce((sum, reg) => sum + reg.accompanist_count, 0)} Begleitpersonen</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center justify-between">
                    <span>Nächste Reise</span>
                    <Calendar className="h-5 w-5 text-[#003399]" />
                  </CardTitle>
                  <CardDescription>Datum der nächsten Entdeckungsreise</CardDescription>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const upcomingTrips = registrations
                      .filter(reg => new Date(reg.travel_date) >= new Date())
                      .sort((a, b) => new Date(a.travel_date).getTime() - new Date(b.travel_date).getTime());
                    
                    if (upcomingTrips.length === 0) {
                      return (
                        <>
                          <div className="text-4xl font-bold text-[#003399]">-</div>
                          <p className="text-sm text-muted-foreground mt-1">Keine bevorstehenden Reisen</p>
                        </>
                      )
                    }
                    
                    return (
                      <>
                        <div className="text-4xl font-bold text-[#003399]">
                          {new Date(upcomingTrips[0].travel_date).toLocaleDateString('de-CH')}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{upcomingTrips[0].school}, {upcomingTrips[0].student_count} Schüler</p>
                      </>
                    )
                  })()}
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Neueste Anmeldungen</CardTitle>
                <CardDescription>Die 5 neuesten Anmeldungen im System</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[950px] text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left font-medium p-2 w-[180px]">Code</th>
                        <th className="text-left font-medium p-2 w-[220px]">Schule</th>
                        <th className="text-left font-medium p-2 w-[120px]">Anmeldedatum</th>
                        <th className="text-left font-medium p-2 w-[120px]">Reisedatum</th>
                        <th className="text-left font-medium p-2 w-[80px]">Schüler</th>
                        <th className="text-right font-medium p-2 w-[100px]"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {registrations.slice(0, 5).map((reg) => (
                        <tr key={reg.id} className="border-b hover:bg-muted/40">
                          <td className="p-2 truncate max-w-[180px]" title={reg.code}>{reg.code}</td>
                          <td className="p-2 truncate max-w-[220px]" title={reg.school}>{reg.school}</td>
                          <td className="p-2">{new Date(reg.created_at).toLocaleDateString('de-CH')}</td>
                          <td className="p-2">{new Date(reg.travel_date).toLocaleDateString('de-CH')}</td>
                          <td className="p-2">{reg.student_count}</td>
                          <td className="p-2 text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              asChild
                            >
                              <Link href={`/admin?reg=${reg.id}`} className="flex items-center">
                                Details
                                <ChevronRight className="ml-1 h-4 w-4" />
                              </Link>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin/testcodes">
                    Testcodes verwalten
                  </Link>
                </Button>
                <Button variant="default" size="sm" asChild>
                  <Link href="#registrations">
                    Alle anzeigen
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="registrations" className="space-y-6" id="registrations">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center justify-between">
                  <span>Anmeldungen</span>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1"
                      onClick={() => window.location.reload()}
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Aktualisieren</span>
                    </Button>
                    <ExportButton registrations={registrations} />
                  </div>
                </CardTitle>
                <CardDescription>Alle Anmeldungen für die ZVV-Entdeckungsreise</CardDescription>
                <div className="mt-4 w-full max-w-sm">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Suche nach Schule, Code..."
                      className="pl-8"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[950px] text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left font-medium p-2 w-[180px]">Code</th>
                        <th className="text-left font-medium p-2 w-[220px]">Schule</th>
                        <th className="text-left font-medium p-2 w-[180px]">Kontaktperson</th>
                        <th className="text-left font-medium p-2 w-[120px]">Anmeldedatum</th>
                        <th className="text-left font-medium p-2 w-[120px]">Reisedatum</th>
                        <th className="text-left font-medium p-2 w-[80px]">Schüler</th>
                        <th className="text-right font-medium p-2 w-[100px]"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {registrations.map((reg) => (
                        <tr key={reg.id} className="border-b hover:bg-muted/40">
                          <td className="p-2 truncate max-w-[180px]" title={reg.code}>{reg.code}</td>
                          <td className="p-2 truncate max-w-[220px]" title={reg.school}>{reg.school}</td>
                          <td className="p-2 truncate max-w-[180px]" title={reg.contact_person}>{reg.contact_person}</td>
                          <td className="p-2">{new Date(reg.created_at).toLocaleDateString('de-CH')}</td>
                          <td className="p-2">{new Date(reg.travel_date).toLocaleDateString('de-CH')}</td>
                          <td className="p-2">{reg.student_count}</td>
                          <td className="p-2 text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedRegistration(reg)}
                              className="flex items-center"
                            >
                              Details
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
      
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
};

export default AdminPage; 