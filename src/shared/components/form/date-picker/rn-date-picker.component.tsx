/**
 * @fileoverview RN-DATE-PICKER-COMPONENT: Alternative Date Picker Implementation
 * @description Alternative date picker using react-native-date-picker library for enhanced UX
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Shared.Components.Form.DatePicker
 * @namespace Shared.Components.Form.DatePicker.RNDatePicker
 * @category Components
 * @subcategory Form
 */

import React, {useState, useCallback} from 'react';
import {TouchableOpacity, StyleProp, ViewStyle} from 'react-native';
import {Text} from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import {colors} from '@core/theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {styles} from './date-picker.style';

/**
 * Props interface for the RNDatePicker component.
 * Extended interface with custom formatting support.
 * 
 * @interface RNDatePickerProps
 * @since 1.0.0
 * @version 1.0.0
 * @category Props
 * @subcategory Components
 * 
 * @example
 * Basic RN date picker:
 * ```tsx
 * const rnDatePickerProps: RNDatePickerProps = {
 *   value: '2024-01-15',
 *   onChange: (isoDate) => setDate(isoDate),
 *   label: 'Auswählen'
 * };
 * ```
 */
export interface RNDatePickerProps {
  /**
   * Currently selected date as ISO string format 'YYYY-MM-DD'.
   * 
   * @type {string}
   * @required
   * @format YYYY-MM-DD
   * @example "2024-01-15"
   */
  value: string;

  /**
   * Callback function executed when date changes.
   * 
   * @type {(isoDate: string) => void}
   * @required
   * @param isoDate - Selected date in ISO format
   * @example (isoDate) => setSelectedDate(isoDate)
   */
  onChange: (isoDate: string) => void;

  /**
   * Display label for the date picker field.
   * 
   * @type {string}
   * @required
   * @example "Geburtsdatum"
   */
  label: string;

  /**
   * Optional custom styling for the container.
   * 
   * @type {StyleProp<ViewStyle>}
   * @optional
   * @example { marginVertical: 10 }
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Indicates error state with visual feedback.
   * 
   * @type {boolean}
   * @optional
   * @default false
   * @example true
   */
  hasError?: boolean;

  /**
   * Base test identifier for automated testing.
   * 
   * @type {string}
   * @optional
   * @default "rn-date-picker"
   * @example "custom-date-picker"
   */
  testID?: string;

  /**
   * Accessibility label for screen readers.
   * 
   * @type {string}
   * @optional
   * @example "Datum auswählen"
   */
  accessibilityLabel?: string;

  /**
   * Optional custom date formatting function.
   * Override default German format.
   * 
   * @type {(dateString: string) => string}
   * @optional
   * @param dateString - ISO date string to format
   * @returns Formatted date string
   * @example (date) => new Date(date).toLocaleDateString('en-US')
   */
  formatDate?: (dateString: string) => string;
}

/**
 * Formatiert ein ISO-Datum (YYYY-MM-DD) in lokales Format (DD.MM.YYYY)
 */
const formatDisplayDate = (isoDate: string): string => {
  if (!isoDate || !/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) {
    return 'Datum auswählen';
  }

  try {
    const [year, month, day] = isoDate.split('-');
    const monthNames = [
      'Januar',
      'Februar',
      'März',
      'April',
      'Mai',
      'Juni',
      'Juli',
      'August',
      'September',
      'Oktober',
      'November',
      'Dezember',
    ];
    return `${parseInt(day, 10)}. ${monthNames[parseInt(month, 10) - 1]} ${year}`;
  } catch {
    return 'Datum auswählen';
  }
};

/**
 * Konvertiert ISO-String (YYYY-MM-DD) zu Date-Objekt
 */
const isoToDate = (isoString: string): Date => {
  console.log('[RNDatePicker] Converting ISO to Date:', isoString);

  if (!isoString || !/^\d{4}-\d{2}-\d{2}$/.test(isoString)) {
    const today = new Date();
    console.log(
      '[RNDatePicker] Invalid ISO, using today:',
      today.toDateString()
    );
    return today;
  }

  try {
    // Verwende lokale Zeit, um Zeitzone-Probleme zu vermeiden
    const [year, month, day] = isoString.split('-').map(Number);
    const date = new Date(year, month - 1, day, 12, 0, 0, 0);
    console.log('[RNDatePicker] Created date:', date.toDateString());
    return date;
  } catch (error) {
    console.error('[RNDatePicker] Error creating date:', error);
    return new Date();
  }
};

/**
 * Konvertiert Date-Objekt zu ISO-String (YYYY-MM-DD)
 */
const dateToISO = (date: Date): string => {
  if (!date || isNaN(date.getTime())) {
    console.error('[RNDatePicker] Invalid date for conversion');
    return '';
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const isoString = `${year}-${month}-${day}`;

  console.log(
    '[RNDatePicker] Converted to ISO:',
    date.toDateString(),
    '->',
    isoString
  );
  return isoString;
};

/**
 * DatePicker mit react-native-date-picker - funktioniert zuverlässig auf beiden Plattformen
 */
export const RNDatePicker: React.FC<RNDatePickerProps> = ({
  value,
  onChange,
  label,
  style,
  hasError = false,
  testID = 'rn-date-picker',
  accessibilityLabel,
  formatDate,
}) => {
  const [open, setOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState(value);

  // Aktualisiere die Anzeige wenn sich value ändert
  React.useEffect(() => {
    console.log('[RNDatePicker] Value changed to:', value);
    setDisplayValue(value);
  }, [value]);

  // Konvertiere den aktuellen Wert zu Date
  const currentDate = React.useMemo(
    () => isoToDate(displayValue),
    [displayValue]
  );

  // Öffnet den DatePicker
  const openPicker = useCallback(() => {
    console.log('[RNDatePicker] Opening picker with value:', displayValue);
    setOpen(true);
  }, [displayValue]);

  // Handler für Datum-Bestätigung
  const handleConfirm = useCallback(
    (selectedDate: Date) => {
      console.log(
        '[RNDatePicker] Date confirmed:',
        selectedDate.toDateString()
      );
      const newISO = dateToISO(selectedDate);
      console.log('[RNDatePicker] New ISO:', newISO);
      setDisplayValue(newISO);
      onChange(newISO);
      setOpen(false);
    },
    [onChange]
  );

  // Handler für Abbruch
  const handleCancel = useCallback(() => {
    console.log('[RNDatePicker] Date selection cancelled');
    setOpen(false);
  }, []);

  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.container, hasError && styles.errorContainer, style]}
        onPress={openPicker}
        testID={testID}
        accessibilityLabel={accessibilityLabel || `${label} auswählen`}>
        <Text style={styles.dateText}>
          {formatDate
            ? formatDate(displayValue)
            : formatDisplayDate(displayValue)}
        </Text>
        <Ionicons name="calendar" size={20} color={colors.primary} />
      </TouchableOpacity>

      {/* react-native-date-picker Modal */}
      <DatePicker
        modal
        open={open}
        date={currentDate}
        mode="date"
        locale="de"
        title="Datum auswählen"
        confirmText="Bestätigen"
        cancelText="Abbrechen"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
};
