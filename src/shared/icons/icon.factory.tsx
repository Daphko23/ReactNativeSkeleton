/**
 * @fileoverview ICON-FACTORY: Enterprise Icon Factory System
 * @description Advanced factory pattern for creating type-safe, reusable icon components with multiple rendering modes
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Shared.Icons
 * @namespace Shared.Icons.Factory
 * @category Components
 * @subcategory Icons
 */

import React from 'react';
import {ColorValue} from 'react-native';
import {IconSource} from 'react-native-paper/lib/typescript/components/Icon';

/**
 * Props interface for colored icon components.
 * Used for icons that need both size and color customization.
 * 
 * @interface ColoredIconProps
 * @since 1.0.0
 * @version 1.0.0
 * @category Interfaces
 * @subcategory Props
 * 
 * @example
 * ```tsx
 * const iconProps: ColoredIconProps = {
 *   size: 24,
 *   color: '#1976d2'
 * };
 * ```
 */
export type ColoredIconProps = {
  /**
   * Icon size in pixels.
   * Determines the rendered dimensions of the icon.
   * 
   * @type {number}
   * @required
   * @range 8-64
   * @example 24
   * @default Usually 24 for standard UI elements
   */
  size: number;
  
  /**
   * Icon color value.
   * Supports all React Native color formats.
   * 
   * @type {string}
   * @required
   * @example "#1976d2"
   * @example "rgba(25, 118, 210, 0.8)"
   * @theming Should use theme colors for consistency
   */
  color: string;
};

/**
 * Props interface for size-only icon components.
 * Used for icons that only need size customization (color handled by parent).
 * 
 * @interface SizeOnlyIconProps
 * @since 1.0.0
 * @version 1.0.0
 * @category Interfaces
 * @subcategory Props
 * 
 * @example
 * ```tsx
 * const iconProps: SizeOnlyIconProps = {
 *   size: 20
 * };
 * ```
 */
export type SizeOnlyIconProps = {
  /**
   * Icon size in pixels.
   * Color is inherited from parent component or theme.
   * 
   * @type {number}
   * @required
   * @range 8-64
   * @example 20
   * @inheritance Color comes from parent context
   */
  size: number;
};

/**
 * Type definition for icon component implementations.
 * Ensures compatibility with popular icon libraries like Ionicons.
 * 
 * @type IconComponentType
 * @since 1.0.0
 * @version 1.0.0
 * @category Types
 * @subcategory Components
 * 
 * @example
 * ```tsx
 * import Ionicons from 'react-native-vector-icons/Ionicons';
 * 
 * const iconComponent: IconComponentType = Ionicons;
 * ```
 */
export type IconComponentType = React.ComponentType<{
  /**
   * Icon name identifier from the icon library.
   * 
   * @type {string}
   * @required
   * @example "add"
   * @example "checkmark-circle"
   */
  name: string;
  
  /**
   * Optional icon size in pixels.
   * 
   * @type {number}
   * @optional
   * @example 24
   */
  size?: number;
  
  /**
   * Optional icon color value.
   * 
   * @type {string | number | ColorValue}
   * @optional
   * @example "#1976d2"
   */
  color?: string | number | ColorValue;
}>;

