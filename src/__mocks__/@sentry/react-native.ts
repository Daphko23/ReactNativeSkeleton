/**
 * @fileoverview Sentry React Native Mock - Vollständiger Mock für Tests
 * 
 * Behebt alle hasViewManagerConfig und RNSentry Fehler
 */

// Mock alle Sentry Funktionen
export const init = jest.fn();
export const captureException = jest.fn();
export const captureMessage = jest.fn();
export const addBreadcrumb = jest.fn();
export const setUser = jest.fn();
export const setContext = jest.fn();
export const setTag = jest.fn();
export const setTags = jest.fn();
export const setExtra = jest.fn();
export const setExtras = jest.fn();
export const clearScope = jest.fn();
export const withScope = jest.fn((callback) => callback(mockScope));

// Mock Scope
const mockScope = {
  setUser: jest.fn(),
  setTag: jest.fn(),
  setTags: jest.fn(),
  setExtra: jest.fn(),
  setExtras: jest.fn(),
  setContext: jest.fn(),
  setLevel: jest.fn(),
  setFingerprint: jest.fn(),
  clear: jest.fn(),
};

// Mock Severity Levels
export const Severity = {
  Fatal: 'fatal',
  Error: 'error',
  Warning: 'warning',
  Info: 'info',
  Debug: 'debug',
};

// Mock Integrations
export const Integrations = {
  ReactNativeErrorHandlers: jest.fn(() => ({})),
  NativeLinkedErrors: jest.fn(() => ({})),
  RewriteFrames: jest.fn(() => ({})),
  HttpContext: jest.fn(() => ({})),
};

// Mock React Native spezifische Funktionen
export const TouchEventBoundary = ({ children }: { children: any }) => children;
export const ReactNavigationInstrumentation = jest.fn(() => ({
  registerNavigationContainer: jest.fn(),
}));

// Mock Native Module
export const NATIVE = {
  hasViewManagerConfig: jest.fn(() => true),
  RNSentry: {
    initNativeSdk: jest.fn(),
    crash: jest.fn(),
    captureEnvelope: jest.fn(),
    setUser: jest.fn(),
    addBreadcrumb: jest.fn(),
    clearBreadcrumbs: jest.fn(),
    setContext: jest.fn(),
    setExtra: jest.fn(),
    setTag: jest.fn(),
    getStringBytesLength: jest.fn(),
    nativeClientAvailable: true,
    nativeTransport: true,
  },
};

// Mock für hasViewManagerConfig speziell
Object.defineProperty(exports, 'hasViewManagerConfig', {
  value: jest.fn(() => true),
  writable: true,
  configurable: true,
});

// Default Export Mock
export default {
  init,
  captureException,
  captureMessage,
  addBreadcrumb,
  setUser,
  setContext,
  setTag,
  setTags,
  setExtra,
  setExtras,
  clearScope,
  withScope,
  Severity,
  Integrations,
  TouchEventBoundary,
  ReactNavigationInstrumentation,
  NATIVE,
}; 