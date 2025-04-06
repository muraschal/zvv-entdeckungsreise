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
          <div className="cmp-container__items">
            <div className="cmp-text">
              <h2>Danke für Ihre Ticketbestellung.</h2>
              <p>Die Tickets werden in den nächsten 7 Arbeitstagen an die angegebene Schulhaus-Adresse verschickt. Wir wünschen Ihrer Klasse schon jetzt viel Spass auf der ZVV-Entdeckungsreise.</p>
            </div>
            <div className="cmp-button">
              <button
                onClick={() => setSuccess(false)}
                className="cmp-button__text"
              >
                Zurück zum Formular
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cmp-container">
      <div className="cmp-container__content">
        <div className="cmp-container__items">
          {error && (
            <div className="cmp-text cmp-text--error">
              <div dangerouslySetInnerHTML={{ __html: error }} />
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="cmp-form">
            <div className="cmp-form__item">
              <label htmlFor="code" className="cmp-form__label">Ticketcode</label>
              <div className="cmp-form__field-wrapper">
                <input
                  id="code"
                  className="cmp-form__field"
                  placeholder="Ticketcode eingeben"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  required
                  aria-describedby="code-desc"
                />
              </div>
            </div>
            
            <div className="cmp-form__item">
              <label htmlFor="school" className="cmp-form__label">Schule</label>
              <div className="cmp-form__field-wrapper">
                <input
                  id="school"
                  className="cmp-form__field"
                  placeholder="Name der Schule"
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                  required
                  aria-describedby="school-desc"
                />
              </div>
            </div>
            
            <div className="cmp-form__item">
              <label htmlFor="contactPerson" className="cmp-form__label">Kontaktperson</label>
              <div className="cmp-form__field-wrapper">
                <input
                  id="contactPerson"
                  className="cmp-form__field"
                  placeholder="Name der Kontaktperson"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  required
                  aria-describedby="contactPerson-desc"
                />
              </div>
            </div>

            <div className="cmp-form__item">
              <label htmlFor="email" className="cmp-form__label">E-Mail</label>
              <div className="cmp-form__field-wrapper">
                <input
                  id="email"
                  className="cmp-form__field"
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

            <div className="cmp-form__item">
              <label htmlFor="phoneNumber" className="cmp-form__label">Telefon</label>
              <div className="cmp-form__field-wrapper">
                <input
                  id="phoneNumber"
                  className="cmp-form__field"
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

            <div className="cmp-form__item">
              <label htmlFor="className" className="cmp-form__label">Klasse</label>
              <div className="cmp-form__field-wrapper">
                <div className={`cmp-form__dropdown ${dropdownVisible ? 'is-visible' : ''}`}>
                  <div 
                    tabIndex={0} 
                    className="cmp-form__dropdown-label"
                    onClick={() => setDropdownVisible(!dropdownVisible)}
                  >
                    {formData.className || 'Bitte wählen'}
                  </div>
                  <div className="cmp-form__dropdown-options">
                    <div 
                      className={`cmp-form__dropdown-option ${!formData.className ? 'is-selected' : ''}`} 
                      data-value=""
                      onClick={() => {
                        setFormData(prev => ({ ...prev, className: '' }));
                        setDropdownVisible(false);
                      }}
                    >
                      Bitte wählen
                    </div>
                    <div 
                      className={`cmp-form__dropdown-option ${formData.className === '4. Klasse' ? 'is-selected' : ''}`} 
                      data-value="klasse-4"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, className: '4. Klasse' }));
                        setDropdownVisible(false);
                      }}
                    >
                      4.
                    </div>
                    <div 
                      className={`cmp-form__dropdown-option ${formData.className === '5. Klasse' ? 'is-selected' : ''}`} 
                      data-value="klasse-5"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, className: '5. Klasse' }));
                        setDropdownVisible(false);
                      }}
                    >
                      5.
                    </div>
                    <div 
                      className={`cmp-form__dropdown-option ${formData.className === '6. Klasse' ? 'is-selected' : ''}`} 
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

            <div className="cmp-form__item">
              <label htmlFor="studentCount" className="cmp-form__label">Anzahl Schüler</label>
              <div className="cmp-form__field-wrapper">
                <input
                  id="studentCount"
                  className="cmp-form__field"
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

            <div className="cmp-form__item">
              <label htmlFor="accompanistCount" className="cmp-form__label">Begleitpersonen</label>
              <div className="cmp-form__field-wrapper">
                <input
                  id="accompanistCount"
                  className="cmp-form__field"
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

            <div className="cmp-form__item">
              <label htmlFor="travelDate" className="cmp-form__label">Reisedatum</label>
              <div className="cmp-form__field-wrapper">
                <input
                  id="travelDate"
                  className="cmp-form__field"
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

            <div className="cmp-form__item">
              <label htmlFor="arrivalTime" className="cmp-form__label">Ankunftszeit</label>
              <div className="cmp-form__field-wrapper">
                <input
                  id="arrivalTime"
                  className="cmp-form__field"
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

            <div className="cmp-form__item">
              <label htmlFor="additionalNotes" className="cmp-form__label">Anmerkungen</label>
              <div className="cmp-form__field-wrapper">
                <textarea
                  id="additionalNotes"
                  className="cmp-form__field cmp-form__field--textarea"
                  placeholder="Zusätzliche Anmerkungen"
                  name="additionalNotes"
                  rows={2}
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  aria-describedby="additionalNotes-desc"
                ></textarea>
              </div>
            </div>

            <div className="cmp-text cmp-text--small">* Alle Felder sind Pflichtfelder, ausser Anmerkungen</div>

            <div className="cmp-form__item">
              <button className="cmp-button__text" type="submit" disabled={isLoading}>
                {isLoading ? 'Wird verarbeitet...' : 'Anmeldung absenden'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 