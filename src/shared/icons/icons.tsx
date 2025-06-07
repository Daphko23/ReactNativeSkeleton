/**
 * @fileoverview ICONS-REGISTRY: Enterprise Icon Collection Registry
 * @description Centralized registry of pre-configured icons for consistent usage across the application
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Shared.Icons
 * @namespace Shared.Icons.Registry
 * @category Components
 * @subcategory Icons
 */

import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  makeColoredIcon,
  makeSizeOnlyIcon,
  makeStaticIcon,
} from './icon.factory';

/**
 * Enterprise Icon Registry
 * 
 * Centralized collection of pre-configured icons using the factory pattern to ensure
 * consistent usage across the application. Icons are categorized by their intended
 * usage context and configured with appropriate factory methods.
 * 
 * @namespace Icons
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Registry
 * @subcategory IconCollection
 * @module Shared.Icons.Registry
 * @namespace Shared.Icons.Registry.Icons
 * 
 * @example
 * Basic icon usage in components:
 * ```tsx
 * import { Icons } from '@/shared/icons';
 * 
 * const ActionButton = () => (
 *   <Button
 *     icon={({ size, color }) => (
 *       <Icons.add size={size} color={color} />
 *     )}
 *     onPress={handleAdd}
 *   >
 *     Add Item
 *   </Button>
 * );
 * ```
 * 
 * @features
 * - Centralized icon management and consistency
 * - Type-safe icon components with factory pattern
 * - Categorized by usage context (colored, size-only, static)
 * - Consistent sizing and styling across the application
 * - Easy maintenance and icon updates
 * - Performance optimized with factory methods
 * - Compatible with React Native Paper components
 * - Semantic naming convention for developer experience
 * - Extensible architecture for adding new icons
 * - Tree-shakable imports for bundle optimization
 * 
 * @architecture
 * - Factory pattern for icon creation
 * - Separation of concerns by usage type
 * - Centralized registry for easy maintenance
 * - Type-safe implementation with TypeScript
 * - Modular design for extensibility
 * - Performance-optimized component generation
 * - Consistent API across all icon types
 * 
 * @performance
 * - Factory methods reduce component overhead
 * - Pre-configured icons avoid runtime computation
 * - Memory efficient with component reuse
 * - Tree-shaking supports bundle optimization
 * - Minimal re-renders with proper usage patterns
 * - Optimized for frequent usage in UI components
 * 
 * @accessibility
 * - Semantic icon names aid in recognition
 * - Consistent sizing improves usability
 * - Color choices consider contrast requirements
 * - Compatible with screen reader technologies
 * - Proper touch target sizing for interactive icons
 * 
 * @use_cases
 * - Button and FAB icons
 * - Navigation and app bar controls
 * - Form field indicators
 * - Status and notification displays
 * - Menu and chip components
 * - Action sheets and toolbars
 * - List item decorations
 * - Tab navigation indicators
 * 
 * @best_practices
 * - Use appropriate icon type for context
 * - Follow semantic naming conventions
 * - Consider accessibility and contrast
 * - Test icons across different screen sizes
 * - Maintain consistency with design system
 * - Group related icons logically
 * - Document icon usage guidelines
 * - Regular review and cleanup of unused icons
 * 
 * @dependencies
 * - react-native-vector-icons/Ionicons: Base icon library
 * - ./icon.factory: Factory methods for icon creation
 * 
 * @see {@link makeColoredIcon} for creating colored icon components
 * @see {@link makeSizeOnlyIcon} for creating size-only icon components  
 * @see {@link makeStaticIcon} for creating static icon instances
 * 
 * @todo Add animation support for interactive icons
 * @todo Implement icon theme variations (outlined, filled)
 * @todo Add custom icon upload and management system
 * @todo Create icon usage analytics and optimization
 */
