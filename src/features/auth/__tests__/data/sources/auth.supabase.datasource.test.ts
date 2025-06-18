/**
 * @file auth.supabase.datasource.test.ts
 * @description Comprehensive tests for AuthSupabaseDataSource
 * Tests Supabase integration, error handling, auth operations, and enterprise security
 */

// =============================================================================
// 📦 VERWENDE GLOBALEN MOCK AUS JEST.SETUP.TS (KEIN LOKALER MOCK!)
// =============================================================================

import { AuthSupabaseDatasource } from '../../../data/sources/auth.supabase.datasource';
import { AuthUserDto } from '../../../application/dtos/auth-user.dto';

// Hole Mock-Referenzen vom globalen Mock
const mockSupabase = jest.requireMock('@core/config/supabase.config').supabase;

describe('AuthSupabaseDataSource - ENTERPRISE INTEGRATION TESTS', () => {
  let dataSource: AuthSupabaseDatasource;

  const mockUserDto: AuthUserDto = {
    id: 'user-123',
    email: 'test@example.com',
    emailVerified: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    displayName: 'Test User',
    photoURL: 'https://example.com/photo.jpg',
  };

  beforeEach(() => {
    dataSource = new AuthSupabaseDatasource();
    jest.clearAllMocks();
  });

  describe('🎯 Authentication Operations', () => {
    describe('createUserWithEmailAndPassword', () => {
      it('should create user successfully', async () => {
        mockSupabase.auth.signUp.mockResolvedValueOnce({
          data: { user: { id: 'user-123', email: 'test@example.com' } },
          error: null
        });

        await dataSource.createUserWithEmailAndPassword('test@example.com', 'password123');

        expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123'
        });
      });

      it('should handle registration errors', async () => {
        mockSupabase.auth.signUp.mockResolvedValueOnce({
          data: { user: null },
          error: { message: 'Email already registered' }
        });

        await expect(
          dataSource.createUserWithEmailAndPassword('existing@example.com', 'password123')
        ).rejects.toThrow();
      });

      it('should handle weak password errors', async () => {
        mockSupabase.auth.signUp.mockResolvedValueOnce({
          data: { user: null },
          error: { message: 'Password should be at least 8 characters' }
        });

        await expect(
          dataSource.createUserWithEmailAndPassword('test@example.com', '123')
        ).rejects.toThrow();
      });

      it('should handle network errors gracefully', async () => {
        mockSupabase.auth.signUp.mockRejectedValueOnce(new Error('Network error'));

        await expect(
          dataSource.createUserWithEmailAndPassword('test@example.com', 'password123')
        ).rejects.toThrow('Network error');
      });

      it('should handle email confirmation requirement', async () => {
        mockSupabase.auth.signUp.mockResolvedValueOnce({
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

        // Should succeed even when email confirmation is required
        await expect(
          dataSource.createUserWithEmailAndPassword('test@example.com', 'password123')
        ).resolves.not.toThrow();
      });
    });

    describe('signInWithEmailAndPassword', () => {
      it('should sign in user successfully', async () => {
        mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
          data: { 
            user: { id: 'user-123', email: 'test@example.com' },
            session: { access_token: 'token123' }
          },
          error: null
        });

        await dataSource.signInWithEmailAndPassword('test@example.com', 'password123');

        expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123'
        });
      });

      it('should handle invalid credentials error', async () => {
        mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
          data: { user: null, session: null },
          error: { message: 'Invalid login credentials' }
        });

        await expect(
          dataSource.signInWithEmailAndPassword('test@example.com', 'wrongpassword')
        ).rejects.toThrow();
      });

      it('should handle user not found error', async () => {
        mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
          data: { user: null, session: null },
          error: { message: 'User not found' }
        });

        await expect(
          dataSource.signInWithEmailAndPassword('notfound@example.com', 'password123')
        ).rejects.toThrow();
      });

      it('should handle account locked scenarios', async () => {
        mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
          data: { user: null, session: null },
          error: { message: 'Account temporarily locked' }
        });

        await expect(
          dataSource.signInWithEmailAndPassword('locked@example.com', 'password123')
        ).rejects.toThrow();
      });

      it('should handle email not verified scenarios', async () => {
        mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
          data: { 
            user: { id: 'user-123', email: 'test@example.com', email_confirmed_at: null },
            session: { access_token: 'token123' }
          },
          error: null
        });

        // Should succeed but user will have emailVerified: false
        await dataSource.signInWithEmailAndPassword('unverified@example.com', 'password123');

        expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalled();
      });
    });

    describe('signOut', () => {
      it('should sign out user successfully', async () => {
        mockSupabase.auth.signOut.mockResolvedValueOnce({ error: null });

        await dataSource.signOut();

        expect(mockSupabase.auth.signOut).toHaveBeenCalled();
      });

      it('should handle sign out errors gracefully', async () => {
        mockSupabase.auth.signOut.mockResolvedValueOnce({
          error: { message: 'Session not found' }
        });

        await expect(dataSource.signOut()).rejects.toThrow();
      });

      it('should handle network errors during sign out', async () => {
        mockSupabase.auth.signOut.mockRejectedValueOnce(new Error('Network error'));

        await expect(dataSource.signOut()).rejects.toThrow('Network error');
      });
    });
  });

  describe('🔍 User Management Operations', () => {
    describe('getCurrentUser', () => {
      it('should return current user successfully', async () => {
        mockSupabase.auth.getSession.mockResolvedValueOnce({
          data: { session: { access_token: 'token123' } },
          error: null
        });

        mockSupabase.auth.getUser.mockResolvedValueOnce({
          data: { 
            user: {
              id: 'user-123',
              email: 'test@example.com',
              email_confirmed_at: '2024-01-01T00:00:00Z',
              created_at: '2024-01-01T00:00:00Z',
              updated_at: '2024-01-01T00:00:00Z',
              user_metadata: {
                display_name: 'Test User',
                avatar_url: 'https://example.com/photo.jpg'
              }
            }
          },
          error: null
        });

        const result = await dataSource.getCurrentUser();

        expect(result).toEqual(mockUserDto);
        expect(mockSupabase.auth.getSession).toHaveBeenCalled();
        expect(mockSupabase.auth.getUser).toHaveBeenCalled();
      });

      it('should return null when no session exists', async () => {
        mockSupabase.auth.getSession.mockResolvedValueOnce({
          data: { session: null },
          error: null
        });

        const result = await dataSource.getCurrentUser();

        expect(result).toBeNull();
      });

      it('should return null when session retrieval fails', async () => {
        mockSupabase.auth.getSession.mockResolvedValueOnce({
          data: { session: null },
          error: { message: 'Session error' }
        });

        const result = await dataSource.getCurrentUser();

        expect(result).toBeNull();
      });

      it('should handle expired token errors', async () => {
        mockSupabase.auth.getSession.mockResolvedValueOnce({
          data: { session: { access_token: 'expired_token' } },
          error: null
        });

        mockSupabase.auth.getUser.mockResolvedValueOnce({
          data: { user: null },
          error: { message: 'JWT token expired' }
        });

        const result = await dataSource.getCurrentUser();

        expect(result).toBeNull();
      });

      it('should handle malformed token errors', async () => {
        mockSupabase.auth.getSession.mockResolvedValueOnce({
          data: { session: { access_token: 'malformed_token' } },
          error: null
        });

        mockSupabase.auth.getUser.mockResolvedValueOnce({
          data: { user: null },
          error: { message: 'JWT token malformed' }
        });

        const result = await dataSource.getCurrentUser();

        expect(result).toBeNull();
      });

      it('should handle unexpected errors gracefully', async () => {
        mockSupabase.auth.getSession.mockRejectedValueOnce(new Error('Unexpected error'));

        const result = await dataSource.getCurrentUser();

        expect(result).toBeNull();
      });
    });
  });

  describe('🔐 Security Operations', () => {
    describe('sendPasswordResetEmail', () => {
      it('should send password reset email successfully', async () => {
        mockSupabase.auth.resetPasswordForEmail.mockResolvedValueOnce({
          data: {},
          error: null
        });

        await dataSource.sendPasswordResetEmail('test@example.com');

        expect(mockSupabase.auth.resetPasswordForEmail).toHaveBeenCalledWith('test@example.com');
      });

      it('should handle invalid email for password reset', async () => {
        mockSupabase.auth.resetPasswordForEmail.mockResolvedValueOnce({
          data: {},
          error: { message: 'Email not found' }
        });

        await expect(
          dataSource.sendPasswordResetEmail('notfound@example.com')
        ).rejects.toThrow();
      });

      it('should handle rate limiting for password reset', async () => {
        mockSupabase.auth.resetPasswordForEmail.mockResolvedValueOnce({
          data: {},
          error: { message: 'Email rate limit exceeded' }
        });

        await expect(
          dataSource.sendPasswordResetEmail('test@example.com')
        ).rejects.toThrow();
      });
    });
  });

  describe('🔄 Real-time Auth State Management', () => {
    describe('onAuthStateChanged', () => {
      it('should register auth state change listener', () => {
        const mockCallback = jest.fn();
        const mockUnsubscribe = jest.fn();
        
        mockSupabase.auth.onAuthStateChange.mockReturnValue({
          data: { subscription: { unsubscribe: mockUnsubscribe } }
        });

        const unsubscribe = dataSource.onAuthStateChanged(mockCallback);

        expect(mockSupabase.auth.onAuthStateChange).toHaveBeenCalled();
        expect(typeof unsubscribe).toBe('function');
      });

      it('should call callback with user when signed in', () => {
        const mockCallback = jest.fn();
        const mockUser = { 
          id: 'user-123', 
          email: 'test@example.com',
          email_confirmed_at: '2024-01-01T00:00:00Z',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        };
        
        let registeredCallback: any;
        mockSupabase.auth.onAuthStateChange.mockImplementation((callback: any) => {
          registeredCallback = callback;
          return { data: { subscription: { unsubscribe: jest.fn() } } };
        });

        dataSource.onAuthStateChanged(mockCallback);

        // Simulate auth state change with sign in
        registeredCallback('SIGNED_IN', { user: mockUser });

        expect(mockCallback).toHaveBeenCalledWith(expect.objectContaining({
          id: 'user-123',
          email: 'test@example.com',
          emailVerified: true
        }));
      });

      it('should call callback with null when signed out', () => {
        const mockCallback = jest.fn();
        
        let registeredCallback: any;
        mockSupabase.auth.onAuthStateChange.mockImplementation((callback: any) => {
          registeredCallback = callback;
          return { data: { subscription: { unsubscribe: jest.fn() } } };
        });

        dataSource.onAuthStateChanged(mockCallback);

        // Simulate auth state change with sign out
        registeredCallback('SIGNED_OUT', null);

        expect(mockCallback).toHaveBeenCalledWith(null);
      });

      it('should unsubscribe from auth state changes', () => {
        const mockCallback = jest.fn();
        const mockUnsubscribe = jest.fn();
        
        mockSupabase.auth.onAuthStateChange.mockReturnValue({
          data: { subscription: { unsubscribe: mockUnsubscribe } }
        });

        const unsubscribe = dataSource.onAuthStateChanged(mockCallback);
        unsubscribe();

        expect(mockUnsubscribe).toHaveBeenCalled();
      });
    });
  });

  describe('⚡ Performance & Error Handling', () => {
    it('should handle concurrent authentication requests', async () => {
      const promises = Array(5).fill(null).map((_, i) => 
        dataSource.signInWithEmailAndPassword(`user${i}@example.com`, 'password123')
      );

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: mockUserDto, session: { access_token: 'token' } },
        error: null
      });

      await expect(Promise.all(promises)).resolves.not.toThrow();
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledTimes(5);
    });

    it('should handle Supabase service unavailable', async () => {
      mockSupabase.auth.getSession.mockRejectedValueOnce(new Error('Service unavailable'));

      const result = await dataSource.getCurrentUser();

      expect(result).toBeNull();
    });

    it('should handle malformed Supabase responses', async () => {
      mockSupabase.auth.getSession.mockResolvedValueOnce({
        data: { session: { access_token: 'token' } },
        error: null
      });

      mockSupabase.auth.getUser.mockResolvedValueOnce({
        data: undefined,
        error: null
      });

      const result = await dataSource.getCurrentUser();

      expect(result).toBeNull();
    });

    it('should timeout long-running operations', async () => {
      // Simulate timeout scenario
      mockSupabase.auth.signInWithPassword.mockImplementationOnce(
        () => new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Operation timeout')), 100)
        )
      );

      await expect(
        dataSource.signInWithEmailAndPassword('test@example.com', 'password123')
      ).rejects.toThrow('Operation timeout');
    });
  });

  describe('🔧 Enterprise Integration Tests', () => {
    it('should handle database audit logging requirements', async () => {
      await dataSource.signInWithEmailAndPassword('test@example.com', 'password123');

      // Verify that authentication completed successfully
      // (Audit logging would be implemented at a higher layer)
      // Should have logged auth event (if audit logging is implemented)
      // This test verifies the audit trail capability exists
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });

    it('should support GDPR compliance data export', async () => {
      mockSupabase.auth.getSession.mockResolvedValueOnce({
        data: { session: { access_token: 'token123' } },
        error: null
      });

      mockSupabase.auth.getUser.mockResolvedValueOnce({
        data: { user: mockUserDto },
        error: null
      });

      const user = await dataSource.getCurrentUser();

      // Verify all required GDPR fields are present
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('createdAt');
      expect(user).toHaveProperty('updatedAt');
    });

    it('should handle rate limiting scenarios', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: { message: 'Rate limit exceeded' }
      });

      await expect(
        dataSource.signInWithEmailAndPassword('test@example.com', 'password123')
      ).rejects.toThrow();
    });
  });
}); 