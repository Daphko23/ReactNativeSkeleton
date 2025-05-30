/**
 * @fileoverview Supabase Authentication Data Source Implementation
 * @description Provides authentication operations using Supabase Auth service.
 * Implements the AuthDatasource interface to ensure consistency across different
 * authentication providers while leveraging Supabase-specific features.
 *
 * @module AuthSupabaseDatasource
 * @since 2.0.0
 * @author FussballFeld Team
 *
 * @requires @core/config/supabase.config
 * @requires @features/auth/data/interfaces/auth.datasource.interface
 * @requires @features/auth/data/dtos/auth-user.dto
 * @requires @features/auth/data/mappers/supabase-auth-error.mapper
 */

import {supabase} from '@core/config/supabase.config';
import {AuthDatasource} from '@features/auth/data/interfaces/auth.datasource.interface';
import {AuthUserDto} from '@features/auth/data/dtos/auth-user.dto';
import {SupabaseAuthErrorMapper} from '../mappers/supabase-auth-error.mapper';
import type {AuthChangeEvent, Session, User} from '@supabase/supabase-js';

/**
 * Supabase-specific implementation of the authentication data source.
 *
 * This class provides concrete implementations for all authentication operations
 * using Supabase Auth service. It handles user sign-in, registration, sign-out,
 * password reset, and real-time authentication state monitoring.
 *
 * Key features:
 * - Email/password authentication
 * - Real-time auth state changes via Supabase listeners
 * - Automatic session management
 * - Enterprise-level error handling with domain error mapping
 * - Type-safe integration with Supabase client
 *
 * @implements {AuthDatasource}
 *
 * @example
 * ```typescript
 * const authDataSource = new AuthSupabaseDatasource();
 *
 * // Sign in user
 * await authDataSource.signInWithEmailAndPassword('user@example.com', 'password123');
 *
 * // Get current user
 * const currentUser = await authDataSource.getCurrentUser();
 *
 * // Listen to auth changes
 * const unsubscribe = authDataSource.onAuthStateChanged((user) => {
 *   console.log('Auth state changed:', user);
 * });
 * ```
 *
 * @see {@link https://supabase.com/docs/guides/auth} Supabase Auth Documentation
 * @see {@link AuthDatasource} Interface specification
 */
