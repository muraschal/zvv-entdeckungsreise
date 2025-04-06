import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { de } from 'date-fns/locale';
import { Alert } from '@/components/ui/alert';

export const dynamic = 'force-dynamic';

export default async function AllCodesPage() {
  // Fetch data from API
  const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/admin/codes`);
  const data = await response.json();

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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Alle Codes</h1>
      
      {data.error ? (
        <Alert variant="destructive">Fehler beim Laden der Daten: {data.error}</Alert>
      ) : (
        <>
          <div className="mb-4">
            <span className="text-sm text-gray-500">
              Umgebung: <Badge>{data.environment === 'integration' ? 'Integration' : 'Produktion'}</Badge>
            </span>
            <div className="mt-2 font-medium">
              {data.codes?.length || 0} Codes gefunden
            </div>
          </div>

          {data.codes?.length > 0 ? (
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
                  {data.codes.map((code: any) => (
                    <tr key={code.id} className={isTestCode(code.code) ? 'bg-gray-100' : ''}>
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
                  ))}
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