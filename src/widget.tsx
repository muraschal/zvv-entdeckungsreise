import React from 'react';
import ReactDOM from 'react-dom';
import { ZVVEntdeckungsreiseForm } from './components/ZVVEntdeckungsreiseForm';

// Aktuelle Version und Build-Datum ausgeben
const version = '2.0.0';
const now = new Date();
const formattedDate = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()}`;
const formattedTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
const gitHash = process.env.GITHUB_SHA || '84449bf';
console.log(`ZVV-Entdeckungsreise Widget v${version} | Build: ${gitHash} | ${formattedDate} - ${formattedTime}`);

// Funktion zum Initialisieren des Widgets
window.initZVVEntdeckungsreiseWidget = (containerId: string, options = {}) => {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container mit ID "${containerId}" nicht gefunden.`);
    return;
  }

  // Optionen mit Standardwerten
  const config = {
    apiBaseUrl: options.apiBaseUrl || 'https://entdeckungsreise.zvv.ch',
    ...options
  };

  // Widget rendern
  ReactDOM.render(
    <React.StrictMode>
      <ZVVEntdeckungsreiseForm apiBaseUrl={config.apiBaseUrl} />
    </React.StrictMode>,
    container
  );
};

// TypeScript-Deklaration für das globale Window-Objekt
declare global {
  interface Window {
    initZVVEntdeckungsreiseWidget: (containerId: string, options?: any) => void;
  }
} 