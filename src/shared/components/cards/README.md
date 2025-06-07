# Enterprise Card Component System

Eine vollständig wiederverwendbare, Enterprise-grade Komponenten-Bibliothek für React Native Apps mit konsistenter UX und modularem Design.

## 📁 **Architektur-Überblick**

```
src/shared/components/cards/
├── base/                   # Foundation Components
│   ├── base-card.component.tsx
│   └── card-content.component.tsx
├── specialized/            # Core Card Types
│   ├── action-card.component.tsx
│   ├── info-card.component.tsx
│   ├── stats-card.component.tsx
│   └── danger-card.component.tsx
├── content/               # Content Wrappers
│   ├── support-card-content.component.tsx
│   ├── security-card-content.component.tsx
│   └── data-stats-content.component.tsx
├── feature-ready/         # High-Level Ready Components
│   ├── support-card.component.tsx
│   ├── security-card.component.tsx
│   └── danger-zone-card.component.tsx
├── types/                 # TypeScript Definitionen
│   └── card.types.ts
├── utils/                 # Styling Utilities
│   └── card-styles.util.ts
└── __tests__/            # Test Suite
    └── *.test.tsx
```

## 🎯 **Design-Prinzipien**

### **1. Composition Pattern**
Maximale Flexibilität durch Komposition statt Vererbung:
```tsx
<BaseCard title="Mein Titel">
  <CustomContent />
</BaseCard>
```

### **2. Enterprise Type Safety**
Vollständige TypeScript-Unterstützung mit strikter Typisierung:
```tsx
interface SecurityStats {
  lastLogin?: Date;
  activeSessions?: number;
  mfaEnabled?: boolean;
}
```

### **3. Konsistente Styling**
Zentrale Styling-Engine für einheitliches Design:
```tsx
const styles = createCardStyles(theme, overrides);
```

### **4. Accessibility First**
Integrierte Barrierefreiheit in allen Komponenten:
```tsx
<ActionCard
  actions={actions}
  accessibilityLabel="Account actions"
  testID="account-actions"
/>
```

## 🔧 **Komponenten-Ebenen**

### **Level 1: Base Components** 
Foundation-Komponenten für minimale Abstraktion:

#### BaseCard
```tsx
import { BaseCard } from '@shared/components/cards';

<BaseCard 
  title="Card Title" 
  subtitle="Optional subtitle"
  elevated={true}
  compact={false}
>
  <YourContent />
</BaseCard>
```

#### CardContent
```tsx
import { CardContent } from '@shared/components/cards';

<CardContent style={customStyle}>
  <Text>Your content here</Text>
</CardContent>
```

### **Level 2: Specialized Components**
Spezialisierte Karten für spezifische Use Cases:

#### ActionCard
```tsx
import { ActionCard } from '@shared/components/cards';

<ActionCard
  title="Actions"
  actions={[
    { id: 'edit', label: 'Edit Profile', icon: 'account-edit' },
    { id: 'settings', label: 'Settings', icon: 'cog' }
  ]}
  onActionPress={(actionId) => handleAction(actionId)}
/>
```

#### InfoCard
```tsx
import { InfoCard } from '@shared/components/cards';

<InfoCard
  title="Completion"
  icon="account-check"
  value="85%"
  description="Profile completion progress"
  trend="up"
  trendValue="+5%"
/>
```

#### StatsCard
```tsx
import { StatsCard } from '@shared/components/cards';

<StatsCard
  title="Statistics"
  layout="vertical"
  stats={[
    { id: 'users', label: 'Active Users', value: '1,234', icon: 'account-group' },
    { id: 'sessions', label: 'Sessions', value: '2,567', icon: 'devices' }
  ]}
/>
```

#### DangerCard
```tsx
import { DangerCard } from '@shared/components/cards';

<DangerCard
  title="Danger Zone"
  dangerLevel="critical"
  confirmationRequired={true}
  confirmText="Delete Account"
  warningText="This action cannot be undone"
  onConfirm={handleDangerousAction}
/>
```

### **Level 3: Content Components**
Intelligente Content-Wrapper mit Domain-Logic:

#### SupportCardContent
```tsx
import { SupportCardContent } from '@shared/components/cards';

<SupportCardContent
  items={supportItems}
  onItemPress={handleSupportAction}
  theme={theme}
  t={t}
/>
```

#### SecurityCardContent
```tsx
import { SecurityCardContent } from '@shared/components/cards';

<SecurityCardContent
  items={securityItems}
  onItemPress={handleSecurityAction}
  theme={theme}
  t={t}
/>
```

### **Level 4: Feature-Ready Components**
Vollständig konfigurierte Komponenten für sofortige Nutzung:

#### SupportCard
```tsx
import { SupportCard } from '@shared/components/cards/feature-ready';

<SupportCard
  t={t}
  onItemPress={handleSupportAction}
  showDefaultItems={true}
/>
```

#### SecurityCard
```tsx
import { SecurityCard } from '@shared/components/cards/feature-ready';

<SecurityCard
  security={{
    lastLogin: new Date(),
    activeSessions: 2,
    mfaEnabled: true
  }}
  t={t}
  onItemPress={handleSecurityAction}
/>
```

