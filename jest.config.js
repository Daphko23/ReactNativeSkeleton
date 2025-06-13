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
  
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
    '<rootDir>/jest.setup.ts',
    // Temporarily disable complex setup files that cause module resolution issues
    // '<rootDir>/src/shared/test-utils/jest-setup-enterprise.ts',
    // '<rootDir>/src/shared/test-utils/jest-setup-performance.ts',
    // '<rootDir>/src/shared/test-utils/jest-setup-security.ts',
    // '<rootDir>/src/shared/test-utils/jest-setup-accessibility.ts',
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
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
    'src/features/**/hooks/**/*.hook.ts': {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
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
    'node_modules/(?!(react-native|@react-native|react-native-.*|@tanstack/.*|@react-navigation|@supabase|uuid|lodash-es|base64-arraybuffer|react-hook-form|@hookform|immer|zustand|use-immer|zod|yup|i18next|react-i18next|@react-native-async-storage|@react-native-community|@invertase|@sentry|axios|date-fns|@testing-library)/)',
  ],
  
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // Enterprise React Native Mocks
  setupFiles: ['<rootDir>/src/shared/test-utils/react-native-mocks.ts'],
};