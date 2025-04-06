#!/bin/bash

# Build-Skript für das ZVV-Entdeckungsreise-Widget

echo "🚀 Starte den Build-Prozess für das ZVV-Entdeckungsreise-Widget..."

# Stelle sicher, dass das dist-Verzeichnis existiert
mkdir -p dist

# Führe den Webpack-Build aus
echo "📦 Baue das Widget mit Webpack in optimierter Produktionsversion..."
npx webpack --config webpack.widget.config.js

# Prüfe, ob der Build erfolgreich war
if [ $? -eq 0 ]; then
  echo "✅ Widget erfolgreich gebaut!"
  echo "📁 Die Widget-Datei befindet sich unter: dist/zvv-entdeckungsreise-widget.js"
  
  # Dateigröße anzeigen
  SIZE=$(du -h dist/zvv-entdeckungsreise-widget.js | cut -f1)
  echo "📊 Dateigröße: $SIZE"
  
  # Gzip-Größe anzeigen (für die Übertragung über das Internet relevant)
  gzip -c dist/zvv-entdeckungsreise-widget.js > dist/zvv-entdeckungsreise-widget.js.gz
  GZIP_SIZE=$(du -h dist/zvv-entdeckungsreise-widget.js.gz | cut -f1)
  echo "🔄 Gzip-Größe: $GZIP_SIZE (Tatsächliche Übertragungsgröße)"
  
  # Chunk-Dateien zählen und anzeigen, wenn vorhanden
  CHUNK_COUNT=$(find dist -name "zvv-entdeckungsreise-widget.*.js" | wc -l)
  if [ $CHUNK_COUNT -gt 0 ]; then
    echo "🧩 Lazy-Loading Chunks gefunden: $CHUNK_COUNT"
    
    # Zeige die Chunks an
    echo "   Chunks:"
    for chunk in dist/zvv-entdeckungsreise-widget.*.js; do
      CHUNK_SIZE=$(du -h "$chunk" | cut -f1)
      echo "   - $(basename "$chunk"): $CHUNK_SIZE"
    done
  fi
  
  # Entferne die temporäre gzip-Datei
  rm dist/zvv-entdeckungsreise-widget.js.gz
  
  echo ""
  echo "🔍 Anleitung zur Integration:"
  echo "1. Kopiere die Datei 'dist/zvv-entdeckungsreise-widget.js' auf deinen Webserver."
  echo "2. Wenn Chunk-Dateien vorhanden sind, kopiere auch diese in dasselbe Verzeichnis."
  echo "3. Binde das Widget in deine HTML-Seite ein (siehe examples/widget-integration.html)."
  echo ""
  echo "💡 Optimierungen:"
  echo "- Lazy Loading der Komponenten für schnellere Ladezeit der Seite"
  echo "- Caching von API-Anfragen für bessere Performance"
  echo "- Unterstützung für Test- und Produktionsumgebungen (INT/PRD)"
else
  echo "❌ Build fehlgeschlagen. Bitte überprüfe die Fehlermeldungen."
fi