'use client';

import { useState } from 'react';

// Hilfsfunktion zur Formatierung des Datums für die Anzeige
const formatDateForDisplay = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('de-CH');
};

// Hilfsfunktion zur Formatierung der Zeit für die Anzeige
const formatTimeForDisplay = (timeString: string) => {
  if (!timeString) return '';
  return timeString;
};

// Exportierbare Komponente für die Integration in externe Websites
export function ZVVEntdeckungsreiseForm({ apiBaseUrl = '' }: { apiBaseUrl?: string }) {
  const [formData, setFormData] = useState({
    code: '',
    school: '',
    studentCount: '',
    travelDate: '',
    additionalNotes: '',
    email: '',
    className: '',
    contactPerson: '',
    phoneNumber: '',
    accompanistCount: '',
    arrivalTime: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Hilfsfunktion zur Validierung des Datums
  const validateDate = (date: string) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return selectedDate >= today;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validiere das Datum
    if (formData.travelDate && !validateDate(formData.travelDate)) {
      setError('Das Reisedatum muss in der Zukunft liegen.');
      setIsLoading(false);
      return;
    }

    try {
      // Zuerst den Code validieren
      const validateResponse = await fetch(`${apiBaseUrl}/api/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: formData.code }),
      });

      const validateData = await validateResponse.json();

      if (!validateData.valid) {
        setError(validateData.message || 'Ungültiger Code');
        setIsLoading(false);
        return;
      }

      // Wenn der Code gültig ist, das Formular einreichen
      const response = await fetch(`${apiBaseUrl}/api/redeem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: formData.code,
          school: formData.school,
          studentCount: parseInt(formData.studentCount),
          travelDate: formData.travelDate,
          additionalNotes: formData.additionalNotes,
          email: formData.email,
          className: formData.className,
          contactPerson: formData.contactPerson,
          phoneNumber: formData.phoneNumber,
          accompanistCount: parseInt(formData.accompanistCount || '0'),
          arrivalTime: formData.arrivalTime
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
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
        <p className="mb-4">Wir haben deine Anfrage erhalten und eine Bestätigungs-E-Mail an dich gesendet.</p>
        <button
          onClick={() => setSuccess(false)}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          Zurück zum Formular
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="code" className="block mb-1">Ticketcode*</label>
          <input
            type="text"
            id="code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            required
            className="w-full p-2 border"
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="school" className="block mb-1">Schule*</label>
          <input
            type="text"
            id="school"
            name="school"
            value={formData.school}
            onChange={handleChange}
            required
            className="w-full p-2 border"
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="contactPerson" className="block mb-1">Kontaktperson*</label>
          <input
            type="text"
            id="contactPerson"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={handleChange}
            required
            className="w-full p-2 border"
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="email" className="block mb-1">E-Mail-Adresse*</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border"
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="phoneNumber" className="block mb-1">Telefonnummer*</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="w-full p-2 border"
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="className" className="block mb-1">Klasse*</label>
          <select
            id="className"
            name="className"
            value={formData.className}
            onChange={handleChange}
            required
            className="w-full p-2 border"
          >
            <option value="">Bitte wählen</option>
            <option value="4. Klasse">4. Klasse</option>
            <option value="5. Klasse">5. Klasse</option>
            <option value="6. Klasse">6. Klasse</option>
          </select>
        </div>
        
        <div className="mb-3">
          <label htmlFor="studentCount" className="block mb-1">Anzahl Schüler*</label>
          <input
            type="number"
            id="studentCount"
            name="studentCount"
            value={formData.studentCount}
            onChange={handleChange}
            required
            min="1"
            className="w-full p-2 border"
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="accompanistCount" className="block mb-1">Anzahl Begleitpersonen*</label>
          <input
            type="number"
            id="accompanistCount"
            name="accompanistCount"
            value={formData.accompanistCount}
            onChange={handleChange}
            required
            min="1"
            className="w-full p-2 border"
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="travelDate" className="block mb-1">Gewünschtes Reisedatum*</label>
          <div className="relative">
            <input
              type="date"
              id="travelDate"
              name="travelDate"
              value={formData.travelDate}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-2 border"
            />
            <div className="text-xs text-gray-500 mt-1">
              Bitte wählen Sie ein Datum in der Zukunft
            </div>
          </div>
        </div>
        
        <div className="mb-3">
          <label htmlFor="arrivalTime" className="block mb-1">Ankunftszeit*</label>
          <div className="relative">
            <input
              type="time"
              id="arrivalTime"
              name="arrivalTime"
              value={formData.arrivalTime}
              onChange={handleChange}
              required
              className="w-full p-2 border"
            />
            <div className="text-xs text-gray-500 mt-1">
              Format: HH:MM (z.B. 09:30)
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="additionalNotes" className="block mb-1">Zusätzliche Anmerkungen</label>
          <textarea
            id="additionalNotes"
            name="additionalNotes"
            value={formData.additionalNotes}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 border"
          ></textarea>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full p-2 bg-blue-500 text-white rounded"
        >
          {isLoading ? 'Wird verarbeitet...' : 'Anmeldung absenden'}
        </button>
      </form>
    </div>
  );
} 