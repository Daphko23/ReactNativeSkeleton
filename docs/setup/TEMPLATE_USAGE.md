# 📋 Template Usage Guide

Diese Anleitung ist speziell für Nutzer des **React Native Skeleton Templates** und erklärt, wie du das Template optimal nutzt.

## 🚀 Template verwenden

### Option 1: GitHub Web Interface (Empfohlen)

1. Gehe zur [Template-Repository-Seite](../../)
2. Klicke auf **"Use this template"** (grüner Button)
3. Wähle **"Create a new repository"**
4. Gib deinen Repository-Namen ein
5. Wähle Sichtbarkeit (Public/Private)
6. Klicke **"Create repository from template"**

### Option 2: GitHub CLI

```bash
# Neues Repository aus Template erstellen
gh repo create mein-neues-projekt --template username/react-native-skeleton-template --public

# Repository klonen
git clone https://github.com/username/mein-neues-projekt.git
cd mein-neues-projekt
```

### Option 3: Manuell

```bash
# Template herunterladen (ohne Git-Historie)
curl -L https://github.com/username/react-native-skeleton-template/archive/main.zip -o template.zip
unzip template.zip
mv react-native-skeleton-template-main mein-neues-projekt
cd mein-neues-projekt

# Neues Git Repository initialisieren
git init
git add .
git commit -m "Initial commit from React Native Skeleton Template"
```

## ⚡ Schnellstart nach Template-Nutzung

### 1. Projekt Setup

```bash
# Dependencies installieren
npm install

# iOS Dependencies (nur auf macOS)
cd ios && pod install && cd ..

# Umgebungsvariablen konfigurieren
cp .env.example .env
```

### 2. Erste Anpassungen

```bash
# App-Namen in package.json ändern
# App-Namen in app.json ändern
# Bundle Identifier anpassen (siehe SETUP.md)
```

### 3. Entwicklung starten

```bash
# Metro Bundler starten
npm start

# In separatem Terminal:
npm run ios     # oder npm run android
```

## 🔧 Template-spezifische Anpassungen

### 1. Projekt-Identität ändern

#### package.json

```json
{
  "name": "mein-app-name",
  "displayName": "Meine App",
  "description": "Beschreibung meiner App"
}
```

#### app.json

```json
{
  "name": "MeineApp",
  "displayName": "Meine App"
}
```

### 2. Native Konfiguration

#### Android Package Name

```gradle
// android/app/build.gradle
android {
    namespace "com.meineapp"
    defaultConfig {
        applicationId "com.meineapp"
        // ...
    }
}
```

#### iOS Bundle Identifier

- Öffne `ios/ReactNativeSkeleton.xcworkspace` in Xcode
- Projekt auswählen → General → Bundle Identifier ändern

### 3. Branding anpassen

#### App-Icons

- **Android:** Ersetze Icons in `android/app/src/main/res/mipmap-*/`
- **iOS:** Ersetze Icons in Xcode Assets Catalog

#### Splash Screen

- **Android:** Bearbeite `android/app/src/main/res/drawable/launch_screen.xml`
- **iOS:** Bearbeite `ios/ReactNativeSkeleton/LaunchScreen.storyboard`

#### Theme Colors

```typescript
// src/shared/theme/colors.ts
export const lightColors = {
  primary: '#deine-primary-farbe',
  secondary: '#deine-secondary-farbe',
  accent: '#deine-accent-farbe',
  // ...
};
```

## 🎯 Template-Features nutzen

### 1. Auth System aktivieren

```typescript
// src/App.tsx
import { AuthNavigator } from '@features/auth/presentation/navigation/AuthNavigator';

// Ersetze Placeholder-Content mit:
<AuthNavigator />
```

### 2. Supabase konfigurieren

```bash
# .env Datei ausfüllen
SUPABASE_URL=https://deinprojekt.supabase.co
SUPABASE_ANON_KEY=dein_anon_key
```

### 3. Neue Features hinzufügen

