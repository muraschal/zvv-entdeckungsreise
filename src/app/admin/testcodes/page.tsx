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

interface TestCode {
  code: string;
  status: "unused" | "used";
  created_at: string;
  expires_at: string;
}

export default function TestcodesPage() {
  const [testCodes, setTestCodes] = useState<TestCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingCodes, setGeneratingCodes] = useState(false);
  const [cleaningCodes, setCleaningCodes] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
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
        <Badge variant="outline" className="bg-[#e6ecf9] text-[#003399] border-[#c7d4ee] flex items-center gap-1">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Verfügbar</span>
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-[#e6ecf9] text-[#003399] border-[#c7d4ee] flex items-center gap-1">
          <XCircle className="h-3.5 w-3.5" />
          <span>Verwendet</span>
        </Badge>
      );
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" asChild>
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
              Testcodes werden automatisch im Format <code className="bg-[#e6ecf9] px-1.5 py-0.5 rounded">INT_VALID_YYYYMMDD_XXXXX</code> generiert und sind 24 Stunden gültig.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={generateTestCodes} 
                disabled={generatingCodes} 
                className="flex items-center gap-2 bg-[#003399] hover:bg-[#00297a]"
              >
                {generatingCodes ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <PlusCircle className="h-4 w-4" />
                )}
                Neue Testcodes generieren
              </Button>
              <Button 
                onClick={cleanupOldTestCodes} 
                disabled={cleaningCodes} 
                variant="outline"
                className="flex items-center gap-2 border-gray-300 hover:bg-gray-50 hover:text-[#003399]"
              >
                {cleaningCodes ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Alte Codes bereinigen
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Testcode Status</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={fetchTestCodes}
                className="h-8 gap-1 hover:text-[#003399]"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Aktualisieren</span>
              </Button>
            </CardTitle>
            <CardDescription>Liste aller Testcodes und deren aktueller Status</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Fehler</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {loading ? (
              <div className="text-center p-6">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">Lade Testcodes...</p>
              </div>
            ) : testCodes.length === 0 ? (
              <div className="text-center p-8 border rounded-md border-dashed">
                <p className="text-muted-foreground mb-2">Keine Testcodes vorhanden</p>
                <Button 
                  onClick={generateTestCodes} 
                  disabled={generatingCodes}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 hover:text-[#003399]"
                >
                  <PlusCircle className="h-4 w-4" />
                  Testcodes generieren
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left font-medium p-2 w-[250px]">Code</th>
                      <th className="text-left font-medium p-2 w-[100px]">Status</th>
                      <th className="text-left font-medium p-2 w-[150px]">Erstellt am</th>
                      <th className="text-left font-medium p-2 w-[150px]">Gültig bis</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testCodes.map((code) => (
                      <tr key={code.code} className="border-b hover:bg-muted/40">
                        <td className="p-2 font-mono text-xs truncate max-w-[250px]" title={code.code}>
                          {code.code}
                        </td>
                        <td className="p-2">
                          {getStatusBadge(code.status, code.expires_at)}
                        </td>
                        <td className="p-2">{new Date(code.created_at).toLocaleString('de-CH')}</td>
                        <td className="p-2">{new Date(code.expires_at).toLocaleString('de-CH')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 