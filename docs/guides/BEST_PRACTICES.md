# 🏆 React Native Template - Best Practices Guide

Bewährte Praktiken für die Entwicklung mit diesem React Native Skeleton Template.

---

## 📚 1. Code-Struktur & Architecture

### 1.1 Clean Architecture befolgen

- **Feature-first**: Jede Funktionalität lebt in eigenem Feature-Ordner (`src/features/xyz`)
- **Layer-Trennung**: Strikte Trennung von Domain, Application, Data und Presentation Layer
- **Shared-Komponenten**: Wiederverwendbare Komponenten unter `src/shared/`

```typescript
// ✅ Gut: Feature-basierte Struktur
src/features/auth/
├── domain/entities/user.entity.ts
├── application/use-cases/login.usecase.ts
├── data/repository/auth.repository.impl.ts
└── presentation/screens/login.screen.tsx

// ❌ Schlecht: Mixed-Folder Struktur
src/
├── screens/LoginScreen.tsx
├── services/AuthService.ts
└── models/User.ts
```

### 1.2 Dependency Rule einhalten

```typescript
// ✅ Gut: Domain Layer kennt keine äußeren Schichten
export interface UserRepository {
  findById(id: string): Promise<User | null>;
}

// ❌ Schlecht: Domain Layer importiert React Native
import {AsyncStorage} from '@react-native-async-storage/async-storage';
```

## 📝 2. Code-Qualität Standards

### 2.1 TypeScript Best Practices

```typescript
// ✅ Gut: Explizite Typisierung
interface LoginCredentials {
  email: string;
  password: string;
}

const login = async (credentials: LoginCredentials): Promise<User> => {
  // Implementation
};

// ❌ Schlecht: Any-Types verwenden
const login = async (credentials: any): Promise<any> => {
  // Implementation
};
```

### 2.2 Naming Conventions

```typescript
// ✅ Gut: Deskriptive Namen
const fetchUserProfile = async (userId: string) => {
  /* */
};
const isUserAuthenticated = (user: User) => {
  /* */
};
const UserProfileScreen = () => {
  /* */
};

// ❌ Schlecht: Unklare Namen
const getData = async (id: string) => {
  /* */
};
const check = (user: User) => {
  /* */
};
const Screen1 = () => {
  /* */
};
```

### 2.3 Funktionale Programmierung

```typescript
// ✅ Gut: Pure Functions
const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.price, 0);
};

// ✅ Gut: Immutable Updates
const updateUser = (user: User, updates: Partial<User>): User => {
  return {...user, ...updates};
};

// ❌ Schlecht: Mutations
const updateUserMutable = (user: User, updates: Partial<User>) => {
  Object.assign(user, updates); // Mutiert das Original
  return user;
};
```

## 🧪 3. Testing Best Practices

### 3.1 Test-Struktur

```typescript
// ✅ Gut: AAA Pattern (Arrange, Act, Assert)
describe('LoginUseCase', () => {
  it('should login user with valid credentials', async () => {
    // Arrange
    const mockRepository = createMockRepository();
    const useCase = new LoginUseCase(mockRepository);
    const credentials = {email: 'test@example.com', password: 'password'};

    // Act
    const result = await useCase.execute(credentials);

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(mockRepository.login).toHaveBeenCalledWith(credentials);
  });
});
```

### 3.2 Test-Coverage

```bash
# Mindest-Coverage Ziele:
# - Use Cases: 90%+
# - Repositories: 80%+
# - Components: 70%+
# - Utilities: 95%+

npm run test:coverage
```

## 🎨 4. UI/UX Best Practices

### 4.1 Theme System nutzen

```typescript
// ✅ Gut: Theme-basierte Styles
const MyComponent = () => {
  const { colors, spacing, typography } = useTheme();

  return (
    <View style={{
      backgroundColor: colors.surface,
      padding: spacing.md,
    }}>
      <Text style={typography.headlineSmall}>Title</Text>
    </View>
  );
};

// ❌ Schlecht: Hardcoded Styles
const MyComponent = () => {
  return (
    <View style={{
      backgroundColor: '#ffffff',
      padding: 16,
    }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Title</Text>
    </View>
  );
};
```

### 4.2 Responsive Design -> Styles in eigene Datei. zB. responsive-card.component.style.ts

```typescript
// ✅ Gut: Responsive Komponenten
const ResponsiveCard = () => {
  const { width } = useWindowDimensions();
  const isTablet = width > 768;

  return (
    <Card style={{
      width: isTablet ? '50%' : '100%',
      maxWidth: isTablet ? 400 : undefined,
    }}>
      {/* Content */}
    </Card>
  );
};
```

## 🔄 5. State Management

