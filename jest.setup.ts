/**
 * @file jest.setup.js
 * @description Jest Setup-Datei für die Testumgebung
 */

/* global jest */

import mockReact from 'react';

jest.mock('react-native-localize');

// Mock für Supabase
jest.mock('@core/config/supabase.config', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      resetPasswordForEmail: jest.fn(),
      getUser: jest.fn(),
      onAuthStateChange: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
        })),
        order: jest.fn(),
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(),
          })),
        })),
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(),
      })),
    })),
  },
}));

// Mock für React Native
jest.mock('react-native', () => {
  return {
    StyleSheet: {
      create: jest.fn(styles => styles),
      flatten: jest.fn(style => style),
    },
    View: 'View',
    Text: 'Text',
    TextInput: 'TextInput',
    TouchableOpacity: 'TouchableOpacity',
    ScrollView: 'ScrollView',
    SafeAreaView: 'View',
  };
});

// Mock für @react-navigation/native
jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({children}) => children,
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
}));

// Mock für @react-navigation/native-stack
jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({children}) => children,
    Screen: ({children}) => children,
  }),
}));

// Mock für react-native-paper
jest.mock('react-native-paper', () => {
  return {
    Snackbar: ({children, visible, onDismiss, style}) => {
      if (!visible) return null;
      return mockReact.createElement(
        'div',
        {
          'data-testid': 'global-snackbar',
          style,
          onClick: onDismiss,
        },
        children
      );
    },
    PaperProvider: ({children}) => children,
  };
});

// Mock für react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({children}) => children,
  useSafeAreaInsets: () => ({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  }),
}));
