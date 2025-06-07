/**
 * @fileoverview DIALOGS-INDEX: Dialog Components Module Exports
 * @description Central export hub for all dialog components and types in the shared components library
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Shared.Components.Dialogs
 * @namespace Shared.Components.Dialogs
 * @category Components
 * @subcategory Dialogs
 * 
 * @example
 * Import all dialog components:
 * ```tsx
 * import {
 *   GenericDialog,
 *   CustomDialog,
 *   DeleteConfirmationDialog,
 *   SaveConfirmationDialog,
 *   WarningDialog,
 *   InfoDialog,
 *   type DialogType,
 *   type DialogAction
 * } from '@/shared/components/dialogs';
 * ```
 * 
 * @example
 * Import specific dialog:
 * ```tsx
 * import { DeleteConfirmationDialog } from '@/shared/components/dialogs';
 * ```
 * 
 * @features
 * - Comprehensive dialog component library
 * - Type-safe interfaces and enums
 * - Preset components for common use cases
 * - Base components for custom implementations
 * - Material Design compliance
 * - Accessibility support
 * - Internationalization ready
 * - Test-friendly implementations
 * 
 * @architecture
 * - GenericDialog: React Native Paper-based foundation
 * - CustomDialog: Native React Native implementation
 * - Preset dialogs: Specialized use-case components
 * - Shared interfaces for consistent API
 * - Type definitions for enhanced development experience
 * 
 * @use_cases
 * - User confirmation flows
 * - Error and warning displays
 * - Information notifications
 * - Form validation feedback
 * - Navigation confirmations
 * - Data modification warnings
 * - Feature announcements
 * - System status updates
 */

/**
 * Base Generic Dialog Component
 * Foundation dialog with React Native Paper integration
 */
export { GenericDialog } from './generic-dialog.component';

/**
 * Generic Dialog Type Definitions
 * Shared interfaces and enums for dialog configuration
 */
export type { GenericDialogProps, DialogType, DialogAction } from './generic-dialog.component';

/**
 * Custom Dialog Component
 * Native React Native implementation without Paper dependencies
 */
export { CustomDialog } from './custom-dialog.component';

/**
 * Custom Dialog Type Definitions
 * Interface definitions for custom dialog implementation
 */
export type { CustomDialogProps } from './custom-dialog.component';

/**
 * Dialog Preset Components
 * Ready-to-use specialized dialog components for common scenarios
 */
export {
  DeleteConfirmationDialog,
  SaveConfirmationDialog,
  WarningDialog,
  InfoDialog
} from './dialog-presets.component';

/**
 * Dialog Preset Type Definitions
 * Interface definitions for all preset dialog components
 */
export type {
  DeleteConfirmationDialogProps,
  SaveConfirmationDialogProps,
  WarningDialogProps,
  InfoDialogProps
} from './dialog-presets.component'; 