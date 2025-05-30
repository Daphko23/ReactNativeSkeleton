#!/bin/bash

echo "🚀 Neues Feature-Modul erstellen"

# Prüfe ob wir im richtigen Verzeichnis sind
if [ ! -d "src" ]; then
  echo "❌ Fehler: Bitte führe das Script aus dem Projekt-Root aus (wo sich src/ befindet)"
  exit 1
fi

# Feature-Name abfragen
read -p "🧱 Name des Features (z.B. todo, profile): " FEATURE_NAME

if [ -z "$FEATURE_NAME" ]; then
  echo "❌ Fehler: Kein Feature-Name angegeben. Abbruch."
  exit 1
fi

# Prüfe ob Feature bereits existiert
if [ -d "src/features/$FEATURE_NAME" ]; then
  echo "❌ Fehler: Feature '$FEATURE_NAME' existiert bereits!"
  exit 1
fi

# Beschreibung abfragen
read -p "📝 Kurze Beschreibung (optional): " FEATURE_DESC

# Optionale Komponenten abfragen
read -p "🎨 Beispiel-Screen erzeugen? (y/n): " ADD_SCREEN
read -p "🧠 Zustand/Store erzeugen? (y/n): " ADD_STORE
read -p "⚡ Beispiel-UseCase erzeugen? (y/n): " ADD_USECASE

BASE="src/features/$FEATURE_NAME"

echo "📁 Erstelle Struktur für: $FEATURE_NAME"

# Domain Layer
mkdir -p $BASE/domain/entities
mkdir -p $BASE/domain/repositories
mkdir -p $BASE/domain/types

# Application Layer
mkdir -p $BASE/application/use-cases
mkdir -p $BASE/application/services

# Data Layer
mkdir -p $BASE/data/repository
mkdir -p $BASE/data/sources
mkdir -p $BASE/data/dto
mkdir -p $BASE/data/mappers

# Presentation Layer
mkdir -p $BASE/presentation/components
mkdir -p $BASE/presentation/screens
mkdir -p $BASE/presentation/hooks
mkdir -p $BASE/presentation/store

# Tests
mkdir -p $BASE/__tests__/application
mkdir -p $BASE/__tests__/data
mkdir -p $BASE/__tests__/domain
mkdir -p $BASE/__tests__/presentation

# feature.json erstellen
cat <<EOT > $BASE/feature.json
{
  "name": "$FEATURE_NAME",
  "description": "$FEATURE_DESC",
  "screens": [],
  "store": false,
  "useCases": [],
  "createdAt": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
EOT
echo "✅ feature.json angelegt"

# Optional: Beispiel-Screen
if [[ $ADD_SCREEN == "y" || $ADD_SCREEN == "Y" ]]; then
  SCREEN_FILE="$BASE/presentation/screens/${FEATURE_NAME^}Screen.tsx"
  cat <<EOT > $SCREEN_FILE
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';
import {Screen} from '@shared/components/Screen';
import {useTheme} from '@shared/theme';

export const ${FEATURE_NAME^}Screen = () => {
  const {colors, spacing} = useTheme();

  return (
    <Screen>
      <View style={[styles.container, {backgroundColor: colors.background}]}>
        <Text variant="headlineMedium" style={{color: colors.onBackground}}>
          ${FEATURE_NAME^} Feature
        </Text>
        <Text variant="bodyLarge" style={{color: colors.onSurface, marginTop: spacing.md}}>
          Willkommen im ${FEATURE_NAME} Feature!
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

  # Update feature.json: Screens ergänzen
  if command -v node >/dev/null 2>&1; then
    node -e "
      const fs = require('fs');
      const path = '$BASE/feature.json';
      const data = JSON.parse(fs.readFileSync(path));
      data.screens.push('${FEATURE_NAME^}Screen');
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
    "
  fi

  echo "✅ Beispiel-Screen erstellt"
fi

# Optional: Zustand/Store
if [[ $ADD_STORE == "y" || $ADD_STORE == "Y" ]]; then
  STORE_FILE="$BASE/presentation/store/use${FEATURE_NAME^}Store.ts"
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

  # Update feature.json: Store true setzen
  if command -v node >/dev/null 2>&1; then
    node -e "
      const fs = require('fs');
      const path = '$BASE/feature.json';
      const data = JSON.parse(fs.readFileSync(path));
      data.store = true;
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
    "
  fi

  echo "✅ Zustand/Store erstellt"
fi

# Optional: Beispiel-UseCase
if [[ $ADD_USECASE == "y" || $ADD_USECASE == "Y" ]]; then
  # Entity erstellen
  ENTITY_FILE="$BASE/domain/entities/${FEATURE_NAME^}.ts"
  cat <<EOT > $ENTITY_FILE
export interface ${FEATURE_NAME^} {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Create${FEATURE_NAME^}Request {
  name: string;
}

export interface Update${FEATURE_NAME^}Request {
  name?: string;
}
EOT

  # Repository Interface erstellen
  REPO_INTERFACE_FILE="$BASE/domain/repositories/${FEATURE_NAME^}Repository.ts"
  cat <<EOT > $REPO_INTERFACE_FILE
import {${FEATURE_NAME^}, Create${FEATURE_NAME^}Request, Update${FEATURE_NAME^}Request} from '../entities/${FEATURE_NAME^}';

export interface ${FEATURE_NAME^}Repository {
  findAll(): Promise<${FEATURE_NAME^}[]>;
  findById(id: string): Promise<${FEATURE_NAME^} | null>;
  create(request: Create${FEATURE_NAME^}Request): Promise<${FEATURE_NAME^}>;
  update(id: string, request: Update${FEATURE_NAME^}Request): Promise<${FEATURE_NAME^}>;
  delete(id: string): Promise<void>;
}
EOT

  # UseCase erstellen
  USECASE_FILE="$BASE/application/use-cases/Get${FEATURE_NAME^}ListUseCase.ts"
  cat <<EOT > $USECASE_FILE
import {${FEATURE_NAME^}} from '../../domain/entities/${FEATURE_NAME^}';
import {${FEATURE_NAME^}Repository} from '../../domain/repositories/${FEATURE_NAME^}Repository';

export class Get${FEATURE_NAME^}ListUseCase {
  constructor(private readonly repository: ${FEATURE_NAME^}Repository) {}

  async execute(): Promise<${FEATURE_NAME^}[]> {
    try {
      return await this.repository.findAll();
    } catch (error) {
      throw new Error(\`Failed to get ${FEATURE_NAME} list: \${error.message}\`);
    }
  }
}
EOT

  # Update feature.json: UseCases ergänzen
  if command -v node >/dev/null 2>&1; then
    node -e "
      const fs = require('fs');
      const path = '$BASE/feature.json';
      const data = JSON.parse(fs.readFileSync(path));
      data.useCases.push('Get${FEATURE_NAME^}ListUseCase');
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
    "
  fi

  echo "✅ Beispiel-UseCase mit Entity und Repository erstellt"
fi

echo ""
echo "🎉 Feature '$FEATURE_NAME' erfolgreich angelegt!"
echo ""
echo "📁 Erstellt in: $BASE"
echo "📝 Nächste Schritte:"
echo "   1. Implementiere deine Business Logic in domain/"
echo "   2. Erstelle Use Cases in application/"
echo "   3. Implementiere Data Layer in data/"
echo "   4. Baue UI Components in presentation/"
echo "   5. Füge Tests hinzu in __tests__/"
echo ""
echo "📚 Siehe docs/EXAMPLES.md für detaillierte Anleitungen!"
