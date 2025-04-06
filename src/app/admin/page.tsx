"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Download, Search, RefreshCw, ChevronRight, Users, Calendar, School, FileSpreadsheet, Key, ShoppingCart, CheckCircle, Clock, AlertTriangle, PieChart, BarChart, LineChart } from 'lucide-react';
import ExcelJS from 'exceljs';
import Link from 'next/link';
import DetailView from '@/components/admin/DetailView';
import { Progress } from '@/components/ui/progress';
import { PieChart as RechartPieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

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

// Typdefinition für einen Code
interface Code {
  id: string;
  code: string;
  status: string;
  expires_at: string;
  created_at: string;
}

// AdminContent Komponente für den Inhalt der Admin-Seite
function AdminContent() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [codes, setCodes] = useState<Code[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCodes, setLoadingCodes] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorCodes, setErrorCodes] = useState<string | null>(null);
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

  const fetchCodes = async () => {
    setLoadingCodes(true);
    setErrorCodes(null);
    try {
      const response = await fetch('/api/admin/codes');
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Fehler beim Laden der Codes');
      }
      const data = await response.json();
      console.log('Geladene Codes:', data.codes);
      setCodes(data.codes || []);
    } catch (err) {
      console.error('Fehler beim Laden der Codes:', err);
      setErrorCodes((err as Error).message);
    } finally {
      setLoadingCodes(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
    fetchCodes();

    const regId = searchParams.get('reg');
    if (regId) {
      // Wenn eine Registrierungs-ID in der URL ist, öffne die Details
      const selectedReg = registrations.find(r => r.id === regId);
      if (selectedReg) {
        setSelectedRegistration(selectedReg);
      }
    }
  }, [searchParams]);

  // Code-Statistiken berechnen
  const totalCodes = codes.length;
  const usedCodes = codes.filter(code => code.status === 'used').length;
  const unusedCodes = codes.filter(code => code.status === 'unused').length;
  const expiredCodes = codes.filter(code => 
    code.status === 'unused' && new Date(code.expires_at) < new Date()
  ).length;
  const availableCodes = unusedCodes - expiredCodes;
  
  // Finde den nächsten ablaufenden Code
  const today = new Date();
  const futureCodes = codes.filter(code => 
    code.status === 'unused' && new Date(code.expires_at) > today
  ).sort((a, b) => new Date(a.expires_at).getTime() - new Date(b.expires_at).getTime());
  
  const nextExpiringCode = futureCodes.length > 0 ? futureCodes[0] : null;
  const daysUntilExpiry = nextExpiringCode 
    ? Math.ceil((new Date(nextExpiringCode.expires_at).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) 
    : 0;

  // Daten für das Kuchendiagramm vorbereiten
  const pieChartData = [
    { name: 'Verfügbar', value: availableCodes, color: '#22c55e' },
    { name: 'Verwendet', value: usedCodes, color: '#3b82f6' },
    { name: 'Abgelaufen', value: expiredCodes, color: '#f59e0b' }
  ];

  // Daten für das Bestellungsverlaufsdiagramm vorbereiten
  const prepareRegistrationChartData = () => {
    if (registrations.length === 0) return [];

    // Kopieren und sortieren der Registrierungen nach Reisedatum
    const sortedRegistrations = [...registrations]
      .sort((a, b) => new Date(a.travel_date).getTime() - new Date(b.travel_date).getTime());

    // Gruppiere Registrierungen nach Monat des Reisedatums
    const monthlyData: Record<string, { count: number, students: number }> = {};
    
    sortedRegistrations.forEach(reg => {
      const date = new Date(reg.travel_date);
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { count: 0, students: 0 };
      }
      
      monthlyData[monthKey].count += 1;
      monthlyData[monthKey].students += reg.student_count;
    });

    // Umwandlung in Array für Recharts
    return Object.entries(monthlyData).map(([month, data]) => {
      const [year, monthNum] = month.split('-');
      const monthNames = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
      const monthName = monthNames[parseInt(monthNum) - 1];
      
      return {
        name: `${monthName} ${year}`,
        Bestellungen: data.count,
        Schüler: data.students
      };
    }).sort((a, b) => {
      // Sortiere nach Jahr und Monat für chronologische Darstellung
      const [aMonth, aYear] = a.name.split(' ');
      const [bMonth, bYear] = b.name.split(' ');
      
      const aYearNum = parseInt(aYear);
      const bYearNum = parseInt(bYear);
      
      if (aYearNum !== bYearNum) {
        return aYearNum - bYearNum;
      }
      
      const monthNames = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
      return monthNames.indexOf(aMonth) - monthNames.indexOf(bMonth);
    });
  };

  const registrationChartData = prepareRegistrationChartData();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      
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
                <div className="flex justify-between text-xs mt-1">
                  <span>Schüler gesamt</span>
                  <span className="text-sm font-medium">
                    {registrations.reduce((sum, reg) => sum + reg.accompanist_count, 0)} Begleitpersonen
                  </span>
                </div>
                
                {registrations.length > 0 && (
                  <>
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span>∅ Klassengröße</span>
                      <span className="font-semibold text-sm">
                        {Math.round(registrations.reduce((sum, reg) => sum + reg.student_count, 0) / registrations.length)}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span>∅ Begleiter</span>
                      <span className="font-semibold text-sm">
                        {Math.round(registrations.reduce((sum, reg) => sum + reg.accompanist_count, 0) / registrations.length)}
                      </span>
                    </div>
                  </>
                )}
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
          
          {/* Bestellungsverlauf-Diagramm */}
          {registrationChartData.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold tracking-tight mb-4">Reiseverlauf</h2>
              <Card className="shadow-sm p-4">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Entwicklung der Reisen im Zeitverlauf</CardTitle>
                  <LineChart className="h-5 w-5 text-zvv-blue" />
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={registrationChartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 40 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="name" 
                          angle={-30} 
                          textAnchor="end" 
                          height={70}
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
                        <YAxis yAxisId="right" orientation="right" stroke="#22c55e" />
                        <Tooltip 
                          formatter={(value, name) => [value, name === 'Bestellungen' ? 'Bestellungen' : 'Schüler']}
                          labelFormatter={(label) => `Reisezeitraum: ${label}`}
                          contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '6px', border: '1px solid #eaeaea' }}
                        />
                        <Legend />
                        <Area 
                          yAxisId="left" 
                          type="monotone"
                          dataKey="Bestellungen" 
                          stroke="#3b82f6" 
                          fill="#3b82f680" 
                          name="Bestellungen"
                          activeDot={{ r: 6 }}
                        />
                        <Area 
                          yAxisId="right" 
                          type="monotone"
                          dataKey="Schüler" 
                          stroke="#22c55e" 
                          fill="#22c55e80"
                          name="Anzahl Schüler" 
                          activeDot={{ r: 6 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Code-Statistiken */}
          <div className="mt-8">
            <h2 className="text-xl font-bold tracking-tight mb-4">Code-Übersicht</h2>
            {loadingCodes ? (
              <div className="grid gap-6 md:grid-cols-2">
                <Skeleton className="h-36 w-full" />
                <Skeleton className="h-36 w-full" />
              </div>
            ) : errorCodes ? (
              <div className="p-4 bg-destructive/15 text-destructive">
                {errorCodes}
              </div>
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Große Code-Anzeige */}
                  <Card className="shadow-sm flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-lg font-medium">BESTELLCODES TOTAL</CardTitle>
                      <Key className="h-6 w-6 text-zvv-blue" />
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-center items-center">
                      <div className="text-6xl font-bold text-zvv-blue mt-3" data-testid="total-codes">
                        {totalCodes}
                      </div>
                      <div className="mt-4 text-sm text-center">
                        <span className="inline-flex items-center bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                          <CheckCircle className="h-3.5 w-3.5 mr-1" />
                          {availableCodes} verfügbar
                        </span>
                        <span className="inline-flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium ml-2">
                          <CheckCircle className="h-3.5 w-3.5 mr-1" />
                          {usedCodes} verwendet
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Großes Ablaufdatum */}
                  <Card className="shadow-sm flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-lg font-medium">Nächster Ablauf</CardTitle>
                      <Clock className="h-6 w-6 text-zvv-blue" />
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-center items-center">
                      {nextExpiringCode ? (
                        <>
                          <div className="text-6xl font-bold text-zvv-blue">
                            {new Date(nextExpiringCode.expires_at).toLocaleDateString('de-CH')}
                          </div>
                          <div className="text-lg font-medium text-zvv-blue mt-2 mb-2">
                            in {daysUntilExpiry} {daysUntilExpiry === 1 ? 'Tag' : 'Tagen'}
                          </div>
                          <div className="mt-1">
                            <div className="px-2 py-1 text-xs font-mono rounded text-center overflow-hidden text-ellipsis bg-zvv-light-blue">
                              {nextExpiringCode.code}
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-6xl font-bold text-zvv-blue">-</div>
                          <p className="text-md mt-1">
                            Keine aktiven Codes vorhanden
                          </p>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mt-4">
                  <Link href="/admin/codes">
                    <Button variant="outline" size="sm" className="btn-zvv-outline">
                      Alle Codes anzeigen
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </>
            )}
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
                  <p className="text-sm text-muted-foreground">Bestellungen anzeigen und als Excel-Datei exportieren</p>
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
          
          {selectedRegistration && (
            <DetailView 
              data={selectedRegistration} 
              open={true} 
              onOpenChange={(open) => !open && setSelectedRegistration(null)}
              isCode={false}
            />
          )}
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