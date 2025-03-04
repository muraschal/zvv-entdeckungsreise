import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ZVV Ticketcode-Validierung
            </h1>
            <p className="text-gray-600 mb-6">
              Anmeldung und Validierung von Ticketcodes für die ZVV-Entdeckungsreise
            </p>
            <Link 
              href="/register" 
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Zur Anmeldung
            </Link>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              API-Dokumentation
            </h2>
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Validierungs-Endpunkt
                </h3>
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
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Einlöse-Endpunkt
                </h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm font-mono mb-2">POST /api/redeem</p>
                  <p className="text-sm text-gray-600 mb-4">
                    Löst einen gültigen Ticketcode ein und speichert die Anmeldedaten.
                  </p>
                  <div className="bg-gray-800 text-white p-3 rounded-md text-sm font-mono">
                    {`{
  "code": "XYZ12345",
  "school": "Musterschule",
  "studentCount": 25,
  "travelDate": "2023-12-15",
  "additionalNotes": "Optional: Zusätzliche Informationen"
}`}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-500">
              ZVV Entdeckungsreise Ticketcode-Validierung mit Supabase & Next.js
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 