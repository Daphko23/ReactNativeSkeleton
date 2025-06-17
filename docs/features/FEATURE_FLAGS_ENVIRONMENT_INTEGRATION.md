# Feature Flags Environment Integration

## 🚀 Übersicht

Das Feature Flag Environment Integration System ermöglicht es, verschiedene App-Varianten zur Build-Zeit zu erstellen, indem Feature Flags über Environment Variables konfiguriert werden. Dies ermöglicht die Erstellung verschiedener App-Versionen (Basic, Enterprise, Development) aus derselben Codebase.

## 📁 Architektur

### Environment Feature Flag Service
```typescript
// src/core/config/feature-flags.env.ts
export class EnvironmentFeatureFlagService {
  // Singleton Service für Environment-basierte Feature Flags
  isScreenEnabled(screen: string): boolean
  isBackgroundFeatureEnabled(feature: string): boolean
  shouldShowUIComponent(component: string): boolean
  getAppVariant(): AppVariant
}
```

### Profile Feature Flag Hook Integration
```typescript
// src/features/profile/presentation/hooks/use-feature-flag.hook.ts
export function useFeatureFlag(): UseFeatureFlagReturn {
  // Erweiterte Hook mit Environment Integration
  // Priorität: Environment Variables > Static Configuration
}
```

## 🏗️ App-Varianten

### 1. Development (Alle Features)
- **Verwendung**: Entwicklung und Testing
- **Feature Coverage**: 100% aller Features aktiviert
- **Debug Mode**: Aktiviert
- **Zielgruppe**: Entwickler

### 2. Basic (Minimal Features)
- **Verwendung**: Basis-App für Standard-User
- **Feature Coverage**: ~30% der Features
- **Screens**: Account Settings, Privacy Settings
- **UI Components**: Grundlegende Profile-Funktionen

### 3. Enterprise (Full Professional)
- **Verwendung**: Vollständige Enterprise-Lösung
- **Feature Coverage**: 100% aller Features
- **Advanced Features**: Analytics, Audit Logging, GDPR Compliance
- **Zielgruppe**: Enterprise-Kunden

## ⚙️ Konfiguration

### Environment Variables

#### Screen-Level Feature Flags
```bash
# Core Profile Screens
ENABLE_ACCOUNT_SETTINGS=true
ENABLE_CUSTOM_FIELDS_EDIT=true
ENABLE_PRIVACY_SETTINGS=true
ENABLE_SKILLS_MANAGEMENT=true
ENABLE_SOCIAL_LINKS_EDIT=true
```

#### Background Functionality
```bash
# Analytics & Monitoring
ENABLE_ANALYTICS=true
ENABLE_PERFORMANCE_MONITORING=true
ENABLE_AUDIT_LOGGING=true

# Data & Sync
ENABLE_BACKGROUND_SYNC=true
ENABLE_REAL_TIME_UPDATES=true
ENABLE_OFFLINE_MODE=true
ENABLE_CLOUD_BACKUP=true

# Advanced Features
ENABLE_PROFILE_VERSIONING=true
ENABLE_ENCRYPTION=true
ENABLE_BIOMETRIC_AUTH=true
ENABLE_GDPR_COMPLIANCE=true
```

#### UI Component Toggles
```bash
# Banner & Suggestions
SHOW_COMPLETION_BANNER=true
SHOW_ENHANCEMENT_SUGGESTIONS=true
SHOW_QUICK_ACTIONS=true

# Profile Sections
SHOW_SOCIAL_LINKS=true
SHOW_PROFESSIONAL_INFO=true
SHOW_SKILLS_MANAGEMENT=true
SHOW_AVATAR_UPLOAD=true

# Analytics & Export
SHOW_PROFILE_ANALYTICS=true
SHOW_EXPORT_OPTIONS=true
SHOW_SHARING_OPTIONS=true
```

## 🛠️ Build Scripts

