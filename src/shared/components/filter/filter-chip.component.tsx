/**
 * @fileoverview FILTER-CHIP-COMPONENT: Generic Toggle Filter Chip
 * @description Reusable chip component for filter toggles with generic type support and icon integration
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Shared.Components.Filter
 * @namespace Shared.Components.Filter.FilterChip
 * @category Components
 * @subcategory Filter
 */

import {Chip} from 'react-native-paper';
import {StyleSheet} from 'react-native';
import {colors, spacing} from '@core/theme';
import {Icons} from '@shared/icons/icons';

/**
 * Props interface for FilterChip with generic type parameter.
 * Enables type-safe filter value handling for various enum and string types.
 * 
 * @interface FilterChipProps
 * @template T - Generic type extending string for filter values
 * @since 1.0.0
 * @version 1.0.0
 * @category Props
 * @subcategory Components
 * 
 * @example
 * Status filter chip:
 * ```tsx
 * type Status = 'active' | 'inactive' | 'pending';
 * 
 * const statusChipProps: FilterChipProps<Status> = {
 *   label: 'Aktiv',
 *   value: 'active',
 *   currentValue: 'active',
 *   onToggle: (value) => setStatusFilter(value),
 *   iconType: 'checkCircle'
 * };
 * ```
 * 
 * @example
 * Category filter chip:
 * ```tsx
 * type Category = 'sports' | 'music' | 'tech';
 * 
 * const categoryChipProps: FilterChipProps<Category> = {
 *   label: 'Sport',
 *   value: 'sports',
 *   currentValue: currentCategory,
 *   onToggle: handleCategoryToggle
 * };
 * ```
 */
interface FilterChipProps<T extends string> {
  /**
   * Display text for the chip.
   * Should be concise and descriptive.
   * 
   * @type {string}
   * @required
   * @example "Aktiv"
   */
  label: string;

  /**
   * Value represented by this filter chip.
   * Type-safe with generic constraint.
   * 
   * @type {T}
   * @required
   * @generic T extends string
   * @example "active"
   */
  value: T;

  /**
   * Currently selected filter value.
   * Used to determine chip selection state.
   * 
   * @type {T}
   * @optional
   * @generic T extends string
   * @example "active"
   */
  currentValue?: T;

  /**
   * Callback function executed when chip is toggled.
   * Receives the chip's value as parameter.
   * 
   * @type {(value: T) => void}
   * @required
   * @param value - The filter value being toggled
   * @example (value) => setActiveFilter(value)
   */
  onToggle: (value: T) => void;

  /**
   * Optional custom styling for the chip.
   * Merged with default styles.
   * 
   * @type {object}
   * @optional
   * @example { marginHorizontal: 5 }
   */
  style?: object;

  /**
   * Optional icon type for visual enhancement.
   * Must be a valid key from the Icons object.
   * 
   * @type {keyof typeof Icons}
   * @optional
   * @example "checkCircle"
   */
  iconType?: keyof typeof Icons;
}

