# Internationalization (i18n) Implementation

## Übersicht

Diese Enterprise-ready i18n-Implementation stellt eine umfassende Mehrsprachigkeitsunterstützung für die ReactNative-Anwendung bereit.

## Struktur

```
src/core/i18n/
├── locales/           # Übersetzungsdateien
│   ├── de.json       # Deutsche Übersetzungen
│   └── en.json       # Englische Übersetzungen
├── hooks/            # Translation Hooks
│   ├── useAuthTranslations.ts
│   └── index.ts
├── i18n.ts           # i18next Konfiguration
└── README.md         # Diese Datei
```

## Features

### ✅ Implementiert

1. **react-i18next Integration**: Vollständige react-i18next Implementierung
2. **Auth-spezifische Translations**: Spezialisierte Hooks für Auth-Features
3. **Platform-aware Translations**: iOS/Android-spezifische Texte
4. **Type-safe Translations**: TypeScript-Unterstützung mit Typ-Sicherheit
5. **Enterprise Alert Integration**: Lokalisierte Alert-Nachrichten
6. **Biometric Authentication**: Vollständig lokalisierte Biometric-Einstellungen
7. **MFA Setup**: Mehrsprachige MFA-Konfiguration

### 📋 Unterstützte Sprachen

- **Deutsch (de)**: Vollständig implementiert
- **Englisch (en)**: Vollständig implementiert

## Verwendung

### Basic Translation Hook

```typescript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <Text>{t('common.cancel')}</Text>
  );
};
```

### Auth-spezifische Translations

```typescript
import { useAuthTranslations } from '@core/i18n/hooks';

const BiometricComponent = () => {
  const authT = useAuthTranslations();
  
  return (
    <View>
      <Text>{authT.biometric.title}</Text>
      <Text>{authT.biometric.subtitle}</Text>
      <Text>{authT.biometric.description.enabled(authT.biometric.subtitle)}</Text>
    </View>
  );
};
```

### Platform-spezifische Biometric-Texte

```typescript
// iOS: "Face ID / Touch ID"
// Android: "Fingerabdruck"
const biometricType = authT.biometric.subtitle;

// iOS: 🔒, Android: 👆  
const biometricIcon = authT.biometric.icon;
```

### Enterprise Alert mit Translations

```typescript
import { EnterpriseAlert, AlertType } from '@shared/components/alert';
import { useAuthTranslations } from '@core/i18n/hooks';

const authT = useAuthTranslations();

// Standard Alert-Titel verwenden
EnterpriseAlert.show({
  type: AlertType.ERROR,
  title: authT.common.alert.titles.error,
  message: authT.error.biometric.notAvailable,
  // ...weitere Optionen
});

// Verfügbare Alert-Titel:
// - authT.common.alert.titles.error        // "Fehler"
// - authT.common.alert.titles.success      // "Erfolg"
// - authT.common.alert.titles.warning      // "Warnung"
// - authT.common.alert.titles.info         // "Information"
// - authT.common.alert.titles.notAvailable // "Nicht verfügbar"
// - authT.common.alert.titles.enabled      // "Aktiviert"
// - authT.common.alert.titles.disabled     // "Deaktiviert"
// - authT.common.alert.titles.failed       // "Fehlgeschlagen"
// - authT.common.alert.titles.notEnabled   // "Nicht aktiviert"
// - authT.common.alert.titles.confirmation // "Bestätigung"
```

## Translation-Struktur

### Gemeinsame Translations (`common`)

```json
{
  "common": {
    "cancel": "Abbrechen",
    "delete": "Löschen"
  }
}
```

### Error Messages (`error.auth`)

```json
{
  "error": {
    "auth": {
      "biometric": {
        "notAvailable": "Biometrische Authentifizierung ist nicht verfügbar...",
        "failed": "Biometrische Authentifizierung fehlgeschlagen.",
        "enableFailed": "Konnte biometrische Authentifizierung nicht aktivieren..."
      },
      "mfa": {
        "setupFailed": "MFA Setup fehlgeschlagen...",
        "verificationFailed": "Verifizierung fehlgeschlagen..."
      }
    }
  }
}
```

### Auth-spezifische Translations (`auth`)

```json
{
  "auth": {
    "biometric": {
      "title": "Biometrische Authentifizierung",
      "subtitle": {
        "ios": "Face ID / Touch ID",
        "android": "Fingerabdruck"
      },
      "description": {
        "enabled": "Sie können sich mit {{biometricType}} anmelden...",
        "disabled": "Aktivieren Sie {{biometricType}}..."
      }
    },
    "mfa": {
      "title": "Multi-Faktor-Authentifizierung aktivieren",
      "methods": {
        "totp": {
          "title": "Authenticator App",
          "description": "Verwenden Sie eine App wie Google Authenticator..."
        }
      }
    }
  }
}
```

## Best Practices

### 1. Immer Translation-Hooks verwenden

❌ **Schlecht:**
```typescript
<Text>Biometrische Authentifizierung</Text>
```

✅ **Gut:**
```typescript
const authT = useAuthTranslations();
<Text>{authT.biometric.title}</Text>
```

### 2. Platform-spezifische Texte verwenden

❌ **Schlecht:**
```typescript
const biometricType = Platform.OS === 'ios' ? 'Face ID' : 'Fingerprint';
```