### Feature Flag Konfiguration
```bash
# Spezifische Variante konfigurieren
npm run feature-flags:basic
npm run feature-flags:enterprise
npm run feature-flags:development

# Verfügbare Varianten anzeigen
npm run feature-flags:list

# Konfiguration validieren
npm run feature-flags:validate

# Custom Konfiguration
npm run feature-flags:configure -- --variant=enterprise --override="ENABLE_ANALYTICS=false"
```

### App-Varianten Build
```bash
# Einzelne Varianten
npm run build:basic           # Basic Android
npm run build:basic:ios       # Basic iOS
npm run build:enterprise      # Enterprise Android
npm run build:enterprise:ios  # Enterprise iOS

# Alle Varianten
npm run build:all-variants        # Alle Android
npm run build:all-variants:ios    # Alle iOS

# Custom Build
npm run build:custom -- --variant=enterprise --override="ENABLE_ANALYTICS=false"

# Validierung vor Build
npm run build:validate
```

## 📱 Verwendung in Komponenten

### Screen Navigation Guards
```typescript
// Automatische Navigation-Guards in ProfileNavigator
{isScreenEnabled('PrivacySettings') && (
  <Stack.Screen name="PrivacySettings" component={PrivacySettingsScreen} />
)}
```

### Component Visibility
```typescript
// Automatische UI Component-Guards in ProfileNavigation
if (isScreenEnabled('AccountSettings')) {
  actions.push({
    id: 'accountSettings',
    label: t('profile.mainScreen.accountSettings'),
    // ...
  });
}
```

### Feature Flag Checks
```typescript
const { isFeatureEnabled, isScreenEnabled, getAppVariant } = useFeatureFlag();

// Screen-Checks
if (isScreenEnabled('CustomFieldsEdit')) {
  // Show Custom Fields Button
}

// Feature-Checks
if (isFeatureEnabled(ProfileScreenFeatureFlag.ENABLE_ANALYTICS)) {
  // Initialize Analytics
}

// App Variant Info
const variant = getAppVariant(); // 'basic' | 'enterprise' | 'development'
```

## 🔧 Build Workflow

### 1. Feature Flag Konfiguration
```bash
# Schritt 1: Gewünschte Variante konfigurieren
npm run feature-flags:enterprise

# Schritt 2: Konfiguration validieren
npm run feature-flags:validate -- --variant=enterprise
```

### 2. App Build
```bash
# Schritt 3: App mit konfigurierten Feature Flags bauen
npm run build:enterprise

# Oder für alle Varianten
npm run build:all-variants
```

### 3. Build Artefakte
Nach erfolgreichem Build werden erstellt:
- `.env` - Aktuelle Environment-Konfiguration
- `.env.{variant}.example` - Example-Datei für Variante
- `feature-flags-{variant}.json` - Konfiguration Summary
- `build-info-{variant}-{platform}.json` - Build-Informationen

## 🎯 Beispiele

### Basic App Konfiguration
```bash
# 1. Basic Variante konfigurieren
npm run feature-flags:basic

# 2. Validieren
npm run feature-flags:validate -- --variant=basic

# 3. Build für Android
npm run build:basic
```

**Resultat**: App mit minimalen Features (Account Settings, Privacy Settings, grundlegende UI)

### Enterprise App mit Custom Overrides
```bash
# 1. Enterprise konfigurieren aber Analytics deaktivieren
npm run feature-flags:configure -- --variant=enterprise --override="ENABLE_ANALYTICS=false,SHOW_PROFILE_ANALYTICS=false"

# 2. Custom Build
npm run build:custom -- --variant=enterprise --override="ENABLE_ANALYTICS=false"
```

**Resultat**: Enterprise App ohne Analytics-Features

### Development Setup
```bash
# 1. Development-Variante für vollständige Features
npm run feature-flags:development

# 2. Build für beide Plattformen
npm run build:development        # Android
npm run build:development:ios    # iOS
```

**Resultat**: Vollständige App mit allen Features und Debug-Funktionen

## 🔍 Validierung

