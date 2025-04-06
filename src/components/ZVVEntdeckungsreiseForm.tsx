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

// Cache-Speicher für API-Antworten
const apiCache: Record<string, { data: any; timestamp: number }> = {};

// Funktion zum Abrufen von Daten mit Caching (direkt in der Komponente implementiert)
const fetchWithCache = async (url: string, options: RequestInit, cacheTimeout: number = 300000) => {
  const cacheKey = `${url}-${JSON.stringify(options)}`;
  const now = Date.now();
  
  // Wenn Daten im Cache sind und noch nicht abgelaufen, verwende sie
  if (apiCache[cacheKey] && now - apiCache[cacheKey].timestamp < cacheTimeout) {
    return apiCache[cacheKey].data;
  }
  
  // Ansonsten hol die Daten und speichere sie im Cache
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    apiCache[cacheKey] = { data, timestamp: now };
    return data;
  } catch (error) {
    console.error('Fehler beim Abrufen der Daten:', error);
    throw error;
  }
};

// Exportierbare Komponente für die Integration in externe Websites
export function ZVVEntdeckungsreiseForm({ 
  apiBaseUrl = '', 
  environment = 'PRD',
  cacheTimeout = 300000
}: { 
  apiBaseUrl?: string; 
  environment?: 'INT' | 'PRD';
  cacheTimeout?: number;
}) {
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

  // Log environment and render timestamp on component mount
  useState(() => {
    console.log(`ZVVEntdeckungsreiseForm Komponente initialisiert - Umgebung: ${environment}`);
    console.log(`Render-Zeitstempel: ${new Date().toISOString()}`);
  });

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
      let validateData;
      try {
        // Verwende die importierte fetchWithCache-Funktion
        validateData = await fetchWithCache(
          `${apiBaseUrl}/api/validate`, 
          {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'X-Environment': environment // Umgebungsparameter hinzufügen
            },
            body: JSON.stringify({ code: formData.code }),
          },
          cacheTimeout
        );
      } catch (cacheError) {
        // Fallback auf normalen fetch, wenn fetchWithCache fehlschlägt
        const validateResponse = await fetch(`${apiBaseUrl}/api/validate`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'X-Environment': environment
          },
          body: JSON.stringify({ code: formData.code }),
        });
        validateData = await validateResponse.json();
      }

      if (!validateData.valid) {
        setError(validateData.message || 'Ungültiger Code');
        setIsLoading(false);
        return;
      }

      // Wenn der Code gültig ist, das Formular einreichen
      const response = await fetch(`${apiBaseUrl}/api/redeem`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Environment': environment // Umgebungsparameter hinzufügen
        },
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
      <div className="cmp-container">
        <div className="cmp-container__content">
          <div className="cmp-text">
            <h1>Danke für Ihre Ticketbestellung.</h1>
            <p>Die Tickets werden in den nächsten 7 Arbeitstagen an die angegebene Schulhaus-Adresse verschickt. Wir wünschen Ihrer Klasse schon jetzt viel Spass auf der ZVV-Entdeckungsreise.</p>
          </div>
          <button
            onClick={() => setSuccess(false)}
            className="cmp-button"
          >
            <span className="cmp-button__text">Zurück zum Formular</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cmp-container">
      <div className="cmp-container__content">
        {error && (
          <div className="cmp-alert cmp-alert--error">
            <div className="cmp-alert__content">
              <p>{error}</p>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="cmp-form">
          <div className="cmp-form__content">
            {/* Ticketcode */}
            <div className="cmp-form__item">
              <div className="cmp-form__label-wrapper">
                <label htmlFor="code" className="cmp-form__label">Ticketcode</label>
              </div>
              <div className="cmp-form__field-wrapper">
                <input
                  id="code"
                  className="cmp-form__field cmp-form__field--text"
                  placeholder="Ticketcode eingeben"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  required
                  aria-describedby="code-desc"
                />
              </div>
            </div>
            
            {/* Schule */}
            <div className="cmp-form__item">
              <div className="cmp-form__label-wrapper">
                <label htmlFor="school" className="cmp-form__label">Schule</label>
              </div>
              <div className="cmp-form__field-wrapper">
                <input
                  id="school"
                  className="cmp-form__field cmp-form__field--text"
                  placeholder="Name der Schule"
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                  required
                  aria-describedby="school-desc"
                />
              </div>
            </div>
            
            {/* Kontaktperson */}
            <div className="cmp-form__item">
              <div className="cmp-form__label-wrapper">
                <label htmlFor="contactPerson" className="cmp-form__label">Kontaktperson</label>
              </div>
              <div className="cmp-form__field-wrapper">
                <input
                  id="contactPerson"
                  className="cmp-form__field cmp-form__field--text"
                  placeholder="Name der Kontaktperson"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* E-Mail */}
            <div className="cmp-form__item">
              <div className="cmp-form__label-wrapper">
                <label htmlFor="email" className="cmp-form__label">E-Mail</label>
              </div>
              <div className="cmp-form__field-wrapper">
                <input
                  id="email"
                  type="email"
                  className="cmp-form__field cmp-form__field--text"
                  placeholder="E-Mail-Adresse"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Telefon */}
            <div className="cmp-form__item">
              <div className="cmp-form__label-wrapper">
                <label htmlFor="phoneNumber" className="cmp-form__label">Telefon</label>
              </div>
              <div className="cmp-form__field-wrapper">
                <input
                  id="phoneNumber"
                  className="cmp-form__field cmp-form__field--text"
                  placeholder="Telefonnummer"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Klasse */}
            <div className="cmp-form__item">
              <div className="cmp-form__label-wrapper">
                <label htmlFor="className" className="cmp-form__label">Klasse</label>
              </div>
              <div className="cmp-form__field-wrapper">
                <input
                  id="className"
                  className="cmp-form__field cmp-form__field--text"
                  placeholder="Klassenbezeichnung"
                  name="className"
                  value={formData.className}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Anzahl Schüler */}
            <div className="cmp-form__item">
              <div className="cmp-form__label-wrapper">
                <label htmlFor="studentCount" className="cmp-form__label">Anzahl Schüler</label>
              </div>
              <div className="cmp-form__field-wrapper">
                <input
                  id="studentCount"
                  type="number"
                  className="cmp-form__field cmp-form__field--text"
                  placeholder="Anzahl Schüler"
                  name="studentCount"
                  value={formData.studentCount}
                  onChange={handleChange}
                  required
                  min="1"
                />
              </div>
            </div>

            {/* Anzahl Begleitpersonen */}
            <div className="cmp-form__item">
              <div className="cmp-form__label-wrapper">
                <label htmlFor="accompanistCount" className="cmp-form__label">Anzahl Begleitpersonen</label>
              </div>
              <div className="cmp-form__field-wrapper">
                <input
                  id="accompanistCount"
                  type="number"
                  className="cmp-form__field cmp-form__field--text"
                  placeholder="Anzahl Begleitpersonen"
                  name="accompanistCount"
                  value={formData.accompanistCount}
                  onChange={handleChange}
                  required
                  min="1"
                />
              </div>
            </div>

            {/* Reisedatum */}
            <div className="cmp-form__item">
              <div className="cmp-form__label-wrapper">
                <label htmlFor="travelDate" className="cmp-form__label">Reisedatum</label>
              </div>
              <div className="cmp-form__field-wrapper">
                <input
                  id="travelDate"
                  type="date"
                  className="cmp-form__field cmp-form__field--text"
                  name="travelDate"
                  value={formData.travelDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Abfahrtszeit */}
            <div className="cmp-form__item">
              <div className="cmp-form__label-wrapper">
                <label htmlFor="arrivalTime" className="cmp-form__label">Abfahrtszeit</label>
              </div>
              <div className="cmp-form__field-wrapper">
                <input
                  id="arrivalTime"
                  type="time"
                  className="cmp-form__field cmp-form__field--text"
                  name="arrivalTime"
                  value={formData.arrivalTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Bemerkungen */}
            <div className="cmp-form__item">
              <div className="cmp-form__label-wrapper">
                <label htmlFor="additionalNotes" className="cmp-form__label">Bemerkungen</label>
              </div>
              <div className="cmp-form__field-wrapper">
                <textarea
                  id="additionalNotes"
                  className="cmp-form__field cmp-form__field--textarea"
                  placeholder="Zusätzliche Bemerkungen"
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
            </div>

            <div className="cmp-form__item cmp-form__item--button-wrapper">
              <button
                type="submit"
                className="cmp-button cmp-button--primary"
                disabled={isLoading}
              >
                <span className="cmp-button__text">
                  {isLoading ? 'Wird gesendet...' : 'Absenden'}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 