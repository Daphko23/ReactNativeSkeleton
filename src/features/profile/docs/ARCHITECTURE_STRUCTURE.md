# Profile Feature - Clean Architecture Structure

## 🏗️ Clean Architecture Layers

Das Profile Feature folgt der **4-Schichten Clean Architecture** mit strikter **Naming-Convention**.

### 📁 Verzeichnisstruktur

```
src/features/profile/
├── application/                    # Application Layer
│   └── usecases/                  # Business Logic & Use Cases
│
├── domain/                        # Domain Layer  
│   ├── entities/                  # Business Entities
│   │   └── user-profile.entity.ts
│   └── interfaces/                # Business Interfaces
│       └── profile-service.interface.ts
│
├── data/                          # Data Layer
│   ├── services/                  # External Services & APIs
│   │   ├── avatar.service.ts
│   │   ├── profile.service.impl.ts
│   │   └── __tests__/
│   │       └── avatar.service.test.ts
│   └── factories/                 # Dependency Injection
│       └── profile-service.container.ts
│
├── presentation/                  # Presentation Layer
│   ├── components/                # UI Components
│   │   └── avatar-uploader.component.tsx
│   ├── screens/                   # Screen Components
│   │   ├── profile.screen.tsx
│   │   ├── profile-edit.screen.tsx
│   │   └── profile-avatar-demo.screen.tsx
│   ├── hooks/                     # React Hooks
│   │   ├── use-profile.hook.ts
│   │   ├── use-profile-form.hook.ts
│   │   ├── use-avatar.hook.ts
│   │   └── __tests__/
│   │       └── use-avatar.hook.test.ts
│   └── navigation/                # Navigation
│       ├── profile.navigator.tsx
│       └── avatar-demo.navigator.tsx
│
├── docs/                          # Documentation
│   ├── ARCHITECTURE_STRUCTURE.md
│   ├── AVATAR_UPLOAD.md
│   ├── IMPLEMENTATION_GUIDE.md
│   └── QUICK_START.md
│
└── index.ts                       # Feature Exports
```

## 🎯 Naming Convention

### Dateitypen und Suffixe

| Typ | Suffix | Beispiel |
|-----|--------|----------|
| **Screens** | `.screen.tsx` | `profile-avatar-demo.screen.tsx` |
| **Components** | `.component.tsx` | `avatar-uploader.component.tsx` |
| **Hooks** | `.hook.ts` | `use-avatar.hook.ts` |
| **Services** | `.service.ts` | `avatar.service.ts` |
| **Service Impl** | `.service.impl.ts` | `profile.service.impl.ts` |
| **Entities** | `.entity.ts` | `user-profile.entity.ts` |
| **Interfaces** | `.interface.ts` | `profile-service.interface.ts` |
| **Use Cases** | `.usecase.ts` | `notification.usecase.ts` |
| **Navigators** | `.navigator.tsx` | `profile.navigator.tsx` |
| **Containers** | `.container.ts` | `profile-service.container.ts` |
| **Tests** | `.test.ts` | `avatar.service.test.ts` |

### Namensregeln

- **Kebab-case** für alle Dateinamen
- **Beschreibende Namen** mit Feature-Präfix
- **Eindeutige Suffixe** für jeden Dateityp
- **Konsistente Struktur** über alle Features

## 🔄 Dependency Flow

```
Presentation Layer
       ↓
Application Layer  
       ↓
Domain Layer
       ↓
Data Layer
```

### Abhängigkeitsregeln

1. **Presentation** → Application → Domain ← Data
2. **Keine Abhängigkeiten** von äußeren zu inneren Schichten
3. **Interfaces** definieren Contracts zwischen Schichten
4. **Dependency Injection** für lose Kopplung

## 📦 Layer Responsibilities

### 🎨 Presentation Layer
- **UI Components** - React Components für User Interface
- **Screens** - Vollständige Screen-Implementierungen  
- **Hooks** - React State Management & Side Effects
- **Navigation** - Screen-zu-Screen Navigation

### 🔧 Application Layer
- **Use Cases** - Business Logic & Orchestration
- **Application Services** - Feature-spezifische Logik
- **DTOs** - Data Transfer Objects
- **Validators** - Input/Output Validation

### 🏛️ Domain Layer
- **Entities** - Core Business Objects
- **Interfaces** - Contracts & Abstractions
- **Value Objects** - Immutable Domain Values
- **Domain Services** - Pure Business Logic

### 💾 Data Layer
- **Services** - External API Integrations
- **Repositories** - Data Access Abstractions
- **Mappers** - Data Transformation
- **Factories** - Object Creation & DI

## 🧪 Testing Strategy

### Test-Dateien Struktur
```
__tests__/
├── avatar.service.test.ts          # Unit Tests
├── use-avatar.hook.test.ts         # Hook Tests
└── profile-integration.test.ts     # Integration Tests
```

### Test-Scripts
```bash
# Avatar-spezifische Tests
npm run test:avatar

# Alle Profile Tests
npm run test:profile

# Mit Watch Mode
npm run test:avatar:watch
```

## 🚀 Usage Examples

### Import Patterns
```typescript
// Presentation Layer
import { AvatarUploader } from '@/features/profile/presentation/components/avatar-uploader.component';
import { useAvatar } from '@/features/profile/presentation/hooks/use-avatar.hook';

// Domain Layer
import { UserProfile } from '@/features/profile/domain/entities/user-profile.entity';
import { IProfileService } from '@/features/profile/domain/interfaces/profile-service.interface';

// Data Layer
import { AvatarService } from '@/features/profile/data/services/avatar.service';
```

### Feature Export
```typescript
// Über Feature Index
import { 
  AvatarUploader, 
  useAvatar, 
  ProfileScreen 
} from '@/features/profile';
```

## 📋 Migration Checklist

- [x] **Screens** umbenannt zu `.screen.tsx`
- [x] **Components** umbenannt zu `.component.tsx`  
- [x] **Hooks** umbenannt zu `.hook.ts`
- [x] **Services** umbenannt zu `.service.ts`
- [x] **Entities** umbenannt zu `.entity.ts`
- [x] **Interfaces** umbenannt zu `.interface.ts`
- [x] **Navigators** umbenannt zu `.navigator.tsx`
- [x] **Tests** umbenannt entsprechend
- [x] **Import-Pfade** aktualisiert
- [x] **Export-Index** aktualisiert
- [x] **Package.json Scripts** aktualisiert

## 🎯 Benefits

### ✅ Vorteile der neuen Struktur

1. **Konsistenz** - Einheitliche Naming-Convention
2. **Skalierbarkeit** - Klare Schichtentrennung
3. **Testbarkeit** - Isolierte Layer für bessere Tests
4. **Wartbarkeit** - Eindeutige Verantwortlichkeiten
5. **Verständlichkeit** - Selbsterklärende Dateinamen
6. **Erweiterbarkeit** - Einfache Feature-Erweiterung

### 🔍 Code Quality

- **TypeScript** - Vollständige Typsicherheit
- **Clean Code** - SOLID Principles
- **Documentation** - Umfassende Dokumentation
- **Testing** - 90%+ Test Coverage
- **Linting** - ESLint + Prettier Standards 