### Build-Zeit Validierung
- TypeScript Compilation Check
- ESLint Linting
- Test Suite Execution
- Feature Flag Konsistenz-Check

### Konfiguration Validierung
```bash
# Prüft auf inkonsistente Feature Flag-Kombinationen
npm run feature-flags:validate -- --variant=basic

# Beispiel-Warnungen:
# ⚠️ Warning: Custom Fields Edit screen is enabled but UI component is hidden
# ⚠️ Warning: Skills Management screen is enabled but UI component is hidden
```

## 📊 Build Summary

Nach jedem Build wird ein Summary generiert:
```json
{
  "variant": "enterprise",
  "platform": "android",
  "timestamp": "2025-01-10T12:00:00.000Z",
  "screenFlags": {
    "enabled": ["ENABLE_ACCOUNT_SETTINGS", "ENABLE_CUSTOM_FIELDS_EDIT"],
    "disabled": []
  },
  "uiComponents": {
    "shown": ["SHOW_COMPLETION_BANNER", "SHOW_QUICK_ACTIONS"],
    "hidden": []
  },
  "featureFlags": {
    "ENABLE_ANALYTICS": "true",
    "ENABLE_GDPR_COMPLIANCE": "true"
  }
}
```

## 🚀 CI/CD Integration

### GitHub Actions Beispiel
```yaml
name: Build App Variants
on: [push, pull_request]

jobs:
  build-variants:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        variant: [basic, enterprise]
        platform: [android, ios]
    
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Configure Feature Flags
        run: npm run feature-flags:${{ matrix.variant }}
      
      - name: Validate Configuration
        run: npm run feature-flags:validate -- --variant=${{ matrix.variant }}
      
      - name: Build App
        run: npm run build:${{ matrix.variant }}:${{ matrix.platform }}
      
      - name: Upload Build Artifacts
        uses: actions/upload-artifact@v4
        with:
          name: app-${{ matrix.variant }}-${{ matrix.platform }}
          path: |
            android/app/build/outputs/apk/release/*.apk
            ios/build/Build/Products/Release-iphoneos/*.app
            build-info-${{ matrix.variant }}-${{ matrix.platform }}.json
```

## 🔐 Sicherheit

### Environment Variables Sicherheit
- Feature Flags enthalten keine sensitiven Daten
- API-Schlüssel separat über sichere Environment Variables
- Build-Zeit Konfiguration vs. Runtime Secrets getrennt

### Validierung
- Automatische Konsistenz-Checks bei Konfiguration
- TypeScript Compile-Zeit Validierung
- ESLint Rules für korrekte Feature Flag Usage

## 📈 Performance

### Build-Zeit Optimierung
- Nur aktivierte Features werden in Bundle inkludiert
- Tree Shaking für nicht verwendete Components
- Conditional Imports basierend auf Feature Flags

### Runtime Performance
- Feature Flags werden zur Build-Zeit aufgelöst
- Keine Runtime-Overhead für deaktivierte Features
- Optimized Bundle Size pro App-Variante

## 🧪 Testing

### Feature Flag Testing
```typescript
// Test für verschiedene App-Varianten
describe('Feature Flags', () => {
  it('should hide disabled screens in basic variant', () => {
    process.env.APP_VARIANT = 'basic';
    process.env.ENABLE_SKILLS_MANAGEMENT = 'false';
    
    const { result } = renderHook(() => useFeatureFlag());
    expect(result.current.isScreenEnabled('SkillsManagement')).toBe(false);
  });
});
```

---

## 🎉 Fazit

Das Environment Feature Flag System ermöglicht:

- ✅ **Multiple App-Varianten** aus einer Codebase
- ✅ **Build-Zeit Konfiguration** ohne Code-Änderungen  
- ✅ **Automatische UI Guards** für konsistente UX
- ✅ **CI/CD Integration** für automatische Builds
- ✅ **Performance Optimierung** durch conditional bundling
- ✅ **Enterprise-Grade Validierung** und Monitoring

**Ready for Production** 🚀 