/**
 * @fileoverview SHARED-COMPONENTS-INDEX: Enterprise Component Library Exports
 * @description Central export point for all reusable UI components in the shared component library
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Shared.Components
 * @namespace Shared.Components
 * @category Components
 * @subcategory Index
 */

/**
 * Card Components
 * 
 * Collection of reusable card components for displaying structured content
 * with consistent styling and behavior patterns.
 * 
 * @namespace Cards
 * @since 1.0.0
 * @version 1.0.0
 * @category Components
 * @subcategory Cards
 * 
 * @example
 * Importing card components:
 * ```tsx
 * import { 
 *   ProfileCard, 
 *   InfoCard, 
 *   ActionCard 
 * } from '@/shared/components';
 * ```
 */
export * from './cards';

/**
 * Dialog Components
 * 
 * Modal dialog components for user interactions, confirmations,
 * and complex forms with consistent theming and accessibility.
 * 
 * @namespace Dialogs
 * @since 1.0.0
 * @version 1.0.0
 * @category Components
 * @subcategory Dialogs
 * 
 * @example
 * Importing dialog components:
 * ```tsx
 * import { 
 *   ConfirmDialog, 
 *   FormDialog, 
 *   AlertDialog 
 * } from '@/shared/components';
 * ```
 */
export * from './dialogs';

/**
 * Form Components
 * 
 * Comprehensive set of form input components with validation,
 * accessibility features, and consistent styling patterns.
 * 
 * @namespace Forms
 * @since 1.0.0
 * @version 1.0.0
 * @category Components
 * @subcategory Forms
 * 
 * @example
 * Importing form components:
 * ```tsx
 * import { 
 *   FormTextInput, 
 *   FormSection, 
 *   ValidationMessage 
 * } from '@/shared/components';
 * ```
 */
export * from './forms';

/**
 * Loading Overlay Component
 * 
 * Versatile loading state component with support for both inline
 * and full-screen overlay modes with optional loading messages.
 * 
 * @component LoadingOverlay
 * @since 1.0.0
 * @version 1.0.0
 * @category Components
 * @subcategory UI
 * 
 * @example
 * Basic loading overlay usage:
 * ```tsx
 * import { LoadingOverlay } from '@/shared/components';
 * 
 * const MyScreen = () => {
 *   const [isLoading, setIsLoading] = useState(false);
 * 
 *   return (
 *     <View>
 *       <LoadingOverlay 
 *         visible={isLoading} 
 *         message="Loading data..." 
 *         overlay 
 *       />
 *       <YourContent />
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * Inline loading state:
 * ```tsx
 * <LoadingOverlay 
 *   visible={isSubmitting} 
 *   size="small"
 *   message="Submitting..."
 * />
 * ```
 */
export { LoadingOverlay } from './ui/loading-overlay.component';

/**
 * Architecture Note: AlertService Migration
 * 
 * The AlertService has been moved from shared components to core services
 * for better separation of concerns and architectural clarity. This service
 * is now part of the core business logic layer.
 * 
 * @deprecated AlertService is no longer exported from shared components
 * @see @core/services/alert.service for the new location
 * @since 1.0.0
 * @migration Use `import { AlertService } from '@core/services';` instead
 * 
 * @example
 * Updated import:
 * ```tsx
 * // Old way (deprecated)
 * // import { AlertService } from '@shared/components';
 * 
 * // New way
 * import { AlertService } from '@core/services';
 * ```
 */
// Note: AlertService moved to @core/services 