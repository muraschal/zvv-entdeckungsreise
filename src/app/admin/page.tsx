"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Download, Search, RefreshCw, ChevronRight, Users, Calendar, School, FileSpreadsheet, Key, ShoppingCart } from 'lucide-react';
import ExcelJS from 'exceljs';
import Link from 'next/link';
import DetailView from '@/components/admin/DetailView';

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
        <div className="p-4 bg-destructive/15 text-destructive">
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
                <Link href="/admin/bestellungen">
                  <Button variant="outline" size="sm" className="btn-zvv-outline">
                    Details
                  </Button>
                </Link>
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
                <Link href="/admin/bestellungen">
                  <Button variant="outline" size="sm" className="btn-zvv-outline">
                    Details
                  </Button>
                </Link>
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
                <Link href="/admin/bestellungen">
                  <Button variant="outline" size="sm" className="btn-zvv-outline">
                    Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
          
          <div className="mt-8 space-y-4">
            <h2 className="text-xl font-bold tracking-tight">Admin-Tools</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Link href="/admin/bestellungen" className="flex items-center p-4 border shadow-sm hover:bg-zvv-light-blue hover:border-zvv-blue transition-colors">
                <div className="mr-4 bg-zvv-light-blue p-2">
                  <ShoppingCart className="h-5 w-5 text-zvv-blue" />
                </div>
                <div>
                  <h3 className="font-semibold">Bestellungen</h3>
                  <p className="text-sm text-muted-foreground">Alle Bestellungen anzeigen</p>
                </div>
              </Link>
              
              <Link href="/admin/codes" className="flex items-center p-4 border shadow-sm hover:bg-zvv-light-blue hover:border-zvv-blue transition-colors">
                <div className="mr-4 bg-zvv-light-blue p-2">
                  <Key className="h-5 w-5 text-zvv-blue" />
                </div>
                <div>
                  <h3 className="font-semibold">Code-Übersicht</h3>
                  <p className="text-sm text-muted-foreground">Alle Codes anzeigen</p>
                </div>
              </Link>
              
              <Link href="/admin/testcodes" className="flex items-center p-4 border shadow-sm hover:bg-zvv-light-blue hover:border-zvv-blue transition-colors">
                <div className="mr-4 bg-zvv-light-blue p-2">
                  <FileSpreadsheet className="h-5 w-5 text-zvv-blue" />
                </div>
                <div>
                  <h3 className="font-semibold">Testcode-Management</h3>
                  <p className="text-sm text-muted-foreground">Testcodes für INT-Umgebung verwalten</p>
                </div>
              </Link>
            </div>
          </div>
          
          <DetailView 
            data={selectedRegistration} 
            open={!!selectedRegistration} 
            onOpenChange={(open) => !open && setSelectedRegistration(null)}
            isCode={false}
          />
        </>
      )}
    </div>
  );
}

// AdminPage Komponente mit Suspense
export default function AdminPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-6"><div className="h-8 w-8 border-2 border-t-zvv-blue animate-spin"></div></div>}>
      <AdminContent />
    </Suspense>
  );
} 