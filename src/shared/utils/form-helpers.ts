/**
 * Form Helper Utilities - Enterprise Form Management
 * 
 * @description Utility functions for form handling with proper TypeScript typing
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 */

import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';

/**
 * Helper function to extract string error message from React Hook Form FieldError
 * 
 * @param error - FieldError from React Hook Form
 * @returns string error message or undefined
 */
export const getFormFieldErrorMessage = (
  error: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined
): string | undefined => {
  if (!error) return undefined;
  
  // Handle React Hook Form FieldError type with explicit casting  
  if (typeof error === 'object' && 'message' in error) {
    return (error as { message: string }).message;
  }
  
  // Handle string error
  if (typeof error === 'string') {
    return error;
  }
  
  return undefined;
};

/**
 * Helper function to get field error from form errors object
 * 
 * @param errors - Form errors object from React Hook Form
 * @param fieldName - Field name to get error for
 * @returns string error message or undefined
 */
export const getFieldError = <T extends Record<string, any>>(
  errors: T,
  fieldName: keyof T
): string | undefined => {
  const error = errors[fieldName];
  return getFormFieldErrorMessage(error);
}; 