export class AuthSupabaseDatasource implements AuthDatasource {
  /**
   * Signs in a user using email and password credentials.
   *
   * @param email - The user's email address
   * @param password - The user's password
   *
   * @throws {InvalidCredentialsError} When credentials are invalid
   * @throws {UserNotFoundError} When user doesn't exist
   * @throws {GenericAuthError} For other authentication failures
   *
   * @example
   * ```typescript
   * try {
   *   await authDataSource.signInWithEmailAndPassword('user@example.com', 'password123');
   *   console.log('User signed in successfully');
   * } catch (error) {
   *   if (error instanceof InvalidCredentialsError) {
   *     console.error('Invalid credentials provided');
   *   }
   * }
   * ```
   */
  async signInWithEmailAndPassword(
    email: string,
    password: string
  ): Promise<void> {
    const {error} = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw SupabaseAuthErrorMapper.map(error);
    }
  }

  /**
   * Creates a new user account with email and password.
   *
   * @param email - Email address for the new account
   * @param password - Password for the new account
   *
   * @throws {EmailAlreadyInUseError} When email is already registered
   * @throws {WeakPasswordError} When password doesn't meet requirements
   * @throws {GenericAuthError} For other registration failures
   *
   * @example
   * ```typescript
   * try {
   *   await authDataSource.createUserWithEmailAndPassword('newuser@example.com', 'securePassword123');
   *   console.log('Account created successfully');
   * } catch (error) {
   *   if (error instanceof WeakPasswordError) {
   *     console.error('Password too weak');
   *   }
   * }
   * ```
   */
  async createUserWithEmailAndPassword(
    email: string,
    password: string
  ): Promise<void> {
    console.log('[AuthSupabaseDatasource] Attempting to register user:', email);

    const {data, error} = await supabase.auth.signUp({
      email,
      password,
    });

    console.log('[AuthSupabaseDatasource] Registration response:', {
      data: data
        ? {
            user: data.user
              ? {
                  id: data.user.id,
                  email: data.user.email,
                  email_confirmed_at: data.user.email_confirmed_at,
                }
              : null,
            session: data.session ? 'session exists' : 'no session',
          }
        : null,
      error: error
        ? {
            message: error.message,
            status: error.status,
          }
        : null,
    });

    if (error) {
      console.error('[AuthSupabaseDatasource] Registration failed:', error);
      throw SupabaseAuthErrorMapper.map(error);
    }

    // Check if email confirmation is required
    if (data.user && !data.user.email_confirmed_at && !data.session) {
      console.log(
        '[AuthSupabaseDatasource] Email confirmation required for:',
        email
      );
      // This is normal for Supabase - user needs to confirm email
      // We should not throw an error here, just log it
    }
  }

  /**
   * Signs out the currently authenticated user.
   *
   * @throws {GenericAuthError} When sign out fails due to network or service errors
   *
   * @example
   * ```typescript
   * try {
   *   await authDataSource.signOut();
   *   console.log('User signed out successfully');
   * } catch (error) {
   *   console.error('Sign out failed:', error.message);
   * }
   * ```
   */
  async signOut(): Promise<void> {
    const {error} = await supabase.auth.signOut();

    if (error) {
      throw SupabaseAuthErrorMapper.map(error);
    }
  }

  /**
   * Sends a password reset email to the specified email address.
   *
   * @param email - Email address to send the reset link to
   *
   * @throws {UserNotFoundError} When email is not registered
   * @throws {GenericAuthError} For other password reset failures
   *
   * @example
   * ```typescript
   * try {
   *   await authDataSource.sendPasswordResetEmail('user@example.com');
   *   console.log('Password reset email sent');
   * } catch (error) {
   *   if (error instanceof UserNotFoundError) {
   *     console.error('Email not found');
   *   }
   * }
   * ```
   */
  async sendPasswordResetEmail(email: string): Promise<void> {
    const {error} = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      throw SupabaseAuthErrorMapper.map(error);
    }
  }

  /**
   * Retrieves the currently authenticated user.
   *
   * @returns Promise resolving to AuthUserDto if user is authenticated, null otherwise
   *
   * @example
   * ```typescript
   * const currentUser = await authDataSource.getCurrentUser();
   * if (currentUser) {
   *   console.log('Current user:', currentUser.email);
   * } else {
   *   console.log('No user is currently authenticated');
   * }
   * ```
   */
  async getCurrentUser(): Promise<AuthUserDto | null> {
    const {
      data: {user},
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.warn('Failed to get current user:', error.message);
      return null;
    }

    if (!user) {
      return null;
    }

    return this.mapSupabaseUserToDto(user);
  }

  /**
   * Subscribes to authentication state changes.
   *
   * @param callback - Function called whenever the authentication state changes
   * @returns Unsubscribe function to stop listening to auth state changes
   *
   * @example
   * ```typescript
   * const unsubscribe = authDataSource.onAuthStateChanged((user) => {
   *   if (user) {
   *     console.log('User signed in:', user.email);
   *   } else {
   *     console.log('User signed out');
   *   }
   * });
   *
   * // Later, stop listening
   * unsubscribe();
   * ```
   */
  onAuthStateChanged(callback: (user: AuthUserDto | null) => void): () => void {
    const {
      data: {subscription},
    } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        const user = session?.user ?? null;
        const mappedUser = user ? this.mapSupabaseUserToDto(user) : null;
        callback(mappedUser);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }

  /**
   * Maps a Supabase User object to our standardized AuthUserDto.
   *
   * This private method ensures consistent data transformation from Supabase-specific
   * user objects to our application's DTO format, abstracting away provider details.
   *
   * @private
   * @param user - Supabase User object
   * @returns Mapped AuthUserDto
   *
   * @example
   * ```typescript
   * // Internal usage only
   * const dto = this.mapSupabaseUserToDto(supabaseUser);
   * ```
   */
  private mapSupabaseUserToDto(user: User): AuthUserDto {
    return {
      id: user.id,
      email: user.email ?? '',
      displayName: user.user_metadata?.display_name ?? null,
      photoURL: user.user_metadata?.avatar_url ?? null,
    };
  }
}
