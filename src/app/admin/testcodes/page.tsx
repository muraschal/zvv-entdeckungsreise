'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface TestCode {
  code: string;
  status: 'unused' | 'used';
  created_at: string;
  expires_at: string;
}

export default function TestCodePage() {
  const [testCodes, setTestCodes] = useState<TestCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchTestCodes = async () => {
    setLoading(true);
    setError('');
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/admin/login');
        return;
      }
      
      const { data, error } = await supabase
        .from('codes')
        .select('*')
        .like('code', 'INT_%')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setTestCodes(data || []);
    } catch (err) {
      setError('Fehler beim Laden der Testcodes: ' + (err instanceof Error ? err.message : 'Unbekannter Fehler'));
    } finally {
      setLoading(false);
    }
  };

  const generateNewTestCodes = async () => {
    setLoading(true);
    setError('');
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
        return;
      }

      const response = await fetch('/api/admin/testcodes/generate', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        console.error('API error:', responseData);
        throw new Error(responseData.error || 'Fehler beim Generieren der Testcodes');
      }
      
      await fetchTestCodes();
    } catch (err) {
      console.error('Generate error:', err);
      setError('Fehler beim Generieren der Testcodes: ' + (err instanceof Error ? err.message : 'Unbekannter Fehler'));
    } finally {
      setLoading(false);
    }
  };

  const cleanupOldTestCodes = async () => {
    setLoading(true);
    setError('');
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
        return;
      }

      const response = await fetch('/api/admin/testcodes/cleanup', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        console.error('API error:', responseData);
        throw new Error(responseData.error || 'Fehler beim Bereinigen der Testcodes');
      }
      
      await fetchTestCodes();
    } catch (err) {
      console.error('Cleanup error:', err);
      setError('Fehler beim Bereinigen der Testcodes: ' + (err instanceof Error ? err.message : 'Unbekannter Fehler'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestCodes();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Testcode-Verwaltung</h1>
        <div className="space-x-2">
          <Button onClick={cleanupOldTestCodes} variant="outline" size="sm">
            Alte Codes bereinigen
          </Button>
          <Button onClick={generateNewTestCodes} size="sm">
            Neue Testcodes generieren
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Fehler</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Aktive Testcodes</CardTitle>
          <CardDescription>
            Übersicht aller aktiven Testcodes für die INT-Umgebung
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[700px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Code</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead className="w-[150px]">Erstellt am</TableHead>
                    <TableHead className="w-[150px]">Läuft ab am</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testCodes.map((code) => (
                    <TableRow key={code.code}>
                      <TableCell className="font-mono truncate max-w-[250px]" title={code.code}>
                        {code.code}
                      </TableCell>
                      <TableCell>
                        <Badge variant={code.status === 'unused' ? 'default' : 'secondary'}>
                          {code.status === 'unused' ? 'Ungenutzt' : 'Verwendet'}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(code.created_at).toLocaleString('de-CH')}</TableCell>
                      <TableCell>{new Date(code.expires_at).toLocaleString('de-CH')}</TableCell>
                    </TableRow>
                  ))}
                  {testCodes.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        Keine aktiven Testcodes vorhanden
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 