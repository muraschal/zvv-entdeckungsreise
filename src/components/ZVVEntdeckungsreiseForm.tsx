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
  const [dropdownVisible, setDropdownVisible] = useState(false);

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
        <h1 className="text-2xl font-bold text-green-600 mb-4">Danke für Ihre Ticketbestellung.</h1>
        <p className="mb-4">Die Tickets werden in den nächsten 7 Arbeitstagen an die angegebene Schulhaus-Adresse verschickt. Wir wünschen Ihrer Klasse schon jetzt viel Spass auf der ZVV-Entdeckungsreise.</p>
        <button
          onClick={() => setSuccess(false)}
          className="cmp-button"
        >
          <span className="cmp-button__text">Zurück zum Formular</span>
        </button>
      </div>
    );
  }

  return (
    <div className="zvv-form max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      {error && (
        <div 
          className="zvv-form__error mb-4 p-3 bg-red-100 text-red-700 rounded"
          dangerouslySetInnerHTML={{ __html: error }}
        />
      )}
      
      <form onSubmit={handleSubmit} className="zvv-form__container">
        {/* Ticketcode */}
        <div className="zvv-form__row">
          <div className="zvv-form__label-col">
            <label htmlFor="code" className="zvv-form__label">Ticketcode</label>
          </div>
          <div className="zvv-form__input-col">
            <div className="zvv-form__input-wrapper">
              <input
                id="code"
                className="zvv-form__input"
                style={{ width: "100%" }}
                placeholder="Ticketcode eingeben"
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
                aria-describedby="code-desc"
              />
            </div>
          </div>
        </div>
        
        {/* Schule */}
        <div className="zvv-form__row">
          <div className="zvv-form__label-col">
            <label htmlFor="school" className="zvv-form__label">Schule</label>
          </div>
          <div className="zvv-form__input-col">
            <div className="zvv-form__input-wrapper">
              <input
                id="school"
                className="zvv-form__input"
                style={{ width: "100%" }}
                placeholder="Name der Schule"
                name="school"
                value={formData.school}
                onChange={handleChange}
                required
                aria-describedby="school-desc"
              />
            </div>
          </div>
        </div>
        
        {/* Kontaktperson */}
        <div className="zvv-form__row">
          <div className="zvv-form__label-col">
            <label htmlFor="contactPerson" className="zvv-form__label">Kontaktperson</label>
          </div>
          <div className="zvv-form__input-col">
            <div className="zvv-form__input-wrapper">
              <input
                id="contactPerson"
                className="zvv-form__input"
                style={{ width: "100%" }}
                placeholder="Name der Kontaktperson"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                required
                aria-describedby="contactPerson-desc"
              />
            </div>
          </div>
        </div>
        
        {/* E-Mail */}
        <div className="zvv-form__row">
          <div className="zvv-form__label-col">
            <label htmlFor="email" className="zvv-form__label">E-Mail</label>
          </div>
          <div className="zvv-form__input-col">
            <div className="zvv-form__input-wrapper">
              <input
                id="email"
                className="zvv-form__input"
                style={{ width: "100%" }}
                placeholder="E-Mail-Adresse"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                aria-describedby="email-desc"
              />
            </div>
          </div>
        </div>
        
        {/* Telefon */}
        <div className="zvv-form__row">
          <div className="zvv-form__label-col">
            <label htmlFor="phoneNumber" className="zvv-form__label">Telefon</label>
          </div>
          <div className="zvv-form__input-col">
            <div className="zvv-form__input-wrapper">
              <input
                id="phoneNumber"
                className="zvv-form__input"
                style={{ width: "100%" }}
                placeholder="Telefonnummer"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                aria-describedby="phoneNumber-desc"
              />
            </div>
          </div>
        </div>
        
        {/* Klasse */}
        <div className="zvv-form__row">
          <div className="zvv-form__label-col">
            <label htmlFor="className" className="zvv-form__label">Klasse</label>
          </div>
          <div className="zvv-form__input-col">
            <div className="zvv-form__input-wrapper">
              <div className={`zvv-form__dropdown ${dropdownVisible ? 'visible' : ''}`}>
                <div 
                  tabIndex={0} 
                  className="zvv-form__dropdown-label"
                  onClick={() => setDropdownVisible(!dropdownVisible)}
                >
                  {formData.className || 'Bitte wählen'}
                </div>
                <div className="zvv-form__dropdown-options">
                  <div 
                    className={`zvv-form__dropdown-option ${!formData.className ? 'zvv-form__dropdown-option--selected' : ''}`} 
                    data-value=""
                    onClick={() => {
                      setFormData(prev => ({ ...prev, className: '' }));
                      setDropdownVisible(false);
                    }}
                  >
                    Bitte wählen
                  </div>
                  <div 
                    className={`zvv-form__dropdown-option ${formData.className === '4. Klasse' ? 'zvv-form__dropdown-option--selected' : ''}`} 
                    data-value="klasse-4"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, className: '4. Klasse' }));
                      setDropdownVisible(false);
                    }}
                  >
                    4.
                  </div>
                  <div 
                    className={`zvv-form__dropdown-option ${formData.className === '5. Klasse' ? 'zvv-form__dropdown-option--selected' : ''}`} 
                    data-value="klasse-5"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, className: '5. Klasse' }));
                      setDropdownVisible(false);
                    }}
                  >
                    5.
                  </div>
                  <div 
                    className={`zvv-form__dropdown-option ${formData.className === '6. Klasse' ? 'zvv-form__dropdown-option--selected' : ''}`} 
                    data-value="klasse-6"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, className: '6. Klasse' }));
                      setDropdownVisible(false);
                    }}
                  >
                    6.
                  </div>
                </div>
              </div>
              <div className="zvv-form__dropdown-spacer"></div>
              <input 
                type="hidden" 
                id="className"
                name="className"
                value={formData.className}
                required
                aria-describedby="className-desc"
              />
            </div>
          </div>
        </div>
        
        {/* Anzahl Schüler */}
        <div className="zvv-form__row">
          <div className="zvv-form__label-col">
            <label htmlFor="studentCount" className="zvv-form__label">Anzahl Schüler</label>
          </div>
          <div className="zvv-form__input-col">
            <div className="zvv-form__input-wrapper">
              <input
                id="studentCount"
                className="zvv-form__input"
                style={{ width: "100%" }}
                placeholder="Anzahl der Schüler"
                name="studentCount"
                type="number"
                min="1"
                value={formData.studentCount}
                onChange={handleChange}
                required
                aria-describedby="studentCount-desc"
              />
            </div>
          </div>
        </div>
        
        {/* Begleitpersonen */}
        <div className="zvv-form__row">
          <div className="zvv-form__label-col">
            <label htmlFor="accompanistCount" className="zvv-form__label">Begleitpersonen</label>
          </div>
          <div className="zvv-form__input-col">
            <div className="zvv-form__input-wrapper">
              <input
                id="accompanistCount"
                className="zvv-form__input"
                style={{ width: "100%" }}
                placeholder="Anzahl der Begleitpersonen"
                name="accompanistCount"
                type="number"
                min="1"
                value={formData.accompanistCount}
                onChange={handleChange}
                required
                aria-describedby="accompanistCount-desc"
              />
            </div>
          </div>
        </div>
        
        {/* Reisedatum */}
        <div className="zvv-form__row">
          <div className="zvv-form__label-col">
            <label htmlFor="travelDate" className="zvv-form__label">Reisedatum</label>
          </div>
          <div className="zvv-form__input-col">
            <div className="zvv-form__input-wrapper">
              <input
                id="travelDate"
                className="zvv-form__input"
                style={{ width: "100%" }}
                placeholder="Reisedatum auswählen"
                name="travelDate"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={formData.travelDate}
                onChange={handleChange}
                required
                aria-describedby="travelDate-desc"
              />
            </div>
          </div>
        </div>
        
        {/* Ankunftszeit */}
        <div className="zvv-form__row">
          <div className="zvv-form__label-col">
            <label htmlFor="arrivalTime" className="zvv-form__label">Ankunftszeit</label>
          </div>
          <div className="zvv-form__input-col">
            <div className="zvv-form__input-wrapper">
              <input
                id="arrivalTime"
                className="zvv-form__input"
                style={{ width: "100%" }}
                placeholder="Ankunftszeit auswählen"
                name="arrivalTime"
                type="time"
                value={formData.arrivalTime}
                onChange={handleChange}
                required
                aria-describedby="arrivalTime-desc"
              />
            </div>
          </div>
        </div>
        
        {/* Anmerkungen */}
        <div className="zvv-form__row">
          <div className="zvv-form__label-col">
            <label htmlFor="additionalNotes" className="zvv-form__label">Anmerkungen</label>
          </div>
          <div className="zvv-form__input-col">
            <div className="zvv-form__input-wrapper">
              <textarea
                id="additionalNotes"
                className="zvv-form__textarea"
                placeholder="Zusätzliche Anmerkungen"
                name="additionalNotes"
                rows={2}
                value={formData.additionalNotes}
                onChange={handleChange}
                aria-describedby="additionalNotes-desc"
              ></textarea>
            </div>
          </div>
        </div>
        
        <div className="text-sm text-grey mb-4">* Alle Felder sind Pflichtfelder, ausser Anmerkungen</div>
        
        <button className="cmp-button" type="submit" disabled={isLoading}>
          <span className="cmp-button__text">
            {isLoading ? 'Wird verarbeitet...' : 'Anmeldung absenden'}
          </span>
        </button>
      </form>
    </div>
  );
} 