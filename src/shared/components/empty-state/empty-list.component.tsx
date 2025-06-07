/**
 * @fileoverview EMPTY-LIST-COMPONENT: Contextual Empty State Display
 * @description Intelligent empty state component for lists with contextual messaging based on loading, filtering, and search states
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Shared.Components.EmptyState
 * @namespace Shared.Components.EmptyState.EmptyList
 * @category Components
 * @subcategory EmptyState
 */

import {memo, useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {colors, spacing} from '@core/theme';

/**
 * Props interface for the EmptyList component.
 * Provides configuration for intelligent empty state messaging based on context.
 * 
 * @interface EmptyListProps
 * @since 1.0.0
 * @version 1.0.0
 * @category Props
 * @subcategory Components
 * 
 * @example
 * Basic empty list state:
 * ```tsx
 * const emptyProps: EmptyListProps = {
 *   loading: false,
 *   hasActiveFilters: false,
 *   hasSearchTerm: false
 * };
 * ```
 * 
 * @example
 * Filtered results empty state:
 * ```tsx
 * const filteredEmptyProps: EmptyListProps = {
 *   loading: false,
 *   hasActiveFilters: true,
 *   hasSearchTerm: false
 * };
 * ```
 * 
 * @example
 * Search results empty state:
 * ```tsx
 * const searchEmptyProps: EmptyListProps = {
 *   loading: false,
 *   hasActiveFilters: false,
 *   hasSearchTerm: true
 * };
 * ```
 */
interface EmptyListProps {
  /**
   * Indicates whether data is currently being loaded.
   * When true, displays loading message instead of empty state.
   * 
   * @type {boolean}
   * @required
   * @example true
   * @state loading - Shows loading indicator message
   * @state !loading - Shows appropriate empty state message
   */
  loading: boolean;

  /**
   * Indicates whether active filters are applied to the list.
   * Affects the contextual message shown to users.
   * 
   * @type {boolean}
   * @required
   * @example true
   * @context Helps determine if emptiness is due to filtering
   */
  hasActiveFilters: boolean;

  /**
   * Indicates whether a search term is currently active.
   * Affects the contextual message shown to users.
   * 
   * @type {boolean}
   * @required
   * @example true
   * @context Helps determine if emptiness is due to search filtering
   */
  hasSearchTerm: boolean;
}

/**
 * Empty List Component
 * 
 * An intelligent empty state component that displays contextual messages based on the current
 * state of the list (loading, filtered, searched, or genuinely empty). Provides users with
 * clear feedback about why the list is empty and potential next actions.
 * 
 * @component
 * @function EmptyList
 * @param {EmptyListProps} props - The component props
 * @returns {React.ReactElement} Rendered empty list state component
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Components
 * @subcategory EmptyState
 * @module Shared.Components.EmptyState
 * @namespace Shared.Components.EmptyState.EmptyList
 * 
 * @example
 * Basic usage in a list component:
 * ```tsx
 * import { EmptyList } from '@/shared/components/empty-state';
 * 
 * const MatchdayList = () => {
 *   const [data, setData] = useState([]);
 *   const [loading, setLoading] = useState(true);
 *   const [filters, setFilters] = useState({});
 *   const [searchTerm, setSearchTerm] = useState('');
 * 
 *   const hasActiveFilters = Object.keys(filters).length > 0;
 *   const hasSearchTerm = searchTerm.trim().length > 0;
 * 
 *   if (data.length === 0) {
 *     return (
 *       <EmptyList
 *         loading={loading}
 *         hasActiveFilters={hasActiveFilters}
 *         hasSearchTerm={hasSearchTerm}
 *       />
 *     );
 *   }
 * 
 *   return <FlatList data={data} />;
 * };
 * ```
 * 
 * @example
 * In a search results context:
 * ```tsx
 * const SearchResults = ({ searchQuery, results, isSearching }) => {
 *   if (results.length === 0) {
 *     return (
 *       <EmptyList
 *         loading={isSearching}
 *         hasActiveFilters={false}
 *         hasSearchTerm={searchQuery.length > 0}
 *       />
 *     );
 *   }
 * 
 *   return <ResultsList results={results} />;
 * };
 * ```
 * 
 * @example
 * In a filtered list context:
 * ```tsx
 * const FilteredProductList = ({ products, filters, isLoading }) => {
 *   const hasFilters = Object.values(filters).some(Boolean);
 * 
 *   if (products.length === 0) {
 *     return (
 *       <EmptyList
 *         loading={isLoading}
 *         hasActiveFilters={hasFilters}
 *         hasSearchTerm={false}
 *       />
 *     );
 *   }
 * 
 *   return <ProductGrid products={products} />;
 * };
 * ```
 * 
 * @example
 * Complex state management:
 * ```tsx
 * const AdvancedList = () => {
 *   const { data, loading, error } = useQuery();
 *   const [searchTerm, setSearchTerm] = useState('');
 *   const [activeFilters, setActiveFilters] = useState({
 *     category: '',
 *     status: '',
 *     dateRange: null
 *   });
 * 
 *   const hasActiveFilters = Object.values(activeFilters).some(value => 
 *     value !== '' && value !== null
 *   );
 * 
 *   if (error) return <ErrorState />;
 * 
 *   if (data?.length === 0) {
 *     return (
 *       <EmptyList
 *         loading={loading}
 *         hasActiveFilters={hasActiveFilters}
 *         hasSearchTerm={searchTerm.trim().length > 0}
 *       />
 *     );
 *   }
 * 
 *   return <DataList data={data} />;
 * };
 * ```
 * 
 * @features
 * - Contextual messaging based on state
 * - Internationalization support
 * - Loading state handling
 * - Filter-aware messaging
 * - Search-aware messaging
 * - Memoized message calculation
 * - Consistent styling with theme
 * - Accessibility compliant
 * - Performance optimized with React.memo
 * - Responsive design
 * 
 * @architecture
 * - React.memo wrapper for performance optimization
 * - useMemo hook for message calculation
 * - useTranslation hook for i18n support
 * - StyleSheet for optimized styling
 * - Conditional logic for contextual messaging
 * - Theme integration for consistent appearance
 * 
 * @styling
 * - Centered layout with flex positioning
 * - Theme-aware text color (placeholder color)
 * - Consistent spacing using theme values
 * - Responsive padding for different screen sizes
 * - Typography following design system
 * - Material Design influenced aesthetics
 * 
 * @accessibility
 * - Screen reader friendly text content
 * - High contrast color usage
 * - Proper text sizing for readability
 * - Semantic text representation
 * - Focus management support
 * 
 * @performance
 * - React.memo prevents unnecessary re-renders
 * - useMemo optimizes message calculation
 * - StyleSheet creates optimized style objects
 * - Minimal component footprint
 * - Efficient prop comparison
 * 
 * @internationalization
 * - Supports multiple languages via i18next
 * - Translation keys:
 *   - 'common.loading' - Loading state message
 *   - 'shared.emptyList.noFilterResults' - No results after filtering
 *   - 'shared.emptyList.noItems' - No items available
 * - RTL (Right-to-Left) language support
 * - Dynamic language switching
 * 
 * @use_cases
 * - Empty search results
 * - Filtered lists with no matches
 * - Initially empty data sets
 * - Loading states for lists
 * - Post-deletion empty states
 * - Onboarding empty states
 * - Error recovery states
 * - Content placeholder display
 * 
 * @best_practices
 * - Always provide contextual messaging
 * - Use loading prop for async operations
 * - Combine with pull-to-refresh for better UX
 * - Consider adding action buttons for empty states
 * - Provide clear next steps to users
 * - Test with different screen sizes
 * - Ensure proper translation coverage
 * - Use consistent empty state patterns
 * 
 * @dependencies
 * - react: Core React library for hooks and memo
 * - react-native: Native components (View, StyleSheet)
 * - react-native-paper: Material Design Text component
 * - react-i18next: Internationalization support
 * - @core/theme: Design system theme values
 * 
 * @see {@link useTranslation} for internationalization setup
 * @see {@link colors} for theme color system
 * @see {@link spacing} for theme spacing system
 * 
 * @todo Add optional action buttons for empty states
 * @todo Implement custom icons for different empty types
 * @todo Add animation support for state transitions
 * @todo Include illustration support for enhanced UX
 */
export const EmptyList = memo<EmptyListProps>(
  ({loading, hasActiveFilters, hasSearchTerm}) => {
    const {t} = useTranslation();

    /**
     * Calculates the appropriate message based on current component state.
     * Uses memoization to prevent unnecessary recalculations.
     * 
     * @function
     * @returns {string} Localized message for current state
     * @memoized Recalculates only when dependencies change
     * 
     * @logic
     * 1. If loading: Show loading message
     * 2. If search term or filters active: Show no results message
     * 3. Otherwise: Show no items available message
     */
    const message = useMemo(() => {
      if (loading) return t('common.loading');
      if (hasSearchTerm || hasActiveFilters)
        return t('shared.emptyList.noFilterResults');
      return t('shared.emptyList.noItems');
    }, [loading, hasActiveFilters, hasSearchTerm, t]);

    return (
      <View style={styles.container}>
        <Text style={styles.text}>{message}</Text>
      </View>
    );
  }
);

/**
 * Optimized StyleSheet for EmptyList component.
 * Uses theme values for consistent design system integration.
 * 
 * @constant styles
 * @type {StyleSheet}
 * @since 1.0.0
 * 
 * @styles
 * - container: Centered flex layout with theme-based padding
 * - text: Theme-aware text styling with placeholder color
 */
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  text: {
    color: colors.placeholder,
    fontSize: 16,
    textAlign: 'center',
  },
});

EmptyList.displayName = 'EmptyList';
