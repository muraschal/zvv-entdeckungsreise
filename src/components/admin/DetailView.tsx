import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ExternalLink, X } from 'lucide-react';

// Typdefinitionen
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

interface Code {
  id: string;
  code: string;
  status: string;
  created_at: string;
  expires_at: string;
  registration?: Registration;
}

interface DetailViewProps {
  data: Code | Registration;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isCode?: boolean;
}

export default function DetailView({ data, open, onOpenChange, isCode = false }: DetailViewProps) {
  if (!data || !open) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd.MM.yyyy HH:mm', { locale: de });
  };

  const isTestCode = (code: string) => {
    return code.startsWith('INT_');
  };

  const getStatusBadge = (status: string, expiresAt: string) => {
    const isExpired = new Date(expiresAt) < new Date();
    
    if (status === 'used') {
      return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">Verwendet</Badge>;
    } else if (isExpired) {
      return <Badge variant="outline" className="text-gray-800 border-gray-300">Abgelaufen</Badge>;
    } else {
      return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">Verfügbar</Badge>;
    }
  };

  // Bestimme die Daten für beide Views
  const registration = isCode ? (data as Code).registration : data as Registration;
  const code = isCode ? data as Code : { 
    code: (data as Registration).code,
    created_at: (data as Registration).created_at,
    expires_at: '', 
    status: 'used',
    id: (data as Registration).id
  };

  // Render-Funktionen für die einzelnen Abschnitte
  const renderCodeDetails = () => (
    <div className="bg-white rounded-md p-4 mb-4">
      <h2 className="font-semibold mb-4 text-black">Code-Details</h2>
      <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
        <div key="code-field">
          <p className="text-gray-500">Code</p>
          <p className="font-mono font-medium text-black">{code.code}</p>
        </div>
        <div key="created-field">
          <p className="text-gray-500">Erstellt am</p>
          <p className="font-medium text-black">{formatDate(code.created_at)}</p>
        </div>
        <div key="status-field">
          <p className="text-gray-500">Status</p>
          <div className="font-medium">
            {getStatusBadge(code.status, code.expires_at)}
          </div>
        </div>
        {code.expires_at && (
          <div key="expires-field">
            <p className="text-gray-500">Gültig bis</p>
            <p className="font-medium text-black">{formatDate(code.expires_at)}</p>
          </div>
        )}
        {!isCode && code.id && (
          <div key="link-to-code" className="col-span-2 mt-2">
            <Link href={`/admin/codes?id=${code.id}`}>
              <Button variant="outline" size="sm" className="flex items-center gap-1 text-black border-gray-300">
                <ExternalLink className="h-3 w-3" />
                Zur Code-Übersicht
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  const renderRegistrationDetails = () => registration && (
    <div className="bg-white rounded-md p-4">
      <h2 className="font-semibold mb-4 text-black">Bestell-Details</h2>
      <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
        <div key="school-field">
          <p className="text-gray-500">Schule</p>
          <p className="font-medium text-black">{registration.school}</p>
        </div>
        <div key="class-field">
          <p className="text-gray-500">Klasse</p>
          <p className="font-medium text-black">{registration.class}</p>
        </div>
        <div key="contact-field">
          <p className="text-gray-500">Kontaktperson</p>
          <p className="font-medium text-black">{registration.contact_person}</p>
        </div>
        <div key="student-count-field">
          <p className="text-gray-500">Anzahl Schüler</p>
          <p className="font-medium text-black">{registration.student_count}</p>
        </div>
        <div key="email-field">
          <p className="text-gray-500">E-Mail</p>
          <p className="font-medium break-all text-black">{registration.email}</p>
        </div>
        <div key="accompanist-field">
          <p className="text-gray-500">Anzahl Begleitpersonen</p>
          <p className="font-medium text-black">{registration.accompanist_count}</p>
        </div>
        <div key="phone-field">
          <p className="text-gray-500">Telefon</p>
          <p className="font-medium text-black">{registration.phone_number}</p>
        </div>
        <div key="empty-field"></div>
        <div key="travel-date-field">
          <p className="text-gray-500">Reisedatum</p>
          <p className="font-medium text-black">{formatDate(registration.travel_date)}</p>
        </div>
        <div key="notes-field">
          <p className="text-gray-500">Anmerkungen</p>
          <p className="font-medium whitespace-pre-wrap text-black">{registration.additional_notes}</p>
        </div>
        <div key="arrival-field">
          <p className="text-gray-500">Ankunftszeit</p>
          <p className="font-medium text-black">{registration.arrival_time.slice(0, 5)} Uhr</p>
        </div>
        {isCode && (
          <div key="link-to-registration" className="col-span-2 mt-2">
            <Link href={`/admin/bestellungen?id=${registration.id}`}>
              <Button variant="outline" size="sm" className="flex items-center gap-1 text-black border-gray-300">
                <ExternalLink className="h-3 w-3" />
                Zur Bestellungs-Übersicht
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="relative overflow-hidden py-4 px-6 bg-gray-50">
      <button 
        className="absolute top-4 right-4 text-gray-500 hover:text-black p-1 rounded-sm"
        onClick={() => onOpenChange(false)}
        aria-label="Schließen"
      >
        <X size={18} />
      </button>
      
      {/* Reihenfolge basierend auf isCode */}
      {isCode ? (
        <>
          <div key="code-details" className="border-b border-gray-200">{renderCodeDetails()}</div>
          {code.status === 'used' && registration && (
            <div key="registration-details">{renderRegistrationDetails()}</div>
          )}
        </>
      ) : (
        <>
          <div key="registration-details" className="border-b border-gray-200">{renderRegistrationDetails()}</div>
          <div key="code-details">{renderCodeDetails()}</div>
        </>
      )}
    </div>
  );
} 