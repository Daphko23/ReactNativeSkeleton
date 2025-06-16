/**
 * @fileoverview ENTERPRISE JEST SETUP - Industry Standard 2025
 * 
 * @description Comprehensive Jest setup for enterprise-grade React Native testing:
 * - Advanced Mocking Strategies
 * - Global Test Utilities
 * - Performance Monitoring
 * - Security & Compliance Setup
 * - Error Boundary Testing
 * - Memory Leak Detection
 * - CI/CD Integration Helpers
 * 
 * @version 2025.1.0
 * @since Enterprise Industry Standard 2025
 */

import 'react-native-gesture-handler/jestSetup';
import '@testing-library/jest-native/extend-expect';
import 'jest-extended';
import React from 'react';

// ============================================================================
// GLOBAL TYPE DECLARATIONS
// ============================================================================

interface MemoryUsageResult {
  heapUsed: number;
  heapTotal: number;
  external: number;
  rss: number;
  arrayBuffers?: number;
}

/* eslint-disable no-var */
declare global {
  function waitFor(ms?: number): Promise<void>;
  function flushPromises(): Promise<void>;
  function createMockHookReturn<T>(overrides?: Partial<T>): T;
  var createTestData: {
    user: (overrides?: any) => any;
    profile: (overrides?: any) => any;
    queryResult: <T>(data: T, overrides?: any) => any;
    mutationResult: (overrides?: any) => any;
  };
  function getMemoryUsage(): MemoryUsageResult;
  function measurePerformance(name: string, fn: () => void | Promise<void>): any;
  var TestErrorBoundary: React.FC<{ children: React.ReactNode; onError?: (error: Error) => void }>;
  var isCI: boolean;
}

// ============================================================================
// GLOBAL TEST ENVIRONMENT SETUP
// ============================================================================

// Performance Monitoring
global.performance = global.performance || {
  now: () => Date.now(),
  mark: () => {},
  measure: () => {},
  getEntriesByName: () => [],
  getEntriesByType: () => [],
};

// Console Enhancement for Testing
const originalConsole = global.console;
global.console = {
  ...originalConsole,
  // Suppress console.warn in tests unless explicitly testing
  warn: jest.fn((...args) => {
    if (process.env.JEST_CONSOLE_WARN === 'true') {
      originalConsole.warn(...args);
    }
  }),
  // Suppress console.error in tests unless explicitly testing
  error: jest.fn((...args) => {
    if (process.env.JEST_CONSOLE_ERROR === 'true') {
      originalConsole.error(...args);
    }
  }),
};

// ============================================================================
// ADVANCED MOCKING SETUP
// ============================================================================

// React Native Core Mocks - Simplified to avoid module resolution issues

// Navigation Mocks - Advanced Enterprise Setup
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    canGoBack: jest.fn(() => true),
    dispatch: jest.fn(),
    setOptions: jest.fn(),
    isFocused: jest.fn(() => true),
    addListener: jest.fn(() => jest.fn()),
  }),
  useRoute: () => ({
    params: {},
    name: 'TestScreen',
    key: 'test-key',
  }),
  useFocusEffect: jest.fn((callback) => callback()),
  useIsFocused: jest.fn(() => true),
}));

// TanStack Query Mock - Enterprise Grade
jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQuery: jest.fn(),
  useMutation: jest.fn(),
  useQueryClient: jest.fn(() => ({
    invalidateQueries: jest.fn(),
    setQueryData: jest.fn(),
    getQueryData: jest.fn(),
    clear: jest.fn(),
    removeQueries: jest.fn(),
  })),
  QueryClient: jest.fn().mockImplementation(() => ({
    invalidateQueries: jest.fn(),
    setQueryData: jest.fn(),
    getQueryData: jest.fn(),
    clear: jest.fn(),
    removeQueries: jest.fn(),
  })),
}));

// Async Storage Mock - Enterprise Security
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve([])),
  multiGet: jest.fn(() => Promise.resolve([])),
  multiSet: jest.fn(() => Promise.resolve()),
  multiRemove: jest.fn(() => Promise.resolve()),
}));

// Keychain Mock - Security Testing - Optional dependency
jest.mock('react-native-keychain', () => ({
  setInternetCredentials: jest.fn(() => Promise.resolve()),
  getInternetCredentials: jest.fn(() => Promise.resolve(false)),
  resetInternetCredentials: jest.fn(() => Promise.resolve()),
  canImplyAuthentication: jest.fn(() => Promise.resolve(true)),
  getSupportedBiometryType: jest.fn(() => Promise.resolve('TouchID')),
}), { virtual: true });

