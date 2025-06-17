/**
 * @fileoverview DATE-FILTER-COMPONENT: Date Selection Filter Interface
 * @description Interactive date filter component with label and button for date selection in filtering contexts
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Shared.Components.Filter
 * @namespace Shared.Components.Filter.DateFilter
 * @category Components
 * @subcategory Filter
 */

import React, {memo} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, Button} from 'react-native-paper';
import {colors, spacing, typography} from '@core/theme';

/**
 * Props interface for the DateFilter component.
 * Provides configuration for date selection filtering with styling options.
 * 
 * @interface DateFilterProps
 * @since 1.0.0
 * @version 1.0.0
 * @category Props
 * @subcategory Components
 * 
 * @example
 * Basic date filter:
 * ```tsx
 * const dateFilterProps: DateFilterProps = {
 *   label: 'Datum auswählen',
 *   value: '2024-01-15',
 *   onPress: () => openDatePicker()
 * };
 * ```
 * 
 * @example
 * Empty date filter:
 * ```tsx
 * const emptyDateProps: DateFilterProps = {
 *   label: 'Startdatum',
 *   onPress: handleDateSelection
 * };
 * ```
 */
interface DateFilterProps {
  /**
   * Display label for the filter.
   * Should be descriptive and localized.
   * 
   * @type {string}
   * @required
   * @example "Datum auswählen"
   */
  label: string;

  /**
   * Current date value as ISO string.
   * When provided, displays formatted date; otherwise shows placeholder.
   * 
   * @type {string}
   * @optional
   * @format ISO-8601 date string
   * @example "2024-01-15T00:00:00.000Z"
   */
  value?: string;

  /**
   * Callback function executed when filter is pressed.
   * Typically opens a date picker or calendar interface.
   * 
   * @type {() => void}
   * @required
   * @example () => setDatePickerVisible(true)
   */
  onPress: () => void;

  /**
   * Optional custom styling for the filter container.
   * Merged with default styles.
   * 
   * @type {object}
   * @optional
   * @example { marginVertical: 10 }
   */
  style?: object;
}

