# 🔄 Template Upgrade Guide

Anleitung zum Aktualisieren deines Projekts mit neuen Template-Versionen.

## 📋 Übersicht

Dieses Template wird regelmäßig aktualisiert mit:

- Neuen React Native Versionen
- Verbesserten Konfigurationen
- Zusätzlichen Features
- Bug Fixes und Optimierungen

## 🔍 Template-Updates verfolgen

### 1. Template Repository verfolgen

```bash
# Original Template als Remote hinzufügen
git remote add template https://github.com/username/react-native-skeleton-template.git

# Template-Updates abrufen
git fetch template
```

### 2. Verfügbare Updates prüfen

```bash
# Neue Releases anzeigen
gh repo view username/react-native-skeleton-template --json releases

# Oder auf GitHub:
# https://github.com/username/react-native-skeleton-template/releases
```

## 🚀 Upgrade-Strategien

### Strategie 1: Selektive Updates (Empfohlen)

Übernimm nur spezifische Dateien vom Template:

```bash
# Konfigurationsdateien aktualisieren
git checkout template/main -- .eslintrc.cjs
git checkout template/main -- prettier.config.cjs
git checkout template/main -- jest.config.cjs
git checkout template/main -- babel.config.cjs
git checkout template/main -- metro.config.js

# Package.json Dependencies vergleichen (manuell)
git show template/main:package.json

# Änderungen committen
git add .
git commit -m "chore: update config files from template v2.0.0"
```

### Strategie 2: Merge-basierte Updates

Für größere Updates mit vielen Änderungen:

```bash
# Neuen Branch für Update erstellen
git checkout -b template-update-v2.0.0

# Template-Änderungen mergen
git merge template/main --allow-unrelated-histories

# Konflikte lösen und committen
git add .
git commit -m "feat: merge template updates v2.0.0"

# Pull Request erstellen für Review
```

### Strategie 3: Diff-basierte Updates

Für erfahrene Entwickler:

```bash
# Unterschiede zwischen Versionen anzeigen
git diff template/v1.0.0..template/v2.0.0

# Spezifische Dateien vergleichen
git diff template/main -- src/shared/theme/
git diff template/main -- .github/workflows/
```

## 📦 Häufige Update-Kategorien

### 1. Dependencies Updates

```bash
# package.json vergleichen
git show template/main:package.json > template-package.json
diff package.json template-package.json

# Neue Dependencies installieren
npm install neue-dependency@version

# Veraltete Dependencies aktualisieren
npm update
```

### 2. Konfigurationsdateien

```bash
# ESLint Konfiguration
git checkout template/main -- .eslintrc.cjs

# TypeScript Konfiguration
git checkout template/main -- tsconfig.json

# Metro Konfiguration
git checkout template/main -- metro.config.js
```

### 3. GitHub Actions / CI/CD

```bash
# Workflow-Dateien aktualisieren
git checkout template/main -- .github/workflows/

# Issue Templates aktualisieren
git checkout template/main -- .github/ISSUE_TEMPLATE/
```

### 4. Shared Components

```bash
# Neue shared components übernehmen
git checkout template/main -- src/shared/components/NewComponent.tsx

# Theme-Updates
git checkout template/main -- src/shared/theme/
```

## ⚠️ Breaking Changes handhaben

### React Native Version Updates

```bash
# 1. React Native Version prüfen
npx react-native info

# 2. Upgrade durchführen
npx react-native upgrade

# 3. iOS Dependencies aktualisieren
cd ios && pod install && cd ..

# 4. Android Gradle aktualisieren (falls nötig)
cd android && ./gradlew clean && cd ..
```

### API-Änderungen

```typescript
// Beispiel: Zustand Store API-Änderung
// Alt (v1.0.0):
const useStore = create(set => ({
  // ...
}));

// Neu (v2.0.0):
const useStore = create<StoreInterface>()(set => ({
  // ...
}));
```

### Konfigurationsänderungen

```bash
# Babel-Konfiguration Migration
# Alt: babel.config.js
# Neu: babel.config.cjs

mv babel.config.js babel.config.cjs
```

## 🧪 Nach dem Update testen

### 1. Dependencies prüfen

```bash
# Installierte Packages prüfen
npm ls

# Sicherheitslücken prüfen
npm audit

# Veraltete Packages finden
npm outdated
```

### 2. Build-Tests

```bash
# TypeScript Check
npm run type-check

# Linting
npm run lint

# Tests
npm test

# iOS Build
npm run ios

# Android Build
npm run android
```

### 3. Funktionalitätstests

- [ ] App startet erfolgreich
- [ ] Navigation funktioniert
- [ ] Auth-System funktioniert
- [ ] Theme-Switching funktioniert
- [ ] Alle Features sind verfügbar

## 📝 Update-Checkliste

### Vor dem Update

- [ ] Aktueller Stand committet
- [ ] Backup erstellt
- [ ] Dependencies dokumentiert
- [ ] Tests laufen grün

### Während des Update

- [ ] Template-Remote hinzugefügt
- [ ] Neue Version identifiziert
- [ ] Changelog gelesen
- [ ] Breaking Changes verstanden
- [ ] Update-Strategie gewählt

### Nach dem Update

- [ ] Dependencies installiert
- [ ] Konfiguration angepasst
- [ ] Tests ausgeführt
- [ ] Builds getestet
- [ ] Dokumentation aktualisiert
- [ ] Team informiert

## 🔧 Automatisierte Update-Checks

### GitHub Actions Workflow

```yaml
# .github/workflows/template-check.yml
name: Template Update Check

on:
  schedule:
    - cron: '0 9 * * 1' # Jeden Montag um 9 Uhr

jobs:
  check-template-updates:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Check for template updates
        run: |
          git remote add template https://github.com/username/react-native-skeleton-template.git
          git fetch template

          LATEST_TAG=$(git describe --tags --abbrev=0 template/main)
          echo "Latest template version: $LATEST_TAG"

          # Issue erstellen falls neue Version verfügbar
          if [ "$LATEST_TAG" != "$(cat .template-version)" ]; then
            gh issue create \
              --title "Template Update verfügbar: $LATEST_TAG" \
              --body "Neue Template-Version verfügbar. Siehe Upgrade Guide."
          fi
```

### Package.json Script

```json
{
  "scripts": {
    "check-template": "git fetch template && git log --oneline HEAD..template/main",
    "update-template": "git checkout template/main -- .eslintrc.cjs prettier.config.cjs jest.config.cjs"
  }
}
```

## 🆘 Troubleshooting

### Merge-Konflikte lösen

```bash
# Konflikte anzeigen
git status

# Konflikte manuell lösen
# Dann:
git add .
git commit -m "resolve: template merge conflicts"
```

### Dependency-Konflikte

```bash
# Node modules neu installieren
rm -rf node_modules package-lock.json
npm install

# iOS Pods neu installieren
cd ios && rm -rf Pods Podfile.lock && pod install && cd ..
```

### Build-Fehler nach Update

```bash
# Cache löschen
npm start -- --reset-cache

# Android Clean
cd android && ./gradlew clean && cd ..

# iOS Clean
cd ios && xcodebuild clean && cd ..
```

## 📚 Weiterführende Ressourcen

- [React Native Upgrade Helper](https://react-native-community.github.io/upgrade-helper/)
- [Template Releases](../../releases)
- [Template Discussions](../../discussions)
- [Breaking Changes Log](CHANGELOG.md)

---

**Halte dein Projekt aktuell und profitiere von den neuesten Verbesserungen!** 🚀
