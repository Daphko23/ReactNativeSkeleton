# 🏗️ Clean Architecture Guide

Diese Template implementiert **Clean Architecture** nach Uncle Bob's Prinzipien für maximale Skalierbarkeit, Wartbarkeit und Testbarkeit.

## 📋 Architektur-Übersicht

```
┌─────────────────────────────────────────────────────────────┐
│                    🎨 Presentation Layer                    │
│              (React Native, UI Components)                 │
├─────────────────────────────────────────────────────────────┤
│                   🔧 Application Layer                      │
│                (Use Cases, Services)                       │
├─────────────────────────────────────────────────────────────┤
│                     💾 Data Layer                          │
│            (Repositories, Datasources, DTOs)               │
├─────────────────────────────────────────────────────────────┤
│                    🎯 Domain Layer                         │
│              (Entities, Business Rules)                    │
└─────────────────────────────────────────────────────────────┘
```

**Dependency Rule**: Abhängigkeiten zeigen nur nach innen. Äußere Schichten kennen innere, aber nicht umgekehrt.

## 🎯 Domain Layer (Geschäftslogik-Kern)

### Struktur

```
src/features/[feature]/domain/
├── entities/          # Geschäftsobjekte
├── enums/            # Geschäftsregeln
├── repositories/     # Abstrakte Interfaces
└── types/           # Domain-spezifische Typen
```

### Verantwortlichkeiten

- **Entities**: Kerngeschäftsobjekte deiner App
- **Business Rules**: Geschäftslogik und Validierungen
- **Repository Interfaces**: Abstrakte Datenverträge
- **Domain Services**: Komplexe Geschäftslogik

### Beispiel: User Entity

```typescript
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  isActive: boolean;
}

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  create(user: Omit<User, 'id'>): Promise<User>;
  update(id: string, data: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
}
```

## 🔧 Application Layer (Use Cases)

### Struktur

```
src/features/[feature]/application/
├── use-cases/        # Geschäftsanwendungsfälle
├── services/         # Domain Services
└── validators/       # Input-Validierung
```

### Verantwortlichkeiten

- **Use Cases**: Spezifische Geschäftsanwendungsfälle
- **Orchestrierung**: Koordination zwischen Domain und Data Layer
- **Validierung**: Input-Validierung und Geschäftsregeln

### Beispiel: Login Use Case

```typescript
export class LoginUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly validator: LoginValidator
  ) {}

  async execute(credentials: LoginCredentials): Promise<AuthResult> {
    // 1. Validierung
    await this.validator.validate(credentials);

    // 2. Geschäftslogik
    const result = await this.authRepository.login(credentials);

    // 3. Rückgabe
    return result;
  }
}
```

## 💾 Data Layer (Persistierung)

### Struktur

```
src/features/[feature]/data/
├── sources/          # API Clients, Supabase, etc.
├── repository/       # Repository Implementierungen
├── mappers/          # DTO ↔ Entity Mapping
├── dto/             # Data Transfer Objects
└── interfaces/       # Datasource Contracts
```

### Verantwortlichkeiten

- **Datasources**: Externe Datenquellen (APIs, Datenbanken)
- **Repository Implementation**: Konkrete Repository-Implementierungen
- **Data Mapping**: Transformation zwischen DTOs und Entities
- **Caching**: Performance-Optimierung

### Beispiel: Repository Implementation

```typescript
export class AuthRepositoryImpl implements AuthRepository {
  constructor(
    private readonly datasource: AuthDatasource,
    private readonly mapper: AuthMapper
  ) {}

  async login(credentials: LoginCredentials): Promise<AuthResult> {
    const dto = await this.datasource.login(credentials);
    return this.mapper.dtoToEntity(dto);
  }
}
```

## 🎨 Presentation Layer (UI/UX)

### Struktur

```
src/features/[feature]/presentation/
├── screens/          # React Native Screens
├── components/       # UI Components
├── hooks/           # Custom React Hooks
├── store/           # Zustand State Management
└── navigation/      # Screen Navigation
```

### Verantwortlichkeiten

- **UI Components**: React Native Komponenten
- **State Management**: Zustand und UI-Logik
- **Navigation**: Screen-zu-Screen Navigation
- **User Interaction**: Event Handling und User Input

### Beispiel: Login Screen

```typescript
export const LoginScreen = () => {
  const { login, isLoading } = useAuthStore();

  const handleLogin = async (credentials: LoginCredentials) => {
    await login(credentials);
  };

  return (
    <Screen>
      <LoginForm onSubmit={handleLogin} loading={isLoading} />
    </Screen>
  );
};
```

## 🔄 Datenfluss

```
User Input → Presentation → Use Case → Repository → Datasource
                ↓              ↓           ↓           ↓
            UI Update ← Store ← Result ← Entity ← DTO
```

## 🎯 Vorteile dieser Architektur

### ✅ **Testbarkeit**

- Jede Schicht kann isoliert getestet werden
- Business Logic ist framework-unabhängig
- Mocking von Dependencies einfach möglich

### ✅ **Wartbarkeit**

- Klare Trennung der Verantwortlichkeiten
- Änderungen in einer Schicht beeinflussen andere nicht
- Code ist selbstdokumentierend

### ✅ **Skalierbarkeit**

- Neue Features folgen dem gleichen Pattern
- Team kann parallel an verschiedenen Schichten arbeiten
- Einfache Erweiterung um neue Datasources

### ✅ **Flexibilität**

- Framework-Wechsel (React Native → Flutter) möglich
- Backend-Wechsel (Supabase → Firebase) einfach
- UI-Library-Wechsel ohne Business Logic Änderungen

## 🚀 Neue Features hinzufügen

### 1. Feature-Struktur erstellen

```bash
mkdir -p src/features/myFeature/{domain,application,data,presentation}
mkdir -p src/features/myFeature/presentation/{screens,components,store}
```

### 2. Domain Layer definieren

- Entities und Interfaces erstellen
- Business Rules implementieren
- Repository Interfaces definieren

### 3. Application Layer implementieren

- Use Cases für Geschäftslogik
- Services für komplexe Operationen
- Validatoren für Input-Prüfung

### 4. Data Layer aufbauen

- Datasources für externe APIs
- Repository Implementierungen
- DTOs und Mapper

### 5. Presentation Layer entwickeln

- Screens und Components
- State Management mit Zustand
- Navigation integrieren

## 📚 Weiterführende Ressourcen

- [Clean Architecture (Uncle Bob)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [React Native Best Practices](https://reactnative.dev/docs/performance)

---

**Diese Architektur macht deine App zukunftssicher und enterprise-ready!** 🚀
