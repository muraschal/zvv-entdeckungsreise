'use client';

import { useState } from 'react';

export default function Home() {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Zuerst den Code validieren
      const validateResponse = await fetch('/api/validate', {
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
      const response = await fetch('/api/redeem', {
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
      <div className="max-w-md mx-auto mt-10 p-4">
        <h1 className="text-xl font-bold text-green-600 mb-2">Anmeldung erfolgreich!</h1>
        <p>Vielen Dank für deine Anmeldung zur ZVV-Entdeckungsreise.</p>
        <p className="mb-4">Wir haben eine Bestätigungs-E-Mail an dich gesendet.</p>
        <button
          onClick={() => setSuccess(false)}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Neue Anmeldung
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">ZVV-Entdeckungsreise Anmeldung</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-2 mb-4">
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
          <input
            type="date"
            id="travelDate"
            name="travelDate"
            value={formData.travelDate}
            onChange={handleChange}
            required
            className="w-full p-2 border"
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="arrivalTime" className="block mb-1">Ankunftszeit*</label>
          <input
            type="time"
            id="arrivalTime"
            name="arrivalTime"
            value={formData.arrivalTime}
            onChange={handleChange}
            required
            className="w-full p-2 border"
          />
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