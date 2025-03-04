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
          className="inline-flex items-center justify-center whitespace-nowrap rounded-lg min-w-[160px] bg-[#0479cc] hover:bg-[#035999] text-white font-bold tracking-[0.2px] h-10 px-4 py-2 focus:shadow-[0px_0px_3px_2px_rgba(4,121,204,.32)]"
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
        <div className="mb-6">
          <h4 id="code" className="mb-1 flex text-h4 font-bold text-black">Ticketcode <span className="ml-1 text-grey">*</span></h4>
          <input
            type="text"
            id="code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            required
            className="flex h-10 w-full rounded-[4px] border-2 border-grey bg-white px-3 py-2 pt-[10px] font-bold focus:border-[#0479cc] focus:shadow-[0px_0px_3px_2px_rgba(4,121,204,.32)] focus:ring-[3px] focus:ring-[#0479cc] mb-[1.2rem] text-p text-black"
            aria-labelledby="code"
          />
        </div>
        
        <div className="mb-6">
          <h4 id="school" className="mb-1 flex text-h4 font-bold text-black">Schule <span className="ml-1 text-grey">*</span></h4>
          <input
            type="text"
            id="school"
            name="school"
            value={formData.school}
            onChange={handleChange}
            required
            className="flex h-10 w-full rounded-[4px] border-2 border-grey bg-white px-3 py-2 pt-[10px] font-bold focus:border-[#0479cc] focus:shadow-[0px_0px_3px_2px_rgba(4,121,204,.32)] focus:ring-[3px] focus:ring-[#0479cc] mb-[1.2rem] text-p text-black"
            aria-labelledby="school"
          />
        </div>
        
        <div className="mb-6">
          <h4 id="contactPerson" className="mb-1 flex text-h4 font-bold text-black">Kontaktperson <span className="ml-1 text-grey">*</span></h4>
          <input
            type="text"
            id="contactPerson"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={handleChange}
            required
            className="flex h-10 w-full rounded-[4px] border-2 border-grey bg-white px-3 py-2 pt-[10px] font-bold focus:border-[#0479cc] focus:shadow-[0px_0px_3px_2px_rgba(4,121,204,.32)] focus:ring-[3px] focus:ring-[#0479cc] mb-[1.2rem] text-p text-black"
            aria-labelledby="contactPerson"
          />
        </div>
        
        <div className="mb-6">
          <h4 id="email" className="mb-1 flex text-h4 font-bold text-black">E-Mail-Adresse <span className="ml-1 text-grey">*</span></h4>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="flex h-10 w-full rounded-[4px] border-2 border-grey bg-white px-3 py-2 pt-[10px] font-bold focus:border-[#0479cc] focus:shadow-[0px_0px_3px_2px_rgba(4,121,204,.32)] focus:ring-[3px] focus:ring-[#0479cc] mb-[1.2rem] text-p text-black"
            aria-labelledby="email"
          />
        </div>
        
        <div className="mb-6">
          <h4 id="phoneNumber" className="mb-1 flex text-h4 font-bold text-black">Telefonnummer <span className="ml-1 text-grey">*</span></h4>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="flex h-10 w-full rounded-[4px] border-2 border-grey bg-white px-3 py-2 pt-[10px] font-bold focus:border-[#0479cc] focus:shadow-[0px_0px_3px_2px_rgba(4,121,204,.32)] focus:ring-[3px] focus:ring-[#0479cc] mb-[1.2rem] text-p text-black"
            aria-labelledby="phoneNumber"
          />
        </div>
        
        <div className="mb-6">
          <h4 id="className" className="mb-1 flex text-h4 font-bold text-black">Klasse <span className="ml-1 text-grey">*</span></h4>
          <select
            id="className"
            name="className"
            value={formData.className}
            onChange={handleChange}
            required
            className="flex h-10 w-full rounded-[4px] border-2 border-grey bg-white px-3 py-2 pt-[10px] font-bold focus:border-[#0479cc] focus:shadow-[0px_0px_3px_2px_rgba(4,121,204,.32)] focus:ring-[3px] focus:ring-[#0479cc] mb-[1.2rem] text-p text-black"
            aria-labelledby="className"
          >
            <option value="">Bitte wählen</option>
            <option value="4. Klasse">4. Klasse</option>
            <option value="5. Klasse">5. Klasse</option>
            <option value="6. Klasse">6. Klasse</option>
          </select>
        </div>
        
        <div className="mb-6">
          <h4 id="studentCount" className="mb-1 flex text-h4 font-bold text-black">Anzahl Schüler <span className="ml-1 text-grey">*</span></h4>
          <input
            type="number"
            id="studentCount"
            name="studentCount"
            value={formData.studentCount}
            onChange={handleChange}
            required
            min="1"
            className="flex h-10 w-full rounded-[4px] border-2 border-grey bg-white px-3 py-2 pt-[10px] font-bold focus:border-[#0479cc] focus:shadow-[0px_0px_3px_2px_rgba(4,121,204,.32)] focus:ring-[3px] focus:ring-[#0479cc] mb-[1.2rem] text-p text-black"
            aria-labelledby="studentCount"
          />
        </div>
        
        <div className="mb-6">
          <h4 id="accompanistCount" className="mb-1 flex text-h4 font-bold text-black">Anzahl Begleitpersonen <span className="ml-1 text-grey">*</span></h4>
          <input
            type="number"
            id="accompanistCount"
            name="accompanistCount"
            value={formData.accompanistCount}
            onChange={handleChange}
            required
            min="1"
            className="flex h-10 w-full rounded-[4px] border-2 border-grey bg-white px-3 py-2 pt-[10px] font-bold focus:border-[#0479cc] focus:shadow-[0px_0px_3px_2px_rgba(4,121,204,.32)] focus:ring-[3px] focus:ring-[#0479cc] mb-[1.2rem] text-p text-black"
            aria-labelledby="accompanistCount"
          />
        </div>
        
        <div className="mb-6">
          <h4 id="travelDate" className="mb-1 flex text-h4 font-bold text-black">Gewünschtes Reisedatum <span className="ml-1 text-grey">*</span></h4>
          <div className="relative">
            <input
              type="date"
              id="travelDate"
              name="travelDate"
              value={formData.travelDate}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className="flex h-10 w-full rounded-[4px] border-2 border-grey bg-white px-3 py-2 pt-[10px] font-bold focus:border-[#0479cc] focus:shadow-[0px_0px_3px_2px_rgba(4,121,204,.32)] focus:ring-[3px] focus:ring-[#0479cc] mb-[1.2rem] text-p text-black"
              aria-labelledby="travelDate"
            />
            <div className="text-xs text-gray-500 mt-1">
              Bitte wählen Sie ein Datum in der Zukunft
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h4 id="arrivalTime" className="mb-1 flex text-h4 font-bold text-black">Ankunftszeit <span className="ml-1 text-grey">*</span></h4>
          <div className="relative">
            <input
              type="time"
              id="arrivalTime"
              name="arrivalTime"
              value={formData.arrivalTime}
              onChange={handleChange}
              required
              className="flex h-10 w-full rounded-[4px] border-2 border-grey bg-white px-3 py-2 pt-[10px] font-bold focus:border-[#0479cc] focus:shadow-[0px_0px_3px_2px_rgba(4,121,204,.32)] focus:ring-[3px] focus:ring-[#0479cc] mb-[1.2rem] text-p text-black"
              aria-labelledby="arrivalTime"
            />
            <div className="text-xs text-gray-500 mt-1">
              Format: HH:MM (z.B. 09:30)
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h4 id="additionalNotes" className="mb-1 flex text-h4 font-bold text-black">Zusätzliche Anmerkungen</h4>
          <textarea
            id="additionalNotes"
            name="additionalNotes"
            value={formData.additionalNotes}
            onChange={handleChange}
            rows={3}
            className="flex w-full rounded-[4px] border-2 border-grey bg-white px-3 py-2 font-bold focus:border-[#0479cc] focus:shadow-[0px_0px_3px_2px_rgba(4,121,204,.32)] focus:ring-[3px] focus:ring-[#0479cc] mb-[1.2rem] text-p text-black"
            aria-labelledby="additionalNotes"
          ></textarea>
        </div>
        
        <div className="mt-8 text-p text-grey">* Diese Felder müssen ausgefüllt werden</div>
        
        <div className="mt-8 flex w-full items-end justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-lg min-w-[160px] bg-[#0479cc] hover:bg-[#035999] text-white font-bold tracking-[0.2px] h-10 px-4 py-2 focus:shadow-[0px_0px_3px_2px_rgba(4,121,204,.32)] disabled:opacity-50 disabled:hover:bg-[#0479cc]"
          >
            {isLoading ? 'Wird verarbeitet...' : 'Anmeldung absenden'}
          </button>
        </div>
      </form>
    </div>
  );
} 