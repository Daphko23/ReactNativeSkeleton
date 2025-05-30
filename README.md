# 🚀 React Native Skeleton Template

[![React Native](https://img.shields.io/badge/React%20Native-0.79.1-blue.svg)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Ein **production-ready** React Native Template mit Clean Architecture, vorkonfigurierten Development-Tools und modernem Setup. Perfekt für den schnellen Start neuer Projekte.

## ⚡ Quick Start

### 1. Template verwenden

```bash
# Klicke auf "Use this template" oben auf dieser Seite
# Oder verwende GitHub CLI:
gh repo create mein-neues-projekt --template username/react-native-skeleton-template
```

### 2. Projekt setup

```bash
git clone https://github.com/username/mein-neues-projekt.git
cd mein-neues-projekt

# Dependencies installieren
npm install

# iOS Setup (nur auf macOS)
cd ios && pod install && cd ..

# Umgebungsvariablen konfigurieren
cp .env.example .env
# Bearbeite .env mit deinen Werten

# App starten
npm run ios    # oder npm run android
```

### 3. Projekt anpassen

Folge der [detaillierten Setup-Anleitung](SETUP.md) um App-Namen, Bundle-Identifier und weitere Konfigurationen anzupassen.

## 🎯 Was ist enthalten?

### 🏗️ Architecture & Structure

- **Clean Architecture** - Saubere Trennung von Data, Domain und Presentation Layer
- **Feature-basierte Struktur** - Modulare Organisation nach Features
- **TypeScript** - Vollständige Typisierung für bessere Entwicklererfahrung

### 🛠️ Development Tools

- **ESLint + Prettier** - Code-Qualität und konsistente Formatierung
- **Husky Pre-Commit Hooks** - Automatische Code-Prüfung vor Commits
- **Jest + React Native Testing Library** - Umfassendes Testing-Setup
- **Path Aliasing** - Saubere Imports mit `@core/`, `@features/`, `@shared/`

### 📱 UI & Navigation

- **React Navigation v7** - Moderne, typisierte Navigation
- **React Native Paper** - Material Design UI-Komponenten
- **Theme System** - Konsistentes Design-System mit Dark/Light Mode
- **Responsive Design** - Optimiert für verschiedene Bildschirmgrößen

### 🔐 Features

- **Auth System** - Vollständiges Authentifizierungs-System mit Clean Architecture
- **State Management** - Zustand für leichtgewichtiges State Management
- **Internationalisierung** - i18next für mehrsprachige Apps
- **Supabase Integration** - Backend-as-a-Service vorbereitet

### 📦 Native Configuration

- **iOS & Android** - Vollständig konfigurierte native Projekte
- **React Native 0.79.1** - Neueste stabile Version
- **New Architecture Ready** - Vorbereitet für Fabric und TurboModules

## 📁 Projektstruktur

```
├── src/
│   ├── core/                    # Kern-Funktionalitäten
│   │   ├── config/             # App-Konfiguration & Konstanten
│   │   ├── navigation/         # Navigation Setup & Types
│   │   ├── store/              # Globaler Zustand Store
│   │   ├── i18n/               # Internationalisierung
│   │   └── types/              # Globale TypeScript Types
│   ├── features/               # Feature-Module (Clean Architecture)
│   │   └── auth/               # Authentifizierungs-Feature
│   │       ├── data/           # Data Layer (API, Storage)
│   │       ├── domain/         # Domain Layer (Entities, Use Cases)
│   │       └── presentation/   # Presentation Layer (Screens, Components)
│   ├── shared/                 # Geteilte Komponenten & Utilities
│   │   ├── components/         # Wiederverwendbare UI-Komponenten
│   │   ├── theme/              # Design-System (Colors, Typography, Spacing)
│   │   └── utils/              # Utility-Funktionen & Helpers
│   └── types/                  # Feature-spezifische Types
├── android/                    # Android Native Code
├── ios/                        # iOS Native Code
├── __tests__/                  # Test-Dateien
└── docs/                       # Zusätzliche Dokumentation
```

## 🎨 Theme System

Vollständiges Design-System mit Dark/Light Mode Support:

```typescript
import { useTheme } from '@shared/theme';

const MyComponent = () => {
  const { colors, spacing, typography } = useTheme();

  return (
    <View style={{
      backgroundColor: colors.surface,
      padding: spacing.md,
    }}>
      <Text style={typography.headlineSmall}>
        Styled with Theme System
      </Text>
    </View>
  );
};
```

## 🔐 Auth System

Production-ready Authentifizierung mit Clean Architecture:

```typescript
import { useAuthStore } from '@features/auth';

const LoginScreen = () => {
  const { login, isLoading, user } = useAuthStore();

  const handleLogin = async () => {
    await login('email@example.com', 'password');
  };

  if (user) {
    return <DashboardScreen />;
  }

  return <LoginForm onLogin={handleLogin} loading={isLoading} />;
};
```

## 🧪 Testing

Umfassendes Testing-Setup mit Best Practices:

```bash
# Unit Tests
npm test

# Tests mit Coverage Report
npm run test:coverage

# Tests im Watch-Modus
npm run test:watch

# E2E Tests (falls konfiguriert)
npm run e2e:ios
npm run e2e:android
```

## 📱 Unterstützte Plattformen

| Platform | Version               | Status                     |
| -------- | --------------------- | -------------------------- |
| iOS      | 13.4+                 | ✅ Vollständig unterstützt |
| Android  | API 21+ (Android 5.0) | ✅ Vollständig unterstützt |

## 🔧 Anpassung für dein Projekt

### 1. App-Namen & Identifier ändern

```bash
# Folge der detaillierten Anleitung in SETUP.md
# Ändere App-Namen, Bundle-Identifier, Package-Namen
```

### 2. Umgebungsvariablen konfigurieren

```bash
# .env Datei anpassen
SUPABASE_URL=deine_supabase_url
SUPABASE_ANON_KEY=dein_supabase_anon_key
API_BASE_URL=https://api.deinapp.com
```

### 3. Theme anpassen

```typescript
// src/shared/theme/colors.ts
export const lightColors = {
  primary: '#deine-primary-farbe',
  secondary: '#deine-secondary-farbe',
  // ...
};
```

## 📚 Verfügbare Scripts

```bash
npm start              # Metro Bundler starten
npm run ios            # iOS App starten
npm run android        # Android App starten
npm run lint           # ESLint ausführen
npm run lint:fix       # ESLint mit Auto-Fix
npm run format         # Prettier Code-Formatierung
npm test               # Tests ausführen
npm run type-check     # TypeScript Type-Checking
npm run build:ios      # iOS Production Build
npm run build:android  # Android Production Build
```

## 📖 Dokumentation

- **[Setup-Anleitung](SETUP.md)** - Detaillierte Schritt-für-Schritt Anleitung
- **[Template-Nutzung](TEMPLATE_USAGE.md)** - Spezifische Anweisungen für Template-Nutzer
- **[Architecture Guide](docs/ARCHITECTURE.md)** - Clean Architecture Erklärung
- **[Contributing](CONTRIBUTING.md)** - Beitrag zum Template

## 🤝 Community & Support

- **[Issues](../../issues)** - Bug Reports & Feature Requests
- **[Discussions](../../discussions)** - Community Diskussionen
- **[Wiki](../../wiki)** - Erweiterte Dokumentation

## 🔄 Template Updates

Dieses Template wird regelmäßig aktualisiert. Um Updates zu erhalten:

1. **Watch** dieses Repository für Benachrichtigungen
2. Überprüfe [Releases](../../releases) für neue Versionen
3. Folge dem [Upgrade Guide](docs/UPGRADE.md) für bestehende Projekte

## 📄 Lizenz

MIT License - siehe [LICENSE](LICENSE) für Details.

## 🌟 Showcase

Projekte, die mit diesem Template erstellt wurden:

- Füge dein Projekt hinzu! Erstelle einen PR.

## 🙏 Credits

Erstellt mit ❤️ für die React Native Community.

**Gefällt dir das Template?** Gib uns einen ⭐ und teile es mit anderen!

---

**Ready to build something amazing?** 🚀

[**Use this template**](../../generate) und starte dein nächstes React Native Projekt in Minuten!
