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
        <h1 className="text-2xl font-bold text-green-600 mb-4">Anmeldung erfolgreich!</h1>
        <p className="mb-4">Vielen Dank für deine Anmeldung zur ZVV-Entdeckungsreise.</p>
        <p className="mb-4">Wir haben deine Anfrage erhalten und eine Bestätigungs-E-Mail an dich gesendet.</p>
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
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Ticketcode */}
        <div className="cmp-row-container aem-Grid cmp-row-container--spacing" style={{ "--cmp-row-vertical-spacing": "0px" } as React.CSSProperties}>
          <div className="aem-GridColumn aem-GridColumn--vps--12 aem-GridColumn aem-GridColumn--vpl--4 aem-GridColumn--vpm--4 aem-GridColumn--vpms--4">
            <label htmlFor="code">Ticketcode</label>
          </div>
          <div className="aem-GridColumn aem-GridColumn--vps--12 aem-GridColumn aem-GridColumn--vpl--8 aem-GridColumn--vpm--8 aem-GridColumn--vpms--8">
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
            </div>
          </div>
        </div>
        
        {/* Schule */}
        <div className="cmp-row-container aem-Grid cmp-row-container--spacing" style={{ "--cmp-row-vertical-spacing": "0px" } as React.CSSProperties}>
          <div className="aem-GridColumn aem-GridColumn--vps--12 aem-GridColumn aem-GridColumn--vpl--4 aem-GridColumn--vpm--4 aem-GridColumn--vpms--4">
            <label htmlFor="school">Schule</label>
          </div>
          <div className="aem-GridColumn aem-GridColumn--vps--12 aem-GridColumn aem-GridColumn--vpl--8 aem-GridColumn--vpm--8 aem-GridColumn--vpms--8">
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
            </div>
          </div>
        </div>
        
        {/* Kontaktperson */}
        <div className="cmp-row-container aem-Grid cmp-row-container--spacing" style={{ "--cmp-row-vertical-spacing": "0px" } as React.CSSProperties}>
          <div className="aem-GridColumn aem-GridColumn--vps--12 aem-GridColumn aem-GridColumn--vpl--4 aem-GridColumn--vpm--4 aem-GridColumn--vpms--4">
            <label htmlFor="contactPerson">Kontaktperson</label>
          </div>
          <div className="aem-GridColumn aem-GridColumn--vps--12 aem-GridColumn aem-GridColumn--vpl--8 aem-GridColumn--vpm--8 aem-GridColumn--vpms--8">
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
            </div>
          </div>
        </div>
        
        {/* E-Mail */}
        <div className="cmp-row-container aem-Grid cmp-row-container--spacing" style={{ "--cmp-row-vertical-spacing": "0px" } as React.CSSProperties}>
          <div className="aem-GridColumn aem-GridColumn--vps--12 aem-GridColumn aem-GridColumn--vpl--4 aem-GridColumn--vpm--4 aem-GridColumn--vpms--4">
            <label htmlFor="email">E-Mail</label>
          </div>
          <div className="aem-GridColumn aem-GridColumn--vps--12 aem-GridColumn aem-GridColumn--vpl--8 aem-GridColumn--vpm--8 aem-GridColumn--vpms--8">
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
            </div>
          </div>
        </div>
        
        {/* Telefon */}
        <div className="cmp-row-container aem-Grid cmp-row-container--spacing" style={{ "--cmp-row-vertical-spacing": "0px" } as React.CSSProperties}>
          <div className="aem-GridColumn aem-GridColumn--vps--12 aem-GridColumn aem-GridColumn--vpl--4 aem-GridColumn--vpm--4 aem-GridColumn--vpms--4">
            <label htmlFor="phoneNumber">Telefon</label>
          </div>
          <div className="aem-GridColumn aem-GridColumn--vps--12 aem-GridColumn aem-GridColumn--vpl--8 aem-GridColumn--vpm--8 aem-GridColumn--vpms--8">
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
            </div>
          </div>
        </div>
        
        {/* Klasse */}
        <div className="cmp-row-container aem-Grid cmp-row-container--spacing" style={{ "--cmp-row-vertical-spacing": "0px" } as React.CSSProperties}>
          <div className="aem-GridColumn aem-GridColumn--vps--12 aem-GridColumn aem-GridColumn--vpl--4 aem-GridColumn--vpm--4 aem-GridColumn--vpms--4">
            <label htmlFor="className" className="cmp-teacher-training-material__classes-dropdown-title">Klasse</label>
          </div>
          <div className="aem-GridColumn aem-GridColumn--vps--12 aem-GridColumn aem-GridColumn--vpl--8 aem-GridColumn--vpm--8 aem-GridColumn--vpms--8">
            <div className="cmp-dropdown__wrapper">
              <div className={`cmp-dropdown ${dropdownVisible ? 'visible' : ''}`}>
                <div 
                  tabIndex={0} 
                  className="cmp-dropdown__label"
                  onClick={() => setDropdownVisible(!dropdownVisible)}
                >
                  {formData.className || 'Bitte wählen'}
                </div>
                <div className="cmp-dropdown__options">
                  <div 
                    className={`cmp-dropdown__option ${!formData.className ? 'cmp-dropdown__option--selected' : ''}`} 
                    data-value=""
                    onClick={() => {
                      setFormData(prev => ({ ...prev, className: '' }));
                      setDropdownVisible(false);
                    }}
                  >
                    Bitte wählen
                  </div>
                  <div 
                    className={`cmp-dropdown__option ${formData.className === '4. Klasse' ? 'cmp-dropdown__option--selected' : ''}`} 
                    data-value="klasse-4"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, className: '4. Klasse' }));
                      setDropdownVisible(false);
                    }}
                  >
                    4.
                  </div>
                  <div 
                    className={`cmp-dropdown__option ${formData.className === '5. Klasse' ? 'cmp-dropdown__option--selected' : ''}`} 
                    data-value="klasse-5"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, className: '5. Klasse' }));
                      setDropdownVisible(false);
                    }}
                  >
                    5.
                  </div>
                  <div 
                    className={`cmp-dropdown__option ${formData.className === '6. Klasse' ? 'cmp-dropdown__option--selected' : ''}`} 
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
              <div className="cmp-dropdown__spacer"></div>
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
        
        {/* Anzahl Schüler */}
        <div className="cmp-row-container aem-Grid cmp-row-container--spacing" style={{ "--cmp-row-vertical-spacing": "0px" } as React.CSSProperties}>
          <div className="aem-GridColumn aem-GridColumn--vps--12 aem-GridColumn aem-GridColumn--vpl--4 aem-GridColumn--vpm--4 aem-GridColumn--vpms--4">
            <label htmlFor="studentCount">Anzahl Schüler</label>
          </div>
          <div className="aem-GridColumn aem-GridColumn--vps--12 aem-GridColumn aem-GridColumn--vpl--8 aem-GridColumn--vpm--8 aem-GridColumn--vpms--8">
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
            </div>
          </div>
        </div>
        
        {/* Begleitpersonen */}
        <div className="cmp-row-container aem-Grid cmp-row-container--spacing" style={{ "--cmp-row-vertical-spacing": "0px" } as React.CSSProperties}>
          <div className="aem-GridColumn aem-GridColumn--vps--12 aem-GridColumn aem-GridColumn--vpl--4 aem-GridColumn--vpm--4 aem-GridColumn--vpms--4">
            <label htmlFor="accompanistCount">Begleitpersonen</label>
          </div>
          <div className="aem-GridColumn aem-GridColumn--vps--12 aem-GridColumn aem-GridColumn--vpl--8 aem-GridColumn--vpm--8 aem-GridColumn--vpms--8">
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
            </div>
          </div>
        </div>
        
        {/* Reisedatum */}
        <div className="cmp-row-container aem-Grid cmp-row-container--spacing" style={{ "--cmp-row-vertical-spacing": "0px" } as React.CSSProperties}>
          <div className="aem-GridColumn aem-GridColumn--vps--12 aem-GridColumn aem-GridColumn--vpl--4 aem-GridColumn--vpm--4 aem-GridColumn--vpms--4">
            <label htmlFor="travelDate">Reisedatum</label>
          </div>
          <div className="aem-GridColumn aem-GridColumn--vps--12 aem-GridColumn aem-GridColumn--vpl--8 aem-GridColumn--vpm--8 aem-GridColumn--vpms--8">
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
            </div>
          </div>
        </div>
        
        {/* Ankunftszeit */}
        <div className="cmp-row-container aem-Grid cmp-row-container--spacing" style={{ "--cmp-row-vertical-spacing": "0px" } as React.CSSProperties}>
          <div className="aem-GridColumn aem-GridColumn--vps--12 aem-GridColumn aem-GridColumn--vpl--4 aem-GridColumn--vpm--4 aem-GridColumn--vpms--4">
            <label htmlFor="arrivalTime">Ankunftszeit</label>
          </div>
          <div className="aem-GridColumn aem-GridColumn--vps--12 aem-GridColumn aem-GridColumn--vpl--8 aem-GridColumn--vpm--8 aem-GridColumn--vpms--8">
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
            </div>
          </div>
        </div>
        
        {/* Anmerkungen */}
        <div className="cmp-row-container aem-Grid cmp-row-container--spacing" style={{ "--cmp-row-vertical-spacing": "0px" } as React.CSSProperties}>
          <div className="aem-GridColumn aem-GridColumn--vps--12 aem-GridColumn aem-GridColumn--vpl--4 aem-GridColumn--vpm--4 aem-GridColumn--vpms--4">
            <label htmlFor="additionalNotes">Anmerkungen</label>
          </div>
          <div className="aem-GridColumn aem-GridColumn--vps--12 aem-GridColumn aem-GridColumn--vpl--8 aem-GridColumn--vpm--8 aem-GridColumn--vpms--8">
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