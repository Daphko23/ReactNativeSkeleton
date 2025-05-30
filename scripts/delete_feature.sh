#!/bin/bash

echo "🗑️ Feature löschen"

# Prüfe ob wir im richtigen Verzeichnis sind
if [ ! -d "src/features" ]; then
  echo "❌ Fehler: src/features Verzeichnis nicht gefunden!"
  echo "   Bitte führe das Script aus dem Projekt-Root aus."
  exit 1
fi

# Verfügbare Features anzeigen
echo "📁 Verfügbare Features:"
for dir in src/features/*/; do
  if [ -d "$dir" ]; then
    feature_name=$(basename "$dir")
    echo "   📦 $feature_name"
  fi
done

echo ""
read -p "🧱 Welches Feature soll gelöscht werden? " FEATURE_NAME

if [ -z "$FEATURE_NAME" ]; then
  echo "❌ Fehler: Kein Feature-Name angegeben. Abbruch."
  exit 1
fi

FEATURE_PATH="src/features/$FEATURE_NAME"

if [ ! -d "$FEATURE_PATH" ]; then
  echo "❌ Fehler: Feature '$FEATURE_NAME' existiert nicht!"
  exit 1
fi

echo ""
echo "⚠️  WARNUNG: Das Feature '$FEATURE_NAME' wird komplett gelöscht!"
echo "📁 Pfad: $FEATURE_PATH"
read -p "🤔 Bist du sicher? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
  echo "❌ Abgebrochen. Feature wurde nicht gelöscht."
  exit 0
fi

echo "🗑️ Lösche Feature '$FEATURE_NAME'..."
rm -rf "$FEATURE_PATH"

if [ $? -eq 0 ]; then
  echo "✅ Feature '$FEATURE_NAME' erfolgreich gelöscht!"
  echo ""
  echo "📝 Vergiss nicht:"
  echo "   - Navigation-Referenzen zu entfernen"
  echo "   - Import-Statements zu bereinigen"
  echo "   - Tests zu aktualisieren"
else
  echo "❌ Fehler beim Löschen des Features!"
  exit 1
fi
