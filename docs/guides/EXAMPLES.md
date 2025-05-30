# 📚 Beispiele und Tutorials

Dieses Dokument enthält praktische Beispiele für die Nutzung des React Native Skeleton Templates.

## 🚀 Schnellstart

### 1. Template verwenden

```bash
# Template klonen
git clone <template-url> MyAwesomeApp
cd MyAwesomeApp

# Dependencies installieren
npm install

# iOS Pods installieren
cd ios && pod install && cd ..

# App starten
npm run ios
# oder
npm run android
```

### 2. Erstes Feature erstellen

```bash
# Einfaches Feature
npm run feature:create

# CRUD-Feature mit vollständiger API-Integration
npm run feature:crud

# Interaktive CLI
npm run feature:cli
```

## 🏗️ CRUD-Feature Beispiel

### Todo-Feature erstellen

```bash
npm run feature:crud
```

**Eingaben:**

- Feature-Name: `todo`
- Beschreibung: `Todo-Verwaltung mit CRUD-Operationen`
- Entity-Felder: `title:string,completed:boolean,priority:number`
- Authentifizierung: `y`
- API-Endpoint: `/api/todos`

### Generierte Struktur

```
src/features/todo/
├── domain/
│   ├── entities/
│   │   └── Todo.ts                 # Entity & Interfaces
│   └── repositories/
│       └── TodoRepository.ts       # Repository Interface
├── application/
│   └── use-cases/
│       ├── GetTodoListUseCase.ts   # Liste laden
│       ├── CreateTodoUseCase.ts    # Todo erstellen
│       ├── UpdateTodoUseCase.ts    # Todo aktualisieren
│       └── DeleteTodoUseCase.ts    # Todo löschen
├── data/
│   ├── dto/
│   │   └── TodoDTO.ts              # Data Transfer Objects
│   ├── mappers/
│   │   └── TodoMapper.ts           # Domain ↔ DTO Mapping
│   └── repository/
│       └── SupabaseTodoRepository.ts # Supabase Implementation
├── presentation/
│   ├── components/                 # Feature-spezifische Components
│   ├── screens/
│   │   ├── TodoListScreen.tsx      # Liste anzeigen
│   │   └── CreateTodoScreen.tsx    # Todo erstellen
│   ├── hooks/
│   │   └── useTodoActions.ts       # Business Logic Hooks
│   └── store/
│       └── useTodoStore.ts         # Zustand Management
├── __tests__/                      # Test-Struktur
└── feature.json                    # Feature-Metadaten
```

### Entity Definition

```typescript
// src/features/todo/domain/entities/Todo.ts
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoRequest {
  title: string;
  completed: boolean;
  priority: number;
}

export interface UpdateTodoRequest {
  title?: string;
  completed?: boolean;
  priority?: number;
}

export interface TodoListResponse {
  data: Todo[];
  total: number;
  page: number;
  limit: number;
}
```

### UseCase Beispiel

```typescript
// src/features/todo/application/use-cases/CreateTodoUseCase.ts
import {Todo, CreateTodoRequest} from '../../domain/entities/Todo';
import {TodoRepository} from '../../domain/repositories/TodoRepository';

export class CreateTodoUseCase {
  constructor(private readonly repository: TodoRepository) {}

  async execute(request: CreateTodoRequest): Promise<Todo> {
    try {
      return await this.repository.create(request);
    } catch (error) {
      throw new Error(`Failed to create todo: ${error.message}`);
    }
  }
}
```

### Store Integration

```typescript
// src/features/todo/presentation/store/useTodoStore.ts
import {create} from 'zustand';
import {Todo} from '../../domain/entities/Todo';

interface TodoState {
  // Data
  items: Todo[];
  currentItem: Todo | null;
  total: number;
  page: number;
  limit: number;

  // Loading states
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;

  // Error handling
  error: string | null;

  // Actions
  setItems: (items: Todo[], total: number, page: number) => void;
  addItem: (item: Todo) => void;
  updateItem: (item: Todo) => void;
  removeItem: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

export const useTodoStore = create<TodoState>((set, get) => ({
  // Initial state
  items: [],
  currentItem: null,
  total: 0,
  page: 1,
  limit: 10,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,

  // Actions
  setItems: (items, total, page) => set({items, total, page}),
  addItem: item =>
    set(state => ({
      items: [item, ...state.items],
      total: state.total + 1,
    })),
  updateItem: item =>
    set(state => ({
      items: state.items.map(i => (i.id === item.id ? item : i)),
      currentItem: state.currentItem?.id === item.id ? item : state.currentItem,
    })),
  removeItem: id =>
    set(state => ({
      items: state.items.filter(i => i.id !== id),
      currentItem: state.currentItem?.id === id ? null : state.currentItem,
      total: state.total - 1,
    })),
  setLoading: isLoading => set({isLoading}),
  setError: error => set({error}),
  clearError: () => set({error: null}),
  reset: () =>
    set({
      items: [],
      currentItem: null,
      total: 0,
      page: 1,
      limit: 10,
      isLoading: false,
      isCreating: false,
      isUpdating: false,
      isDeleting: false,
      error: null,
    }),
}));
```

