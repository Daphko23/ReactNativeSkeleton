#!/bin/bash

echo "✨ Feature erweitern"

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
read -p "🧱 Welches Feature soll erweitert werden? " FEATURE_NAME

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
echo "🔧 Was möchtest du hinzufügen?"
echo "1) 🎨 Neuen Screen"
echo "2) ⚡ Neuen UseCase"
echo "3) 🧠 Store (falls noch nicht vorhanden)"
echo ""
read -p "Wähle eine Option (1-3): " OPTION

case $OPTION in
  1)
    echo ""
    read -p "📱 Name des neuen Screens (z.B. Settings): " SCREEN_NAME
    
    if [ -z "$SCREEN_NAME" ]; then
      echo "❌ Fehler: Kein Screen-Name angegeben."
      exit 1
    fi

    SCREEN_FILE="$FEATURE_PATH/presentation/screens/${SCREEN_NAME}Screen.tsx"
    
    if [ -f "$SCREEN_FILE" ]; then
      echo "❌ Fehler: Screen '$SCREEN_NAME' existiert bereits!"
      exit 1
    fi

    cat <<EOT > $SCREEN_FILE
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';
import {Screen} from '@shared/components/Screen';
import {useTheme} from '@shared/theme';

export const ${SCREEN_NAME}Screen = () => {
  const {colors, spacing} = useTheme();

  return (
    <Screen>
      <View style={[styles.container, {backgroundColor: colors.background}]}>
        <Text variant="headlineMedium" style={{color: colors.onBackground}}>
          ${SCREEN_NAME} Screen
        </Text>
        <Text variant="bodyLarge" style={{color: colors.onSurface, marginTop: spacing.md}}>
          ${SCREEN_NAME} Screen für ${FEATURE_NAME} Feature
        </Text>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});
EOT

    # Update feature.json
    if command -v node >/dev/null 2>&1 && [ -f "$FEATURE_PATH/feature.json" ]; then
      node -e "
        const fs = require('fs');
        const path = '$FEATURE_PATH/feature.json';
        const data = JSON.parse(fs.readFileSync(path));
        if (!data.screens.includes('${SCREEN_NAME}Screen')) {
          data.screens.push('${SCREEN_NAME}Screen');
          fs.writeFileSync(path, JSON.stringify(data, null, 2));
        }
      "
    fi

    echo "✅ Screen '${SCREEN_NAME}Screen' erfolgreich erstellt!"
    ;;

  2)
    echo ""
    read -p "⚡ Name des neuen UseCases (z.B. Delete): " USECASE_NAME
    
    if [ -z "$USECASE_NAME" ]; then
      echo "❌ Fehler: Kein UseCase-Name angegeben."
      exit 1
    fi

    USECASE_FILE="$FEATURE_PATH/application/use-cases/${USECASE_NAME}${FEATURE_NAME^}UseCase.ts"
    
    if [ -f "$USECASE_FILE" ]; then
      echo "❌ Fehler: UseCase '$USECASE_NAME' existiert bereits!"
      exit 1
    fi

    cat <<EOT > $USECASE_FILE
import {${FEATURE_NAME^}Repository} from '../../domain/repositories/${FEATURE_NAME^}Repository';

export class ${USECASE_NAME}${FEATURE_NAME^}UseCase {
  constructor(private readonly repository: ${FEATURE_NAME^}Repository) {}

  async execute(id: string): Promise<void> {
    try {
      // TODO: Implementiere ${USECASE_NAME} Logic
      console.log('${USECASE_NAME} ${FEATURE_NAME} with id:', id);
    } catch (error) {
      throw new Error(\`Failed to ${USECASE_NAME.toLowerCase()} ${FEATURE_NAME}: \${error.message}\`);
    }
  }
}
EOT

    # Update feature.json
    if command -v node >/dev/null 2>&1 && [ -f "$FEATURE_PATH/feature.json" ]; then
      node -e "
        const fs = require('fs');
        const path = '$FEATURE_PATH/feature.json';
        const data = JSON.parse(fs.readFileSync(path));
        const useCaseName = '${USECASE_NAME}${FEATURE_NAME^}UseCase';
        if (!data.useCases.includes(useCaseName)) {
          data.useCases.push(useCaseName);
          fs.writeFileSync(path, JSON.stringify(data, null, 2));
        }
      "
    fi

    echo "✅ UseCase '${USECASE_NAME}${FEATURE_NAME^}UseCase' erfolgreich erstellt!"
    ;;

  3)
    STORE_FILE="$FEATURE_PATH/presentation/store/use${FEATURE_NAME^}Store.ts"
    
    if [ -f "$STORE_FILE" ]; then
      echo "❌ Store für Feature '$FEATURE_NAME' existiert bereits!"
      exit 1
    fi

    cat <<EOT > $STORE_FILE
import {create} from 'zustand';

interface ${FEATURE_NAME^}State {
  isLoading: boolean;
  error: string | null;
  data: any[];

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setData: (data: any[]) => void;
  clearError: () => void;
}

export const use${FEATURE_NAME^}Store = create<${FEATURE_NAME^}State>((set) => ({
  isLoading: false,
  error: null,
  data: [],

  setLoading: (loading) => set({isLoading: loading}),
  setError: (error) => set({error}),
  setData: (data) => set({data}),
  clearError: () => set({error: null}),
}));
EOT

    # Update feature.json
    if command -v node >/dev/null 2>&1 && [ -f "$FEATURE_PATH/feature.json" ]; then
      node -e "
        const fs = require('fs');
        const path = '$FEATURE_PATH/feature.json';
        const data = JSON.parse(fs.readFileSync(path));
        data.store = true;
        fs.writeFileSync(path, JSON.stringify(data, null, 2));
      "
    fi

    echo "✅ Store 'use${FEATURE_NAME^}Store' erfolgreich erstellt!"
    ;;

  *)
    echo "❌ Ungültige Option. Abbruch."
    exit 1
    ;;
esac

echo ""
echo "🎉 Feature '$FEATURE_NAME' erfolgreich erweitert!"
echo "📚 Siehe docs/EXAMPLES.md für weitere Anleitungen!"
