/**
 * @fileoverview Global Mock Index
 * @description Central mock file for global mocks and test utilities
 */

/* global jest */

// Global Test Configuration
global.requestIdleCallback = global.requestIdleCallback || function (cb: any) {
  const start = Date.now();
  return setTimeout(() => {
    cb({
      didTimeout: false,
      timeRemaining() {
        return Math.max(0, 50 - (Date.now() - start));
      },
    });
  }, 1);
};

global.cancelIdleCallback = global.cancelIdleCallback || function (id: any) {
  clearTimeout(id);
};

// Mock console methods for cleaner test output
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock fetch for API tests
global.fetch = jest.fn();

// Mock React Native extensively to avoid native module issues
jest.mock('react-native', () => {
  return {
    Platform: {
      OS: 'ios',
      select: jest.fn((platforms) => platforms.ios || platforms.default),
    },
    Alert: {
      alert: jest.fn(),
    },
    DevMenu: {},
    NativeModules: {},
    TurboModuleRegistry: {
      getEnforcing: jest.fn(() => ({})),
      get: jest.fn(() => null),
    },
    AppRegistry: {
      registerComponent: jest.fn(),
    },
    Dimensions: {
      get: jest.fn(() => ({ width: 375, height: 667 })),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    },
    StyleSheet: {
      create: jest.fn((styles) => styles),
      flatten: jest.fn((styles) => styles),
    },
    View: 'View',
    Text: 'Text',
    TouchableOpacity: 'TouchableOpacity',
    FlatList: 'FlatList',
    ScrollView: 'ScrollView',
    Image: 'Image',
    TextInput: 'TextInput',
    SafeAreaView: 'SafeAreaView',
    ActivityIndicator: 'ActivityIndicator',
    Modal: 'Modal',
    Button: 'Button',
  };
});

// Mock NetInfo
jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(),
  fetch: jest.fn(() => Promise.resolve({
    isConnected: true,
    type: 'wifi',
  })),
}));

// Mock Async Storage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock React Native Vector Icons
jest.mock('react-native-vector-icons/Ionicons', () => 'Ionicons');

// Mock React Native Device Info
jest.mock('react-native-device-info', () => ({
  getVersion: jest.fn(() => Promise.resolve('1.0.0')),
  getBuildNumber: jest.fn(() => Promise.resolve('1')),
  getSystemName: jest.fn(() => Promise.resolve('iOS')),
  getSystemVersion: jest.fn(() => Promise.resolve('14.0')),
  getModel: jest.fn(() => Promise.resolve('iPhone')),
  getBrand: jest.fn(() => Promise.resolve('Apple')),
  getCarrier: jest.fn(() => Promise.resolve('Carrier')),
  getUniqueId: jest.fn(() => Promise.resolve('test-device-id')),
  hasSystemFeature: jest.fn(() => Promise.resolve(false)),
  isEmulator: jest.fn(() => Promise.resolve(false)),
  default: {
    getVersion: jest.fn(() => Promise.resolve('1.0.0')),
    getBuildNumber: jest.fn(() => Promise.resolve('1')),
    getSystemName: jest.fn(() => Promise.resolve('iOS')),
    getSystemVersion: jest.fn(() => Promise.resolve('14.0')),
    getModel: jest.fn(() => Promise.resolve('iPhone')),
    getBrand: jest.fn(() => Promise.resolve('Apple')),
    getCarrier: jest.fn(() => Promise.resolve('Carrier')),
    getUniqueId: jest.fn(() => Promise.resolve('test-device-id')),
  },
}));

// Mock Sentry
jest.mock('@sentry/react-native', () => ({
  init: jest.fn(),
  captureException: jest.fn(),
  captureMessage: jest.fn(),
  setUser: jest.fn(),
  setTag: jest.fn(),
  setContext: jest.fn(),
  addBreadcrumb: jest.fn(),
  withScope: jest.fn((callback) => callback({
    setTag: jest.fn(),
    setContext: jest.fn(),
    setLevel: jest.fn(),
  })),
}));

// Mock OAuth Providers
jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn(() => Promise.resolve(true)),
    signIn: jest.fn(() => Promise.resolve({
      user: { email: 'test@example.com', name: 'Test User' }
    })),
    signOut: jest.fn(() => Promise.resolve()),
    isSignedIn: jest.fn(() => Promise.resolve(false)),
    getCurrentUser: jest.fn(() => Promise.resolve(null)),
  },
  statusCodes: {
    SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED',
    IN_PROGRESS: 'IN_PROGRESS',
    PLAY_SERVICES_NOT_AVAILABLE: 'PLAY_SERVICES_NOT_AVAILABLE',
  },
}));

jest.mock('@invertase/react-native-apple-authentication', () => ({
  appleAuth: {
    performRequest: jest.fn(() => Promise.resolve({
      email: 'test@example.com',
      fullName: { givenName: 'Test', familyName: 'User' }
    })),
    requestPermissionForScope: jest.fn(() => Promise.resolve(true)),
  },
  AppleButton: 'AppleButton',
}));

jest.mock('react-native-app-auth', () => ({
  authorize: jest.fn(() => Promise.resolve({
    accessToken: 'test-access-token',
    refreshToken: 'test-refresh-token',
  })),
}));

// Mock Supabase
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: {
      signUp: jest.fn(() => Promise.resolve({
        data: { user: { id: 'user123', email: 'test@example.com' } },
        error: null
      })),
      signInWithPassword: jest.fn(() => Promise.resolve({
        data: { user: { id: 'user123', email: 'test@example.com' } },
        error: null
      })),
      signOut: jest.fn(() => Promise.resolve({ error: null })),
      getSession: jest.fn(() => Promise.resolve({
        data: { session: { user: { id: 'user123', email: 'test@example.com' } } },
        error: null
      })),
      getUser: jest.fn(() => Promise.resolve({
        data: { user: { id: 'user123', email: 'test@example.com' } },
        error: null
      })),
      resetPasswordForEmail: jest.fn(() => Promise.resolve({ error: null })),
    },
  })),
}));

// Export test utilities
export const mockUtils = {
  resetAllMocks: () => {
    jest.clearAllMocks();
  },
  mockConsole: {
    warn: jest.fn(),
    error: jest.fn(),
  },
};

export default {};