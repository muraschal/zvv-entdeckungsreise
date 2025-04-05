import React from 'react';
import { createRoot } from 'react-dom/client';
import { ZVVEntdeckungsreiseForm } from './components/ZVVEntdeckungsreiseForm';

// Aktuelle Version und Build-Datum ausgeben
const version = '2.0.0';
const now = new Date();
const formattedDate = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()}`;
const formattedTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
const gitHash = process.env.GITHUB_SHA || '84449bf';
console.log(`ZVV-Entdeckungsreise Widget v${version} | Build: ${gitHash} | ${formattedDate} - ${formattedTime}`);

interface Config {
  apiBaseUrl: string;
}

declare global {
  interface Window {
    ZVVEntdeckungsreiseWidget: {
      init: (config: Config) => void;
    };
  }
}

// Widget initialisieren
window.ZVVEntdeckungsreiseWidget = {
  init: (config: Config) => {
    // Container erstellen
    const container = document.createElement('div');
    container.id = 'zvv-entdeckungsreise-widget';
    document.body.appendChild(container);

    // Widget rendern
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <ZVVEntdeckungsreiseForm apiBaseUrl={config.apiBaseUrl} />
      </React.StrictMode>
    );
  },
}; 