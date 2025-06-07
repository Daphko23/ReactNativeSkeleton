# DaphkoAI Clean Architecture & Naming Convention

## 🏗️ 4-Schichten Clean Architecture

Alle Features folgen der **4-Schichten Clean Architecture** mit strikter **Naming-Convention**.

### 📁 Standard Feature Struktur

```
src/features/{feature-name}/
├── application/                    # Application Layer
│   ├── usecases/                  # Business Logic & Use Cases
│   │   └── {feature}.usecase.ts
│   └── services/                  # Application Services
│       └── {feature}-app.service.ts
│
├── domain/                        # Domain Layer  
│   ├── entities/                  # Business Entities
│   │   └── {entity-name}.entity.ts
│   ├── interfaces/                # Business Interfaces
│   │   └── {service-name}.interface.ts
│   └── value-objects/             # Domain Value Objects
│       └── {value-object}.vo.ts
│
├── data/                          # Data Layer
│   ├── services/                  # External Services & APIs
│   │   ├── {service-name}.service.ts
│   │   ├── {service-name}.service.impl.ts
│   │   └── __tests__/
│   │       └── {service-name}.service.test.ts
│   ├── repositories/              # Data Access
│   │   └── {entity-name}.repository.impl.ts
│   └── factories/                 # Dependency Injection
│       └── {feature}-service.container.ts
│
├── presentation/                  # Presentation Layer
│   ├── components/                # UI Components
│   │   └── {component-name}.component.tsx
│   ├── screens/                   # Screen Components
│   │   └── {screen-name}.screen.tsx
│   ├── hooks/                     # React Hooks
│   │   ├── use-{hook-name}.hook.ts
│   │   └── __tests__/
│   │       └── use-{hook-name}.hook.test.ts
│   └── navigation/                # Navigation
│       └── {feature}.navigator.tsx
│
├── docs/                          # Documentation
│   ├── {FEATURE}_GUIDE.md
│   └── API_REFERENCE.md
│
└── index.ts                       # Feature Exports
```

## 🎯 Naming Convention

### Dateitypen und Suffixe

| Layer | Typ | Suffix | Beispiel |
|-------|-----|--------|----------|
| **Presentation** | Screens | `.screen.tsx` | `profile-avatar-demo.screen.tsx` |
| **Presentation** | Components | `.component.tsx` | `avatar-uploader.component.tsx` |
| **Presentation** | Hooks | `.hook.ts` | `use-avatar.hook.ts` |
| **Presentation** | Navigators | `.navigator.tsx` | `profile.navigator.tsx` |
| **Application** | Use Cases | `.usecase.ts` | `notification.usecase.ts` |
| **Application** | App Services | `.service.ts` | `profile-app.service.ts` |
| **Domain** | Entities | `.entity.ts` | `user-profile.entity.ts` |
| **Domain** | Interfaces | `.interface.ts` | `profile-service.interface.ts` |
| **Domain** | Value Objects | `.vo.ts` | `email-address.vo.ts` |
| **Data** | Services | `.service.ts` | `avatar.service.ts` |
| **Data** | Service Impl | `.service.impl.ts` | `profile.service.impl.ts` |
| **Data** | Repositories | `.repository.impl.ts` | `user-profile.repository.impl.ts` |
| **Data** | Containers | `.container.ts` | `profile-service.container.ts` |
| **Testing** | Tests | `.test.ts` | `avatar.service.test.ts` |

### Namensregeln

- **Kebab-case** für alle Dateinamen
- **Beschreibende Namen** mit Feature-Kontext
- **Eindeutige Suffixe** für jeden Dateityp
- **Konsistente Struktur** über alle Features
- **Englische Namen** für Code, Deutsche für Docs

## 🔄 Dependency Flow

```
┌─────────────────┐
│ Presentation    │ ← UI, Screens, Hooks, Navigation
│ Layer           │
└─────────────────┘
         ↓
┌─────────────────┐
│ Application     │ ← Use Cases, Business Logic
│ Layer           │
└─────────────────┘
         ↓
┌─────────────────┐
│ Domain          │ ← Entities, Interfaces, Rules
│ Layer           │
└─────────────────┘
         ↑
┌─────────────────┐
│ Data            │ ← Services, APIs, Storage
│ Layer           │
└─────────────────┘
```

### Abhängigkeitsregeln

1. **Presentation** → Application → Domain ← Data
2. **Keine Abhängigkeiten** von inneren zu äußeren Schichten
3. **Interfaces** definieren Contracts zwischen Schichten
4. **Dependency Injection** für lose Kopplung

## 📦 Implementierte Features

### ✅ Profile Feature

