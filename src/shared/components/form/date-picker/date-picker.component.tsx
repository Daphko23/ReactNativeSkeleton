/**
 * @fileoverview DATE-PICKER-COMPONENT: Cross-Platform Date Selection
 * @description Robust date picker component with platform-specific implementations and ISO date handling
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Shared.Components.Form.DatePicker
 * @namespace Shared.Components.Form.DatePicker.DatePicker
 * @category Components
 * @subcategory Form
 */

import React, {useState, useCallback} from 'react';
import {
  TouchableOpacity,
  Platform,
  StyleProp,
  ViewStyle,
  Modal,
  View,
} from 'react-native';
import {Text, Button} from 'react-native-paper';
import DateTimePicker, {
  DateTimePickerEvent,
// @ts-expect-error - Optional dependency
} from '@react-native-community/datetimepicker';
import {colors} from '@core/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {styles} from './date-picker.style';
import {useTranslation} from 'react-i18next';

/**
 * Props interface for the DatePicker component.
 * Provides comprehensive configuration for cross-platform date selection.
 * 
 * @interface DatePickerProps
 * @since 1.0.0
 * @version 1.0.0
 * @category Props
 * @subcategory Components
 * 
 * @example
 * Basic date picker:
 * ```tsx
 * const datePickerProps: DatePickerProps = {
 *   value: '2024-01-15',
 *   onChange: (isoDate) => setSelectedDate(isoDate),
 *   label: 'Geburtsdatum'
 * };
 * ```
 * 
 * @example
 * Advanced date picker with error state:
 * ```tsx
 * const advancedProps: DatePickerProps = {
 *   value: birthDate,
 *   onChange: handleDateChange,
 *   label: 'Datum auswählen',
 *   hasError: !isValidDate(birthDate),
 *   testID: 'birth-date-picker',
 *   accessibilityLabel: 'Geburtsdatum auswählen'
 * };
 * ```
 */
export interface DatePickerProps {
  /**
   * Currently selected date as ISO string format 'YYYY-MM-DD'.
   * Ensures consistent date handling across platforms and locales.
   * 
   * @type {string}
   * @required
   * @format YYYY-MM-DD
   * @example "2024-01-15"
   */
  value: string;

  /**
   * Callback function executed when date changes.
   * Receives ISO string format 'YYYY-MM-DD' for consistency.
   * 
   * @type {(isoDate: string) => void}
   * @required
   * @param isoDate - Selected date in ISO format
   * @example (isoDate) => setSelectedDate(isoDate)
   */
  onChange: (isoDate: string) => void;

  /**
   * Display label for the date picker field.
   * Should be descriptive and localized.
   * 
   * @type {string}
   * @required
   * @example "Geburtsdatum"
   */
  label: string;

  /**
   * Optional custom styling for the container.
   * Merged with default styles.
   * 
   * @type {StyleProp<ViewStyle>}
   * @optional
   * @example { marginVertical: 10 }
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Indicates error state with visual feedback.
   * Changes border color to error color.
   * 
   * @type {boolean}
   * @optional
   * @default false
   * @example true
   */
  hasError?: boolean;

  /**
   * Base test identifier for automated testing.
   * Used for both container and picker elements.
   * 
   * @type {string}
   * @optional
   * @default "date-picker"
   * @example "birth-date-picker"
   */
  testID?: string;

  /**
   * Accessibility label for screen readers.
   * Falls back to label + " auswählen" if not provided.
   * 
   * @type {string}
   * @optional
   * @example "Geburtsdatum auswählen"
   */
  accessibilityLabel?: string;
}

/**
 * Formats ISO date string to German locale display format.
 * Converts YYYY-MM-DD to DD.MM.YYYY with validation.
 * 
 * @function formatDisplayDate
 * @param {string} isoDate - ISO date string to format
 * @returns {string} Formatted date or placeholder text
 * @since 1.0.0
 * 
 * @example
 * ```tsx
 * formatDisplayDate('2024-01-15'); // "15.01.2024"
 * formatDisplayDate('invalid'); // "Datum auswählen"
 * formatDisplayDate(''); // "Datum auswählen"
 * ```
 */