✅ **Gut:**
```typescript
const authT = useAuthTranslations();
const biometricType = authT.biometric.subtitle;
```

### 3. Interpolation für dynamische Inhalte

❌ **Schlecht:**
```typescript
const message = `${biometricType} wurde aktiviert`;
```

✅ **Gut:**
```typescript
const message = authT.biometric.success.enabled(biometricType);
```

### 4. Type-safe Translation Keys

Die `useAuthTranslations`-Hook stellt TypeScript-Typen bereit, die zur Compile-Zeit validiert werden.

```typescript
// ✅ TypeScript-Fehler bei falschen Keys
const title = authT.biometric.title;     // OK
const wrong = authT.biometric.wrongKey;  // TS Error
```

## Migration von hardcodierten Strings

### Schritt 1: Identifizieren
```typescript
// Finden Sie alle hardcodierten deutschen Strings
<Text>Biometrische Authentifizierung</Text>
Alert.alert('Fehler', 'Aktivierung fehlgeschlagen');
```

### Schritt 2: Translation hinzufügen
```json
{
  "auth": {
    "biometric": {
      "title": "Biometrische Authentifizierung"
    }
  },
  "error": {
    "auth": {
      "biometric": {
        "enableFailed": "Aktivierung fehlgeschlagen"
      }
    }
  }
}
```

### Schritt 3: Hook verwenden
```typescript
const authT = useAuthTranslations();

<Text>{authT.biometric.title}</Text>
EnterpriseAlert.showError('Fehler', authT.error.biometric.enableFailed);
```

## Erweiterung

### Neue Sprache hinzufügen

1. Neue Locale-Datei erstellen: `src/core/i18n/locales/fr.json`
2. I18n-Konfiguration erweitern: `src/core/i18n/i18n.ts`
3. Translation-Hooks testen

### Neue Translation-Sektion hinzufügen

1. Locale-Dateien erweitern
2. Type-Definitionen in `useAuthTranslations.ts` ergänzen
3. Hook-Implementation aktualisieren

## Testing

### Translation-Keys validieren

```typescript
import { useAuthTranslations } from '@core/i18n/hooks';

// Unit Test
it('should provide all required translation keys', () => {
  const authT = useAuthTranslations();
  
  expect(authT.biometric.title).toBeDefined();
  expect(authT.mfa.title).toBeDefined();
  expect(authT.error.biometric.notAvailable).toBeDefined();
});
```

### Platform-spezifische Translations testen

```typescript
import { Platform } from 'react-native';

it('should provide platform-specific biometric subtitles', () => {
  const authT = useAuthTranslations();
  
  if (Platform.OS === 'ios') {
    expect(authT.biometric.subtitle).toContain('Face ID');
  } else {
    expect(authT.biometric.subtitle).toContain('Fingerabdruck');
  }
});
```

## Troubleshooting

### Problem: Translation-Key nicht gefunden

**Symptom:** `t('missing.key')` gibt den Key zurück statt der Übersetzung

**Lösung:**
1. Überprüfen Sie die Locale-Datei auf Tippfehler
2. Stellen Sie sicher, dass der Key in allen Sprachen vorhanden ist
3. Neuladen der App nach Locale-Änderungen

### Problem: TypeScript-Fehler bei Translation-Hooks

**Symptom:** `Property 'xyz' does not exist on type 'AuthTranslations'`

**Lösung:**
1. Interface `AuthTranslations` erweitern
2. Hook-Implementation aktualisieren
3. Alle Locale-Dateien synchronisieren

## Enterprise Features

- ✅ **Type Safety**: Vollständige TypeScript-Unterstützung
- ✅ **Platform Awareness**: iOS/Android-spezifische Texte
- ✅ **Performance**: Optimierte Translation-Caching
- ✅ **Maintainability**: Zentrale Translation-Verwaltung
- ✅ **Scalability**: Einfache Erweiterung um neue Sprachen
- ✅ **Consistency**: Einheitliche Translation-APIs
- ✅ **Error Handling**: Graceful Fallbacks bei fehlenden Keys

## Migrierte Komponenten

### ✅ Vollständig migriert

1. **BiometricSettings**: Alle deutschen Strings durch Translations ersetzt
   - ✅ Komponententexte (Titel, Beschreibungen, Buttons)
   - ✅ Alert-Titel (Fehler, Erfolg, Warnung, etc.)
   - ✅ Platform-spezifische Biometric-Types
   - ✅ Enterprise Alert Integration

2. **MFASetupModal**: Vollständige i18n-Integration
   - ✅ MFA-Methoden und Beschreibungen
   - ✅ Setup-Anweisungen und Verification
   - ✅ Alert-Titel und Nachrichten
   - ✅ Platform-spezifische Anpassungen

3. **EnterpriseAlert**: Lokalisierte Alert-Nachrichten
   - ✅ Standard Alert-Titel (Fehler, Erfolg, Warnung, etc.)
   - ✅ Gemeinsame Alert-Titel über `common.alert.titles`
   - ✅ Type-safe Alert-Titel in AuthTranslations Hook

### 📋 Ausstehende Migration

- LoginScreen
- RegisterScreen  
- PasswordResetScreen
- UserProfile
- Settings

---

**Hinweis**: Diese Implementation folgt den Enterprise-Standards für Internationalisierung und bietet eine skalierbare Basis für die mehrsprachige Anwendungsentwicklung. 