/**
 * @file auth.supabase.datasource.test.ts
 * @description Critical DataSource Tests for Supabase Integration
 * Tests external API integration, error handling, and data transformation
 */

import { AuthSupabaseDatasource } from '../../../data/sources/auth.supabase.datasource';

// Mock Supabase config
jest.mock('@core/config/supabase.config', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      resetPasswordForEmail: jest.fn(),
      getUser: jest.fn()
    }
  }
}));

// Mock error mapper
jest.mock('../../../data/mappers/supabase-auth-error.mapper', () => ({
  SupabaseAuthErrorMapper: {
    map: jest.fn((error) => new Error(error.message))
  }
}));

describe('AuthSupabaseDatasource - CRITICAL INTEGRATION', () => {
  let dataSource: AuthSupabaseDatasource;
  const mockSupabase = require('@core/config/supabase.config').supabase;

  beforeEach(() => {
    jest.clearAllMocks();
    dataSource = new AuthSupabaseDatasource();
  });

  describe('Constructor and Initialization', () => {
    it('should initialize correctly', () => {
      expect(dataSource).toBeDefined();
      expect(dataSource).toBeInstanceOf(AuthSupabaseDatasource);
    });
  });

  describe('🔐 Authentication Operations', () => {
    describe('signInWithEmailAndPassword()', () => {
      it('should successfully sign in user', async () => {
        mockSupabase.auth.signInWithPassword.mockResolvedValue({
          data: { user: { id: 'user-123', email: 'test@example.com' } },
          error: null
        });

        await expect(dataSource.signInWithEmailAndPassword('test@example.com', 'password123'))
          .resolves.not.toThrow();

        expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123'
        });
      });

      it('should handle sign in errors', async () => {
        const mockError = { message: 'Invalid credentials' };
        mockSupabase.auth.signInWithPassword.mockResolvedValue({
          data: null,
          error: mockError
        });

        await expect(dataSource.signInWithEmailAndPassword('test@example.com', 'wrongpassword'))
          .rejects.toThrow('Invalid credentials');
      });
    });

    describe('createUserWithEmailAndPassword()', () => {
      it('should successfully create new user', async () => {
        mockSupabase.auth.signUp.mockResolvedValue({
          data: { 
            user: { 
              id: 'user-123', 
              email: 'test@example.com',
              email_confirmed_at: null
            },
            session: null
          },
          error: null
        });

        await expect(dataSource.createUserWithEmailAndPassword('test@example.com', 'password123'))
          .resolves.not.toThrow();

        expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123'
        });
      });

      it('should handle registration errors', async () => {
        const mockError = { message: 'Email already exists' };
        mockSupabase.auth.signUp.mockResolvedValue({
          data: null,
          error: mockError
        });

        await expect(dataSource.createUserWithEmailAndPassword('existing@example.com', 'password123'))
          .rejects.toThrow('Email already exists');
      });
    });

    describe('signOut()', () => {
      it('should successfully sign out user', async () => {
        mockSupabase.auth.signOut.mockResolvedValue({ error: null });

        await expect(dataSource.signOut()).resolves.not.toThrow();

        expect(mockSupabase.auth.signOut).toHaveBeenCalled();
      });

      it('should handle sign out errors', async () => {
        const mockError = { message: 'Sign out failed' };
        mockSupabase.auth.signOut.mockResolvedValue({ error: mockError });

        await expect(dataSource.signOut()).rejects.toThrow('Sign out failed');
      });
    });
  });

  describe('🛡️ Error Handling', () => {
    it('should map Supabase errors correctly', async () => {
      const mockError = { message: 'Network error', status: 500 };
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: mockError
      });

      await expect(dataSource.signInWithEmailAndPassword('test@example.com', 'password123'))
        .rejects.toThrow('Network error');
    });
  });
}); 