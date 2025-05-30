import {AuthUserDto} from '@features/auth/data/dtos/auth-user.dto';

/**
 * @fileoverview Authentication Data Source Interface
 * @description Defines the contract for authentication data sources, ensuring
 * consistent implementation across different providers (Supabase, etc.).
 *
 * This interface abstracts authentication operations to allow easy switching
 * between different authentication providers while maintaining consistent behavior.
 *
 * @interface AuthDatasource
 * @since 1.0.0
 * @author FussballFeld Team
 */
export interface AuthDatasource {
  /**
   * Signs in a user using email and password credentials.
   *
   * @param email - User's email address
   * @param password - User's password
   * @throws {Error} When authentication fails
   */
  signInWithEmailAndPassword(email: string, password: string): Promise<void>;

  /**
   * Creates a new user account with email and password.
   *
   * @param email - Email address for new account
   * @param password - Password for new account
   * @throws {Error} When registration fails
   */
  createUserWithEmailAndPassword(
    email: string,
    password: string
  ): Promise<void>;

  /**
   * Signs out the currently authenticated user.
   *
   * @throws {Error} When sign out fails
   */
  signOut(): Promise<void>;

  /**
   * Sends a password reset email to the specified address.
   *
   * @param email - Email address to send reset link
   * @throws {Error} When password reset fails
   */
  sendPasswordResetEmail(email: string): Promise<void>;

  /**
   * Retrieves the currently authenticated user.
   *
   * @returns Promise resolving to user DTO or null if not authenticated
   */
  getCurrentUser(): Promise<AuthUserDto | null>;

  /**
   * Subscribes to authentication state changes.
   *
   * @param callback - Function called on auth state changes
   * @returns Unsubscribe function
   */
  onAuthStateChanged(callback: (user: AuthUserDto | null) => void): () => void;
}