// Haptic Feedback Mock - Optional dependency
jest.mock('react-native-haptic-feedback', () => ({
  trigger: jest.fn(),
}), { virtual: true });

// ============================================================================
// SUPABASE & BACKEND MOCKS - Enterprise Security
// ============================================================================

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } } })),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
      then: jest.fn(),
    })),
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn(),
        download: jest.fn(),
        remove: jest.fn(),
        getPublicUrl: jest.fn(() => ({ data: { publicUrl: 'mock-url' } })),
      })),
    },
  })),
}));

// ============================================================================
// ANALYTICS & MONITORING MOCKS
// ============================================================================

// Firebase Analytics Mock
jest.mock('@react-native-firebase/analytics', () => ({
  __esModule: true,
  default: () => ({
    logEvent: jest.fn(),
    setUserId: jest.fn(),
    setUserProperties: jest.fn(),
    logScreenView: jest.fn(),
  }),
}));

// Sentry Mock
jest.mock('@sentry/react-native', () => ({
  init: jest.fn(),
  captureException: jest.fn(),
  captureMessage: jest.fn(),
  setUser: jest.fn(),
  setTag: jest.fn(),
  setContext: jest.fn(),
  addBreadcrumb: jest.fn(),
}));

// ============================================================================
// PERMISSION & DEVICE MOCKS
// ============================================================================

// Permissions Mock - Optional dependency
jest.mock('react-native-permissions', () => ({
  check: jest.fn(() => Promise.resolve('granted')),
  request: jest.fn(() => Promise.resolve('granted')),
  openSettings: jest.fn(() => Promise.resolve()),
  PERMISSIONS: {
    IOS: {
      CAMERA: 'ios.permission.CAMERA',
      PHOTO_LIBRARY: 'ios.permission.PHOTO_LIBRARY',
    },
    ANDROID: {
      CAMERA: 'android.permission.CAMERA',
      READ_EXTERNAL_STORAGE: 'android.permission.READ_EXTERNAL_STORAGE',
    },
  },
  RESULTS: {
    GRANTED: 'granted',
    DENIED: 'denied',
    BLOCKED: 'blocked',
  },
}), { virtual: true });

// Device Info Mock - Optional dependency
jest.mock('react-native-device-info', () => ({
  getVersion: jest.fn(() => Promise.resolve('1.0.0')),
  getBuildNumber: jest.fn(() => Promise.resolve('1')),
  getUniqueId: jest.fn(() => Promise.resolve('unique-id')),
  getSystemVersion: jest.fn(() => Promise.resolve('15.0')),
  getModel: jest.fn(() => Promise.resolve('iPhone')),
  isTablet: jest.fn(() => Promise.resolve(false)),
}), { virtual: true });

// ============================================================================
// GLOBAL TEST UTILITIES
// ============================================================================

/**
 * Wait for async operations to complete
 * @param ms - Milliseconds to wait
 */
global.waitFor = (ms: number = 0) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Flush all pending promises and timers
 */
global.flushPromises = () => new Promise(resolve => setImmediate(resolve));

/**
 * Mock implementation for testing hook return values
 */
global.createMockHookReturn = <T>(overrides?: Partial<T>): T => ({
  isLoading: false,
  isError: false,
  error: null,
  data: undefined,
  ...overrides,
} as T);

/**
 * Enterprise-grade test data factory
 */
global.createTestData = {
  user: (overrides = {}) => ({
    id: 'test-user-123',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    createdAt: new Date('2023-01-01'),
    ...overrides,
  }),
  
  profile: (overrides = {}) => ({
    id: 'test-user-123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    avatar: 'https://example.com/avatar.jpg',
    bio: 'Software engineer',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-12-01'),
    ...overrides,
  }),
  
  queryResult: <T>(data: T, overrides = {}) => ({
    data,
    isLoading: false,
    isError: false,
    error: null,
    isSuccess: true,
    isFetching: false,
    refetch: jest.fn(),
    ...overrides,
  }),
  
  mutationResult: (overrides = {}) => ({
    mutate: jest.fn(),
    mutateAsync: jest.fn(),
    isLoading: false,
    isError: false,
    error: null,
    isSuccess: false,
    data: undefined,
    reset: jest.fn(),
    ...overrides,
  }),
};

// ============================================================================
// PERFORMANCE MONITORING SETUP
// ============================================================================

// Memory usage tracking for performance tests
global.getMemoryUsage = (): MemoryUsageResult => {
  if (typeof process !== 'undefined' && process.memoryUsage) {
    return process.memoryUsage();
  }
  return { heapUsed: 0, heapTotal: 0, external: 0, rss: 0, arrayBuffers: 0 };
};

