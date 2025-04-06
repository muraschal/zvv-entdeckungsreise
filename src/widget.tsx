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
const gitHash = process.env.GITHUB_SHA || '84449bf';
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

declare global {
  interface Window {
    ZVVEntdeckungsreiseWidget: {
      init: (config: Config) => void;
    };
    initZVVEntdeckungsreiseWidget: (containerId: string, config: Config) => void;
  }
}

// Initialisierungsfunktion für das Widget
const initWidget = (config: Config) => {
  // Standardwerte für Konfiguration setzen
  const defaultConfig: Config = {
    apiBaseUrl: '',
    environment: 'PRD',
    cacheTimeout: 300000 // 5 Minuten Standard-Cache
  };

  // Konfiguration mit Standardwerten zusammenführen
  const mergedConfig = { ...defaultConfig, ...config };
  console.log(`Widget wird mit folgender Konfiguration initialisiert:`, mergedConfig);

  // Container erstellen
  const container = document.createElement('div');
  container.id = 'zvv-entdeckungsreise-widget';
  document.body.appendChild(container);

  // Widget rendern mit Ladeindikator während des Lazy Loading
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
};

// Neue Funktion, die einen Container-ID nimmt und diesen anstelle eines neuen Containers verwendet
const initZVVEntdeckungsreiseWidget = (containerId: string, config: Config) => {
  // Standardwerte für Konfiguration setzen
  const defaultConfig: Config = {
    apiBaseUrl: '',
    environment: 'PRD',
    cacheTimeout: 300000 // 5 Minuten Standard-Cache
  };

  // Konfiguration mit Standardwerten zusammenführen
  const mergedConfig = { ...defaultConfig, ...config };
  console.log(`Widget wird mit folgender Konfiguration initialisiert:`, mergedConfig);

  // Bestehenden Container verwenden
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container mit ID "${containerId}" wurde nicht gefunden.`);
    return;
  }

  // Widget rendern mit Ladeindikator während des Lazy Loading
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
};

// Beide Varianten exportieren
window.ZVVEntdeckungsreiseWidget = {
  init: initWidget
};

// Exportiere die neue Funktion als globale Funktion
window.initZVVEntdeckungsreiseWidget = initZVVEntdeckungsreiseWidget; 