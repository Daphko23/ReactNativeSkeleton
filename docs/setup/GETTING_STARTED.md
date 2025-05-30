📄 GETTING_STARTED.md

# 🚀 Getting Started

Schnelleinstieg für die Nutzung des React Native Skeleton Templates.

## 📋 Voraussetzungen

- **Node.js** 18+
- **npm** 8+
- **React Native CLI** (global installiert)
- **Xcode** 15+ (für iOS, nur auf macOS)
- **Android Studio** (für Android)

## ⚡ Template verwenden

### 1. Repository aus Template erstellen

```bash
# Auf GitHub: "Use this template" Button klicken
# Oder mit GitHub CLI:
gh repo create mein-projekt --template username/react-native-skeleton-template
```

### 2. Projekt setup

```bash
# Repository klonen
git clone https://github.com/username/mein-projekt.git
cd mein-projekt

# Dependencies installieren
npm install

# iOS Dependencies (nur auf macOS)
cd ios && pod install && cd ..

# Umgebungsvariablen konfigurieren
cp .env.example .env
# .env Datei mit deinen Werten ausfüllen
```

### 3. Entwicklung starten

```bash
# Metro Bundler starten
npm start

# In separatem Terminal:
npm run ios     # iOS Simulator
npm run android # Android Emulator
```

## 🔧 Erste Anpassungen

### App-Namen ändern

```json
// package.json
{
  "name": "mein-app-name",
  "displayName": "Meine App"
}

// app.json
{
  "name": "MeineApp",
  "displayName": "Meine App"
}
```

### Bundle Identifier anpassen

- **iOS**: Öffne `ios/ReactNativeSkeleton.xcworkspace` in Xcode
- **Android**: Bearbeite `android/app/build.gradle`

Siehe [SETUP.md](../SETUP.md) für detaillierte Anweisungen.

## 🧪 Entwicklung & Testing

```bash
# Code Quality prüfen
npm run lint        # ESLint
npm run type-check  # TypeScript
npm run format      # Prettier

# Tests ausführen
npm test            # Unit Tests
npm run test:watch  # Tests im Watch-Modus

# Builds erstellen
npm run build:ios     # iOS Production Build
npm run build:android # Android Production Build
```

## 📚 Nächste Schritte

1. **[Template Features](FEATURES.md)** - Übersicht über enthaltene Features
2. **[Architecture Guide](ARCHITECTURE.md)** - Clean Architecture verstehen
3. **[Examples](EXAMPLES.md)** - Praktische Implementierungsbeispiele
4. **[Setup Guide](../SETUP.md)** - Detaillierte Konfiguration

## 🆘 Hilfe benötigt?

- **[Issues](../../issues)** - Bug Reports & Feature Requests
- **[Discussions](../../discussions)** - Community Austausch
- **[Wiki](../../wiki)** - Erweiterte Dokumentation

---

**Viel Erfolg mit deinem React Native Projekt!** 🚀