### Screen Beispiel

```typescript
// src/features/todo/presentation/screens/TodoListScreen.tsx
import React, {useEffect} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {Text, FAB, Card, IconButton, ActivityIndicator} from 'react-native-paper';
import {Screen} from '@shared/components/Screen';
import {useTheme} from '@shared/theme';
import {useTodoStore} from '../store/useTodoStore';
import {useTodoActions} from '../hooks/useTodoActions';
import {Todo} from '../../domain/entities/Todo';

interface TodoListScreenProps {
  navigation: any;
}

export const TodoListScreen = ({navigation}: TodoListScreenProps) => {
  const {colors, spacing} = useTheme();
  const {items, isLoading, error} = useTodoStore();
  const {loadTodos, deleteTodo} = useTodoActions();

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const handleCreate = () => {
    navigation.navigate('CreateTodo');
  };

  const handleEdit = (item: Todo) => {
    navigation.navigate('EditTodo', {id: item.id});
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTodo(id);
    } catch (error) {
      // Error is handled by the store
    }
  };

  const renderItem = ({item}: {item: Todo}) => (
    <Card style={[styles.card, {backgroundColor: colors.surface}]} mode="outlined">
      <Card.Content>
        <View style={styles.cardHeader}>
          <Text variant="titleMedium" style={{color: colors.onSurface}}>
            {item.title}
          </Text>
          <View style={styles.actions}>
            <IconButton
              icon="pencil"
              size={20}
              onPress={() => handleEdit(item)}
            />
            <IconButton
              icon="delete"
              size={20}
              onPress={() => handleDelete(item.id)}
            />
          </View>
        </View>
        <Text variant="bodyMedium" style={{color: colors.onSurfaceVariant}}>
          Status: {item.completed ? "Erledigt" : "Offen"}
        </Text>
        <Text variant="bodyMedium" style={{color: colors.onSurfaceVariant}}>
          Priorität: {item.priority}
        </Text>
      </Card.Content>
    </Card>
  );

  if (isLoading && items.length === 0) {
    return (
      <Screen>
        <View style={[styles.centered, {backgroundColor: colors.background}]}>
          <ActivityIndicator size="large" />
          <Text style={{color: colors.onBackground, marginTop: spacing.md}}>
            Loading todos...
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={[styles.container, {backgroundColor: colors.background}]}>
        {error && (
          <Text style={[styles.error, {color: colors.error}]}>
            {error}
          </Text>
        )}

        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />

        <FAB
          icon="plus"
          style={[styles.fab, {backgroundColor: colors.primary}]}
          onPress={handleCreate}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  error: {
    padding: 16,
    textAlign: 'center',
  },
});
```

## 🛠️ Development Tools

### Feature CLI verwenden

```bash
# Interaktive CLI starten
npm run feature:cli
```

**Menü-Optionen:**

1. 📦 Neues Feature erstellen
2. 🏗️ CRUD-Feature erstellen
3. 📋 Features auflisten
4. ✨ Feature erweitern
5. 🗑️ Feature löschen
6. 📚 Dokumentation generieren
7. 🔧 Projekt validieren

### Development Menu

```bash
# Development Menu öffnen
npm run dev:menu
```

**Verfügbare Tools:**

- 🍎 iOS App starten
- 🤖 Android App starten
- 🧹 Cache leeren
- 🔄 Metro Server neustarten
- 🔍 ESLint ausführen
- ✨ Code formatieren
- 🎯 TypeScript prüfen
- 🧪 Tests ausführen
- 📊 Bundle-Größe analysieren
- 🧹 Komplette Bereinigung

### Projekt validieren

```bash
# Vollständige Projekt-Validierung
npm run dev:validate
```

**Validierungs-Bereiche:**

- 📁 Projektstruktur (20 Punkte)
- ⚙️ Konfigurationsdateien (15 Punkte)
- 📦 Package.json (10 Punkte)
- 🎯 TypeScript (5 Punkte)
- 🔍 ESLint (5 Punkte)
- 🏗️ Feature-Struktur (10 Punkte)
- 📜 Scripts (10 Punkte)
- 📚 Dokumentation (5 Punkte)
- 🪝 Git Hooks (5 Punkte)
- 🎯 Template-Qualität (10 Punkte)