### 5.1 Zustand Store Pattern

```typescript
// ✅ Gut: Feature-spezifische Stores
interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async credentials => {
    set({isLoading: true, error: null});
    try {
      const loginUseCase = new LoginUseCase(authRepository);
      const user = await loginUseCase.execute(credentials);
      set({user, isLoading: false});
    } catch (error) {
      set({error: error.message, isLoading: false});
    }
  },

  logout: () => set({user: null}),
  clearError: () => set({error: null}),
}));
```

## 🚀 6. Performance Best Practices

### 6.1 Lazy Loading

```typescript
// ✅ Gut: Lazy-loaded Screens
const ProfileScreen = lazy(() => import('./ProfileScreen'));
const SettingsScreen = lazy(() => import('./SettingsScreen'));

// ✅ Gut: Conditional Imports
const heavyLibrary = await import('heavy-library');
```

### 6.2 Memoization

```typescript
// ✅ Gut: React.memo für teure Komponenten
const ExpensiveComponent = React.memo(({ data }: { data: ComplexData }) => {
  const processedData = useMemo(() => {
    return processComplexData(data);
  }, [data]);

  return <View>{/* Render processedData */}</View>;
});
```

## 🔒 7. Security Best Practices

### 7.1 Sensitive Data

```typescript
// ✅ Gut: Umgebungsvariablen für Secrets
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// ❌ Schlecht: Hardcoded Secrets
const supabaseUrl = 'https://xyz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

### 7.2 Input Validation

```typescript
// ✅ Gut: Zod für Validierung
const LoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const validateLogin = (data: unknown) => {
  return LoginSchema.parse(data);
};
```

## 📦 8. Dependency Management

### 8.1 Package Auswahl

```typescript
// ✅ Gut: Bewertungskriterien
// - Aktive Wartung (letzte Updates)
// - Community Support (GitHub Stars, Issues)
// - Bundle Size Impact
// - TypeScript Support
// - React Native Kompatibilität

// ❌ Schlecht: Veraltete oder unmaintained Packages
```

### 8.2 Version Pinning

```json
// ✅ Gut: Exakte Versionen für kritische Dependencies
{
  "dependencies": {
    "react": "19.0.0",
    "react-native": "0.79.1",
    "@supabase/supabase-js": "^2.49.8"
  }
}
```

## 🔄 9. Git Workflow

### 9.1 Commit Messages

```bash
# ✅ Gut: Conventional Commits
feat(auth): add biometric authentication
fix(navigation): resolve deep link handling
docs(readme): update installation instructions
test(auth): add unit tests for login use case

# ❌ Schlecht: Unklare Messages
git commit -m "fix stuff"
git commit -m "update"
```

### 9.2 Branch Strategy

```bash
# ✅ Gut: Feature Branches
feature/auth-biometric
feature/profile-settings
fix/navigation-crash
hotfix/security-patch

# ✅ Gut: Descriptive PR Titles
"feat(auth): implement biometric authentication with TouchID/FaceID"
```

## 🚀 10. Release & Deployment

### 10.1 Build Optimization

```bash
# Production Builds optimieren
npm run build:ios -- --configuration Release
npm run build:android -- --mode release

# Bundle Size analysieren
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output bundle.js
```

### 10.2 Environment Management

```typescript
// ✅ Gut: Environment-spezifische Konfiguration
const config = {
  development: {
    apiUrl: 'http://localhost:3000',
    logLevel: 'debug',
  },
  production: {
    apiUrl: 'https://api.myapp.com',
    logLevel: 'error',
  },
};

export default config[process.env.NODE_ENV || 'development'];
```

---

## 📋 Checkliste für Code Reviews

### ✅ Code Quality

- [ ] TypeScript Typen korrekt definiert
- [ ] Keine `any` Types verwendet
- [ ] Funktionen sind pure (wo möglich)
- [ ] Naming Conventions befolgt

### ✅ Architecture

- [ ] Clean Architecture Prinzipien befolgt
- [ ] Dependency Rule eingehalten
- [ ] Feature-basierte Struktur verwendet

### ✅ Testing

- [ ] Unit Tests für neue Features
- [ ] Integration Tests für kritische Flows
- [ ] Test Coverage ausreichend

### ✅ Performance

- [ ] Keine unnötigen Re-Renders
- [ ] Lazy Loading implementiert
- [ ] Bundle Size Impact berücksichtigt

### ✅ Security

- [ ] Keine Secrets im Code
- [ ] Input Validation implementiert
- [ ] Sichere API-Kommunikation

---

**Mit diesen Best Practices entwickelst du maintainable, skalierbare und professionelle React Native Apps!** 🚀
