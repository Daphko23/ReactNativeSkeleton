# 🧪 Test Mocks

Dieses Verzeichnis enthält Jest-Mocks für externe Dependencies, um Tests zu ermöglichen.

## 📁 Struktur

```
__mocks__/
├── @react-navigation/          # React Navigation Mocks
│   ├── native.ts              # Navigation Hooks
│   └── bottom-tabs.ts         # Tab Navigator
├── @react-native-async-storage/
│   └── async-storage.js       # AsyncStorage Mock
├── @react-native-community/
│   └── datetimepicker.ts      # DateTimePicker Mock
├── @supabase/
│   └── supabase-js.ts         # Supabase Client Mock
├── react-i18next.ts           # i18n Hooks Mock
├── react-native-localize.ts   # Localization Mock
├── react-native-paper.ts      # UI Components Mock
├── styleMock.js               # CSS/Style Imports
└── fileMock.js                # File/Asset Imports
```

## 🔧 Verwendung

Diese Mocks werden automatisch von Jest verwendet, wenn die entsprechenden Module importiert werden.

### Beispiel: Navigation Mock verwenden

```typescript
import {useNavigation} from '@react-navigation/native';

// In Tests wird automatisch der Mock verwendet
const navigation = useNavigation();
navigation.navigate('SomeScreen'); // Jest Mock Function
```

### Beispiel: Supabase Mock erweitern

```typescript
// In Test-Datei
import {createClient} from '@supabase/supabase-js';

const mockSupabase = createClient as jest.MockedFunction<typeof createClient>;
mockSupabase().auth.signInWithPassword.mockResolvedValue({
  data: {user: mockUser},
  error: null,
});
```

## ➕ Neue Mocks hinzufügen

1. **Ordnerstruktur befolgen**: `__mocks__/@package-name/module.ts`
2. **TypeScript verwenden**: Für bessere Type-Safety
3. **Jest Functions**: `jest.fn()` für mockbare Funktionen
4. **Konsistente APIs**: Gleiche Interface wie Original-Module

### Beispiel: Neuen Mock erstellen

```typescript
// __mocks__/@new-package/module.ts
export const someFunction = jest.fn(() => 'mocked-value');

export const SomeComponent = ({children}: {children: React.ReactNode}) => {
  const React = require('react');
  return React.createElement('View', {testID: 'mocked-component'}, children);
};
```

## 📚 Weiterführende Ressourcen

- [Jest Manual Mocks](https://jestjs.io/docs/manual-mocks)
- [React Native Testing](https://reactnative.dev/docs/testing-overview)
- [Testing Library Best Practices](https://testing-library.com/docs/guiding-principles)

---

**Diese Mocks ermöglichen umfassende Tests ohne externe Dependencies!** 🚀