const formatDisplayDate = (isoDate: string): string => {
  if (!isoDate || !/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) {
    return 'Datum auswählen';
  }

  try {
    const [year, month, day] = isoDate.split('-');
    return `${day}.${month}.${year}`;
  } catch {
    return 'Datum auswählen';
  }
};

/**
 * Converts ISO date string to Date object with timezone safety.
 * Uses local time to avoid timezone-related issues.
 * 
 * @function createDateFromISO
 * @param {string} isoString - ISO date string to convert
 * @returns {Date} Date object or current date as fallback
 * @since 1.0.0
 * 
 * @example
 * ```tsx
 * createDateFromISO('2024-01-15'); // Date object for Jan 15, 2024
 * createDateFromISO('invalid'); // new Date() (today)
 * ```
 */
const createDateFromISO = (isoString: string): Date => {
  console.log('[DatePicker] Creating date from ISO:', isoString);

  if (!isoString || !/^\d{4}-\d{2}-\d{2}$/.test(isoString)) {
    const today = new Date();
    console.log('[DatePicker] Using today as fallback:', today.toDateString());
    return today;
  }

  try {
    // Verwende lokale Zeit, um Zeitzone-Probleme zu vermeiden
    const [year, month, day] = isoString.split('-').map(Number);
    const date = new Date(year, month - 1, day, 12, 0, 0, 0);
    console.log('[DatePicker] Created date:', date.toDateString());
    return date;
  } catch (error) {
    console.error('[DatePicker] Error creating date:', error);
    return new Date();
  }
};

/**
 * Converts Date object to ISO date string format.
 * Ensures consistent YYYY-MM-DD format output.
 * 
 * @function formatDateToISO
 * @param {Date} date - Date object to convert
 * @returns {string} ISO date string or empty string for invalid dates
 * @since 1.0.0
 * 
 * @example
 * ```tsx
 * formatDateToISO(new Date(2024, 0, 15)); // "2024-01-15"
 * formatDateToISO(new Date('invalid')); // ""
 * ```
 */
