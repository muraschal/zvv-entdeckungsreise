import React from 'react';
import ReactDOM from 'react-dom';
import { ZVVEntdeckungsreiseForm } from './app/page';

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