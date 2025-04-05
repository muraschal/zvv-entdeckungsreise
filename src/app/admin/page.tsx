"use client";

import { useState, useEffect } from 'react';
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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Admin Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registrierungen</CardTitle>
            <Users className="h-5 w-5 text-zvv-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zvv-blue">{registrations.length}</div>
            <p className="text-xs text-muted-foreground">
              Letzte am {registrations.length > 0 ? new Date(registrations[0].created_at).toLocaleDateString('de-CH') : '-'}
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
            <div className="text-2xl font-bold text-zvv-blue">
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
              
              if (upcomingTrips.length === 0) {
                return (
                  <>
                    <div className="text-2xl font-bold text-zvv-blue">-</div>
                    <p className="text-xs text-muted-foreground">
                      Keine bevorstehenden Reisen
                    </p>
                  </>
                )
              }
              
              return (
                <>
                  <div className="text-2xl font-bold text-zvv-blue">
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