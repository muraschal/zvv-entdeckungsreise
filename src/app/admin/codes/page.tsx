'use client';

import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { de } from 'date-fns/locale';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import DetailView from '@/components/admin/DetailView';

// Typdefinitionen
interface Code {
  id: string;
  code: string;
  status: string;
  created_at: string;
  expires_at: string;
  registration?: any;
}

// Registration-Schnittstelle für die Typung
interface Registration {
  id: string;
  code: string;
  email: string;
  created_at: string;
  school: string;
  student_count: number;
  travel_date: string;
  class: string;
  contact_person: string;
  phone_number: string;
  accompanist_count: number;
  arrival_time: string;
  additional_notes?: string;
}

export default function AllCodesPage() {
  const [data, setData] = useState<any>({ codes: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCode, setSelectedCode] = useState<Code | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/codes');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (e) {
        console.error('Error fetching codes:', e);
        setError('Fehler beim Laden der Daten');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd.MM.yyyy HH:mm', { locale: de });
  };

  const getStatusBadge = (status: string, expiresAt: string) => {
    const isExpired = new Date(expiresAt) < new Date();
    
    if (status === 'used') {
      return <Badge variant="destructive">Verwendet</Badge>;
    } else if (isExpired) {
      return <Badge variant="outline">Abgelaufen</Badge>;
    } else {
      return <Badge variant="secondary" className="bg-green-100 text-green-800">Verfügbar</Badge>;
    }
  };

  const isTestCode = (code: string) => {
    return code.startsWith('INT_');
  };

  const toggleSelectedCode = (code: Code) => {
    if (selectedCode?.id === code.id) {
      setSelectedCode(null);
    } else {
      setSelectedCode(code);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Alle Codes</h1>
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  // Erstelle eine sortierte Liste der Codes
  const sortedCodes = [...(data.codes || [])];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Alle Codes</h1>
      
      {error ? (
        <Alert variant="destructive">
          <AlertDescription>Fehler beim Laden der Daten: {error}</AlertDescription>
        </Alert>
      ) : (
        <>
          <div className="mb-4">
            <span className="text-sm text-gray-500">
              Umgebung: <Badge>{data.environment === 'integration' ? 'Integration' : 'Produktion'}</Badge>
            </span>
            <div className="mt-2 font-medium">
              {sortedCodes.length || 0} Codes gefunden
            </div>
          </div>

          {sortedCodes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse table-zvv">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Status</th>
                    <th>Erstellt am</th>
                    <th>Gültig bis</th>
                    <th>Typ</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedCodes.map((code: Code) => {
                    const isSelected = selectedCode?.id === code.id;
                    const rowClassName = `${isTestCode(code.code) ? 'bg-gray-100' : ''} hover:bg-muted/50 cursor-pointer ${isSelected ? 'bg-muted/50' : ''}`;
                    
                    return (
                      <React.Fragment key={code.id}>
                        <tr 
                          className={rowClassName}
                          onClick={() => toggleSelectedCode(code)}
                        >
                          <td className="font-mono">{code.code}</td>
                          <td>{getStatusBadge(code.status, code.expires_at)}</td>
                          <td>{formatDate(code.created_at)}</td>
                          <td>{formatDate(code.expires_at)}</td>
                          <td>
                            {isTestCode(code.code) ? (
                              <Badge variant="secondary">Testcode</Badge>
                            ) : (
                              <Badge>Produktionscode</Badge>
                            )}
                          </td>
                        </tr>
                        {isSelected && (
                          <tr key={`details-${code.id}`}>
                            <td colSpan={5} className="p-0">
                              <DetailView 
                                data={code} 
                                open={true} 
                                onOpenChange={(open) => !open && setSelectedCode(null)}
                                isCode={true}
                              />
                              {code.status === 'used' && code.registration && (
                                <div className="p-4 border-t">
                                  <h3 className="text-sm font-medium mb-4">Registrierungsinformationen</h3>
                                  <DetailView 
                                    data={code.registration}
                                    open={true}
                                    onOpenChange={() => {}}
                                    isCode={false}
                                  />
                                </div>
                              )}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              Keine Codes gefunden
            </div>
          )}
        </>
      )}
    </div>
  );
} 