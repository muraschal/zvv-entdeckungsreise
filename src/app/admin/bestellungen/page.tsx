'use client';

import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { de } from 'date-fns/locale';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import DetailView from '@/components/admin/DetailView';
import { ArrowUp, ArrowDown, Download, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ExcelJS from 'exceljs';
import { useToast } from '@/components/ui/use-toast';

// Typdefinitionen
interface Registration {
  id: string;
  code: string;
  email: string;
  created_at: string;
  status: string;
  trip_datetime: string;
  trip_title: string;
  school?: string;
  student_count?: number;
  travel_date?: string;
  class?: string;
  contact_person?: string;
  phone_number?: string;
  accompanist_count?: number;
  arrival_time?: string;
  additional_notes?: string;
}

// Sortieroptionen definieren
type SortField = 'code' | 'school' | 'contact_person' | 'email' | 'class' | 'student_count' | 'accompanist_count' | 'travel_date' | 'additional_notes';
type SortDirection = 'asc' | 'desc';

export default function AllRegistrationsPage() {
  const [data, setData] = useState<any>({ registrations: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();
  
  // State für Sortierung
  const [sortField, setSortField] = useState<SortField>('travel_date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Excel-Export Funktion
  const exportToExcel = async () => {
    try {
      setIsExporting(true);
      
      // Erstelle eine neue Excel-Arbeitsmappe
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Bestellungen');
      
      // Definiere die Spalten
      worksheet.columns = [
        { header: 'Code', key: 'code', width: 25 },
        { header: 'Schule', key: 'school', width: 30 },
        { header: 'Klasse', key: 'class', width: 15 },
        { header: 'Kontaktperson', key: 'contact_person', width: 25 },
        { header: 'E-Mail', key: 'email', width: 30 },
        { header: 'Telefon', key: 'phone_number', width: 20 },
        { header: 'Schüleranzahl', key: 'student_count', width: 15 },
        { header: 'Begleitpersonen', key: 'accompanist_count', width: 15 },
        { header: 'Reisedatum', key: 'travel_date', width: 20 },
        { header: 'Ankunftszeit', key: 'arrival_time', width: 15 },
        { header: 'Erstellt am', key: 'created_at', width: 20 },
        { header: 'Notizen', key: 'additional_notes', width: 50 }
      ];
      
      // Style für die Kopfzeile
      worksheet.getRow(1).font = { bold: true, color: { argb: '002D77' } }; // ZVV-Blau
      worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E6EEF8' } };
      
      // Daten hinzufügen
      const registrations = data.registrations || [];
      
      registrations.forEach((registration: Registration) => {
        // Formatiere Daten für Excel
        const travelDate = registration.travel_date || registration.trip_datetime;
        
        worksheet.addRow({
          code: registration.code || '',
          school: registration.school || '',
          class: registration.class || '',
          contact_person: registration.contact_person || '',
          email: registration.email || '',
          phone_number: registration.phone_number || '',
          student_count: registration.student_count || 0,
          accompanist_count: registration.accompanist_count || 0,
          travel_date: travelDate ? format(new Date(travelDate), 'dd.MM.yyyy', { locale: de }) : '',
          arrival_time: registration.arrival_time || '',
          created_at: registration.created_at ? format(new Date(registration.created_at), 'dd.MM.yyyy HH:mm', { locale: de }) : '',
          additional_notes: registration.additional_notes || ''
        });
      });
      
      // Automatische Filter für die Kopfzeile
      worksheet.autoFilter = {
        from: { row: 1, column: 1 },
        to: { row: 1, column: worksheet.columns.length }
      };
      
      // Excel-Datei generieren und herunterladen
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      
      // Erstelle einen Download-Link und klicke darauf
      const downloadLink = document.createElement('a');
      const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm', { locale: de });
      downloadLink.href = url;
      downloadLink.download = `ZVV_Entdeckungsreise_Bestellungen_${timestamp}.xlsx`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      // Zeige Erfolgsmeldung
      toast({
        title: "Export erfolgreich",
        description: `${registrations.length} Bestellungen wurden als Excel-Datei exportiert.`,
        duration: 3000
      });
      
    } catch (err) {
      console.error('Fehler beim Excel-Export:', err);
      toast({
        title: "Export fehlgeschlagen",
        description: "Beim Exportieren der Bestellungen ist ein Fehler aufgetreten.",
        variant: "destructive",
        duration: 5000
      });
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/registrations');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);

        // URL-Parameter überprüfen, um einen bestimmten Eintrag zu öffnen
        const urlParams = new URLSearchParams(window.location.search);
        const codeValue = urlParams.get('code');
        const registrationId = urlParams.get('id');

        // Erst nach Code suchen (Primärschlüssel)
        if (codeValue) {
          // Suche nach Code
          const registrationByCode = result.registrations.find(
            (reg: Registration) => reg.code === codeValue
          );
          if (registrationByCode) {
            setSelectedRegistration(registrationByCode);
          }
        }
        // Fallback: Nach ID suchen
        else if (registrationId) {
          // Suche nach ID
          const registrationToOpen = result.registrations.find(
            (reg: Registration) => reg.id === registrationId
          );
          if (registrationToOpen) {
            setSelectedRegistration(registrationToOpen);
          }
        }
      } catch (e) {
        console.error('Error fetching registrations:', e);
        setError('Fehler beim Laden der Daten');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Nicht verfügbar';
    
    try {
      const date = new Date(dateString);
      // Überprüfen, ob das Datum gültig ist
      if (isNaN(date.getTime())) {
        return 'Ungültiges Datum';
      }
      return format(date, 'dd.MM.yyyy HH:mm', { locale: de });
    } catch (error) {
      console.error('Fehler beim Formatieren des Datums:', dateString, error);
      return 'Ungültiges Datum';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">Bestätigt</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-gray-800 border-gray-300">Ausstehend</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">Storniert</Badge>;
      default:
        return <Badge variant="outline" className="text-gray-800 border-gray-300">{status}</Badge>;
    }
  };

  const toggleSelectedRegistration = (registration: Registration) => {
    if (selectedRegistration?.id === registration.id) {
      setSelectedRegistration(null);
    } else {
      setSelectedRegistration(registration);
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
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Alle Bestellungen</h1>
          
          <Button 
            onClick={exportToExcel} 
            disabled={loading || isExporting || data.registrations?.length === 0}
            className="bg-zvv-blue hover:bg-zvv-dark-blue text-white font-medium"
          >
            {isExporting ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                Exportiere...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Excel-Export
              </>
            )}
          </Button>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  // Sortiere die Bestellungen basierend auf der ausgewählten Spalte und Richtung
  const sortedRegistrations = [...(data.registrations || [])].sort((a, b) => {
    let aValue, bValue;
    
    // Fallback für undefined-Werte oder leere Strings
    const getComparableValue = (val: any) => {
      if (val === undefined || val === null || val === '') return '';
      return val;
    };
    
    switch (sortField) {
      case 'code':
        aValue = getComparableValue(a.code);
        bValue = getComparableValue(b.code);
        break;
      case 'school':
        aValue = getComparableValue(a.school);
        bValue = getComparableValue(b.school);
        break;
      case 'contact_person':
        aValue = getComparableValue(a.contact_person);
        bValue = getComparableValue(b.contact_person);
        break;
      case 'email':
        aValue = getComparableValue(a.email);
        bValue = getComparableValue(b.email);
        break;
      case 'class':
        aValue = getComparableValue(a.class);
        bValue = getComparableValue(b.class);
        break;
      case 'student_count':
        aValue = getComparableValue(a.student_count) || 0;
        bValue = getComparableValue(b.student_count) || 0;
        break;
      case 'accompanist_count':
        aValue = getComparableValue(a.accompanist_count) || 0;
        bValue = getComparableValue(b.accompanist_count) || 0;
        break;
      case 'travel_date':
        // Versuche, aus travel_date oder trip_datetime ein gültiges Datum zu machen
        const aDate = a.travel_date || a.trip_datetime;
        const bDate = b.travel_date || b.trip_datetime;
        aValue = aDate ? new Date(aDate).getTime() : 0;
        bValue = bDate ? new Date(bDate).getTime() : 0;
        break;
      case 'additional_notes':
        aValue = getComparableValue(a.additional_notes);
        bValue = getComparableValue(b.additional_notes);
        break;
      default:
        aValue = getComparableValue(a[sortField]);
        bValue = getComparableValue(b[sortField]);
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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Alle Bestellungen</h1>
        
        <Button 
          onClick={exportToExcel} 
          disabled={loading || isExporting || data.registrations?.length === 0}
          className="bg-zvv-blue hover:bg-zvv-dark-blue text-white font-medium"
        >
          {isExporting ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              Exportiere...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Excel-Export
            </>
          )}
        </Button>
      </div>
      
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
              {sortedRegistrations.length || 0} Bestellungen gefunden
            </div>
          </div>

          {sortedRegistrations.length > 0 ? (
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
                      onClick={() => toggleSort('school')}
                    >
                      Schule {getSortIndicator('school')}
                    </th>
                    <th 
                      className="cursor-pointer hover:bg-gray-200"
                      onClick={() => toggleSort('contact_person')}
                    >
                      Kontaktperson {getSortIndicator('contact_person')}
                    </th>
                    <th 
                      className="cursor-pointer hover:bg-gray-200"
                      onClick={() => toggleSort('email')}
                    >
                      E-Mail {getSortIndicator('email')}
                    </th>
                    <th 
                      className="cursor-pointer hover:bg-gray-200"
                      onClick={() => toggleSort('class')}
                    >
                      Klasse {getSortIndicator('class')}
                    </th>
                    <th 
                      className="cursor-pointer hover:bg-gray-200"
                      onClick={() => toggleSort('student_count')}
                    >
                      Schüler {getSortIndicator('student_count')}
                    </th>
                    <th 
                      className="cursor-pointer hover:bg-gray-200"
                      onClick={() => toggleSort('accompanist_count')}
                    >
                      Begleiter {getSortIndicator('accompanist_count')}
                    </th>
                    <th 
                      className="cursor-pointer hover:bg-gray-200"
                      onClick={() => toggleSort('travel_date')}
                    >
                      Reisedatum {getSortIndicator('travel_date')}
                    </th>
                    <th 
                      className="cursor-pointer hover:bg-gray-200"
                      onClick={() => toggleSort('additional_notes')}
                    >
                      Anmerkungen {getSortIndicator('additional_notes')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedRegistrations.map((registration: Registration) => {
                    const isSelected = selectedRegistration?.id === registration.id;
                    const rowClassName = `hover:bg-gray-100 cursor-pointer ${isSelected ? 'bg-gray-100' : 'bg-white'} text-black`;
                    
                    return (
                      <React.Fragment key={registration.id}>
                        <tr 
                          className={rowClassName}
                          onClick={() => toggleSelectedRegistration(registration)}
                        >
                          <td className="font-mono font-medium">{registration.code || '-'}</td>
                          <td>{registration.school || '-'}</td>
                          <td>{registration.contact_person || '-'}</td>
                          <td>{registration.email || '-'}</td>
                          <td>{registration.class || '-'}</td>
                          <td>{registration.student_count || '-'}</td>
                          <td>{registration.accompanist_count || '-'}</td>
                          <td>{formatDate(registration.travel_date || registration.trip_datetime)}</td>
                          <td className="max-w-xs truncate">{registration.additional_notes || '-'}</td>
                        </tr>
                        {isSelected && (
                          <tr key={`details-${registration.id}`}>
                            <td colSpan={9} className="p-0 border-none">
                              <div className="bg-gray-50 shadow-sm">
                                <DetailView 
                                  data={{
                                    id: registration.id,
                                    code: registration.code || '',
                                    email: registration.email,
                                    created_at: registration.created_at,
                                    school: registration.school || '',
                                    student_count: registration.student_count || 0,
                                    travel_date: registration.travel_date || registration.trip_datetime || '',
                                    class: registration.class || '',
                                    contact_person: registration.contact_person || '',
                                    phone_number: registration.phone_number || '',
                                    accompanist_count: registration.accompanist_count || 0,
                                    arrival_time: registration.arrival_time || '',
                                    additional_notes: registration.additional_notes
                                  }} 
                                  open={true} 
                                  onOpenChange={(open) => !open && setSelectedRegistration(null)}
                                  isCode={false}
                                />
                              </div>
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
              Keine Bestellungen gefunden
            </div>
          )}
        </>
      )}
    </div>
  );
} 