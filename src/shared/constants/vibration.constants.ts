/**
 * @fileoverview VIBRATION-CONSTANTS: Haptic Feedback Pattern Definitions
 * @description Predefined vibration patterns for consistent haptic feedback across the application
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Shared.Constants
 * @namespace Shared.Constants.Vibration
 * @category Constants
 * @subcategory Haptics
 */

/**
 * Form Interaction Vibration Pattern
 * 
 * Short, subtle haptic feedback for form interactions such as input focus,
 * field validation, or button presses. Provides gentle user feedback without
 * being intrusive during data entry.
 * 
 * @constant {number} FORM_VIBRATION_PATTERN
 * @since 1.0.0
 * @version 1.0.0
 * @category Haptics
 * @subcategory Forms
 * 
 * @example
 * Usage in form input:
 * ```tsx
 * import { Vibration } from 'react-native';
 * import { FORM_VIBRATION_PATTERN } from '@/shared/constants/vibration.constants';
 * 
 * const handleInputFocus = () => {
 *   Vibration.vibrate(FORM_VIBRATION_PATTERN);
 * };
 * ```
 * 
 * @example
 * Usage in button press:
 * ```tsx
 * const handleButtonPress = () => {
 *   Vibration.vibrate(FORM_VIBRATION_PATTERN);
 *   onPress();
 * };
 * ```
 */
export const FORM_VIBRATION_PATTERN = 50;

/**
 * Action Confirmation Vibration Pattern
 * 
 * More prominent haptic feedback for important user actions such as
 * successful form submissions, data saves, or confirmation dialogs.
 * Provides clear feedback for completed operations.
 * 
 * @constant {number} ACTION_VIBRATION_PATTERN
 * @since 1.0.0
 * @version 1.0.0
 * @category Haptics
 * @subcategory Actions
 * 
 * @example
 * Usage for successful actions:
 * ```tsx
 * import { Vibration } from 'react-native';
 * import { ACTION_VIBRATION_PATTERN } from '@/shared/constants/vibration.constants';
 * 
 * const handleSaveSuccess = () => {
 *   Vibration.vibrate(ACTION_VIBRATION_PATTERN);
 *   showSuccessMessage('Data saved successfully');
 * };
 * ```
 * 
 * @example
 * Usage in confirmation dialog:
 * ```tsx
 * const handleConfirmAction = () => {
 *   Vibration.vibrate(ACTION_VIBRATION_PATTERN);
 *   executeAction();
 * };
 * ```
 */
export const ACTION_VIBRATION_PATTERN = 100;

/**
 * Error Notification Vibration Pattern
 * 
 * Distinctive haptic pattern for error states and warnings. Uses a pattern
 * of short vibrations to clearly indicate something needs attention without
 * being overly disruptive.
 * 
 * @constant {number[]} ERROR_VIBRATION_PATTERN
 * @since 1.0.0
 * @version 1.0.0
 * @category Haptics
 * @subcategory Errors
 * 
 * @property {number} 0 - Initial delay (no vibration)
 * @property {number} 50 - First short vibration
 * @property {number} 50 - Brief pause
 * @property {number} 50 - Second short vibration for emphasis
 * 
 * @example
 * Usage for form validation errors:
 * ```tsx
 * import { Vibration } from 'react-native';
 * import { ERROR_VIBRATION_PATTERN } from '@/shared/constants/vibration.constants';
 * 
 * const handleValidationError = (errors: string[]) => {
 *   Vibration.vibrate(ERROR_VIBRATION_PATTERN);
 *   setFieldErrors(errors);
 * };
 * ```
 * 
 * @example
 * Usage for API errors:
 * ```tsx
 * const handleApiError = (error: Error) => {
 *   Vibration.vibrate(ERROR_VIBRATION_PATTERN);
 *   showErrorAlert(error.message);
 * };
 * ```
 * 
 * @example
 * Usage in error boundary:
 * ```tsx
 * const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
 *   const handleError = (error: Error) => {
 *     Vibration.vibrate(ERROR_VIBRATION_PATTERN);
 *     logError(error);
 *   };
 * 
 *   return (
 *     <ReactErrorBoundary onError={handleError}>
 *       {children}
 *     </ReactErrorBoundary>
 *   );
 * };
 * ```
 */
export const ERROR_VIBRATION_PATTERN = [0, 50, 50, 50];
