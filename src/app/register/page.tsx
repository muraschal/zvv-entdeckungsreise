'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    code: '',
    school: '',
    studentCount: '',
    travelDate: '',
    additionalNotes: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Zuerst den Code validieren
      const validateResponse = await fetch('/api/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: formData.code }),
      });

      const validateData = await validateResponse.json();

      if (!validateData.valid) {
        setError(validateData.message || 'Ungültiger Code');
        setIsLoading(false);
        return;
      }

      // Wenn der Code gültig ist, das Formular einreichen
      const response = await fetch('/api/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: formData.code,
          school: formData.school,
          studentCount: parseInt(formData.studentCount),
          travelDate: formData.travelDate,
          additionalNotes: formData.additionalNotes
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        // Optional: Weiterleitung zu einer Bestätigungsseite
        // router.push('/register/success');
      } else {
        setError(data.message || 'Ein Fehler ist aufgetreten');
      }
    } catch (err) {
      setError('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-green-600 mb-4">Anmeldung erfolgreich!</h1>
        <p className="mb-4">Vielen Dank für deine Anmeldung zur ZVV-Entdeckungsreise.</p>
        <p className="mb-4">Wir haben deine Anfrage erhalten und werden uns in Kürze bei dir melden.</p>
        <button
          onClick={() => router.push('/')}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          Zurück zur Startseite
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">ZVV-Entdeckungsreise Anmeldung</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
            Ticketcode*
          </label>
          <input
            type="text"
            id="code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="z.B. XYZ12345"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-1">
            Schule*
          </label>
          <input
            type="text"
            id="school"
            name="school"
            value={formData.school}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Name der Schule"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="studentCount" className="block text-sm font-medium text-gray-700 mb-1">
            Anzahl Schüler*
          </label>
          <input
            type="number"
            id="studentCount"
            name="studentCount"
            value={formData.studentCount}
            onChange={handleChange}
            required
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="z.B. 25"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="travelDate" className="block text-sm font-medium text-gray-700 mb-1">
            Gewünschtes Reisedatum*
          </label>
          <input
            type="date"
            id="travelDate"
            name="travelDate"
            value={formData.travelDate}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-1">
            Zusätzliche Anmerkungen
          </label>
          <textarea
            id="additionalNotes"
            name="additionalNotes"
            value={formData.additionalNotes}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Weitere Informationen oder Wünsche"
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded text-white ${
            isLoading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'
          } transition-colors`}
        >
          {isLoading ? 'Wird verarbeitet...' : 'Anmeldung absenden'}
        </button>
      </form>
    </div>
  );
} 