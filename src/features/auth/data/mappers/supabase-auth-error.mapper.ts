/**
 * @fileoverview Supabase Authentication Error Mapper
 * @description Maps Supabase authentication errors to domain-specific error types.
 * Provides consistent error handling across the application by transforming
 * Supabase-specific error codes into standardized domain errors.
 *
 * @module SupabaseAuthErrorMapper
 * @since 2.0.0
 * @author FussballFeld Team
 *
 * @requires ../../domain/errors/invalid-credentials.error
 * @requires ../../domain/errors/user-not-found.error
 * @requires ../../domain/errors/email-already-in-use.error
 * @requires ../../domain/errors/weak-password.error
 * @requires ../../domain/errors/generic-auth.error
 * @requires ../../domain/errors/invalid-token.error
 * @requires ../../domain/errors/token-expired.error
 * @requires ../../domain/errors/email-already-verified.error
 */

import {InvalidCredentialsError} from '../../domain/errors/invalid-credentials.error';
import {UserNotFoundError} from '../../domain/errors/user-not-found.error';
import {EmailAlreadyInUseError} from '../../domain/errors/email-already-in-use.error';
import {WeakPasswordError} from '../../domain/errors/weak-password.error';
import {GenericAuthError} from '../../domain/errors/generic-auth.error';
import {InvalidTokenError} from '../../domain/errors/invalid-token.error';
import {TokenExpiredError} from '../../domain/errors/token-expired.error';
import {EmailAlreadyVerifiedError} from '../../domain/errors/email-already-verified.error';

/**
 * Type definition for Supabase authentication error structure.
 *
 * @interface SupabaseAuthError
 */
type SupabaseAuthError = {
  /** Supabase-specific error code */
  code?: string;
  /** Human-readable error message */
  message: string;
  /** Additional error details from Supabase */
  details?: string;
  /** HTTP status code if available */
  status?: number;
};

/**
 * Type guard to safely check if an error is a SupabaseAuthError.
 *
 * Supabase errors typically have a message property and may include
 * code, details, and status properties.
 *
 * @param error - The error object to check
 * @returns True if error has typical SupabaseAuthError structure, false otherwise
 *
 * @example
 * ```typescript
 * try {
 *   await supabase.auth.signIn();
 * } catch (error) {
 *   if (isSupabaseAuthError(error)) {
 *     console.log('Supabase error code:', error.code);
 *   }
 * }
 * ```
 */
function isSupabaseAuthError(error: unknown): error is SupabaseAuthError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as SupabaseAuthError).message === 'string'
  );
}

/**
 * Maps Supabase authentication errors to domain-specific error types.
 *
 * This mapper translates Supabase error messages and codes into standardized
 * domain errors that can be handled consistently throughout the application.
 * It provides better error handling and user experience by categorizing
 * errors appropriately.
 *
 * Supported mappings:
 * - Invalid credentials → InvalidCredentialsError
 * - User not found → UserNotFoundError
 * - Email already registered → EmailAlreadyInUseError
 * - Weak password → WeakPasswordError
 * - All other errors → GenericAuthError
 *
 * @example
 * ```typescript
 * try {
 *   await supabase.auth.signInWithPassword({ email, password });
 * } catch (error) {
 *   const mappedError = SupabaseAuthErrorMapper.map(error);
 *
 *   if (mappedError instanceof InvalidCredentialsError) {
 *     showErrorMessage('Please check your credentials');
 *   }
 * }
 * ```
 *
 * @see {@link https://supabase.com/docs/guides/auth/auth-helpers/auth-ui#error-handling} Supabase Auth Errors
 * @see {@link https://supabase.com/docs/guides/auth/auth-helpers/auth-ui} Supabase Auth Documentation
 */
export class SupabaseAuthErrorMapper {
  /**
   * Maps a Supabase authentication error to an appropriate domain error.
   *
   * @param error - The error from Supabase auth operation
   * @returns Mapped domain error with appropriate type and message
   *
   * @static
   * @public
   */
  static map(error: unknown): Error {
    if (isSupabaseAuthError(error)) {
      const errorMessage = error.message.toLowerCase();
      const errorCode = error.code?.toLowerCase();

      // Map based on error message patterns (Supabase uses descriptive messages)
      if (
        errorMessage.includes('invalid login credentials') ||
        errorMessage.includes('invalid email or password') ||
        errorMessage.includes('email not confirmed') ||
        errorCode === 'invalid_credentials'
      ) {
        return new InvalidCredentialsError(error);
      }

      if (
        errorMessage.includes('user not found') ||
        errorMessage.includes('no user found') ||
        errorCode === 'user_not_found'
      ) {
        return new UserNotFoundError(error);
      }

      if (
        errorMessage.includes('user already registered') ||
        errorMessage.includes('email address already in use') ||
        errorMessage.includes('duplicate') ||
        errorCode === 'email_already_exists'
      ) {
        return new EmailAlreadyInUseError(error);
      }

      if (
        errorMessage.includes('password is too short') ||
        errorMessage.includes('password should be at least') ||
        errorMessage.includes('weak password') ||
        errorCode === 'weak_password'
      ) {
        return new WeakPasswordError(error);
      }

      // Email verification token errors
      if (
        errorMessage.includes('invalid token') ||
        errorMessage.includes('token is invalid') ||
        errorMessage.includes('malformed token') ||
        errorMessage.includes('token format invalid') ||
        errorCode === 'invalid_token'
      ) {
        return new InvalidTokenError('Invalid verification token', error);
      }

      if (
        errorMessage.includes('token expired') ||
        errorMessage.includes('token has expired') ||
        errorMessage.includes('expired token') ||
        errorMessage.includes('token no longer valid') ||
        errorCode === 'token_expired'
      ) {
        return new TokenExpiredError('Verification token has expired', error);
      }

      if (
        errorMessage.includes('email already verified') ||
        errorMessage.includes('email already confirmed') ||
        errorMessage.includes('already verified') ||
        errorMessage.includes('email confirmation already completed') ||
        errorCode === 'email_already_verified'
      ) {
        return new EmailAlreadyVerifiedError('Email address is already verified', error);
      }

      // Handle specific Supabase error codes
      switch (errorCode) {
        case 'signup_disabled':
          return new GenericAuthError(error);
        case 'email_address_invalid':
          return new InvalidCredentialsError(error);
        case 'password_too_short':
          return new WeakPasswordError(error);
        case 'signups_disabled':
          return new GenericAuthError(error);
        case 'invalid_token':
          return new InvalidTokenError('Invalid verification token', error);
        case 'token_expired':
          return new TokenExpiredError('Verification token has expired', error);
        case 'email_already_verified':
          return new EmailAlreadyVerifiedError('Email address is already verified', error);
        default:
          return new GenericAuthError(error);
      }
    }

    // Handle standard JavaScript errors or unknown error types
    if (error instanceof Error) {
      return new GenericAuthError(error);
    }

    // Fallback for any other error type
    return new GenericAuthError(error);
  }
}