## 📊 Supabase Integration

### Datenbank-Tabelle erstellen

```sql
-- Todo-Tabelle für das Beispiel
CREATE TABLE todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  priority INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security aktivieren
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Policy für authentifizierte Benutzer
CREATE POLICY "Users can manage their own todos" ON todos
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Trigger für updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_todos_updated_at
  BEFORE UPDATE ON todos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### Repository Implementation

```typescript
// src/features/todo/data/repository/SupabaseTodoRepository.ts
import {TodoRepository} from '../../domain/repositories/TodoRepository';
import {
  Todo,
  CreateTodoRequest,
  UpdateTodoRequest,
  TodoListResponse,
} from '../../domain/entities/Todo';
import {TodoMapper} from '../mappers/TodoMapper';
import {supabase} from '@core/config/supabase';

export class SupabaseTodoRepository implements TodoRepository {
  private readonly tableName = 'todos';

  async findAll(page = 1, limit = 10): Promise<TodoListResponse> {
    const offset = (page - 1) * limit;

    const {data, error, count} = await supabase
      .from(this.tableName)
      .select('*', {count: 'exact'})
      .range(offset, offset + limit - 1)
      .order('created_at', {ascending: false});

    if (error) throw new Error(error.message);

    return {
      data: data?.map(TodoMapper.toDomain) || [],
      total: count || 0,
      page,
      limit,
    };
  }

  async findById(id: string): Promise<Todo | null> {
    const {data, error} = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }

    return data ? TodoMapper.toDomain(data) : null;
  }

  async create(request: CreateTodoRequest): Promise<Todo> {
    const dto = TodoMapper.toCreateDTO(request);

    const {data, error} = await supabase
      .from(this.tableName)
      .insert(dto)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return TodoMapper.toDomain(data);
  }

  async update(id: string, request: UpdateTodoRequest): Promise<Todo> {
    const {data, error} = await supabase
      .from(this.tableName)
      .update(request)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return TodoMapper.toDomain(data);
  }

  async delete(id: string): Promise<void> {
    const {error} = await supabase.from(this.tableName).delete().eq('id', id);

    if (error) throw new Error(error.message);
  }
}
```

## 🧪 Testing

### UseCase Tests

```typescript
// src/features/todo/__tests__/application/CreateTodoUseCase.test.ts
import {CreateTodoUseCase} from '../../application/use-cases/CreateTodoUseCase';
import {TodoRepository} from '../../domain/repositories/TodoRepository';
import {CreateTodoRequest, Todo} from '../../domain/entities/Todo';

// Mock Repository
const mockRepository: jest.Mocked<TodoRepository> = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('CreateTodoUseCase', () => {
  let useCase: CreateTodoUseCase;

  beforeEach(() => {
    useCase = new CreateTodoUseCase(mockRepository);
    jest.clearAllMocks();
  });

  it('should create a todo successfully', async () => {
    // Arrange
    const request: CreateTodoRequest = {
      title: 'Test Todo',
      completed: false,
      priority: 1,
    };

    const expectedTodo: Todo = {
      id: '123',
      title: 'Test Todo',
      completed: false,
      priority: 1,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };

    mockRepository.create.mockResolvedValue(expectedTodo);

    // Act
    const result = await useCase.execute(request);

    // Assert
    expect(result).toEqual(expectedTodo);
    expect(mockRepository.create).toHaveBeenCalledWith(request);
  });

  it('should throw error when repository fails', async () => {
    // Arrange
    const request: CreateTodoRequest = {
      title: 'Test Todo',
      completed: false,
      priority: 1,
    };

    mockRepository.create.mockRejectedValue(new Error('Database error'));

    // Act & Assert
    await expect(useCase.execute(request)).rejects.toThrow(
      'Failed to create todo: Database error'
    );
  });
});
```

### Component Tests

```typescript
// src/features/todo/__tests__/presentation/TodoListScreen.test.tsx
import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {TodoListScreen} from '../../presentation/screens/TodoListScreen';
import {useTodoStore} from '../../presentation/store/useTodoStore';
import {useTodoActions} from '../../presentation/hooks/useTodoActions';