/**
 * Date Filter Component
 * 
 * An interactive date filter component that displays a label and button for date selection.
 * Formats selected dates for display and provides a consistent interface for date-based
 * filtering in lists and search interfaces.
 * 
 * @component
 * @function DateFilter
 * @param {DateFilterProps} props - The component props
 * @returns {React.ReactElement} Rendered date filter component
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Components
 * @subcategory Filter
 * @module Shared.Components.Filter
 * @namespace Shared.Components.Filter.DateFilter
 * 
 * @example
 * Basic usage in a filter bar:
 * ```tsx
 * import { DateFilter } from '@/shared/components/filter';
 * 
 * const MatchdayFilters = () => {
 *   const [startDate, setStartDate] = useState<string>();
 *   const [endDate, setEndDate] = useState<string>();
 *   const [showDatePicker, setShowDatePicker] = useState(false);
 * 
 *   return (
 *     <View style={styles.filterContainer}>
 *       <DateFilter
 *         label="Startdatum"
 *         value={startDate}
 *         onPress={() => setShowDatePicker(true)}
 *       />
 *       <DateFilter
 *         label="Enddatum"
 *         value={endDate}
 *         onPress={() => setShowDatePicker(true)}
 *       />
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * With date picker integration:
 * ```tsx
 * const EventDateFilter = () => {
 *   const [selectedDate, setSelectedDate] = useState<string>();
 *   const [pickerVisible, setPickerVisible] = useState(false);
 * 
 *   const handleDateConfirm = (date: Date) => {
 *     setSelectedDate(date.toISOString());
 *     setPickerVisible(false);
 *   };
 * 
 *   return (
 *     <>
 *       <DateFilter
 *         label="Veranstaltungsdatum"
 *         value={selectedDate}
 *         onPress={() => setPickerVisible(true)}
 *       />
 *       <DateTimePickerModal
 *         isVisible={pickerVisible}
 *         mode="date"
 *         onConfirm={handleDateConfirm}
 *         onCancel={() => setPickerVisible(false)}
 *       />
 *     </>
 *   );
 * };
 * ```
 * 
 * @example
 * Multiple date filters with state management:
 * ```tsx
 * const DateRangeFilter = () => {
 *   const [dateRange, setDateRange] = useState({
 *     start: undefined as string | undefined,
 *     end: undefined as string | undefined
 *   });
 *   const [activeFilter, setActiveFilter] = useState<'start' | 'end' | null>(null);
 * 
 *   const handleDateSelection = (type: 'start' | 'end') => {
 *     setActiveFilter(type);
 *     // Open date picker logic
 *   };
 * 
 *   return (
 *     <View style={styles.dateRangeContainer}>
 *       <DateFilter
 *         label="Von"
 *         value={dateRange.start}
 *         onPress={() => handleDateSelection('start')}
 *         style={styles.startDateFilter}
 *       />
 *       <DateFilter
 *         label="Bis"
 *         value={dateRange.end}
 *         onPress={() => handleDateSelection('end')}
 *         style={styles.endDateFilter}
 *       />
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * With custom styling and validation:
 * ```tsx
 * const ValidatedDateFilter = () => {
 *   const [date, setDate] = useState<string>();
 *   const [error, setError] = useState<string>();
 * 
 *   const handleDatePress = () => {
 *     if (error) {
 *       setError(undefined);
 *     }
 *     openDatePicker();
 *   };
 * 
 *   return (
 *     <DateFilter
 *       label="Geburtsdatum"
 *       value={date}
 *       onPress={handleDatePress}
 *       style={[
 *         styles.dateFilter,
 *         error && styles.errorStyle
 *       ]}
 *     />
 *   );
 * };
 * ```
 * 
 * @features
 * - ISO date string handling
 * - Automatic date formatting for display
 * - Placeholder display for empty state
 * - Material Design button integration
 * - Theme-aware styling
 * - Flexible container styling
 * - Performance optimized with React.memo
 * - Accessibility compliant
 * - Responsive design
 * - DevTools-friendly display name
 * 
 * @architecture
 * - React.memo wrapper for performance optimization
 * - Material Design button component
 * - StyleSheet for optimized styling
 * - Theme system integration
 * - Functional component pattern
 * - Props-based configuration
 * 
 * @styling
 * - Theme-aware colors and typography
 * - Consistent spacing using design system
 * - Outlined button style for clarity
 * - Flexible container layout
 * - Responsive text and button sizing
 * - Material Design visual language
 * 
 * @accessibility
 * - Proper button role for interaction
 * - Screen reader compatible text
 * - Touch target optimization
 * - High contrast support
 * - Keyboard navigation support
 * 
 * @performance
 * - React.memo prevents unnecessary re-renders
 * - StyleSheet creates optimized style objects
 * - Minimal component footprint
 * - Efficient date formatting
 * - Optimized prop comparison
 * 
 * @use_cases
 * - Event date filtering
 * - Date range selection start/end
 * - Appointment scheduling filters
 * - Content publication date filters
 * - Analytics date range selectors
 * - Form date input alternatives
 * - Search date parameters
 * - Booking date selection
 * 
 * @best_practices
 * - Use ISO date strings for value prop
 * - Provide clear, descriptive labels
 * - Handle empty states gracefully
 * - Integrate with proper date picker modals
 * - Consider date validation requirements
 * - Test across different locales
 * - Ensure proper timezone handling
 * - Follow platform date conventions
 * 
 * @dependencies
 * - react: Core React library for memo
 * - react-native: Native components (View, StyleSheet)
 * - react-native-paper: Material Design components
 * - @core/theme: Design system values
 * 
 * @see {@link colors} for theme color system
 * @see {@link spacing} for spacing constants
 * @see {@link typography} for text styling
 * 
 * @todo Add built-in date picker modal option
 * @todo Implement date range validation
 * @todo Add localization for date formatting
 * @todo Include icon support for visual enhancement
 */
export const DateFilter = memo<DateFilterProps>(
  ({label, value, onPress, style}) => (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>
      <Button
        mode="outlined"
        onPress={onPress}
        style={styles.button}
        labelStyle={styles.buttonText}>
        {value ? new Date(value).toLocaleDateString() : '-- -- --'}
      </Button>
    </View>
  )
);

/**
 * Optimized StyleSheet for DateFilter component.
 * Uses theme values for consistent design system integration.
 * 
 * @constant styles
 * @type {StyleSheet}
 * @since 1.0.0
 * 
 * @styles
 * - container: Flexible layout with spacing
 * - label: Theme-aware label styling
 * - button: Outlined button with theme colors
 * - buttonText: Consistent text color
 */
const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.background,
    borderColor: colors.border,
  },
  buttonText: {
    color: colors.text,
  },
  container: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  label: {
    color: colors.text,
    marginBottom: spacing.xs,
    ...typography.labelText.medium,
  },
});

// Expliziter Display-Name für DevTools
DateFilter.displayName = 'DateFilter';
