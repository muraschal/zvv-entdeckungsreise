import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  data: Code | Registration | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isCode?: boolean;
}

export default function DetailView({ data, open, onOpenChange, isCode = false }: DetailViewProps) {
  if (!data) return null;

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
      return <Badge variant="destructive">Verwendet</Badge>;
    } else if (isExpired) {
      return <Badge variant="outline">Abgelaufen</Badge>;
    } else {
      return <Badge variant="secondary" className="bg-green-100 text-green-800">Verfügbar</Badge>;
    }
  };

  // Hat das aktuelle Objekt ein 'code' Attribut?
  const hasCodeProperty = 'code' in data;
  // Bestimme, ob es sich um eine Registrierung handelt (nicht ein Code oder ein Code mit Registrierung)
  const isRegistration = 'school' in data;
  // Wenn es ein Code-Objekt ist, könnte es eine verbundene Registrierung haben
  const registration = isCode && 'registration' in data ? (data as Code).registration : (isRegistration ? data as Registration : null);
  // Wenn es ein Code ist, nehmen wir das direkte Code-Objekt, ansonsten aus der Registrierung
  const code = isCode ? data as Code : hasCodeProperty ? { 
    code: (data as Registration).code,
    created_at: (data as Registration).created_at,
    expires_at: '', // Nicht in Registrierung enthalten
    status: 'used' // Wenn eine Registrierung existiert, wurde der Code verwendet
  } : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isCode ? 'Code-Details' : 'Registrierungsdetails'}</SheetTitle>
          <SheetDescription>
            {isCode 
              ? 'Informationen zum ausgewählten Code' 
              : 'Details zur ausgewählten Anmeldung'}
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue={isRegistration ? "registration" : "code"} className="mt-6">
          <TabsList className="w-full">
            {code && <TabsTrigger value="code">Code-Info</TabsTrigger>}
            {registration && <TabsTrigger value="registration">Anmeldung</TabsTrigger>}
          </TabsList>

          {code && (
            <TabsContent value="code" className="space-y-6 mt-4">
              <div className="space-y-1">
                <h3 className="text-sm font-medium">Code-Informationen</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Code</p>
                    <p className="font-mono font-medium">{code.code}</p>
                  </div>
                  {isCode && (
                    <>
                      <div>
                        <p className="text-muted-foreground">Status</p>
                        <div className="font-medium">
                          {getStatusBadge(code.status, code.expires_at)}
                        </div>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Typ</p>
                        <div className="font-medium">
                          {isTestCode(code.code) ? (
                            <Badge variant="secondary">Testcode</Badge>
                          ) : (
                            <Badge>Produktionscode</Badge>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                  <div>
                    <p className="text-muted-foreground">Erstellt am</p>
                    <p className="font-medium">
                      {formatDate(code.created_at)}
                    </p>
                  </div>
                  {isCode && code.expires_at && (
                    <div>
                      <p className="text-muted-foreground">Gültig bis</p>
                      <p className="font-medium">
                        {formatDate(code.expires_at)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          )}

          {registration && (
            <TabsContent value="registration" className="space-y-6 mt-4">
              <div className="space-y-1">
                <h3 className="text-sm font-medium">Grundinformationen</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Code</p>
                    <p className="font-mono font-medium">{registration.code}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Anmeldedatum</p>
                    <p className="font-medium">
                      {formatDate(registration.created_at)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-sm font-medium">Schulinformationen</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Schule</p>
                    <p className="font-medium">{registration.school}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Klasse</p>
                    <p className="font-medium">{registration.class}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Kontaktperson</p>
                    <p className="font-medium">{registration.contact_person}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">E-Mail</p>
                    <p className="font-medium break-all">{registration.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Telefon</p>
                    <p className="font-medium">{registration.phone_number}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-sm font-medium">Reiseinformationen</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Reisedatum</p>
                    <p className="font-medium">
                      {formatDate(registration.travel_date)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Ankunftszeit</p>
                    <p className="font-medium">
                      {registration.arrival_time.slice(0, 5)} Uhr
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Anzahl Schüler</p>
                    <p className="font-medium">{registration.student_count}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Anzahl Begleitpersonen</p>
                    <p className="font-medium">{registration.accompanist_count}</p>
                  </div>
                </div>
              </div>
              
              {registration.additional_notes && (
                <div className="space-y-1">
                  <h3 className="text-sm font-medium">Anmerkungen</h3>
                  <p className="text-sm border p-3 rounded-md bg-muted/50 whitespace-pre-wrap">
                    {registration.additional_notes}
                  </p>
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>

        <div className="mt-6">
          <SheetClose asChild>
            <Button variant="outline" className="w-full">Schließen</Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
} 