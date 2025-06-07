#!/bin/bash

echo "🗂️ Übersicht aller Features im Projekt:"
echo "======================================="

# Prüfe ob wir im richtigen Verzeichnis sind
if [ ! -d "src/features" ]; then
  echo "❌ Fehler: src/features Verzeichnis nicht gefunden!"
  echo "   Bitte führe das Script aus dem Projekt-Root aus."
  exit 1
fi

# Prüfe ob jq installiert ist
if ! command -v jq >/dev/null 2>&1; then
  echo "⚠️  Warnung: 'jq' ist nicht installiert. Installiere es mit:"
  echo "   macOS: brew install jq"
  echo "   Ubuntu: sudo apt-get install jq"
  echo ""
  echo "📁 Verfügbare Features (ohne Details):"
  for dir in src/features/*/; do
    if [ -d "$dir" ]; then
      feature_name=$(basename "$dir")
      echo "   📦 $feature_name"
    fi
  done
  exit 0
fi

feature_count=0

for file in src/features/*/feature.json; do
  if [ -f "$file" ]; then
    FEATURE_NAME=$(jq -r '.name' "$file")
    DESCRIPTION=$(jq -r '.description // "Keine Beschreibung"' "$file")
    SCREENS=$(jq -r '.screens[]?' "$file" 2>/dev/null | paste -sd "," - || echo "keine")
    STORE=$(jq -r '.store // false' "$file")
    USECASES=$(jq -r '.useCases[]?' "$file" 2>/dev/null | paste -sd "," - || echo "keine")
    CREATED_AT=$(jq -r '.createdAt // "unbekannt"' "$file")

    echo "📦 Feature: $FEATURE_NAME"
    echo "📝 Beschreibung: $DESCRIPTION"
    echo "🎨 Screens: $SCREENS"
    echo "⚡ UseCases: $USECASES"
    echo "🧠 Store vorhanden: $STORE"
    echo "📅 Erstellt: $CREATED_AT"
    echo "---------------------------------------"
    
    ((feature_count++))
  fi
done

if [ $feature_count -eq 0 ]; then
  echo "📭 Keine Features mit feature.json gefunden."
  echo ""
  echo "💡 Erstelle ein neues Feature mit:"
  echo "   ./scripts/create_feature.sh"
else
  echo ""
  echo "📊 Gesamt: $feature_count Feature(s) gefunden"
fi
