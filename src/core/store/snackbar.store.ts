/**
 * @fileoverview SNACKBAR-STORE: Enterprise Snackbar State Management
 * @description Global state management for application-wide snackbar notifications with type-safe operations and comprehensive notification handling
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Core.Store.Snackbar
 * @namespace Core.Store.Snackbar
 * @category Store
 * @subcategory Notifications
 */

import {create} from 'zustand';

/**
 * Interface defining the complete snackbar state structure and operations.
 * Provides type-safe access to snackbar functionality across the application.
 * 
 * @interface SnackbarState
 * @since 1.0.0
 * @version 1.0.0
 * @category Interfaces
 * @subcategory State
 * 
 * @example
 * ```tsx
 * const snackbarConfig: Partial<SnackbarState> = {
 *   visible: true,
 *   message: 'Profile updated successfully',
 *   type: 'success'
 * };
 * ```
 */
interface SnackbarState {
  /**
   * Controls the visibility state of the snackbar.
   * When true, the snackbar is displayed to the user.
   * 
   * @type {boolean}
   * @default false
   * @example true
   */
  visible: boolean;

  /**
   * The message content to display in the snackbar.
   * Should be concise and informative.
   * 
   * @type {string}
   * @default ''
   * @example "Profile updated successfully"
   */
  message: string;

  /**
   * The semantic type of the snackbar affecting styling and behavior.
   * Determines the visual appearance and user experience.
   * 
   * @type {'success' | 'error' | 'info'}
   * @default 'info'
   * @example "success"
   * 
   * @variant success - Positive actions and confirmations
   * @variant error - Error states and failures
   * @variant info - General information and neutral notifications
   */
  type: 'success' | 'error' | 'info';

  /**
   * Function to display a snackbar with the specified message and type.
   * Automatically sets the snackbar to visible state.
   * 
   * @method show
   * @param {string} message - The message to display
   * @param {SnackbarState['type']} [type='info'] - The snackbar type
   * @returns {void}
   * 
   * @example
   * ```tsx
   * // Show success message
   * show('Profile saved successfully', 'success');
   * 
   * // Show error message
   * show('Failed to save profile', 'error');
   * 
   * // Show info message (default type)
   * show('Loading complete');
   * ```
   */
  show: (message: string, type?: SnackbarState['type']) => void;

  /**
   * Function to hide the currently displayed snackbar.
   * Resets the snackbar state to default values.
   * 
   * @method hide
   * @returns {void}
   * 
   * @example
   * ```tsx
   * // Hide current snackbar
   * hide();
   * ```
   */
  hide: () => void;
}

/**
 * Global Snackbar Store
 * 
 * Enterprise-grade state management solution for application-wide snackbar notifications.
 * Provides centralized control over notification display with type-safe operations,
 * semantic styling support, and consistent user experience patterns.
 * 
 * @store useSnackbarStore
 * @created create<SnackbarState>
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Store
 * @subcategory Notifications
 * @module Core.Store.Snackbar
 * @namespace Core.Store.Snackbar.useSnackbarStore
 * 
 * @description
 * Zustand-based store providing global snackbar state management with semantic
 * notification types, automatic state transitions, and enterprise-grade reliability.
 * Enables consistent notification experiences across all application screens.
 * 
 * @example
 * Basic usage in components:
 * ```tsx
 * import { useSnackbarStore } from '@/core/store/snackbar.store';
 * 
 * const MyComponent = () => {
 *   const { show, hide, visible, message, type } = useSnackbarStore();
 * 
 *   const handleSuccess = () => {
 *     show('Operation completed successfully', 'success');
 *   };
 * 
 *   const handleError = () => {
 *     show('Something went wrong', 'error');
 *   };
 * 
 *   return (
 *     <View>
 *       <Button onPress={handleSuccess} title="Success" />
 *       <Button onPress={handleError} title="Error" />
 *       {visible && <Snackbar message={message} type={type} onDismiss={hide} />}
 *     </View>
 *   );
 * };
 * ```
 * 
 * @use_cases
 * - Form submission feedback
 * - API operation results
 * - User action confirmations
 * - Error notifications
 * - Loading state updates
 * - Feature announcements
 * - System status updates
 * 
 * @best_practices
 * - Use semantic types appropriately
 * - Keep messages concise and clear
 * - Auto-hide after appropriate duration
 * - Provide dismiss functionality
 * - Test notification accessibility
 * - Monitor notification frequency
 * - Handle multiple notifications gracefully
 * 
 * @dependencies
 * - zustand: State management library
 * 
 * @see {@link SnackbarState} for state interface
 * @see {@link SnackbarHost} for UI component integration
 * 
 * @todo Add auto-hide functionality with configurable duration
 * @todo Implement notification queue for multiple messages
 * @todo Add custom styling options
 * @todo Implement haptic feedback
 * @todo Add analytics tracking for notifications
 */
export const useSnackbarStore = create<SnackbarState>(set => ({
  visible: false,
  message: '',
  type: 'info',

  show: (message, type = 'info') => set({message, type, visible: true}),

  hide: () => set({visible: false, message: '', type: 'info'}),
}));