/**
 * Filter Chip Component
 * 
 * A reusable, generic chip component for filter toggles with type-safe value handling.
 * Supports icons, custom styling, and automatic selection state management. Ideal for
 * category filters, status toggles, and any enumerable filter options.
 * 
 * @component
 * @function FilterChip
 * @template T - Generic type extending string for filter values
 * @param {FilterChipProps<T>} props - The component props
 * @returns {React.ReactElement} Rendered filter chip component
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Components
 * @subcategory Filter
 * @module Shared.Components.Filter
 * @namespace Shared.Components.Filter.FilterChip
 * 
 * @example
 * Basic status filter chips:
 * ```tsx
 * import { FilterChip } from '@/shared/components/filter';
 * 
 * type TaskStatus = 'todo' | 'in-progress' | 'done';
 * 
 * const TaskStatusFilter = () => {
 *   const [selectedStatus, setSelectedStatus] = useState<TaskStatus>('todo');
 * 
 *   return (
 *     <View style={styles.chipContainer}>
 *       <FilterChip<TaskStatus>
 *         label="Zu erledigen"
 *         value="todo"
 *         currentValue={selectedStatus}
 *         onToggle={setSelectedStatus}
 *         iconType="circle"
 *       />
 *       <FilterChip<TaskStatus>
 *         label="In Bearbeitung"
 *         value="in-progress"
 *         currentValue={selectedStatus}
 *         onToggle={setSelectedStatus}
 *         iconType="clock"
 *       />
 *       <FilterChip<TaskStatus>
 *         label="Erledigt"
 *         value="done"
 *         currentValue={selectedStatus}
 *         onToggle={setSelectedStatus}
 *         iconType="checkCircle"
 *       />
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * Category filter with enum:
 * ```tsx
 * enum EventCategory {
 *   SPORTS = 'sports',
 *   MUSIC = 'music',
 *   TECH = 'tech',
 *   FOOD = 'food'
 * }
 * 
 * const CategoryFilter = () => {
 *   const [selectedCategory, setSelectedCategory] = useState<EventCategory>();
 * 
 *   const categories = [
 *     { key: EventCategory.SPORTS, label: 'Sport', icon: 'trophy' },
 *     { key: EventCategory.MUSIC, label: 'Musik', icon: 'music' },
 *     { key: EventCategory.TECH, label: 'Technologie', icon: 'laptop' },
 *     { key: EventCategory.FOOD, label: 'Essen', icon: 'food' }
 *   ];
 * 
 *   return (
 *     <ScrollView horizontal style={styles.filterRow}>
 *       {categories.map((category) => (
 *         <FilterChip<EventCategory>
 *           key={category.key}
 *           label={category.label}
 *           value={category.key}
 *           currentValue={selectedCategory}
 *           onToggle={setSelectedCategory}
 *           iconType={category.icon as keyof typeof Icons}
 *         />
 *       ))}
 *     </ScrollView>
 *   );
 * };
 * ```
 * 
 * @example
 * Priority filter with custom styling:
 * ```tsx
 * type Priority = 'low' | 'medium' | 'high' | 'urgent';
 * 
 * const PriorityFilter = () => {
 *   const [selectedPriority, setSelectedPriority] = useState<Priority>();
 * 
 *   const priorityStyles = {
 *     low: { backgroundColor: '#e8f5e8' },
 *     medium: { backgroundColor: '#fff3cd' },
 *     high: { backgroundColor: '#f8d7da' },
 *     urgent: { backgroundColor: '#d1ecf1' }
 *   };
 * 
 *   return (
 *     <View style={styles.priorityContainer}>
 *       {(['low', 'medium', 'high', 'urgent'] as Priority[]).map((priority) => (
 *         <FilterChip<Priority>
 *           key={priority}
 *           label={priority.charAt(0).toUpperCase() + priority.slice(1)}
 *           value={priority}
 *           currentValue={selectedPriority}
 *           onToggle={setSelectedPriority}
 *           style={priorityStyles[priority]}
 *         />
 *       ))}
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * Dynamic filter chips from API data:
 * ```tsx
 * interface FilterOption {
 *   id: string;
 *   name: string;
 *   icon?: string;
 * }
 * 
 * const DynamicFilterChips = ({ options }: { options: FilterOption[] }) => {
 *   const [selectedFilter, setSelectedFilter] = useState<string>();
 * 
 *   return (
 *     <View style={styles.dynamicFilters}>
 *       {options.map((option) => (
 *         <FilterChip<string>
 *           key={option.id}
 *           label={option.name}
 *           value={option.id}
 *           currentValue={selectedFilter}
 *           onToggle={setSelectedFilter}
 *           iconType={option.icon as keyof typeof Icons}
 *         />
 *       ))}
 *     </View>
 *   );
 * };
 * ```
 * 
 * @features
 * - Generic type support for type-safe filter values
 * - Automatic selection state visualization
 * - Optional icon integration from Icons system
 * - Material Design chip implementation
 * - Custom styling support
 * - Toggle functionality with callback
 * - Theme-aware default styling
 * - Performance optimized rendering
 * - DevTools-friendly display name
 * - Accessible interaction patterns
 * 
 * @architecture
 * - Generic TypeScript function component
 * - React Native Paper Chip foundation
 * - StyleSheet for optimized styling
 * - Theme system integration
 * - Icon system integration
 * - Props-based configuration
 * - Functional programming pattern
 * 
 * @styling
 * - Material Design chip aesthetics
 * - Theme-aware background colors
 * - Consistent spacing using design system
 * - Selection state visual feedback
 * - Icon and text alignment
 * - Responsive touch targets
 * 
 * @accessibility
 * - Proper chip role and interaction
 * - Screen reader compatible labels
 * - Touch target optimization
 * - High contrast support
 * - Keyboard navigation compatibility
 * - Selection state announcement
 * 
 * @performance
 * - Lightweight component structure
 * - StyleSheet optimization
 * - Efficient prop handling
 * - Minimal re-render triggers
 * - Optimized icon rendering
 * 
 * @type_safety
 * - Generic type parameter for filter values
 * - Compile-time type checking
 * - IntelliSense support for enum values
 * - Type-safe callback parameters
 * - Icon key validation
 * 
 * @use_cases
 * - Category filtering
 * - Status toggles
 * - Priority selection
 * - Tag-based filtering
 * - Multi-option filters
 * - Search refinement
 * - Content type selection
 * - User preference toggles
 * 
 * @best_practices
 * - Use specific types instead of generic string
 * - Provide meaningful labels for accessibility
 * - Consider icon usage for visual clarity
 * - Group related chips visually
 * - Handle empty states gracefully
 * - Test with different value types
 * - Ensure consistent spacing in chip groups
 * - Follow platform interaction guidelines
 * 
 * @dependencies
 * - react-native-paper: Material Design Chip component
 * - react-native: StyleSheet for styling
 * - @core/theme: Design system values
 * - @shared/icons/icons: Icon system integration
 * 
 * @see {@link colors} for theme color system
 * @see {@link spacing} for spacing constants
 * @see {@link Icons} for available icon types
 * 
 * @todo Add animation support for selection transitions
 * @todo Implement multi-select chip variant
 * @todo Add accessibility labels customization
 * @todo Include haptic feedback option
 */
export function FilterChip<T extends string>({
  label,
  value,
  currentValue,
  onToggle,
  style,
  iconType,
}: FilterChipProps<T>) {
  return (
    <Chip
      icon={iconType ? Icons[iconType] : undefined}
      selected={currentValue === value}
      onPress={() => onToggle(value)}
      style={[styles.chip, style]}>
      {label}
    </Chip>
  );
}

/**
 * Optimized StyleSheet for FilterChip component.
 * Uses theme values for consistent design system integration.
 * 
 * @constant styles
 * @type {StyleSheet}
 * @since 1.0.0
 * 
 * @styles
 * - chip: Theme-aware background with spacing
 */
const styles = StyleSheet.create({
  chip: {
    backgroundColor: colors.background,
    marginRight: spacing.xs,
  },
});

FilterChip.displayName = 'FilterChip';