// Mock dependencies
jest.mock('../../presentation/store/useTodoStore');
jest.mock('../../presentation/hooks/useTodoActions');
jest.mock('@shared/theme', () => ({
  useTheme: () => ({
    colors: {
      background: '#ffffff',
      surface: '#f5f5f5',
      onSurface: '#000000',
      onSurfaceVariant: '#666666',
      error: '#ff0000',
      primary: '#007bff',
      onBackground: '#000000',
    },
    spacing: { md: 16 },
  }),
}));

const mockNavigation = {
  navigate: jest.fn(),
};

describe('TodoListScreen', () => {
  const mockUseTodoStore = useTodoStore as jest.MockedFunction<typeof useTodoStore>;
  const mockUseTodoActions = useTodoActions as jest.MockedFunction<typeof useTodoActions>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state', () => {
    mockUseTodoStore.mockReturnValue({
      items: [],
      isLoading: true,
      error: null,
    });

    mockUseTodoActions.mockReturnValue({
      loadTodos: jest.fn(),
      deleteTodo: jest.fn(),
    });

    const { getByText } = render(<TodoListScreen navigation={mockNavigation} />);

    expect(getByText('Loading todos...')).toBeTruthy();
  });

  it('should render todo list', () => {
    const mockTodos = [
      {
        id: '1',
        title: 'Test Todo',
        completed: false,
        priority: 1,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ];

    mockUseTodoStore.mockReturnValue({
      items: mockTodos,
      isLoading: false,
      error: null,
    });

    mockUseTodoActions.mockReturnValue({
      loadTodos: jest.fn(),
      deleteTodo: jest.fn(),
    });

    const { getByText } = render(<TodoListScreen navigation={mockNavigation} />);

    expect(getByText('Test Todo')).toBeTruthy();
    expect(getByText('Status: Offen')).toBeTruthy();
    expect(getByText('Priorität: 1')).toBeTruthy();
  });

  it('should handle create button press', () => {
    mockUseTodoStore.mockReturnValue({
      items: [],
      isLoading: false,
      error: null,
    });

    mockUseTodoActions.mockReturnValue({
      loadTodos: jest.fn(),
      deleteTodo: jest.fn(),
    });

    const { getByTestId } = render(<TodoListScreen navigation={mockNavigation} />);

    fireEvent.press(getByTestId('create-fab'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('CreateTodo');
  });
});
```

## 🚀 Deployment

### Build für Production

```bash
# Android Release Build
npm run build:android

# iOS Release Build
npm run build:ios

# Bundle-Größe analysieren
npm run dev:menu
# Wähle Option 13: Bundle-Größe analysieren
```

### CI/CD mit GitHub Actions

Das Template enthält bereits vorkonfigurierte GitHub Actions:

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test:ci
      - run: npm run dev:validate
```

## 🎯 Best Practices

### 1. Feature-Entwicklung

- **Clean Architecture**: Halte dich an die Domain/Application/Data/Presentation Struktur
- **Single Responsibility**: Jede Klasse/Funktion hat eine klare Aufgabe
- **Dependency Injection**: Verwende Interfaces für lose Kopplung
- **Error Handling**: Implementiere robuste Fehlerbehandlung

### 2. State Management

- **Zustand Store**: Verwende für Feature-spezifischen State
- **Loading States**: Implementiere Loading-Indikatoren
- **Error States**: Zeige benutzerfreundliche Fehlermeldungen
- **Optimistic Updates**: Für bessere UX

### 3. Testing

- **Unit Tests**: Für UseCases und Business Logic
- **Integration Tests**: Für Repository-Implementierungen
- **Component Tests**: Für React Components
- **E2E Tests**: Für kritische User Journeys

### 4. Performance

- **Lazy Loading**: Lade Features nur bei Bedarf
- **Memoization**: Verwende React.memo und useMemo
- **Bundle Splitting**: Teile Code in kleinere Chunks
- **Image Optimization**: Optimiere Bilder und Assets

## 🔧 Troubleshooting

### Häufige Probleme

**1. Metro Cache Probleme**

```bash
npm run dev:menu
# Wähle Option 3: Cache leeren
```

**2. iOS Build Fehler**

```bash
cd ios && pod install && cd ..
npm run clean:ios
```

**3. Android Build Fehler**

```bash
npm run clean:android
cd android && ./gradlew clean && cd ..
```

**4. TypeScript Fehler**

```bash
npm run type-check
# Behebe die angezeigten Fehler
```

**5. ESLint Fehler**

```bash
npm run lint:fix
```

### Support

- 📚 Dokumentation: `docs/`
- 🛠️ Development Tools: `npm run dev:menu`
- 🔍 Projekt-Validierung: `npm run dev:validate`
- 🏗️ Feature-Management: `npm run feature:cli`

---

**Happy Coding! 🚀**
