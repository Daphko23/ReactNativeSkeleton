# Profile Feature Flags - Build-Time Configuration

## 🚀 Übersicht

Die Profile Feature Flags ermöglichen es, verschiedene Profile-Screens und Funktionen zur Build-Zeit ein- oder auszuschalten. Dies erlaubt die Erstellung verschiedener App-Varianten (Basic, Enterprise, Student, etc.) aus derselben Codebase.

## 📱 Verfügbare Screen Feature Flags

### Screen-Level Toggles (Build-Time)
```typescript
ENABLE_ACCOUNT_SETTINGS     // Account Settings Screen
ENABLE_CUSTOM_FIELDS_EDIT   // Custom Fields Edit Screen  
ENABLE_PRIVACY_SETTINGS     // Privacy Settings Screen
ENABLE_SKILLS_MANAGEMENT    // Skills Management Screen
ENABLE_SOCIAL_LINKS_EDIT    // Social Links Edit Screen
```

### Background Funktionalität (Existing)
```typescript
ENABLE_ANALYTICS            // Nutzungsstatistiken
ENABLE_OFFLINE_MODE         // Offline Funktionalität
ENABLE_REAL_TIME           // Real-time Updates
ENABLE_ADVANCED_SHARING    // Erweiterte Sharing-Features
ENABLE_CUSTOM_FIELDS       // Custom Fields Backend
ENABLE_AVATAR_UPLOAD       // Avatar Upload Feature
ENABLE_EXPORT              // Profile Export
ENABLE_PERFORMANCE_MONITORING // Performance Tracking
```

## 🛠️ Verwendung

### 1. Navigation Guards
```tsx
// Automatisch in profile.navigator.tsx implementiert:
{isScreenEnabled('SkillsManagement') && (
  <Screen 
    name="SkillsManagement" 
    component={SkillsManagementScreen} 
  />
)}
```

### 2. Component Conditional Rendering
```tsx
import { useFeatureFlag } from '@features/profile/presentation/hooks';

const ProfileComponent = () => {
  const { isScreenEnabled, isFeatureEnabled } = useFeatureFlag();

  return (
    <View>
      {/* Screen Navigation Button */}
      {isScreenEnabled('CustomFieldsEdit') && (
        <Button onPress={() => navigate('CustomFieldsEdit')}>
          Custom Fields bearbeiten
        </Button>
      )}

      {/* Feature Flag for Components */}
      {isFeatureEnabled(ProfileScreenFeatureFlag.ENABLE_ANALYTICS) && (
        <AnalyticsSection />
      )}
    </View>
  );
};
```

### 3. Hook Integration
```tsx
import { useCustomFields } from '@features/profile/presentation/hooks';

const ProfileScreen = () => {
  const { isScreenEnabled } = useFeatureFlag();
  
  // Hook nur laden wenn Feature aktiv
  const customFields = useCustomFields({
    enabled: isScreenEnabled('CustomFieldsEdit')
  });

  return (
    <View>
      {isScreenEnabled('CustomFieldsEdit') && (
        <CustomFieldsSection data={customFields.data} />
      )}
    </View>
  );
};
```

## 🏗️ App Varianten

### Basic App
```json
{
  "enable_account_settings": true,
  "enable_custom_fields_edit": false,
  "enable_privacy_settings": true,
  "enable_skills_management": false,
  "enable_social_links_edit": false
}
```
**Features**: Nur Account Settings + Privacy Settings

### Enterprise App  
```json
{
  "enable_account_settings": true,
  "enable_custom_fields_edit": true,
  "enable_privacy_settings": true,
  "enable_skills_management": true,
  "enable_social_links_edit": true
}
```
**Features**: Alle Profile-Features aktiviert

### Student App
```json
{
  "enable_account_settings": true,
  "enable_custom_fields_edit": true,
  "enable_privacy_settings": true,
  "enable_skills_management": true,
  "enable_social_links_edit": false
}
```
**Features**: Skills + Custom Fields, aber keine Social Links

