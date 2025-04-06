'use client';

import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { de } from 'date-fns/locale';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink, ArrowUp, ArrowDown } from 'lucide-react';

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

// Sortieroptionen definieren
type SortField = 'code' | 'status' | 'created_at' | 'expires_at' | 'type';
type SortDirection = 'asc' | 'desc';

export default function AllCodesPage() {
  const [data, setData] = useState<any>({ codes: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCode, setSelectedCode] = useState<Code | null>(null);
  
  // State für Sortierung
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Daten beim Laden der Seite abrufen
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
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Verwendet</Badge>;
    } else if (isExpired) {
      return <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">Abgelaufen</Badge>;
    } else {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Verfügbar</Badge>;
    }
  };

  const isTestCode = (code: string) => {
    return code.startsWith('INT_');
  };

  const navigateToRegistration = async (code: Code) => {
    // Wenn der Code verwendet wurde, versuche zur Bestellungsseite zu navigieren
    if (code.status === 'used') {
      // Da wir einen 1:1-Verhältnis zwischen Code und Bestellung haben,
      // können wir direkt mit dem Code-Wert navigieren
      window.location.href = `/admin/bestellungen?code=${code.code}`;
    }
  };

  // Funktion zum Umschalten der Sortierung
  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      // Wenn das Feld bereits ausgewählt ist, Richtung ändern
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Neues Feld auswählen und standardmäßig aufsteigend sortieren
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Funktion zum Anzeigen des Sortierindikators
  const getSortIndicator = (field: SortField) => {
    if (sortField !== field) return null;
    
    return sortDirection === 'asc' 
      ? <ArrowUp className="h-4 w-4 inline-block ml-1" /> 
      : <ArrowDown className="h-4 w-4 inline-block ml-1" />;
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

  // Sortieren der Codes basierend auf aktiven Sortieroptionen
  const sortedCodes = [...(data.codes || [])].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortField) {
      case 'code':
        aValue = a.code;
        bValue = b.code;
        break;
      case 'status':
        // Für Status unterscheiden wir zwischen "verwendet", "abgelaufen" und "verfügbar"
        const getStatusPriority = (code: Code) => {
          if (code.status === 'used') return 1;
          if (new Date(code.expires_at) < new Date()) return 2;
          return 3;
        };
        aValue = getStatusPriority(a);
        bValue = getStatusPriority(b);
        break;
      case 'created_at':
        aValue = new Date(a.created_at).getTime();
        bValue = new Date(b.created_at).getTime();
        break;
      case 'expires_at':
        aValue = new Date(a.expires_at).getTime();
        bValue = new Date(b.expires_at).getTime();
        break;
      case 'type':
        aValue = isTestCode(a.code) ? 'test' : 'production';
        bValue = isTestCode(b.code) ? 'test' : 'production';
        break;
      default:
        aValue = a[sortField];
        bValue = b[sortField];
    }
    
    // Sortierrichtung berücksichtigen
    const sortFactor = sortDirection === 'asc' ? 1 : -1;
    
    // Sortierung durchführen
    if (aValue < bValue) return -1 * sortFactor;
    if (aValue > bValue) return 1 * sortFactor;
    return 0;
  });

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
              Umgebung: <Badge variant="outline" className="text-gray-800 border-gray-300">{data.environment === 'integration' ? 'Integration' : 'Produktion'}</Badge>
            </span>
            <div className="mt-2 font-medium text-black">
              {sortedCodes.length || 0} Codes gefunden
            </div>
          </div>

          {sortedCodes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse table-zvv">
                <thead>
                  <tr className="bg-gray-100 text-black">
                    <th 
                      className="cursor-pointer hover:bg-gray-200"
                      onClick={() => toggleSort('code')}
                    >
                      Code {getSortIndicator('code')}
                    </th>
                    <th 
                      className="cursor-pointer hover:bg-gray-200"
                      onClick={() => toggleSort('status')}
                    >
                      Status {getSortIndicator('status')}
                    </th>
                    <th 
                      className="cursor-pointer hover:bg-gray-200"
                      onClick={() => toggleSort('created_at')}
                    >
                      Erstellt am {getSortIndicator('created_at')}
                    </th>
                    <th 
                      className="cursor-pointer hover:bg-gray-200"
                      onClick={() => toggleSort('expires_at')}
                    >
                      Gültig bis {getSortIndicator('expires_at')}
                    </th>
                    <th 
                      className="cursor-pointer hover:bg-gray-200"
                      onClick={() => toggleSort('type')}
                    >
                      Typ {getSortIndicator('type')}
                    </th>
                    <th>Bestellung</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedCodes.map((code: Code, index) => {
                    const uniqueKey = code.id || `code-${index}-${code.code}`;
                    // Zusätzliche Klasse für verwendete Codes, die auf Bestellungen verlinken
                    const isUsed = code.status === 'used';
                    
                    // Unterschiedliche Styling-Klassen für verwendete und nicht verwendete Codes
                    const rowClassName = `
                      hover:bg-gray-100 
                      ${isUsed ? 'cursor-pointer' : ''}
                      text-black
                    `;
                    
                    return (
                      <React.Fragment key={uniqueKey}>
                        <tr 
                          className={rowClassName}
                          onClick={() => isUsed ? navigateToRegistration(code) : null}
                          title={isUsed ? "Zur Bestellung anzeigen" : ""}
                        >
                          <td className="font-mono">{code.code}</td>
                          <td>{getStatusBadge(code.status, code.expires_at)}</td>
                          <td>{formatDate(code.created_at)}</td>
                          <td>{formatDate(code.expires_at)}</td>
                          <td>
                            {isTestCode(code.code) ? (
                              <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">Testcode</Badge>
                            ) : (
                              <Badge variant="outline" className="text-gray-800 border-gray-300">Produktionscode</Badge>
                            )}
                          </td>
                          <td className="text-center w-24">
                            {isUsed ? (
                              <span title="Zur Bestellung" className="inline-flex justify-center w-full">
                                <ExternalLink className="h-4 w-4 text-gray-500" />
                              </span>
                            ) : (
                              <span className="inline-block w-4"></span>
                            )}
                          </td>
                        </tr>
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