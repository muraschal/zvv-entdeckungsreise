#!/bin/bash

# Build-Skript für das ZVV-Entdeckungsreise-Widget

echo "🚀 Starte den Build-Prozess für das ZVV-Entdeckungsreise-Widget..."

# Stelle sicher, dass das dist-Verzeichnis existiert
mkdir -p dist

# Führe den Webpack-Build aus
echo "📦 Baue das Widget mit Webpack..."
npx webpack --config webpack.widget.config.js

# Prüfe, ob der Build erfolgreich war
if [ $? -eq 0 ]; then
  echo "✅ Widget erfolgreich gebaut!"
  echo "📁 Die Widget-Datei befindet sich unter: dist/zvv-entdeckungsreise-widget.js"
  
  # Dateigröße anzeigen
  SIZE=$(du -h dist/zvv-entdeckungsreise-widget.js | cut -f1)
  echo "📊 Dateigröße: $SIZE"
  
  echo ""
  echo "🔍 Anleitung zur Integration:"
  echo "1. Kopiere die Datei 'dist/zvv-entdeckungsreise-widget.js' auf deinen Webserver."
  echo "2. Binde das Widget in deine HTML-Seite ein (siehe examples/widget-integration.html)."
else
  echo "❌ Build fehlgeschlagen. Bitte überprüfe die Fehlermeldungen."
fi