/**
 * Factory function for creating colored icon components.
 * 
 * Creates icon components that accept both size and color props, making them
 * suitable for use in buttons, FABs, text inputs, and other interactive elements
 * where color customization is required.
 * 
 * @function makeColoredIcon
 * @param {IconComponentType} Component - The base icon component (e.g., Ionicons)
 * @param {string} name - The icon name from the library
 * @returns {(props: ColoredIconProps) => React.ReactElement} Configured icon component
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Factory
 * @subcategory IconCreation
 * @module Shared.Icons.Factory
 * @namespace Shared.Icons.Factory.ColoredIcon
 * 
 * @example
 * Basic colored icon creation:
 * ```tsx
 * import Ionicons from 'react-native-vector-icons/Ionicons';
 * import { makeColoredIcon } from '@/shared/icons/icon.factory';
 * 
 * const AddIcon = makeColoredIcon(Ionicons, 'add');
 * 
 * // Usage in component
 * const MyButton = () => (
 *   <Button
 *     icon={({ size, color }) => (
 *       <AddIcon size={size} color={color} />
 *     )}
 *     onPress={handleAdd}
 *   >
 *     Add Item
 *   </Button>
 * );
 * ```
 * 
 * @example
 * Multiple colored icons for different actions:
 * ```tsx
 * const ActionIcons = {
 *   save: makeColoredIcon(Ionicons, 'save'),
 *   delete: makeColoredIcon(Ionicons, 'trash'),
 *   edit: makeColoredIcon(Ionicons, 'pencil'),
 *   share: makeColoredIcon(Ionicons, 'share')
 * };
 * 
 * const ActionBar = () => (
 *   <View style={styles.actionBar}>
 *     <IconButton
 *       icon={({ size, color }) => (
 *         <ActionIcons.save size={size} color={color} />
 *       )}
 *       onPress={handleSave}
 *     />
 *     <IconButton
 *       icon={({ size, color }) => (
 *         <ActionIcons.delete size={size} color={color} />
 *       )}
 *       onPress={handleDelete}
 *     />
 *   </View>
 * );
 * ```
 * 
 * @example
 * Theme-aware colored icon usage:
 * ```tsx
 * const ThemedButton = () => {
 *   const { theme } = useTheme();
 *   const SearchIcon = makeColoredIcon(Ionicons, 'search');
 *   
 *   return (
 *     <Button
 *       icon={({ size }) => (
 *         <SearchIcon 
 *           size={size} 
 *           color={theme.colors.primary}
 *         />
 *       )}
 *       mode="contained"
 *       onPress={handleSearch}
 *     >
 *       Search
 *     </Button>
 *   );
 * };
 * ```
 * 
 * @features
 * - Type-safe icon component creation
 * - Flexible size and color customization
 * - Compatible with React Native Paper components
 * - Automatic display name assignment for debugging
 * - Memory efficient component generation
 * - Theme integration support
 * - Consistent API across different icon libraries
 * - Performance optimized with React.Component pattern
 * 
 * @use_cases
 * - Button icons with custom colors
 * - FAB (Floating Action Button) icons
 * - Text input leading/trailing icons
 * - Navigation bar icons
 * - Tab bar icons with state colors
 * - Action sheet icons
 * - Toolbar and app bar icons
 * - Interactive element indicators
 * 
 * @best_practices
 * - Use theme colors for consistency
 * - Provide appropriate size for touch targets
 * - Consider accessibility contrast ratios
 * - Use semantic icon names
 * - Cache created icons for performance
 * - Test icons across different screen densities
 * 
 * @performance
 * - Minimal overhead with factory pattern
 * - Component reuse across multiple instances
 * - Efficient prop passing to underlying component
 * - No unnecessary re-renders with proper usage
 * 
 * @accessibility
 * - Inherits accessibility props from base component
 * - Supports screen reader descriptions
 * - Maintains proper contrast ratios
 * - Compatible with accessibility testing tools
 * 
 * @see {@link makeSizeOnlyIcon} for size-only icon creation
 * @see {@link makeStaticIcon} for static icon creation
 * @see {@link ColoredIconProps} for prop interface
 */
export const makeColoredIcon = (
  Component: IconComponentType,
  name: string
): ((props: ColoredIconProps) => React.ReactElement) => {
  const Icon = function IconComponent({
    size,
    color,
  }: ColoredIconProps): React.ReactElement {
    return <Component name={name} size={size} color={color} />;
  };

  Icon.displayName = `Icon(${name})`;
  return Icon;
};