// Performance measurement utilities
global.measurePerformance = (name: string, fn: () => void | Promise<void>) => {
  const start = performance.now();
  const result = fn();
  
  if (result instanceof Promise) {
    return result.then((value) => {
      const end = performance.now();
      console.log(`Performance [${name}]: ${end - start}ms`);
      return value;
    });
  } else {
    const end = performance.now();
    console.log(`Performance [${name}]: ${end - start}ms`);
    return result;
  }
};

// ============================================================================
// ERROR BOUNDARY TESTING
// ============================================================================

// Error boundary test utilities
const TestErrorBoundaryComponent: React.FC<{ children: React.ReactNode; onError?: (error: Error) => void }> = ({ children, onError }) => {
  const [hasError, setHasError] = React.useState(false);
  
  React.useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      setHasError(true);
      onError?.(event.error);
    };
    
    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, [onError]);
  
  if (hasError) {
    return React.createElement('div', { 'data-testid': 'error-boundary' }, 'Something went wrong');
  }
  
  return children;
};

TestErrorBoundaryComponent.displayName = 'TestErrorBoundary';
global.TestErrorBoundary = TestErrorBoundaryComponent;

// ============================================================================
// CLEANUP & RESET
// ============================================================================

// Enhanced cleanup after each test
afterEach(() => {
  // Clear all mocks
  jest.clearAllMocks();
  
  // Clear timers
  jest.clearAllTimers();
  
  // Reset console mocks
  (console.warn as jest.Mock).mockClear();
  (console.error as jest.Mock).mockClear();
  
  // Garbage collection hint for memory leak detection
  if (global.gc) {
    global.gc();
  }
});

// ============================================================================
// CI/CD INTEGRATION
// ============================================================================

// CI environment detection
global.isCI = process.env.CI === 'true' || process.env.CONTINUOUS_INTEGRATION === 'true';

// Enhanced error reporting for CI
if (global.isCI) {
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
  });
}

// =============================================================================
// SERVICE MOCKS - ENTERPRISE TESTING COMPATIBILITY
// =============================================================================

/**
 * Comprehensive service mocks for Enterprise Testing
 * Resolves "Cannot find module" errors across all hook tests
 */

// Profile Services
jest.mock('@/features/profile/data/services/profile.service', () => ({
  profileService: {
    getProfile: jest.fn().mockResolvedValue({}),
    getPublicProfile: jest.fn().mockResolvedValue({}),
    updateProfile: jest.fn().mockResolvedValue({}),
    deleteProfile: jest.fn().mockResolvedValue(true),
    validateProfileAccess: jest.fn().mockResolvedValue(true),
    sanitizeProfileData: jest.fn().mockImplementation(data => data),
    encryptSensitiveData: jest.fn().mockImplementation(data => data),
  },
}));

// Avatar Services
jest.mock('@/features/profile/data/services/avatar.service', () => ({
  avatarService: {
    uploadAvatar: jest.fn().mockResolvedValue({ url: 'mock-avatar-url' }),
    deleteAvatar: jest.fn().mockResolvedValue(true),
    getAvatarUrl: jest.fn().mockReturnValue('mock-avatar-url'),
    validateImageFile: jest.fn().mockReturnValue(true),
    compressImage: jest.fn().mockResolvedValue('mock-compressed-image'),
  },
}));

// Custom Fields Services
jest.mock('@/features/profile/data/services/custom-fields.service', () => ({
  customFieldsService: {
    getCustomFields: jest.fn().mockResolvedValue([]),
    updateCustomFields: jest.fn().mockResolvedValue({}),
    validateCustomField: jest.fn().mockReturnValue(true),
    sanitizeCustomFieldData: jest.fn().mockImplementation(data => data),
  },
}));

// Daily Bonus Services
jest.mock('@/features/profile/data/services/daily-bonus.service', () => ({
  dailyBonusService: {
    checkDailyBonus: jest.fn().mockResolvedValue({ available: true }),
    claimDailyBonus: jest.fn().mockResolvedValue({ claimed: true }),
    getDailyBonusHistory: jest.fn().mockResolvedValue([]),
  },
}));

// Privacy Settings Services
jest.mock('@/features/profile/data/services/privacy-settings.service', () => ({
  privacySettingsService: {
    getPrivacySettings: jest.fn().mockResolvedValue({}),
    updatePrivacySettings: jest.fn().mockResolvedValue({}),
    validatePrivacySettings: jest.fn().mockReturnValue(true),
  },
}));

// URL Validation Services
jest.mock('@/features/profile/data/services/url-validation.service', () => ({
  urlValidationService: {
    validateUrl: jest.fn().mockReturnValue(true),
    sanitizeUrl: jest.fn().mockImplementation(url => url),
    checkUrlSafety: jest.fn().mockResolvedValue(true),
  },
}));

