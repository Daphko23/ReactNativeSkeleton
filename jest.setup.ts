/**
 * @file jest.setup.ts
 * @description Enterprise Jest Setup & Global Mocks für React Native Testing
 *
 * Provides comprehensive mock configuration for:
 * - Supabase Client (Auth, Database, Storage)
 * - React Native Core Modules
 * - Logger Service & Security
 * - i18n & Localization
 * - Navigation Components
 *
 * @version 3.0.0
 * @enterprise-ready ✅
 */

// =============================================================================
// 🔧 VOLLSTÄNDIGER SUPABASE MOCK (Für DataSource Tests)
// =============================================================================

jest.mock('@core/config/supabase.config', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest
        .fn()
        .mockResolvedValue({ data: { user: null }, error: null }),
      signUp: jest
        .fn()
        .mockResolvedValue({ data: { user: null }, error: null }),
      signOut: jest.fn().mockResolvedValue({ error: null }),
      resetPasswordForEmail: jest.fn().mockResolvedValue({ error: null }),
      getUser: jest
        .fn()
        .mockResolvedValue({ data: { user: null }, error: null }),
      getSession: jest
        .fn()
        .mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: jest.fn().mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } },
      }),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({ data: null, error: null }),
        })),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({ data: null, error: null }),
        })),
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({ data: null, error: null }),
          })),
        })),
      })),
      delete: jest.fn(() => ({
        eq: jest.fn().mockResolvedValue({ error: null }),
      })),
    })),
  },
}));

jest.mock('@core/logging/logger.factory', () => ({
  LoggerFactory: {
    createServiceLogger: jest.fn().mockReturnValue({
      info: jest.fn(),
      warn: jest.fn().mockImplementation((msg, cat, meta) => {
        if (global.console?.warn) {
          const errorMsg = meta?.metadata?.error || meta?.error || '';
          const errorObj = new Error(errorMsg);
          global.console.warn('Authentication status check failed:', errorObj);
        }
      }),
      error: jest.fn(),
      debug: jest.fn(),
    }),
  },
}));

jest.mock('react-native-localize');
jest.mock('@core/logging/logger.service.interface', () => ({
  LogCategory: {
    SECURITY: 'SECURITY',
    BUSINESS: 'BUSINESS',
    AUTH: 'AUTH',
    UI: 'UI',
  },
}));

global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
  log: jest.fn(),
  info: jest.fn(),
};
