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
      
      <form onSubmit={handleSubmit} className="cmp-newsletter__form">
        <div className="grid gap-6 mb-4">
          <div className="cmp-form-text cmp-newsletter__input-wrapper">
            <label htmlFor="code">
              Ticketcode
            </label>
            <div className="cmp-newsletter__input-wrapper-inner">
              <input
                id="code"
                className="cmp-form-text__text cmp-newsletter__input"
                placeholder="Ticketcode eingeben"
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
                aria-describedby="code-desc"
                data-cmphookformtext=""
                data-cmprequiredmessage="Bitte geben Sie einen Ticketcode ein"
              />
            </div>
          </div>
          
          <div className="cmp-form-text cmp-newsletter__input-wrapper">
            <label htmlFor="school">
              Schule
            </label>
            <div className="cmp-newsletter__input-wrapper-inner">
              <input
                id="school"
                className="cmp-form-text__text cmp-newsletter__input"
                placeholder="Name der Schule"
                name="school"
                value={formData.school}
                onChange={handleChange}
                required
                aria-describedby="school-desc"
                data-cmphookformtext=""
                data-cmprequiredmessage="Bitte geben Sie den Namen der Schule ein"
              />
            </div>
          </div>
          
          <div className="cmp-form-text cmp-newsletter__input-wrapper">
            <label htmlFor="contactPerson">
              Kontaktperson
            </label>
            <div className="cmp-newsletter__input-wrapper-inner">
              <input
                id="contactPerson"
                className="cmp-form-text__text cmp-newsletter__input"
                placeholder="Name der Kontaktperson"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                required
                aria-describedby="contactPerson-desc"
                data-cmphookformtext=""
                data-cmprequiredmessage="Bitte geben Sie den Namen der Kontaktperson ein"
              />
            </div>
          </div>
          
          <div className="cmp-form-text cmp-newsletter__input-wrapper">
            <label htmlFor="email">
              E-Mail
            </label>
            <div className="cmp-newsletter__input-wrapper-inner">
              <input
                id="email"
                className="cmp-form-text__text cmp-newsletter__input"
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
            </div>
          </div>
          
          <div className="cmp-form-text cmp-newsletter__input-wrapper">
            <label htmlFor="phoneNumber">
              Telefon
            </label>
            <div className="cmp-newsletter__input-wrapper-inner">
              <input
                id="phoneNumber"
                className="cmp-form-text__text cmp-newsletter__input"
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
            </div>
          </div>
          
          <div className="cmp-form-text cmp-newsletter__input-wrapper">
            <label htmlFor="className">
              Klasse
            </label>
            <div className="cmp-newsletter__input-wrapper-inner">
              <div className="cmp-dropdown zone-category">
                <div 
                  tabIndex={1} 
                  className="cmp-dropdown__label"
                  onClick={() => {
                    // Toggle dropdown visibility
                    const dropdown = document.querySelector('.cmp-dropdown__options');
                    if (dropdown) {
                      dropdown.classList.toggle('visible');
                    }
                  }}
                >
                  {formData.className || 'Bitte wählen'}
                </div>
                <div className="cmp-dropdown__options">
                  <div 
                    className="cmp-dropdown__option" 
                    id="0" 
                    data-value=""
                    onClick={(e) => {
                      const value = '';
                      setFormData(prev => ({ ...prev, className: value }));
                      // Hide dropdown after selection
                      e.currentTarget.parentElement?.classList.remove('visible');
                    }}
                  >
                    Bitte wählen
                  </div>
                  <div 
                    className="cmp-dropdown__option" 
                    id="1" 
                    data-value="4. Klasse"
                    onClick={(e) => {
                      const value = '4. Klasse';
                      setFormData(prev => ({ ...prev, className: value }));
                      // Hide dropdown after selection
                      e.currentTarget.parentElement?.classList.remove('visible');
                    }}
                  >
                    4. Klasse
                  </div>
                  <div 
                    className="cmp-dropdown__option" 
                    id="2" 
                    data-value="5. Klasse"
                    onClick={(e) => {
                      const value = '5. Klasse';
                      setFormData(prev => ({ ...prev, className: value }));
                      // Hide dropdown after selection
                      e.currentTarget.parentElement?.classList.remove('visible');
                    }}
                  >
                    5. Klasse
                  </div>
                  <div 
                    className="cmp-dropdown__option" 
                    id="3" 
                    data-value="6. Klasse"
                    onClick={(e) => {
                      const value = '6. Klasse';
                      setFormData(prev => ({ ...prev, className: value }));
                      // Hide dropdown after selection
                      e.currentTarget.parentElement?.classList.remove('visible');
                    }}
                  >
                    6. Klasse
                  </div>
                </div>
                <input 
                  type="hidden" 
                  id="className"
                  name="className"
                  value={formData.className}
                  required
                  aria-describedby="className-desc"
                  data-cmprequiredmessage="Bitte wählen Sie eine Klasse aus"
                />
              </div>
            </div>
          </div>
          
          <div className="cmp-form-text cmp-newsletter__input-wrapper">
            <label htmlFor="studentCount">
              Anzahl Schüler
            </label>
            <div className="cmp-newsletter__input-wrapper-inner">
              <input
                id="studentCount"
                className="cmp-form-text__text cmp-newsletter__input"
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
            </div>
          </div>
          
          <div className="cmp-form-text cmp-newsletter__input-wrapper">
            <label htmlFor="accompanistCount">
              Begleitpersonen
            </label>
            <div className="cmp-newsletter__input-wrapper-inner">
              <input
                id="accompanistCount"
                className="cmp-form-text__text cmp-newsletter__input"
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
            </div>
          </div>
          
          <div className="cmp-form-text cmp-newsletter__input-wrapper">
            <label htmlFor="travelDate">
              Reisedatum
            </label>
            <div className="cmp-newsletter__input-wrapper-inner">
              <input
                id="travelDate"
                className="cmp-form-text__text cmp-newsletter__input"
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
            </div>
          </div>
          
          <div className="cmp-form-text cmp-newsletter__input-wrapper">
            <label htmlFor="arrivalTime">
              Ankunftszeit
            </label>
            <div className="cmp-newsletter__input-wrapper-inner">
              <input
                id="arrivalTime"
                className="cmp-form-text__text cmp-newsletter__input"
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
            </div>
          </div>
          
          <div className="cmp-form-text cmp-newsletter__input-wrapper">
            <label htmlFor="additionalNotes">
              Anmerkungen
            </label>
            <div className="cmp-newsletter__input-wrapper-inner">
              <textarea
                id="additionalNotes"
                className="cmp-form-text__text cmp-newsletter__input"
                placeholder="Zusätzliche Anmerkungen"
                name="additionalNotes"
                rows={2}
                value={formData.additionalNotes}
                onChange={handleChange}
                aria-describedby="additionalNotes-desc"
                data-cmphookformtext=""
                data-cmprequiredmessage=""
              ></textarea>
            </div>
          </div>
        </div>
        
        <div className="text-sm text-grey mb-4">* Alle Felder sind Pflichtfelder, außer Anmerkungen</div>
        
        <div className="button">
          <button className="cmp-button" type="submit" disabled={isLoading}>
            <span className="cmp-button__text">
              {isLoading ? 'Wird verarbeitet...' : 'Anmeldung absenden'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
} 