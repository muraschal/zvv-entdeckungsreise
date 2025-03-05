import React from 'react';
import ReactDOM from 'react-dom';
import { ZVVEntdeckungsreiseForm } from './components/ZVVEntdeckungsreiseForm';

// Aktuelle Version und Build-Datum ausgeben
const version = '2.0.0';
const buildDate = new Date().toISOString();
console.log(`ZVV-Entdeckungsreise Widget v${version} - Build: ${buildDate} - GitHub: ${process.env.GITHUB_SHA || 'local'}`);

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