#### DangerZoneCard
```tsx
import { DangerZoneCard } from '@shared/components/cards/feature-ready';

<DangerZoneCard
  action="delete"
  onConfirm={handleAccountDeletion}
  t={t}
  dangerLevel="critical"
  requiresDoubleConfirmation={true}
/>
```

## 🎨 **Theming & Styling**

### **Theme Overrides**
Anpassung des visuellen Designs:
```tsx
const themeOverrides: CardThemeOverrides = {
  colors: {
    cardBackground: '#ffffff',
    cardBorder: '#e0e0e0',
    dangerBackground: '#ffebee',
    dangerBorder: '#f44336',
  },
  spacing: {
    cardPadding: 20,
    contentPadding: 16,
    itemSpacing: 12,
  },
  typography: {
    titleSize: 20,
    subtitleSize: 16,
    bodySize: 14,
  }
};

const styles = createCardStyles(theme, themeOverrides);
```

### **Variant Support**
```tsx
<BaseCard variant="elevated" size="large">
  <Content />
</BaseCard>
```

### **Danger Level Styling**
```tsx
<DangerCard dangerLevel="critical">
  <DangerousContent />
</DangerCard>
```

## 🧪 **Testing**

### **Component Tests**
```tsx
import { render, fireEvent } from '@testing-library/react-native';
import { SupportCard } from '@shared/components/cards/feature-ready';

test('renders support items correctly', () => {
  const { getByText } = render(
    <SupportCard t={mockT} showDefaultItems={true} />
  );
  
  expect(getByText('support.help')).toBeTruthy();
  expect(getByText('support.contact')).toBeTruthy();
});
```

### **Integration Tests**
```tsx
test('handles item press correctly', () => {
  const onItemPress = jest.fn();
  const { getByText } = render(
    <SupportCard t={mockT} onItemPress={onItemPress} />
  );
  
  fireEvent.press(getByText('support.help'));
  expect(onItemPress).toHaveBeenCalledWith(
    expect.objectContaining({ id: 'help', type: 'help' })
  );
});
```

## 📊 **Performance Optimierung**

### **Memoization**
```tsx
const MemoizedCard = React.memo(SupportCard);
```

### **Lazy Loading**
```tsx
const LazySecurityCard = React.lazy(() => 
  import('@shared/components/cards/feature-ready/security-card.component')
);
```

### **Bundle Splitting**
```tsx
// Nur importieren was benötigt wird
import { ActionCard } from '@shared/components/cards/specialized/action-card.component';
```

## 🔄 **Migration Guide**

### **Von Feature Cards zu Shared Cards**
```tsx
// Vorher - Feature-spezifische Komponente
import { SupportCard } from '../components/support-card.component';

// Nachher - Shared Enterprise Komponente
import { SupportCard } from '@shared/components/cards/feature-ready';
```

### **Schrittweise Migration**
1. **Level 1**: Base Components nutzen
2. **Level 2**: Specialized Components einführen
3. **Level 3**: Content Components implementieren
4. **Level 4**: Feature-Ready Components verwenden

## 🚀 **Best Practices**

### **Konsistenz**
- Verwende immer die gleichen Card-Typen für ähnliche Inhalte
- Nutze zentrale Styling-Utilities
- Befolge die Accessibility-Guidelines

### **Performance**
- Memoize heavy computations
- Verwende testIDs für E2E-Tests
- Optimiere Bundle-Größe durch selektive Imports

### **Maintenance**
- Dokumentiere Custom-Overrides
- Verwende TypeScript konsequent
- Schreibe umfassende Tests

## 🎯 **Roadmap**

### **Phase 1** ✅ Abgeschlossen
- Base Architecture
- Specialized Components
- Content Components
- Feature-Ready Components

### **Phase 2** 🔄 In Arbeit
- Animation System
- Advanced Theming
- Micro-Interactions

### **Phase 3** 📋 Geplant
- AI-powered Content Suggestions
- Advanced Analytics Integration
- Cross-Platform Compatibility

---

## 📝 **Beispiel-Implementierung**

```tsx
import React from 'react';
import { ScrollView } from 'react-native';
import { 
  SupportCard, 
  SecurityCard, 
  DangerZoneCard 
} from '@shared/components/cards/feature-ready';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

export const AccountSettingsScreen = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <ScrollView>
      <SecurityCard
        security={{
          lastLogin: new Date(),
          activeSessions: 2,
          mfaEnabled: true
        }}
        t={t}
        theme={theme}
        onItemPress={handleSecurityAction}
      />
      
      <SupportCard
        t={t}
        theme={theme}
        onItemPress={handleSupportAction}
      />
      
      <DangerZoneCard
        action="delete"
        onConfirm={handleAccountDeletion}
        t={t}
        theme={theme}
      />
    </ScrollView>
  );
};
```

Diese Enterprise Card Component Library bietet maximale Flexibilität, Konsistenz und Wartbarkeit für React Native Applications auf Enterprise-Niveau. 