/**
 * Factory function for creating size-only icon components.
 * 
 * Creates icon components that only accept size props, with color being handled
 * by the parent component or inherited from theme. Ideal for use in Card titles,
 * App bars, and other contexts where color is controlled externally.
 * 
 * @function makeSizeOnlyIcon
 * @param {IconComponentType} Component - The base icon component (e.g., Ionicons)
 * @param {string} name - The icon name from the library
 * @returns {(props: SizeOnlyIconProps) => React.ReactElement} Configured icon component
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Factory
 * @subcategory IconCreation
 * @module Shared.Icons.Factory
 * @namespace Shared.Icons.Factory.SizeOnlyIcon
 * 
 * @example
 * Basic size-only icon for Card.Title:
 * ```tsx
 * import Ionicons from 'react-native-vector-icons/Ionicons';
 * import { makeSizeOnlyIcon } from '@/shared/icons/icon.factory';
 * 
 * const CloseIcon = makeSizeOnlyIcon(Ionicons, 'close');
 * 
 * const UserCard = ({ user, onClose }) => (
 *   <Card>
 *     <Card.Title
 *       title={user.name}
 *       subtitle={user.email}
 *       right={(props) => (
 *         <IconButton
 *           {...props}
 *           icon={(iconProps) => <CloseIcon size={iconProps.size} />}
 *           onPress={onClose}
 *         />
 *       )}
 *     />
 *     <Card.Content>
 *       <Text>{user.bio}</Text>
 *     </Card.Content>
 *   </Card>
 * );
 * ```
 * 
 * @example
 * App bar navigation icons:
 * ```tsx
 * const NavigationIcons = {
 *   back: makeSizeOnlyIcon(Ionicons, 'arrow-back'),
 *   menu: makeSizeOnlyIcon(Ionicons, 'menu'),
 *   settings: makeSizeOnlyIcon(Ionicons, 'settings')
 * };
 * 
 * const AppHeader = ({ title, onBack, onMenu }) => (
 *   <Appbar.Header>
 *     <Appbar.BackAction
 *       icon={(props) => <NavigationIcons.back size={props.size} />}
 *       onPress={onBack}
 *     />
 *     <Appbar.Content title={title} />
 *     <Appbar.Action
 *       icon={(props) => <NavigationIcons.menu size={props.size} />}
 *       onPress={onMenu}
 *     />
 *   </Appbar.Header>
 * );
 * ```
 * 
 * @example
 * List item trailing icons:
 * ```tsx
 * const ChevronIcon = makeSizeOnlyIcon(Ionicons, 'chevron-forward');
 * 
 * const SettingsList = ({ settings }) => (
 *   <FlatList
 *     data={settings}
 *     renderItem={({ item }) => (
 *       <List.Item
 *         title={item.title}
 *         description={item.description}
 *         right={(props) => (
 *           <ChevronIcon size={props.size || 20} />
 *         )}
 *         onPress={() => navigateToSetting(item.id)}
 *       />
 *     )}
 *   />
 * );
 * ```
 * 
 * @features
 * - Simplified icon API with size-only configuration
 * - Automatic color inheritance from parent components
 * - Perfect for Material Design Card and App bar usage
 * - Consistent sizing across different contexts
 * - Automatic display name for debugging
 * - Memory efficient component generation
 * - Theme-aware color handling
 * - Clean separation of concerns
 * 
 * @use_cases
 * - Card.Title right/left icons
 * - App bar navigation and action icons
 * - List item trailing indicators
 * - Modal header controls
 * - Navigation drawer items
 * - Tab bar icons (when color is managed by tab navigator)
 * - Accordion expand/collapse indicators
 * - Table header sorting indicators
 * 
 * @best_practices
 * - Let parent components control color for consistency
 * - Use appropriate sizes for different UI contexts
 * - Ensure proper touch target sizes for interactive icons
 * - Consider icon semantics and user expectations
 * - Test across different theme modes (light/dark)
 * - Maintain consistent sizing within component groups
 * 
 * @performance
 * - Minimal component overhead
 * - Efficient prop delegation
 * - No color calculations or theme lookups
 * - Optimized for frequent re-renders
 * 
 * @accessibility
 * - Relies on parent for proper accessibility handling
 * - Supports assistive technology through parent context
 * - Maintains semantic meaning through icon choice
 * - Compatible with screen reader navigation
 * 
 * @see {@link makeColoredIcon} for colored icon creation
 * @see {@link makeStaticIcon} for static icon creation
 * @see {@link SizeOnlyIconProps} for prop interface
 */
export const makeSizeOnlyIcon = (
  Component: IconComponentType,
  name: string
): ((props: SizeOnlyIconProps) => React.ReactElement) => {
  const Icon = function SizeOnlyIconComponent({
    size,
  }: SizeOnlyIconProps): React.ReactElement {
    return <Component name={name} size={size} />;
  };

  Icon.displayName = `Icon(${name}-noColor)`;
  return Icon;
};