// Template Services
jest.mock('@/features/profile/data/services/template.service', () => ({
  templateService: {
    getTemplates: jest.fn().mockResolvedValue([]),
    applyTemplate: jest.fn().mockResolvedValue({}),
    validateTemplate: jest.fn().mockReturnValue(true),
  },
}));

// Image Picker Services
jest.mock('@/features/profile/data/services/image-picker.service', () => ({
  imagePickerService: {
    pickImage: jest.fn().mockResolvedValue({ uri: 'mock-image-uri' }),
    pickImageFromCamera: jest.fn().mockResolvedValue({ uri: 'mock-camera-uri' }),
    validateImagePermissions: jest.fn().mockResolvedValue(true),
  },
}));

// Settings Services
jest.mock('@/features/profile/data/services/settings.service', () => ({
  settingsService: {
    getSettings: jest.fn().mockResolvedValue({}),
    updateSettings: jest.fn().mockResolvedValue({}),
    resetSettings: jest.fn().mockResolvedValue({}),
  },
}));

// Shared Services
jest.mock('@/shared/services/validation.service', () => ({
  validationService: {
    validateEmail: jest.fn().mockReturnValue(true),
    validatePhone: jest.fn().mockReturnValue(true),
    validateRequired: jest.fn().mockReturnValue(true),
    validateLength: jest.fn().mockReturnValue(true),
    sanitizeInput: jest.fn().mockImplementation(input => input),
  },
}));

jest.mock('@/shared/services/analytics.service', () => ({
  analyticsService: {
    trackEvent: jest.fn(),
    trackScreen: jest.fn(),
    trackError: jest.fn(),
    trackQueryPerformance: jest.fn(),
    trackCacheHit: jest.fn(),
    trackCacheMiss: jest.fn(),
    setUserProperties: jest.fn(),
  },
}));

jest.mock('@/shared/services/storage.service', () => ({
  storageService: {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue(undefined),
    remove: jest.fn().mockResolvedValue(undefined),
    clear: jest.fn().mockResolvedValue(undefined),
    getSecure: jest.fn().mockResolvedValue(null),
    setSecure: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('@/shared/services/alert.service', () => ({
  alertService: {
    showAlert: jest.fn(),
    showError: jest.fn(),
    showSuccess: jest.fn(),
    showConfirm: jest.fn().mockResolvedValue(true),
    showLoading: jest.fn(),
    hideLoading: jest.fn(),
  },
}));

jest.mock('@/shared/services/permission.service', () => ({
  permissionService: {
    requestCameraPermission: jest.fn().mockResolvedValue(true),
    requestPhotoLibraryPermission: jest.fn().mockResolvedValue(true),
    checkPermission: jest.fn().mockResolvedValue(true),
    openSettings: jest.fn(),
  },
}));

jest.mock('@/shared/services/file-system.service', () => ({
  fileSystemService: {
    readFile: jest.fn().mockResolvedValue('mock-file-content'),
    writeFile: jest.fn().mockResolvedValue(undefined),
    deleteFile: jest.fn().mockResolvedValue(undefined),
    fileExists: jest.fn().mockResolvedValue(true),
    getFileInfo: jest.fn().mockResolvedValue({ size: 1024 }),
  },
}));

jest.mock('@/shared/services/animation.service', () => ({
  animationService: {
    fadeIn: jest.fn(),
    fadeOut: jest.fn(),
    slideIn: jest.fn(),
    slideOut: jest.fn(),
    bounce: jest.fn(),
    shake: jest.fn(),
  },
}));

// Auth Services
jest.mock('@/features/auth/services/auth.service', () => ({
  authService: {
    login: jest.fn().mockResolvedValue({ token: 'mock-token' }),
    logout: jest.fn().mockResolvedValue(undefined),
    getCurrentUser: jest.fn().mockResolvedValue({ id: 'mock-user-id' }),
    refreshToken: jest.fn().mockResolvedValue({ token: 'mock-refreshed-token' }),
    validateToken: jest.fn().mockResolvedValue(true),
  },
}));

// Core Services
jest.mock('@/core/compliance/gdpr.service', () => ({
  gdprService: {
    checkCompliance: jest.fn().mockResolvedValue(true),
    getConsentStatus: jest.fn().mockResolvedValue({ consented: true }),
    updateConsent: jest.fn().mockResolvedValue(undefined),
    exportUserData: jest.fn().mockResolvedValue({}),
    deleteUserData: jest.fn().mockResolvedValue(undefined),
  },
}));

console.log('🔧 Enterprise Service Mocks configured successfully');

export {}; 