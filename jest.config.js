/**
 * @fileoverview ENTERPRISE INDUSTRY STANDARD 2025 JEST CONFIGURATION
 * 
 * @description Streamlined Jest setup for React Native enterprise testing
 * @version 2025.1.0
 * @since Enterprise Industry Standard 2025
 */

/** @type {import('jest').Config} */
module.exports = {
  preset: 'react-native',
  
  testEnvironment: 'node',
  
  // Setup-Reihenfolge optimiert um Window-Konflikte zu vermeiden
  setupFiles: [
    '<rootDir>/src/shared/test-utils/react-native-mocks.ts',
  ],
  
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
    '<rootDir>/jest.setup.ts',
  ],
  
  // Module resolution
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@core/(.*)$': '<rootDir>/src/core/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@features/(.*)$': '<rootDir>/src/features/$1',
    '^@components/(.*)$': '<rootDir>/src/shared/components/$1',
    '^@services/(.*)$': '<rootDir>/src/shared/services/$1',
    '^@utils/(.*)$': '<rootDir>/src/shared/utils/$1',
    '^@types/(.*)$': '<rootDir>/src/shared/types/$1',
    '^@assets/(.*)$': '<rootDir>/src/assets/$1',
    // Sentry Mock hinzufügen
    '^@sentry/react-native$': '<rootDir>/src/__mocks__/@sentry/react-native.ts',
    // Logger Factory Mock hinzufügen
    '^@core/logging/logger\\.factory$': '<rootDir>/src/__mocks__/@core/logging/logger.factory.ts',
  },
  
  // Test patterns
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.(test|spec).(js|jsx|ts|tsx)',
    '<rootDir>/src/**/*.(test|spec).(js|jsx|ts|tsx)',
  ],
  
  testPathIgnorePatterns: [
    '/node_modules/',
    '/ios/',
    '/android/',
    '/coverage/',
    '/build/',
    '/dist/',
  ],
  
  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/**/*.test.*',
  ],
  
  coverageDirectory: '<rootDir>/coverage',
  
  coverageReporters: [
    'text',
    'lcov',
    'html',
  ],
  
  // Enterprise performance thresholds
  coverageThreshold: {
    global: {
      branches: 70,  // Realistischer Threshold
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  
  // Performance settings
  maxWorkers: '50%',
  testTimeout: 30000,
  
  // Enterprise test reporting
  reporters: [
    'default',
  ],
  
  // Transform configuration
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-.*|@tanstack/.*|@react-navigation|@supabase|uuid|lodash-es|base64-arraybuffer|react-hook-form|@hookform|immer|zustand|use-immer|zod|yup|i18next|react-i18next|@react-native-async-storage|@react-native-community|@invertase|@sentry|axios|date-fns|@testing-library|@react-native-google-signin)/)',
  ],
  
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // Verbesserte Globals um Window-Konflikte zu vermeiden
  globals: {
    __DEV__: true,
  },
  
  // Cache-Konfiguration für bessere Performance
  clearMocks: true,
  resetMocks: false,
  restoreMocks: true,
};