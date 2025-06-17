/**
 * @fileoverview Auth Error Utilities
 * 
 * @description Shared utilities for auth error handling and categorization
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @layer Application/Utils
 */

/**
 * Determine if an auth error is a business error (expected user scenario) or technical error
 * 
 * Business errors are expected user scenarios that should not trigger console errors
 * or React Native's LogBox, as they are normal user interactions.
 */
export function isBusinessError(error: Error | string): boolean {
  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorType = typeof error === 'string' ? error : error.constructor.name;
  
  // These are expected business scenarios, not technical errors
  const businessErrors = [
    'InvalidCredentialsError',
    'UserNotFoundError', 
    'EmailAlreadyInUseError',
    'WeakPasswordError',
    'MFARequiredError',
    'Invalid credentials',
    'User not found',
    'Email already in use',
    'Password too weak',
    'Email und Passwort sind erforderlich',
    'Alle Felder sind erforderlich',
    'Passwörter stimmen nicht überein',
    'Invalid login credentials',
    'Email not confirmed',
    'Account is temporarily locked',
    'Too many login attempts'
  ];
  
  return businessErrors.some(pattern => 
    errorType.includes(pattern) || errorMessage.includes(pattern)
  );
}

/**
 * Get appropriate log level for an auth error
 */
export function getErrorLogLevel(error: Error | string): 'info' | 'warn' | 'error' {
  if (isBusinessError(error)) {
    return 'warn'; // Business errors are warnings, not errors
  }
  return 'error'; // Technical errors are actual errors
} 