import React, { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';

// Lazy loading der ZVVEntdeckungsreiseForm-Komponente
const ZVVEntdeckungsreiseForm = lazy(() => import('./components/ZVVEntdeckungsreiseForm').then(module => ({ 
  default: module.ZVVEntdeckungsreiseForm 
})));

// Aktuelle Version und Build-Datum ausgeben
const version = '2.0.0';
const now = new Date();
const formattedDate = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()}`;
const formattedTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
const gitHash = process.env.GITHUB_SHA || 'local-build';
console.log(`ZVV-Entdeckungsreise Widget v${version} | Build: ${gitHash} | ${formattedDate} - ${formattedTime}`);

interface Config {
  apiBaseUrl: string;
  environment?: 'INT' | 'PRD';
  cacheTimeout?: number; // Zeit in Millisekunden, für die die Daten gecacht werden sollen
}

// Cache-Speicher für API-Antworten
const apiCache: Record<string, { data: any; timestamp: number }> = {};

// Funktion zum Abrufen von Daten mit Caching
export const fetchWithCache = async (url: string, options: RequestInit, cacheTimeout: number = 300000) => {
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

/**
 * Hauptfunktion zur Initialisierung des Widgets mit einem vorhandenen Container.
 * 
 * @param containerId - Die ID des HTML-Elements, in dem das Widget gerendert werden soll
 * @param config - Konfigurationsobjekt für das Widget
 * @returns true bei Erfolg, false bei Fehler
 */
function initZVVEntdeckungsreiseWidget(containerId: string, config: {
  apiBaseUrl?: string;
  environment?: 'INT' | 'PRD';
  cacheTimeout?: number;
} = {}) {
  // Standardwerte für Konfiguration setzen
  const mergedConfig = {
    apiBaseUrl: '',
    environment: 'PRD' as 'INT' | 'PRD',
    cacheTimeout: 300000, // 5 Minuten Standard-Cache
    ...config
  };
  
  console.log(`ZVV-Widget wird initialisiert mit:`, mergedConfig);
  
  // Bestehenden Container verwenden
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container mit ID "${containerId}" wurde nicht gefunden.`);
    return false;
  }
  
  try {
    // Widget rendern
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <Suspense fallback={
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '200px',
            width: '100%'
          }}>
            <div style={{ 
              border: '3px solid #f3f3f3',
              borderRadius: '50%',
              borderTop: '3px solid #0066b3',
              width: '30px',
              height: '30px',
              animation: 'spin 1s linear infinite'
            }}></div>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        }>
          <ZVVEntdeckungsreiseForm 
            apiBaseUrl={mergedConfig.apiBaseUrl} 
            environment={mergedConfig.environment}
            cacheTimeout={mergedConfig.cacheTimeout}
          />
        </Suspense>
      </React.StrictMode>
    );
    console.log('ZVV-Widget erfolgreich gerendert');
    return true;
  } catch (error) {
    console.error('Fehler beim Initialisieren des Widgets:', error);
    return false;
  }
}

/**
 * Legacy-Methode zur Initialisierung des Widgets durch Erstellen eines Containers.
 * 
 * @param config - Konfigurationsobjekt für das Widget
 * @returns true bei Erfolg, false bei Fehler
 */
function initWidget(config: Config) {
  // Standardwerte für Konfiguration
  const standardConfig = {
    apiBaseUrl: '',
    environment: 'PRD' as 'INT' | 'PRD',
    cacheTimeout: 300000
  };
  
  // Konfiguration mit Standardwerten zusammenführen
  const mergedConfig = { ...standardConfig, ...config };
  
  console.log(`ZVV-Widget wird mit Legacy-Methode initialisiert:`, mergedConfig);
  
  // Container erstellen, wenn nicht anders angegeben
  const containerId = 'zvv-entdeckungsreise-widget';
  let container = document.getElementById(containerId);
  
  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    document.body.appendChild(container);
    console.log(`Container "${containerId}" wurde erstellt`);
  }
  
  // Direkter Aufruf der Container-spezifischen Funktion mit den bereits konfigurierten Einstellungen
  return initZVVEntdeckungsreiseWidget(containerId, mergedConfig);
}

// Widget-API-Objekt erstellen
const widgetAPI = {
  init: initWidget,
  initZVVEntdeckungsreiseWidget: initZVVEntdeckungsreiseWidget
};

// WICHTIG: Funktionen direkt global zuweisen, NICHT in einer Bedingung!
// Das stellt sicher, dass die Funktionen immer verfügbar sind
if (typeof window !== 'undefined') {
  (window as any).initZVVEntdeckungsreiseWidget = initZVVEntdeckungsreiseWidget;
  (window as any).ZVVEntdeckungsreiseWidget = widgetAPI;
  console.log('ZVV Widget-Funktionen wurden global registriert');
}

// Sowohl als Default-Export als auch als Named-Exports bereitstellen
export { initZVVEntdeckungsreiseWidget, initWidget };
export default widgetAPI; 