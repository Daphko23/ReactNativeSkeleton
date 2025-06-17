/**
 * @fileoverview LogBox Configuration
 * 
 * @description React Native LogBox configuration to filter expected business errors
 * and avoid misleading developer warnings for normal user interactions.
 * 
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module LogBoxConfig
 */

import { LogBox } from 'react-native';
import { LoggerFactory } from '@core/logging/logger.factory';
import { LogCategory } from '@core/logging/logger.service.interface';

// Logger for LogBox configuration
const logger = LoggerFactory.createServiceLogger('LogBoxConfig');

/**
 * Configure React Native LogBox to ignore expected business errors
 * that should not trigger the error overlay or snackbars
 */
export function configureLogBox(): void {
  if (__DEV__) {
    // Ignore expected auth business errors that are normal user scenarios
    LogBox.ignoreLogs([
      // Auth business errors - these are expected user interactions
      'Invalid credentials',
      'User not found',
      'Email already in use',
      'Password too weak',
      'InvalidCredentialsError',
      'UserNotFoundError',
      'EmailAlreadyInUseError',
      'WeakPasswordError',
      'MFARequiredError',
      
      // Login validation errors - normal user form errors
      'Email und Passwort sind erforderlich',
      'Alle Felder sind erforderlich',
      'Passwörter stimmen nicht überein',
      
      // Auth state transitions - expected flow states
      'Auth GDPR Audit: Supabase credentials missing',
      'Login failed - Business Error',
      'User login failed - Business Error',
      
      // Known React Native warnings we can't fix
      'Require cycle:',
      'Remote debugger',
      
      // TanStack Query dev warnings that are not errors
      'Query data cannot be undefined',
    ]);

    logger.info('LogBox configured to filter business errors', LogCategory.BUSINESS, {
      service: 'LogBoxConfig',
      metadata: { filtersEnabled: true, environmentType: 'development' }
    });
  }
}

/**
 * Reset LogBox configuration (useful for testing)
 */
export function resetLogBox(): void {
  if (__DEV__) {
    LogBox.ignoreAllLogs(false);
    logger.info('LogBox reset to default configuration', LogCategory.BUSINESS, {
      service: 'LogBoxConfig',
      metadata: { filtersEnabled: false, environmentType: 'development' }
    });
  }
} 