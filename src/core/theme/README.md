# 🎨 Core Theme System

## Übersicht

Das zentrale Theme-System bietet eine einheitliche Design-Sprache für die gesamte ReactNativeSkeleton-Anwendung. Es definiert konsistente Farben, Abstände, Typografie und weitere Design-Token für alle Komponenten.

## 📁 Dateienstruktur

```
src/core/theme/
├── README.md           # Diese Dokumentation  
├── index.ts           # Zentrale Exports
├── colors.ts          # Farbpalette
├── spacing.ts         # Abstände und Layouts
├── typography.ts      # Typografie-System
└── theme.ts          # Haupt-Theme-Konfiguration
```

## 🎨 Farb-System

### Grundlegende Verwendung

```typescript
import { colors } from '@core/theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderColor: colors.borderLight,
  },
  text: {
    color: colors.textPrimary,
  },
});
```

### Verfügbare Farbkategorien

#### 🎨 Brand Colors
- `colors.primary` - Primärfarbe (#015941)
- `colors.secondary` - Sekundärfarbe (#00B374)

#### 🖼️ Surface Colors
- `colors.background` - App-Hintergrund
- `colors.surface` - Card/Container-Hintergrund
- `colors.surfaceVariant` - Alternative Oberfläche
- `colors.surfaceCard` - Spezielle Card-Oberfläche

#### 📝 Text Colors
- `colors.textPrimary` - Haupt-Text
- `colors.textSecondary` - Sekundärer Text
- `colors.textMuted` - Gedämpfter Text
- `colors.textDisabled` - Deaktivierter Text

#### 🚨 Status Colors
- `colors.error` / `colors.errorLight` / `colors.errorText`
- `colors.success` / `colors.successLight` / `colors.successText`
- `colors.warning` / `colors.warningLight` / `colors.warningText`
- `colors.info` / `colors.infoLight` / `colors.infoText`

#### 🔲 Border Colors
- `colors.border` - Standard-Border
- `colors.borderLight` - Heller Border
- `colors.borderMuted` - Gedämpfter Border
- `colors.borderFocus` - Fokus-Border

## 📏 Spacing-System

### Grundlegende Verwendung

```typescript
import { spacing } from '@core/theme';

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    margin: spacing.lg,
    borderRadius: spacing.component.borderRadius,
  },
});
```

### Spacing-Skala
- `spacing.none` - 0px
- `spacing.xs` - 4px
- `spacing.sm` - 8px
- `spacing.md` - 16px
- `spacing.lg` - 24px
- `spacing.xl` - 32px
- `spacing.xxl` - 40px
- `spacing.xxxl` - 48px

### Komponenten-Spacing
```typescript
spacing.component.padding          // 20px
spacing.component.borderRadius     // 12px
spacing.layout.screenPadding       // 20px
spacing.touchTarget.button         // 48px
```

### Shadow-System
```typescript
// Kleine Schatten
...spacing.shadow.small

// Mittlere Schatten  
...spacing.shadow.medium

// Große Schatten
...spacing.shadow.large
```

## 📝 Typography-System

### Grundlegende Verwendung

```typescript
import { typography } from '@core/theme';

const styles = StyleSheet.create({
  title: {
    ...typography.heading.h3,
    color: colors.textPrimary,
  },
  body: {
    ...typography.text.regular,
    color: colors.textSecondary,
  },
  button: {
    ...typography.buttonText.medium,
    color: colors.surface,
  },
});
```

### Heading-Hierarchie
- `typography.heading.h1` - Größte Überschrift (32px)
- `typography.heading.h2` - Zweite Überschrift (28px)
- `typography.heading.h3` - Dritte Überschrift (24px)
- `typography.heading.h4` - Vierte Überschrift (20px)
- `typography.heading.h5` - Fünfte Überschrift (18px)
- `typography.heading.h6` - Kleinste Überschrift (16px)

### Text-Größen
- `typography.text.large` - Großer Text (18px)
- `typography.text.regular` - Standard-Text (16px)
- `typography.text.small` - Kleiner Text (14px)
- `typography.text.tiny` - Sehr kleiner Text (12px)

### Label & Interactive Elements
- `typography.labelText.large` - Große Labels (16px)
- `typography.labelText.medium` - Standard Labels (14px)
- `typography.labelText.small` - Kleine Labels (12px)
- `typography.buttonText.large` - Große Buttons (18px)
- `typography.buttonText.medium` - Standard Buttons (16px)
- `typography.buttonText.small` - Kleine Buttons (14px)

## 🏗️ Theme Integration Beispiele

### Auth-Komponenten Integration

```typescript
// BiometricSettings Komponente
import { colors, spacing, typography } from '@core/theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceCard,
    borderRadius: spacing.component.borderRadius,
    padding: spacing.component.padding,
    ...spacing.shadow.small,
  },
  title: {
    ...typography.heading.h5,
    color: colors.textPrimary,
  },
  warningContainer: {
    backgroundColor: colors.warningLight,
    borderLeftColor: colors.warningBorder,
    padding: spacing.sm,
  },
});
```

### Modal-Komponenten Integration

```typescript
// MFASetupModal Komponente
const styles = StyleSheet.create({
  methodCard: {
    backgroundColor: colors.surfaceVariant,
    borderRadius: spacing.component.borderRadius,
    borderColor: colors.borderLight,
    padding: spacing.md,
    minHeight: spacing.touchTarget.button + spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.info,
    borderRadius: spacing.component.borderRadiusSmall,
    minHeight: spacing.touchTarget.button,
  },
  buttonText: {
    ...typography.buttonText.medium,
    color: colors.surface,
  },
});
```

## 🎯 Best Practices

### ✅ Empfohlene Praktiken

1. **Immer Theme-Variablen verwenden**
   ```typescript
   // ✅ Gut
   color: colors.textPrimary
   
   // ❌ Schlecht
   color: '#111827'
   ```

2. **Semantische Farbnamen verwenden**
   ```typescript
   // ✅ Gut
   backgroundColor: colors.errorLight
   
   // ❌ Schlecht
   backgroundColor: colors.red
   ```

3. **Spacing-System konsequent nutzen**
   ```typescript
   // ✅ Gut
   padding: spacing.md
   
   // ❌ Schlecht
   padding: 16
   ```

4. **Typography-Kombinationen verwenden**
   ```typescript
   // ✅ Gut
   {
     ...typography.heading.h3,
     color: colors.textPrimary,
   }
   
   // ❌ Schlecht
   {
     fontSize: 24,
     fontWeight: 'bold',
     color: '#111827',
   }
   ```

### ⚠️ Zu vermeidende Praktiken

1. **Hardcodierte Werte**
2. **Magische Zahlen** 
3. **Inkonsistente Abstände**
4. **Direkte Hex-Codes**

## 🔄 Migration von hardcodierten Styles

### Vor der Migration
```typescript
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
});
```

### Nach der Migration
```typescript
import { colors, spacing, typography } from '@core/theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: spacing.component.borderRadius,
    padding: spacing.component.padding,
    ...spacing.shadow.small,
  },
  title: {
    ...typography.heading.h5,
    color: colors.textPrimary,
  },
});
```

## 🚀 Erweiterte Verwendung

### Dark Mode Support (Vorbereitung)
```typescript
// Theme kann dynamisch basierend auf Dark Mode erweitert werden
const themeColors = isDarkMode ? darkColors : lightColors;
```

### Custom Component Themes
```typescript
// Spezielle Theme-Erweiterungen für Komponenten
export const authComponentTheme = {
  biometric: {
    iconSize: spacing.xl,
    cardPadding: spacing.component.padding,
  },
  mfa: {
    qrCodeSize: 200,
    methodCardHeight: spacing.touchTarget.button + spacing.md,
  },
};
```

### Responsive Design
```typescript
// Spacing kann für verschiedene Bildschirmgrößen angepasst werden
const getResponsiveSpacing = (screenWidth: number) => ({
  padding: screenWidth > 768 ? spacing.xl : spacing.md,
});
```

## 📱 Platform-spezifische Anpassungen

```typescript
import { Platform } from 'react-native';

const platformSpacing = {
  ...spacing,
  touchTarget: {
    ...spacing.touchTarget,
    // iOS hat etwas größere Touch-Targets
    minimum: Platform.OS === 'ios' ? 44 : 48,
  },
};
```

## 🔧 Theme-Erweiterung

Neue Design-Token können einfach hinzugefügt werden:

```typescript
// colors.ts erweitern
export const colors = {
  // ... existing colors
  custom: {
    brand: '#your-brand-color',
    accent: '#your-accent-color',
  },
};

// spacing.ts erweitern  
export const spacing = {
  // ... existing spacing
  custom: {
    specialPadding: 42,
    uniqueMargin: 18,
  },
};
```

---

*Die Theme-Integration ermöglicht eine konsistente, wartbare und skalierbare Design-Sprache für die gesamte Anwendung.* 