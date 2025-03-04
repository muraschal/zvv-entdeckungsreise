import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ZVV Ticketcode-Validierung
            </h1>
            <p className="text-gray-600">
              API-Endpunkte für die Validierung und das Einlösen von Ticketcodes
            </p>
          </div>

          <div className="space-y-6">
            <div className="border border-gray-200 rounded-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Validierungs-Endpunkt
              </h2>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm font-mono mb-2">POST /api/validate</p>
                <p className="text-sm text-gray-600 mb-4">
                  Überprüft, ob ein Ticketcode gültig ist.
                </p>
                <div className="bg-gray-800 text-white p-3 rounded-md text-sm font-mono">
                  {`{
  "code": "XYZ12345"
}`}
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Einlöse-Endpunkt
              </h2>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm font-mono mb-2">POST /api/redeem</p>
                <p className="text-sm text-gray-600 mb-4">
                  Löst einen gültigen Ticketcode ein.
                </p>
                <div className="bg-gray-800 text-white p-3 rounded-md text-sm font-mono">
                  {`{
  "code": "XYZ12345"
}`}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-500">
              ZVV Entdeckungsreise Ticketcode-Validierung mit Supabase & Zapier
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 