export const Icons = {
  // ========================================================================
  // COLORED ICONS - For FAB, Button, TextInput, etc.
  // ========================================================================
  // These icons accept both size and color props, making them suitable
  // for interactive elements where color customization is required.
  
  /**
   * Add/Plus icon for creation actions.
   * 
   * @type {ColoredIcon}
   * @usage Buttons, FABs, creation flows
   * @example <Icons.add size={24} color="#1976d2" />
   * @semantic Creation, addition, new item
   */
  add: makeColoredIcon(Ionicons, 'add'),
  
  /**
   * Save/Disk icon for save operations.
   * 
   * @type {ColoredIcon}
   * @usage Save buttons, form submissions
   * @example <Icons.save size={20} color="#4caf50" />
   * @semantic Data persistence, save action
   */
  save: makeColoredIcon(Ionicons, 'save'),
  
  /**
   * Checkmark icon for confirmation and success.
   * 
   * @type {ColoredIcon}
   * @usage Confirmation buttons, success states
   * @example <Icons.checkmark size={24} color="#4caf50" />
   * @semantic Success, confirmation, completion
   */
  checkmark: makeColoredIcon(Ionicons, 'checkmark'),
  
  /**
   * Filter icon for filtering and sorting.
   * 
   * @type {ColoredIcon}
   * @usage Filter buttons, data manipulation
   * @example <Icons.filter size={20} color="#ff9800" />
   * @semantic Data filtering, sorting, refinement
   */
  filter: makeColoredIcon(Ionicons, 'filter'),
  
  /**
   * Search/Magnifying glass icon for search functionality.
   * 
   * @type {ColoredIcon}
   * @usage Search buttons, text inputs
   * @example <Icons.search size={24} color="#1976d2" />
   * @semantic Search, find, lookup
   */
  search: makeColoredIcon(Ionicons, 'search'),
  
  /**
   * Funnel icon for advanced filtering.
   * 
   * @type {ColoredIcon}
   * @usage Advanced filter controls
   * @example <Icons.funnel size={20} color="#9c27b0" />
   * @semantic Advanced filtering, data refinement
   */
  funnel: makeColoredIcon(Ionicons, 'funnel'),
  
  /**
   * Refresh/Reload icon for refresh operations.
   * 
   * @type {ColoredIcon}
   * @usage Refresh buttons, reload actions
   * @example <Icons.refresh size={24} color="#607d8b" />
   * @semantic Refresh, reload, update
   */
  refresh: makeColoredIcon(Ionicons, 'refresh'),

  // ========================================================================
  // SIZE-ONLY ICONS - For Card.Title, Appbar, etc.
  // ========================================================================
  // These icons only accept size props, with color inherited from parent
  // component or theme. Perfect for navigation and contextual controls.
  
  /**
   * Close/X icon for dismissal actions.
   * 
   * @type {SizeOnlyIcon}
   * @usage App bars, modal headers, card titles
   * @example <Icons.close size={20} />
   * @semantic Close, dismiss, cancel
   * @inheritance Color from parent component or theme
   */
  close: makeSizeOnlyIcon(Ionicons, 'close'),

  // ========================================================================
  // STATIC ICONS - For Chip, Menu, etc.
  // ========================================================================
  // These are pre-configured JSX elements with fixed size and color,
  // suitable for components expecting IconSource like Chips and Menu items.
  
  /**
   * Delete/Trash icon for deletion actions.
   * 
   * @type {StaticIcon}
   * @usage Chip close icons, menu items, delete buttons
   * @size 18px
   * @color Inherits from component context
   * @semantic Delete, remove, trash
   */
  delete: makeStaticIcon(Ionicons, 'trash', 18),
  
  /**
   * Information icon for help and details.
   * 
   * @type {StaticIcon}
   * @usage Chip indicators, menu items, info buttons
   * @size 18px
   * @color Inherits from component context
   * @semantic Information, help, details
   */
  info: makeStaticIcon(Ionicons, 'information-circle', 18),
};
