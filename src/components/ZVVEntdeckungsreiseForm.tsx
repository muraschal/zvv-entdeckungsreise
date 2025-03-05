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
      <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
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
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 mb-4">
          <div>
            <div className="cmp-form-text">
              <input
                id="code"
                className="cmp-form-text__text"
                placeholder="Ticketcode eingeben"
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
                aria-describedby="code-desc"
                data-cmphookformtext=""
                data-cmprequiredmessage="Bitte geben Sie einen Ticketcode ein"
              />
              <label htmlFor="code">Ticketcode</label>
            </div>
          </div>
          
          <div>
            <div className="cmp-form-text">
              <input
                id="school"
                className="cmp-form-text__text"
                placeholder="Name der Schule"
                name="school"
                value={formData.school}
                onChange={handleChange}
                required
                aria-describedby="school-desc"
                data-cmphookformtext=""
                data-cmprequiredmessage="Bitte geben Sie den Namen der Schule ein"
              />
              <label htmlFor="school">Schule</label>
            </div>
          </div>
          
          <div>
            <div className="cmp-form-text">
              <input
                id="contactPerson"
                className="cmp-form-text__text"
                placeholder="Name der Kontaktperson"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                required
                aria-describedby="contactPerson-desc"
                data-cmphookformtext=""
                data-cmprequiredmessage="Bitte geben Sie den Namen der Kontaktperson ein"
              />
              <label htmlFor="contactPerson">Kontaktperson</label>
            </div>
          </div>
          
          <div>
            <div className="cmp-form-text">
              <input
                id="email"
                className="cmp-form-text__text"
                placeholder="E-Mail-Adresse"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                aria-describedby="email-desc"
                data-cmphookformtext=""
                data-cmprequiredmessage="Bitte geben Sie eine gültige E-Mail-Adresse ein"
              />
              <label htmlFor="email">E-Mail</label>
            </div>
          </div>
          
          <div>
            <div className="cmp-form-text">
              <input
                id="phoneNumber"
                className="cmp-form-text__text"
                placeholder="Telefonnummer"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                aria-describedby="phoneNumber-desc"
                data-cmphookformtext=""
                data-cmprequiredmessage="Bitte geben Sie eine Telefonnummer ein"
              />
              <label htmlFor="phoneNumber">Telefon</label>
            </div>
          </div>
          
          <div>
            <div className="cmp-form-text">
              <select
                id="className"
                className="cmp-form-text__text"
                name="className"
                value={formData.className}
                onChange={handleChange}
                required
                aria-describedby="className-desc"
                data-cmphookformtext=""
                data-cmprequiredmessage="Bitte wählen Sie eine Klasse aus"
              >
                <option value="">Bitte wählen</option>
                <option value="4. Klasse">4. Klasse</option>
                <option value="5. Klasse">5. Klasse</option>
                <option value="6. Klasse">6. Klasse</option>
              </select>
              <label htmlFor="className">Klasse</label>
            </div>
          </div>
          
          <div>
            <div className="cmp-form-text">
              <input
                id="studentCount"
                className="cmp-form-text__text"
                placeholder="Anzahl der Schüler"
                name="studentCount"
                type="number"
                min="1"
                value={formData.studentCount}
                onChange={handleChange}
                required
                aria-describedby="studentCount-desc"
                data-cmphookformtext=""
                data-cmprequiredmessage="Bitte geben Sie die Anzahl der Schüler ein"
              />
              <label htmlFor="studentCount">Anzahl Schüler</label>
            </div>
          </div>
          
          <div>
            <div className="cmp-form-text">
              <input
                id="accompanistCount"
                className="cmp-form-text__text"
                placeholder="Anzahl der Begleitpersonen"
                name="accompanistCount"
                type="number"
                min="1"
                value={formData.accompanistCount}
                onChange={handleChange}
                required
                aria-describedby="accompanistCount-desc"
                data-cmphookformtext=""
                data-cmprequiredmessage="Bitte geben Sie die Anzahl der Begleitpersonen ein"
              />
              <label htmlFor="accompanistCount">Begleitpersonen</label>
            </div>
          </div>
          
          <div>
            <div className="cmp-form-text">
              <input
                id="travelDate"
                className="cmp-form-text__text"
                placeholder="Reisedatum auswählen"
                name="travelDate"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={formData.travelDate}
                onChange={handleChange}
                required
                aria-describedby="travelDate-desc"
                data-cmphookformtext=""
                data-cmprequiredmessage="Bitte wählen Sie ein Reisedatum aus"
              />
              <label htmlFor="travelDate">Reisedatum</label>
            </div>
          </div>
          
          <div>
            <div className="cmp-form-text">
              <input
                id="arrivalTime"
                className="cmp-form-text__text"
                placeholder="Ankunftszeit auswählen"
                name="arrivalTime"
                type="time"
                value={formData.arrivalTime}
                onChange={handleChange}
                required
                aria-describedby="arrivalTime-desc"
                data-cmphookformtext=""
                data-cmprequiredmessage="Bitte wählen Sie eine Ankunftszeit aus"
              />
              <label htmlFor="arrivalTime">Ankunftszeit</label>
            </div>
          </div>
          
          <div>
            <div className="cmp-form-text">
              <textarea
                id="additionalNotes"
                className="cmp-form-text__text"
                placeholder="Zusätzliche Anmerkungen"
                name="additionalNotes"
                rows={2}
                value={formData.additionalNotes}
                onChange={handleChange}
                aria-describedby="additionalNotes-desc"
                data-cmphookformtext=""
                data-cmprequiredmessage=""
              ></textarea>
              <label htmlFor="additionalNotes">Anmerkungen</label>
            </div>
          </div>
        </div>
        
        <div className="text-sm text-grey mb-4">* Alle Felder sind Pflichtfelder, außer Anmerkungen</div>
        
        <div className="flex justify-end">
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