### Corporate App
```json
{
  "enable_account_settings": true,
  "enable_custom_fields_edit": true,
  "enable_privacy_settings": true,
  "enable_skills_management": true,
  "enable_social_links_edit": false
}
```
**Features**: Berufliche Features, aber Social Media deaktiviert

## 🔧 Konfiguration

### 1. Feature Flag Defaults
Die Default-Werte sind in `ProfileScreenConfiguration` definiert:
```typescript
// src/features/profile/domain/entities/profile-screen-config.entity.ts
[ProfileScreenFeatureFlag.ENABLE_ACCOUNT_SETTINGS]: true,
[ProfileScreenFeatureFlag.ENABLE_CUSTOM_FIELDS_EDIT]: true,
[ProfileScreenFeatureFlag.ENABLE_PRIVACY_SETTINGS]: true,
[ProfileScreenFeatureFlag.ENABLE_SKILLS_MANAGEMENT]: true,
[ProfileScreenFeatureFlag.ENABLE_SOCIAL_LINKS_EDIT]: true
```

### 2. App Varianten Konfiguration
App-spezifische Konfigurationen in:
```
src/core/config/app-variants.json
```

### 3. Environment Variables (Zukünftig)
```bash
# .env.production
REACT_APP_PROFILE_VARIANT=enterprise

# .env.basic
REACT_APP_PROFILE_VARIANT=basic

# .env.student  
REACT_APP_PROFILE_VARIANT=student
```

## 📊 Business Use Cases

### 🎯 App Store Varianten
- **Basic**: Kostenlose Version mit eingeschränkten Features
- **Premium**: Bezahlversion mit erweiterten Features
- **Enterprise**: B2B-Version mit vollständigen Features

### 🏢 Deployment Strategien
- **White-Label Apps**: Verschiedene Kunden, verschiedene Feature-Sets
- **Market Testing**: A/B-Tests mit verschiedenen Feature-Kombinationen
- **Gradual Rollout**: Neue Features schrittweise aktivieren

### 🎓 Zielgruppen-spezifisch
- **Student Apps**: Akademische Features, Social Media reduziert
- **Corporate Apps**: Business Features, Social Media deaktiviert
- **Consumer Apps**: Alle Social Features, weniger Business Tools

## 🚀 API Referenz

### useFeatureFlag Hook
```typescript
interface UseFeatureFlagReturn {
  isFeatureEnabled: (flag: ProfileScreenFeatureFlag) => boolean;
  isScreenEnabled: (screenName: ScreenName) => boolean;
  getEnabledFeatures: () => ProfileScreenFeatureFlag[];
}
```

### Screen Names
```typescript
type ScreenName = 
  | 'AccountSettings' 
  | 'CustomFieldsEdit'
  | 'PrivacySettings'
  | 'SkillsManagement' 
  | 'SocialLinksEdit';
```

### Feature Flag Utils
```typescript
FeatureFlagUtils.areAllScreensEnabled(screens, checker)
FeatureFlagUtils.isAnyScreenEnabled(screens, checker)  
FeatureFlagUtils.getEnabledScreens(screens, checker)
```

## ✅ Implementierung Status

- ✅ ProfileScreenFeatureFlag enum erweitert (5 neue Screen Flags)
- ✅ useFeatureFlag Hook implementiert
- ✅ Navigation Guards in profile.navigator.tsx
- ✅ TypeScript Typen und Interfaces
- ✅ App Varianten Konfiguration
- ✅ Dokumentation
- ⏳ Environment Variable Integration (geplant)
- ⏳ Build-Zeit Konfiguration Scripts (geplant)

## 🎯 Nächste Schritte

1. **Environment Integration**: Feature Flags aus .env Dateien laden
2. **Build Scripts**: Automatische Konfiguration basierend auf Build-Target
3. **Testing**: Feature Flag Toggles in verschiedenen Szenarien testen
4. **Runtime Feature Flags**: User Settings für funktionale Features implementieren 