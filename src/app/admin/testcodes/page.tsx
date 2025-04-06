"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw, PlusCircle, Trash2, CheckCircle2, XCircle, AlertTriangle, Clock } from "lucide-react";
import Link from "next/link";
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface TestCode {
  code: string;
  status: "unused" | "used";
  created_at: string;
  expires_at: string;
}

export default function TestcodesPage() {
  // Prüfen, ob wir in der Integrationsumgebung sind
  const [isIntegrationEnv, setIsIntegrationEnv] = useState(true); // Default-Wert
  const [testCodes, setTestCodes] = useState<TestCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingCodes, setGeneratingCodes] = useState(false);
  const [cleaningCodes, setCleaningCodes] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  // Überprüfe die Umgebung beim Laden der Seite
  useEffect(() => {
    // Wir überprüfen die Umgebung anhand der Hostname-Endung
    // In einer echten Anwendung würde man dies besser über eine API-Abfrage lösen
    const hostname = window.location.hostname;
    setIsIntegrationEnv(
      hostname.includes('localhost') || 
      hostname.includes('vercel.app') || 
      hostname.includes('-int') || 
      hostname === 'entdeckungsreise-int.zvv.ch'
    );
    
    fetchTestCodes();
  }, []);

  const fetchTestCodes = async () => {
    setLoading(true);
    setError(null);
    try {
      // Dynamische Basis-URL für den API-Endpunkt
      const baseUrl = window.location.origin;
      console.log('Verwende Basis-URL:', baseUrl);
      
      const response = await fetch(`${baseUrl}/api/admin/testcodes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Fehler beim Laden der Testcodes");
      }

      const data = await response.json();
      setTestCodes(data.testCodes || []);
    } catch (err) {
      console.error("Fehler beim Laden der Testcodes:", err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const generateTestCodes = async () => {
    setGeneratingCodes(true);
    setError(null);
    try {
      console.log('Testcode-Generierungsprozess gestartet');
      
      // Dynamische Basis-URL für den API-Endpunkt
      const baseUrl = window.location.origin;
      console.log('Verwende Basis-URL:', baseUrl);
      
      const response = await fetch(`${baseUrl}/api/admin/testcodes/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log('Generierungsanfrage abgeschickt, Statuscode:', response.status);
      
      const responseText = await response.text();
      let data;
      
      try {
        // Versuche JSON zu parsen, falls vorhanden
        data = responseText ? JSON.parse(responseText) : {};
        console.log('Generierungsantwort erhalten:', data);
      } catch (parseError) {
        console.error('Fehler beim Parsen der Antwort:', responseText);
        throw new Error(`Ungültige Antwort vom Server: ${responseText}`);
      }

      if (!response.ok) {
        throw new Error(data.error || `Fehler beim Generieren: ${response.status} ${response.statusText}`);
      }

      await fetchTestCodes(); // Aktualisiere die Liste nach dem Generieren
      
      toast({
        title: "Testcodes generiert",
        description: `${data.count || 0} neue Testcodes wurden erfolgreich generiert.`,
      });
    } catch (err) {
      console.error("Fehler beim Generieren der Testcodes:", err);
      setError(`Fehler beim Generieren der Testcodes: ${(err as Error).message}`);
      toast({
        title: "Fehler",
        description: `Fehler beim Generieren der Testcodes: ${(err as Error).message}`,
        variant: "destructive",
      });
    } finally {
      setGeneratingCodes(false);
    }
  };

  const cleanupOldTestCodes = async () => {
    setCleaningCodes(true);
    setError(null);
    try {
      console.log('Bereinigungsprozess gestartet');
      
      // Dynamische Basis-URL für den API-Endpunkt
      const baseUrl = window.location.origin;
      console.log('Verwende Basis-URL:', baseUrl);
      
      const response = await fetch(`${baseUrl}/api/admin/testcodes/cleanup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log('Bereinigungsanfrage abgeschickt, Statuscode:', response.status);
      
      const responseText = await response.text();
      let data;
      
      try {
        // Versuche JSON zu parsen, falls vorhanden
        data = responseText ? JSON.parse(responseText) : {};
        console.log('Bereinigungsantwort erhalten:', data);
      } catch (parseError) {
        console.error('Fehler beim Parsen der Antwort:', responseText);
        throw new Error(`Ungültige Antwort vom Server: ${responseText}`);
      }

      if (!response.ok) {
        throw new Error(data.error || `Fehler beim Bereinigen: ${response.status} ${response.statusText}`);
      }

      await fetchTestCodes(); // Aktualisiere die Liste nach der Bereinigung
      
      toast({
        title: "Testcodes bereinigt",
        description: `${data.count || 0} alte Testcodes wurden erfolgreich entfernt.`,
      });
    } catch (err) {
      console.error("Fehler beim Bereinigen der alten Testcodes:", err);
      setError(`Fehler beim Bereinigen der alten Testcodes: ${(err as Error).message}`);
      toast({
        title: "Fehler",
        description: `Fehler beim Bereinigen der alten Testcodes: ${(err as Error).message}`,
        variant: "destructive",
      });
    } finally {
      setCleaningCodes(false);
    }
  };

  const getStatusBadge = (status: string, expiresAt: string) => {
    const isExpired = new Date(expiresAt) < new Date();
    
    if (isExpired) {
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-500 flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          <span>Abgelaufen</span>
        </Badge>
      );
    }
    
    if (status === "unused") {
      return (
        <Badge variant="outline" className="bg-zvv-light-blue text-zvv-blue border-zvv-light-blue flex items-center gap-1">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Verfügbar</span>
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-zvv-light-blue text-zvv-blue border-zvv-light-blue flex items-center gap-1">
          <XCircle className="h-3.5 w-3.5" />
          <span>Verwendet</span>
        </Badge>
      );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd.MM.yyyy HH:mm', { locale: de });
  };

  // Wenn wir nicht in der Integrationsumgebung sind, zeigen wir eine Meldung an
  if (!isIntegrationEnv) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Testcodes</h1>
        <Alert variant="destructive">
          <AlertTitle>Nicht verfügbar</AlertTitle>
          <AlertDescription>
            Diese Funktion ist nur in der Integrationsumgebung verfügbar.
            Bitte wechseln Sie zu <a href="https://entdeckungsreise-int.zvv.ch/admin/testcodes" className="underline">entdeckungsreise-int.zvv.ch</a>, um Testcodes zu verwalten.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" asChild className="hover:bg-zvv-light-blue">
          <Link href="/admin" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Zurück</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Testcode Management</h1>
      </div>
      
      <div className="space-y-6">
        <Card className="bg-white border shadow-sm">
          <CardHeader>
            <CardTitle>Test-Umgebung</CardTitle>
            <CardDescription>Verwaltung von Testcodes für die Integrationsumgebung</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm">
              Testcodes werden automatisch im Format <code className="bg-zvv-light-blue px-1.5 py-0.5 rounded">INT_VALID_YYYYMMDD_XXXXX</code> generiert und sind 24 Stunden gültig.
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              <Button
                onClick={generateTestCodes}
                disabled={generatingCodes}
                className="bg-zvv-blue hover:bg-zvv-dark-blue text-white"
              >
                {generatingCodes ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generiere...
                  </>
                ) : (
                  <>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Testcodes generieren
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={cleanupOldTestCodes}
                disabled={cleaningCodes}
                className="border-zvv-blue text-zvv-blue hover:bg-zvv-light-blue"
              >
                {cleaningCodes ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Bereinige...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Alte Testcodes bereinigen
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={fetchTestCodes}
                disabled={loading}
                className="border-zvv-blue text-zvv-blue hover:bg-zvv-light-blue"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Aktualisieren
              </Button>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Fehler</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <RefreshCw className="h-8 w-8 text-zvv-blue animate-spin" />
                <span className="ml-2 text-zvv-blue">Lade Testcodes...</span>
              </div>
            ) : testCodes.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse table-zvv">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Status</th>
                      <th>Erstellt am</th>
                      <th>Gültig bis</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testCodes.map((code, index) => (
                      <tr key={index}>
                        <td className="font-mono">{code.code}</td>
                        <td>
                          {getStatusBadge(code.status, code.expires_at)}
                        </td>
                        <td>{formatDate(code.created_at)}</td>
                        <td>{formatDate(code.expires_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center text-gray-500">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Keine Testcodes gefunden.</p>
                <p className="text-sm mt-2">Generiere neue Testcodes mit dem Button oben.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 