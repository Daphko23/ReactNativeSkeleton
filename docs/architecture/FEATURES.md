# 📚 Template Features

Übersicht über die im Template enthaltenen Features und deren Implementierung.

## 🔐 Auth Feature

**Beschreibung:** Vollständiges Authentifizierungs-System mit Clean Architecture

**Implementiert:**

- ✅ Login mit Email/Password
- ✅ Registrierung
- ✅ Passwort vergessen
- ✅ Automatische Session-Verwaltung
- ✅ Logout-Funktionalität

**Screens:**

- `LoginScreen` - Benutzeranmeldung
- `RegisterScreen` - Benutzerregistrierung
- `ForgotPasswordScreen` - Passwort zurücksetzen

**Use Cases:**

- `LoginWithEmailUseCase` - Email/Password Login
- `RegisterWithEmailUseCase` - Benutzerregistrierung
- `LogoutUseCase` - Benutzer abmelden
- `GetCurrentUserUseCase` - Aktueller Benutzer
- `IsAuthenticatedUseCase` - Authentifizierungsstatus

**Store:** `useAuthStore` - Zustand State Management

**Technologien:**

- Supabase Auth
- Zustand für State Management
- React Navigation für Auth-Flow

---

## 🎨 Theme System

**Beschreibung:** Vollständiges Design-System mit Dark/Light Mode

**Features:**

- ✅ Light/Dark Mode Toggle
- ✅ Konsistente Farbpalette
- ✅ Typography-System
- ✅ Spacing-System
- ✅ React Native Paper Integration

**Komponenten:**

- `ThemeProvider` - Theme-Kontext
- `useTheme` - Theme Hook
- `ThemeToggle` - Mode-Switcher

---

## 🧭 Navigation System

**Beschreibung:** Typisierte Navigation mit React Navigation v7

**Features:**

- ✅ Stack Navigation
- ✅ Tab Navigation (vorbereitet)
- ✅ Auth Navigation Flow
- ✅ TypeScript Integration
- ✅ Deep Linking (vorbereitet)

**Struktur:**

- `AppNavigator` - Haupt-Navigation
- `AuthNavigator` - Auth-Flow Navigation
- Navigation Types für TypeScript

---

## 🌐 Internationalization (i18n)

**Beschreibung:** Mehrsprachige App-Unterstützung

**Features:**

- ✅ i18next Integration
- ✅ Deutsch/Englisch vorbereitet
- ✅ Automatische Spracherkennung
- ✅ Namespace-basierte Übersetzungen

**Dateien:**

- `src/core/i18n/` - i18n Konfiguration
- `src/core/i18n/locales/` - Übersetzungsdateien

---

## 🧪 Testing Setup

**Beschreibung:** Umfassendes Testing-Framework

**Features:**

- ✅ Jest Konfiguration
- ✅ React Native Testing Library
- ✅ Unit Test Beispiele
- ✅ Integration Test Setup
- ✅ Coverage Reports

**Beispiele:**

- Auth Store Tests
- Component Tests
- Use Case Tests

---

## 🔧 Development Tools

**Beschreibung:** Professionelle Entwicklungsumgebung

**Features:**

- ✅ ESLint + Prettier
- ✅ Husky Pre-Commit Hooks
- ✅ TypeScript Konfiguration
- ✅ Path Aliasing (@core/, @features/, @shared/)
- ✅ Metro Konfiguration

---

## 📱 Shared Components

**Beschreibung:** Wiederverwendbare UI-Komponenten

**Komponenten:**

- `Screen` - Basis-Screen Wrapper
- `LoadingSpinner` - Loading-Indikator
- `ErrorMessage` - Fehler-Anzeige
- `Button` - Styled Button
- `Input` - Styled Text Input

---

## 🗄️ State Management

**Beschreibung:** Zustand für leichtgewichtiges State Management

**Features:**

- ✅ TypeScript Integration
- ✅ Persist Middleware (vorbereitet)
- ✅ DevTools Integration
- ✅ Feature-basierte Stores

---

## 🔌 Backend Integration

**Beschreibung:** Supabase Backend-as-a-Service

**Features:**

- ✅ Supabase Client Setup
- ✅ Authentication Integration
- ✅ Database Queries (vorbereitet)
- ✅ Real-time Subscriptions (vorbereitet)
- ✅ File Storage (vorbereitet)

---

## 📦 Neue Features hinzufügen

### 1. Feature-Struktur erstellen

```bash
mkdir -p src/features/meinFeature/{domain,application,data,presentation}
mkdir -p src/features/meinFeature/presentation/{screens,components,store}
```

### 2. Clean Architecture befolgen

- **Domain Layer**: Entities, Repository Interfaces
- **Application Layer**: Use Cases, Services
- **Data Layer**: Repository Implementations, DTOs
- **Presentation Layer**: Screens, Components, Store

### 3. Navigation integrieren

```typescript
// Navigation Types erweitern
export type RootStackParamList = {
  // ... bestehende Screens
  MeinFeature: undefined;
};

// Screen zur Navigation hinzufügen
<Stack.Screen name="MeinFeature" component={MeinFeatureScreen} />
```

### 4. Tests schreiben

```typescript
// Use Case Tests
describe('MeinFeatureUseCase', () => {
  // ...
});

// Component Tests
describe('MeinFeatureScreen', () => {
  // ...
});
```

---

## 📚 Dokumentation

Jedes Feature sollte dokumentiert werden:

- **README.md** - Feature-Übersicht
- **ARCHITECTURE.md** - Architektur-Details
- **API.md** - API-Dokumentation
- **TESTING.md** - Test-Strategien

---

**Das Template bietet eine solide Basis für skalierbare React Native Apps!** 🚀
