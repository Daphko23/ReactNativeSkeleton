/**
 * @fileoverview SHARED-ERRORS-INDEX: Error System Exports
 * @description Central export point for all error handling modules
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module SharedErrors
 * @namespace Shared.Errors
 */

// Base error classes and utilities
export {
  AppError,
  ErrorSeverity,
  ErrorCategory,
  isAppError,
  createAppError,
  type ErrorContext,
  type ErrorDetails
} from './app.error';