```
src/features/profile/
├── application/                    # [Geplant]
├── domain/
│   ├── entities/
│   │   └── user-profile.entity.ts
│   └── interfaces/
│       └── profile-service.interface.ts
├── data/
│   ├── services/
│   │   ├── avatar.service.ts
│   │   ├── profile.service.impl.ts
│   │   └── __tests__/
│   │       └── avatar.service.test.ts
│   └── factories/
│       └── profile-service.container.ts
├── presentation/
│   ├── components/
│   │   └── avatar-uploader.component.tsx
│   ├── screens/
│   │   ├── profile.screen.tsx
│   │   ├── profile-edit.screen.tsx
│   │   └── profile-avatar-demo.screen.tsx
│   ├── hooks/
│   │   ├── use-profile.hook.ts
│   │   ├── use-profile-form.hook.ts
│   │   ├── use-avatar.hook.ts
│   │   └── __tests__/
│   │       └── use-avatar.hook.test.ts
│   └── navigation/
│       ├── profile.navigator.tsx
│       └── avatar-demo.navigator.tsx
└── docs/
    ├── ARCHITECTURE_STRUCTURE.md
    ├── AVATAR_UPLOAD.md
    ├── IMPLEMENTATION_GUIDE.md
    └── QUICK_START.md
```

### ✅ Notifications Feature

```
src/features/notifications/
├── application/
│   └── usecases/
│       └── notification.usecase.ts
├── domain/
│   ├── entities/
│   │   └── notification.entity.ts
│   └── interfaces/
│       └── notification-service.interface.ts
├── data/
│   └── services/
│       └── firebase-push-notification.service.impl.ts
├── presentation/
│   └── hooks/
│       └── use-notifications.hook.ts
└── di/
    └── notification.container.ts
```

## 🧪 Testing Strategy

### Test-Struktur
```
__tests__/
├── {service-name}.service.test.ts     # Unit Tests
├── use-{hook-name}.hook.test.ts       # Hook Tests
├── {feature}-integration.test.ts      # Integration Tests
└── {feature}-e2e.test.ts             # E2E Tests
```

### Test-Scripts
```bash
# Feature-spezifische Tests
npm run test:{feature}
npm run test:{feature}:watch

# Alle Tests
npm run test
npm run test:coverage
```

## 🚀 Usage Patterns

### Import Patterns
```typescript
// Presentation Layer
import { Component } from '@/features/{feature}/presentation/components/{name}.component';
import { useHook } from '@/features/{feature}/presentation/hooks/use-{name}.hook';

// Domain Layer
import { Entity } from '@/features/{feature}/domain/entities/{name}.entity';
import { IService } from '@/features/{feature}/domain/interfaces/{name}.interface';

// Data Layer
import { Service } from '@/features/{feature}/data/services/{name}.service';
```

### Feature Export
```typescript
// Über Feature Index
import { 
  Component, 
  useHook, 
  Screen 
} from '@/features/{feature}';
```

## 📋 Migration Checklist

Für neue Features oder Refactoring bestehender Features:

### Dateien
- [ ] **Screens** → `.screen.tsx`
- [ ] **Components** → `.component.tsx`  
- [ ] **Hooks** → `use-{name}.hook.ts`
- [ ] **Services** → `.service.ts` / `.service.impl.ts`
- [ ] **Entities** → `.entity.ts`
- [ ] **Interfaces** → `.interface.ts`
- [ ] **Use Cases** → `.usecase.ts`
- [ ] **Navigators** → `.navigator.tsx`
- [ ] **Tests** → entsprechende Suffixe

### Struktur
- [ ] **4 Layer** korrekt implementiert
- [ ] **Dependency Flow** eingehalten
- [ ] **Import-Pfade** aktualisiert
- [ ] **Export-Index** vollständig
- [ ] **Documentation** erstellt

### Code Quality
- [ ] **TypeScript** vollständig typisiert
- [ ] **Tests** mit >90% Coverage
- [ ] **ESLint** ohne Warnings
- [ ] **Prettier** formatiert

## 🎯 Benefits

### ✅ Vorteile der Architektur

1. **Konsistenz** - Einheitliche Struktur über alle Features
2. **Skalierbarkeit** - Klare Schichtentrennung ermöglicht Wachstum
3. **Testbarkeit** - Isolierte Layer für bessere Unit Tests
4. **Wartbarkeit** - Eindeutige Verantwortlichkeiten
5. **Verständlichkeit** - Selbsterklärende Dateinamen und Struktur
6. **Erweiterbarkeit** - Einfache Feature-Erweiterung ohne Breaking Changes
7. **Team-Effizienz** - Entwickler finden sich schnell zurecht
8. **Code Quality** - Erzwingt Clean Code Principles

### 🔍 Enterprise Standards

- **SOLID Principles** - Single Responsibility, Open/Closed, etc.
- **DRY Principle** - Don't Repeat Yourself
- **KISS Principle** - Keep It Simple, Stupid
- **Clean Code** - Readable, Maintainable, Testable
- **Documentation** - Comprehensive and Up-to-date

## 📚 Weitere Ressourcen

- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [React Native Best Practices](https://github.com/react-native-community/discussions-and-proposals)
- [TypeScript Style Guide](https://github.com/microsoft/TypeScript/wiki/Coding-guidelines)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library) 