```bash
# Feature-Struktur erstellen
mkdir -p src/features/meinFeature/{data,domain,presentation}
mkdir -p src/features/meinFeature/presentation/{screens,components,store}
```

## 📱 Development Workflow

### 1. Code Quality

```bash
# Vor jedem Commit (automatisch durch Husky)
npm run lint:fix
npm run format
npm run type-check
```

### 2. Testing

```bash
# Tests während Entwicklung
npm run test:watch

# Coverage vor Release
npm run test:coverage
```

### 3. Build & Release

```bash
# Development Builds
npm run build:ios:debug
npm run build:android:debug

# Production Builds
npm run build:ios
npm run build:android
```

## 🔄 Template Updates erhalten

### 1. Template-Repository verfolgen

```bash
# Original Template als Remote hinzufügen
git remote add template https://github.com/username/react-native-skeleton-template.git

# Template-Updates abrufen
git fetch template
```

### 2. Selektive Updates anwenden

```bash
# Spezifische Dateien vom Template übernehmen
git checkout template/main -- .eslintrc.cjs
git checkout template/main -- jest.config.cjs
git checkout template/main -- babel.config.cjs

# Änderungen committen
git add .
git commit -m "Update config files from template"
```

### 3. Automatische Update-Checks

```bash
# GitHub CLI verwenden um Template-Updates zu prüfen
gh repo view username/react-native-skeleton-template --json pushedAt
```

## 🚨 Häufige Template-Probleme

### Problem: Metro Cache Konflikte

```bash
# Lösung: Cache komplett löschen
npm start -- --reset-cache
rm -rf node_modules/.cache
```

### Problem: iOS Build Fehler nach Template-Nutzung

```bash
# Lösung: Pods neu installieren
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

### Problem: Android Package Name Konflikte

```bash
# Lösung: Package-Struktur komplett umbenennen
cd android/app/src/main/java/com/
mv reactnativeskeleton meinappname

# Dann in allen .kt Dateien package-Namen ändern
```

## 📚 Template-spezifische Ressourcen

### Dokumentation

- **[SETUP.md](SETUP.md)** - Vollständige Setup-Anleitung
- **[Architecture Guide](docs/ARCHITECTURE.md)** - Clean Architecture Erklärung
- **[Upgrade Guide](docs/UPGRADE.md)** - Template-Updates anwenden

### Community

- **[Template Issues](../../issues)** - Template-spezifische Probleme
- **[Template Discussions](../../discussions)** - Community-Austausch
- **[Template Wiki](../../wiki)** - Erweiterte Dokumentation

### Beispiele

- **[Example Projects](docs/EXAMPLES.md)** - Projekte basierend auf diesem Template
- **[Feature Examples](docs/FEATURE_EXAMPLES.md)** - Wie neue Features hinzugefügt werden

## ✅ Template-Checkliste

Nach der Template-Nutzung:

- [ ] Repository aus Template erstellt
- [ ] Projekt lokal geklont
- [ ] Dependencies installiert (`npm install`)
- [ ] iOS Pods installiert (`cd ios && pod install`)
- [ ] `.env` Datei konfiguriert
- [ ] App-Namen in `package.json` geändert
- [ ] App-Namen in `app.json` geändert
- [ ] Bundle Identifier angepasst
- [ ] Package Name geändert (Android)
- [ ] Erste erfolgreiche Builds (iOS & Android)
- [ ] Git Repository konfiguriert
- [ ] Erste Commits gemacht

## 🎉 Nächste Schritte

1. **Features entwickeln** - Nutze die Clean Architecture Struktur
2. **Tests schreiben** - Erweitere die Test-Suite
3. **CI/CD einrichten** - GitHub Actions für automatische Builds
4. **App Store Setup** - Vorbereitung für Release
5. **Community beitragen** - Teile deine Erfahrungen

---

**Viel Erfolg mit deinem neuen React Native Projekt!** 🚀

Bei Fragen zum Template: [Issue erstellen](../../issues/new)