const formatDateToISO = (date: Date): string => {
  if (!date || isNaN(date.getTime())) {
    console.error('[DatePicker] Invalid date for conversion');
    return '';
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const isoString = `${year}-${month}-${day}`;

  console.log(
    '[DatePicker] Converted to ISO:',
    date.toDateString(),
    '->',
    isoString
  );
  return isoString;
};

/**
 * Date Picker Component
 * 
 * A robust, cross-platform date picker component that provides consistent functionality
 * across iOS and Android platforms. Uses native DateTimePicker with platform-specific
 * modal implementations and handles ISO date strings for reliable data handling.
 * 
 * @component
 * @function DatePicker
 * @param {DatePickerProps} props - The component props
 * @returns {React.ReactElement} Rendered date picker component
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Components
 * @subcategory Form
 * @module Shared.Components.Form.DatePicker
 * @namespace Shared.Components.Form.DatePicker.DatePicker
 * 
 * @example
 * Basic usage in a form:
 * ```tsx
 * import { DatePicker } from '@/shared/components/form/date-picker';
 * 
 * const UserProfileForm = () => {
 *   const [birthDate, setBirthDate] = useState<string>('');
 *   const [errors, setErrors] = useState<Record<string, boolean>>({});
 * 
 *   const handleDateChange = (isoDate: string) => {
 *     setBirthDate(isoDate);
 *     if (errors.birthDate) {
 *       setErrors(prev => ({ ...prev, birthDate: false }));
 *     }
 *   };
 * 
 *   return (
 *     <View style={styles.form}>
 *       <DatePicker
 *         label="Geburtsdatum"
 *         value={birthDate}
 *         onChange={handleDateChange}
 *         hasError={errors.birthDate}
 *         testID="birth-date"
 *       />
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * Event date selection with validation:
 * ```tsx
 * const EventForm = () => {
 *   const [eventDate, setEventDate] = useState<string>('');
 *   const [isDateValid, setIsDateValid] = useState(true);
 * 
 *   const validateDate = (isoDate: string) => {
 *     const selectedDate = new Date(isoDate);
 *     const today = new Date();
 *     const isValid = selectedDate >= today;
 *     setIsDateValid(isValid);
 *     return isValid;
 *   };
 * 
 *   const handleEventDateChange = (isoDate: string) => {
 *     setEventDate(isoDate);
 *     validateDate(isoDate);
 *   };
 * 
 *   return (
 *     <DatePicker
 *       label="Veranstaltungsdatum"
 *       value={eventDate}
 *       onChange={handleEventDateChange}
 *       hasError={!isDateValid}
 *       style={styles.eventDatePicker}
 *       accessibilityLabel="Datum der Veranstaltung auswählen"
 *     />
 *   );
 * };
 * ```
 * 
 * @example
 * Date range picker (start date):
 * ```tsx
 * const DateRangePicker = () => {
 *   const [startDate, setStartDate] = useState<string>('');
 *   const [endDate, setEndDate] = useState<string>('');
 * 
 *   const handleStartDateChange = (isoDate: string) => {
 *     setStartDate(isoDate);
 *     // Clear end date if it's before start date
 *     if (endDate && isoDate > endDate) {
 *       setEndDate('');
 *     }
 *   };
 * 
 *   return (
 *     <View style={styles.dateRange}>
 *       <DatePicker
 *         label="Startdatum"
 *         value={startDate}
 *         onChange={handleStartDateChange}
 *         testID="start-date"
 *         style={styles.startDatePicker}
 *       />
 *       <DatePicker
 *         label="Enddatum"
 *         value={endDate}
 *         onChange={setEndDate}
 *         testID="end-date"
 *         style={styles.endDatePicker}
 *       />
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * Integration with form validation library:
 * ```tsx
 * const ValidatedForm = () => {
 *   const { control, handleSubmit, formState: { errors } } = useForm();
 * 
 *   return (
 *     <View>
 *       <Controller
 *         name="appointmentDate"
 *         control={control}
 *         rules={{ required: 'Datum ist erforderlich' }}
 *         render={({ field: { onChange, value } }) => (
 *           <DatePicker
 *             label="Termin"
 *             value={value || ''}
 *             onChange={onChange}
 *             hasError={!!errors.appointmentDate}
 *             testID="appointment-date"
 *           />
 *         )}
 *       />
 *     </View>
 *   );
 * };
 * ```
 * 
 * @features
 * - Cross-platform compatibility (iOS/Android)
 * - ISO date string handling for consistency
 * - Platform-specific UI implementations
 * - Error state visualization
 * - Accessibility support
 * - Internationalization ready
 * - Touch-friendly interface
 * - Calendar icon indicator
 * - Modal presentation on iOS
 * - Native dialog on Android
 * - Comprehensive logging for debugging
 * - Timezone-safe date handling
 * 
 * @architecture
 * - Platform-specific rendering logic
 * - React hooks for state management
 * - Memoized date conversion functions
 * - Callback-based change handling
 * - Modal wrapper for iOS
 * - Native picker integration
 * - Theme system integration
 * - Style composition pattern
 * 
 * @styling
 * - Material Design principles
 * - Theme-aware colors
 * - Error state styling
 * - Consistent input height
 * - Icon alignment
 * - Modal overlay styling
 * - Platform-specific adjustments
 * 
 * @accessibility
 * - Screen reader support
 * - Descriptive labels
 * - Touch target optimization
 * - Keyboard navigation (where supported)
 * - High contrast compatibility
 * - Proper semantic roles
 * 
 * @performance
 * - Memoized date calculations
 * - Efficient re-render handling
 * - Optimized modal presentation
 * - Minimal state updates
 * - Debug logging (development only)
 * 
 * @platform_differences
 * - Android: Native dialog picker
 * - iOS: Modal with spinner picker
 * - Different button layouts per platform
 * - Platform-specific styling adjustments
 * 
 * @use_cases
 * - Birth date selection
 * - Event scheduling
 * - Appointment booking
 * - Date range filtering
 * - Deadline setting
 * - Historical date entry
 * - Future date planning
 * - Form date inputs
 * 
 * @best_practices
 * - Use ISO date strings for data consistency
 * - Validate dates based on business rules
 * - Provide clear error feedback
 * - Test on both platforms
 * - Consider timezone implications
 * - Use descriptive labels
 * - Handle edge cases gracefully
 * - Follow platform conventions
 * 
 * @dependencies
 * - react: Core React hooks and components
 * - react-native: Platform components and utilities
 * - react-native-paper: Material Design components
 * - @react-native-community/datetimepicker: Native date picker
 * - react-native-vector-icons: Icon components
 * - react-i18next: Internationalization
 * - @core/theme: Design system values
 * 
 * @see {@link formatDisplayDate} for date formatting utility
 * @see {@link createDateFromISO} for ISO to Date conversion
 * @see {@link formatDateToISO} for Date to ISO conversion
 * 
 * @todo Add time selection mode
 * @todo Implement date range restrictions
 * @todo Add custom date format options
 * @todo Include haptic feedback
 */
export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  label,
  style,
  hasError = false,
  testID = 'date-picker',
  accessibilityLabel,
}) => {
  const {t} = useTranslation();
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Konvertiere den aktuellen Wert zu Date
  const currentDate = React.useMemo(() => createDateFromISO(value), [value]);

  // Handler für DateTimePicker
  const handleDateChange = useCallback(
    (event: DateTimePickerEvent, date?: Date) => {
      console.log(
        '[DatePicker] Event:',
        event.type,
        'Date:',
        date?.toDateString()
      );

      if (Platform.OS === 'android') {
        // Android: Picker wird automatisch geschlossen
        setShowPicker(false);

        // Nur bei "set" das Datum übernehmen
        if (event.type === 'set' && date && !isNaN(date.getTime())) {
          const newISO = formatDateToISO(date);
          console.log('[DatePicker] Android - New ISO:', newISO);
          onChange(newISO);
        }
      } else {
        // iOS: Speichere das ausgewählte Datum im lokalen State
        if (date && !isNaN(date.getTime())) {
          console.log(
            '[DatePicker] iOS - Updating selectedDate:',
            date.toDateString()
          );
          setSelectedDate(date);
        }
      }
    },
    [onChange]
  );

  // Öffnet den DatePicker
  const openPicker = useCallback(() => {
    console.log('[DatePicker] Opening picker with:', value);
    setSelectedDate(currentDate); // Initialisiere selectedDate mit dem aktuellen Wert
    setShowPicker(true);
  }, [value, currentDate]);

  // Schließt den Picker ohne Änderung (iOS Cancel)
  const cancelPicker = useCallback(() => {
    console.log('[DatePicker] Cancelling picker');
    setShowPicker(false);
    setSelectedDate(null);
  }, []);

  // Bestätigt die Auswahl (iOS Confirm)
  const confirmPicker = useCallback(() => {
    if (selectedDate && !isNaN(selectedDate.getTime())) {
      const newISO = formatDateToISO(selectedDate);
      console.log('[DatePicker] iOS - Confirming with ISO:', newISO);
      onChange(newISO);
    } else {
      console.warn('[DatePicker] No valid date selected for confirmation');
    }
    setShowPicker(false);
    setSelectedDate(null);
  }, [selectedDate, onChange]);

  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.container, hasError && styles.errorContainer, style]}
        onPress={openPicker}
        testID={testID}
        accessibilityLabel={accessibilityLabel || `${label} auswählen`}>
        <Text style={styles.dateText}>{formatDisplayDate(value)}</Text>
        <Ionicons name="calendar" size={20} color={colors.primary} />
      </TouchableOpacity>

      {/* Android: DateTimePicker wird als nativer Dialog angezeigt */}
      {Platform.OS === 'android' && showPicker && (
        <DateTimePicker
          testID={`${testID}-picker`}
          value={currentDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {/* iOS: DateTimePicker in einem Modal */}
      {Platform.OS === 'ios' && showPicker && (
        <Modal
          visible={showPicker}
          transparent
          animationType="slide"
          onRequestClose={cancelPicker}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {t('shared.datePicker.selectDate', {defaultValue: 'Datum wählen'})}
              </Text>

              <DateTimePicker
                testID={`${testID}-picker`}
                value={selectedDate || currentDate}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                style={styles.datePickerIOS}
              />

              <View style={styles.modalButtonContainer}>
                <Button
                  mode="outlined"
                  onPress={cancelPicker}
                  style={styles.confirmButton}>
                  {t('common.cancel', {defaultValue: 'Abbrechen'})}
                </Button>
                <Button mode="contained" onPress={confirmPicker}>
                  {t('shared.datePicker.confirm', {defaultValue: 'Bestätigen'})}
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};