/**
 * Factory function for creating static icon instances.
 * 
 * Creates pre-configured icon JSX elements with fixed size and optional color,
 * suitable for use as IconSource in components like Chips, Menu items, and other
 * contexts where a static icon reference is needed.
 * 
 * @function makeStaticIcon
 * @param {IconComponentType} Component - The base icon component (e.g., Ionicons)
 * @param {string} name - The icon name from the library
 * @param {number} size - Fixed icon size in pixels
 * @param {string | number | ColorValue} color - Optional fixed color value
 * @returns {IconSource} Pre-configured icon JSX element
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Factory
 * @subcategory IconCreation
 * @module Shared.Icons.Factory
 * @namespace Shared.Icons.Factory.StaticIcon
 * 
 * @example
 * Basic static icons for Chips:
 * ```tsx
 * import Ionicons from 'react-native-vector-icons/Ionicons';
 * import { makeStaticIcon } from '@/shared/icons/icon.factory';
 * 
 * const deleteIcon = makeStaticIcon(Ionicons, 'close', 16, '#666');
 * const infoIcon = makeStaticIcon(Ionicons, 'information-circle', 16);
 * 
 * const TagChips = ({ tags, onRemove }) => (
 *   <View style={styles.chipContainer}>
 *     {tags.map(tag => (
 *       <Chip
 *         key={tag.id}
 *         icon={infoIcon}
 *         closeIcon={deleteIcon}
 *         onClose={() => onRemove(tag.id)}
 *       >
 *         {tag.name}
 *       </Chip>
 *     ))}
 *   </View>
 * );
 * ```
 * 
 * @example
 * Menu item icons with consistent sizing:
 * ```tsx
 * const MenuIcons = {
 *   edit: makeStaticIcon(Ionicons, 'pencil', 18, '#1976d2'),
 *   copy: makeStaticIcon(Ionicons, 'copy', 18, '#1976d2'),
 *   delete: makeStaticIcon(Ionicons, 'trash', 18, '#d32f2f'),
 *   share: makeStaticIcon(Ionicons, 'share', 18, '#1976d2')
 * };
 * 
 * const ContextMenu = ({ item, onAction }) => (
 *   <Menu>
 *     <Menu.Item
 *       leadingIcon={MenuIcons.edit}
 *       title="Edit"
 *       onPress={() => onAction('edit', item)}
 *     />
 *     <Menu.Item
 *       leadingIcon={MenuIcons.copy}
 *       title="Copy"
 *       onPress={() => onAction('copy', item)}
 *     />
 *     <Divider />
 *     <Menu.Item
 *       leadingIcon={MenuIcons.delete}
 *       title="Delete"
 *       onPress={() => onAction('delete', item)}
 *     />
 *   </Menu>
 * );
 * ```
 * 
 * @example
 * Status indicators with semantic colors:
 * ```tsx
 * const StatusIcons = {
 *   success: makeStaticIcon(Ionicons, 'checkmark-circle', 20, '#4caf50'),
 *   warning: makeStaticIcon(Ionicons, 'warning', 20, '#ff9800'),
 *   error: makeStaticIcon(Ionicons, 'close-circle', 20, '#f44336'),
 *   info: makeStaticIcon(Ionicons, 'information-circle', 20, '#2196f3')
 * };
 * 
 * const StatusChip = ({ status, message }) => (
 *   <Chip
 *     icon={StatusIcons[status]}
 *     textStyle={{ color: getStatusColor(status) }}
 *   >
 *     {message}
 *   </Chip>
 * );
 * ```
 * 
 * @example
 * Notification type icons:
 * ```tsx
 * const NotificationIcons = {
 *   message: makeStaticIcon(Ionicons, 'mail', 16),
 *   reminder: makeStaticIcon(Ionicons, 'time', 16),
 *   system: makeStaticIcon(Ionicons, 'settings', 16),
 *   social: makeStaticIcon(Ionicons, 'people', 16)
 * };
 * 
 * const NotificationList = ({ notifications }) => (
 *   <FlatList
 *     data={notifications}
 *     renderItem={({ item }) => (
 *       <List.Item
 *         title={item.title}
 *         description={item.message}
 *         left={() => NotificationIcons[item.type]}
 *         onPress={() => handleNotification(item)}
 *       />
 *     )}
 *   />
 * );
 * ```
 * 
 * @features
 * - Pre-configured static icon instances
 * - Fixed size and color for consistency
 * - Perfect for IconSource usage patterns
 * - Optimized for Chip and Menu components
 * - No props interface needed at runtime
 * - Memory efficient with single instance creation
 * - Immediate usability without wrapper functions
 * - Semantic color coding support
 * 
 * @use_cases
 * - Chip icons (leading and close icons)
 * - Menu item leading icons
 * - Status and notification indicators
 * - Badge and label icons
 * - Form field validation icons
 * - List item category indicators
 * - Quick action icons
 * - Toolbar button icons with fixed appearance
 * 
 * @best_practices
 * - Use consistent sizes within component groups
 * - Apply semantic colors for status indicators
 * - Consider accessibility contrast requirements
 * - Use appropriate icon sizes for touch targets
 * - Group related static icons for maintainability
 * - Document color choices for team consistency
 * 
 * @performance
 * - Single instance creation per icon
 * - No runtime prop processing
 * - Minimal memory footprint
 * - Optimized for components expecting IconSource
 * 
 * @accessibility
 * - Fixed appearance aids in recognition consistency
 * - Color coding supports visual categorization
 * - Size consistency improves scanning efficiency
 * - Compatible with accessibility testing frameworks
 * 
 * @see {@link makeColoredIcon} for dynamic colored icons
 * @see {@link makeSizeOnlyIcon} for size-configurable icons
 * @see {@link IconSource} for React Native Paper compatibility
 */
export const makeStaticIcon = (
  Component: IconComponentType,
  name: string,
  size: number = 16,
  color?: string | number | ColorValue
): IconSource => {
  return (<Component name={name} size={size} color={color} />) as IconSource;
};
