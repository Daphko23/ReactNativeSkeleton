/**
 * @fileoverview RN-TIME-PICKER-COMPONENT: Modern Time Selection Component
 * @description Enhanced time picker using react-native-date-picker library for superior UX
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Shared.Components.Form.TimePicker
 * @namespace Shared.Components.Form.TimePicker.RNTimePicker
 * @category Components
 * @subcategory Form
 */

import React, {useState, useCallback} from 'react';
import {TouchableOpacity, StyleProp, ViewStyle} from 'react-native';
import {Text} from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import {colors} from '@core/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {styles} from './time-picker.style';

/**
 * Props interface for the RNTimePicker component.
 * Modern interface for enhanced time selection functionality.
 * 
 * @interface RNTimePickerProps
 * @since 1.0.0
 * @version 1.0.0
 * @category Props
 * @subcategory Components
 * 
 * @example
 * Basic time picker:
 * ```tsx
 * const timePickerProps: RNTimePickerProps = {
 *   value: '14:30',
 *   onChange: (time) => setSelectedTime(time),
 *   label: 'Startzeit'
 * };
 * ```
 */
export interface RNTimePickerProps {
  /**
   * Currently selected time as string in HH:mm format.
   * 24-hour format for consistency and clarity.
   * 
   * @type {string}
   * @required
   * @format HH:mm
   * @example "14:30"
   */
  value: string;

  /**
   * Callback function executed when time changes.
   * Receives time string in HH:mm format.
   * 
   * @type {(timeString: string) => void}
   * @required
   * @param timeString - Selected time in HH:mm format
   * @example (timeString) => setSelectedTime(timeString)
   */
  onChange: (timeString: string) => void;

  /**
   * Display label for the time picker field.
   * Should be descriptive and localized.
   * 
   * @type {string}
   * @required
   * @example "Startzeit"
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
   * @default "rn-time-picker"
   * @example "appointment-time-picker"
   */
  testID?: string;

  /**
   * Accessibility label for screen readers.
   * Falls back to label + " auswählen" if not provided.
   * 
   * @type {string}
   * @optional
   * @example "Startzeit auswählen"
   */
  accessibilityLabel?: string;
}

/**
 * Formatiert eine Zeit (HH:mm) in lokales Format (HH:mm)
 */
const formatDisplayTime = (timeString: string): string => {
  if (!timeString || !/^\d{2}:\d{2}$/.test(timeString)) {
    return 'Zeit auswählen';
  }
  return timeString;
};

/**
 * Konvertiert Zeit-String (HH:mm) zu Date-Objekt
 */
const timeToDate = (timeString: string): Date => {
  console.log('[RNTimePicker] Converting time to Date:', timeString);

  if (!timeString || !/^\d{2}:\d{2}$/.test(timeString)) {
    const now = new Date();
    console.log('[RNTimePicker] Invalid time, using now:', now.toTimeString());
    return now;
  }

  try {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    console.log('[RNTimePicker] Created date:', date.toTimeString());
    return date;
  } catch (error) {
    console.error('[RNTimePicker] Error creating date:', error);
    return new Date();
  }
};

/**
 * Konvertiert Date-Objekt zu Zeit-String (HH:mm)
 */
const dateToTime = (date: Date): string => {
  if (!date || isNaN(date.getTime())) {
    console.error('[RNTimePicker] Invalid date for conversion');
    return '';
  }

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const timeString = `${hours}:${minutes}`;

  console.log(
    '[RNTimePicker] Converted to time:',
    date.toTimeString(),
    '->',
    timeString
  );
  return timeString;
};

/**
 * TimePicker mit react-native-date-picker - funktioniert zuverlässig auf beiden Plattformen
 */
export const RNTimePicker: React.FC<RNTimePickerProps> = ({
  value,
  onChange,
  label,
  style,
  hasError = false,
  testID = 'rn-time-picker',
  accessibilityLabel,
}) => {
  const [open, setOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState(value);

  // Aktualisiere die Anzeige wenn sich value ändert
  React.useEffect(() => {
    console.log('[RNTimePicker] Value changed to:', value);
    setDisplayValue(value);
  }, [value]);

  // Konvertiere den aktuellen Wert zu Date
  const currentDate = React.useMemo(
    () => timeToDate(displayValue),
    [displayValue]
  );

  // Öffnet den TimePicker
  const openPicker = useCallback(() => {
    console.log('[RNTimePicker] Opening picker with value:', displayValue);
    setOpen(true);
  }, [displayValue]);

  // Handler für Zeit-Bestätigung
  const handleConfirm = useCallback(
    (selectedDate: Date) => {
      console.log(
        '[RNTimePicker] Time confirmed:',
        selectedDate.toTimeString()
      );
      const newTime = dateToTime(selectedDate);
      console.log('[RNTimePicker] New time:', newTime);
      setDisplayValue(newTime);
      onChange(newTime);
      setOpen(false);
    },
    [onChange]
  );

  // Handler für Abbruch
  const handleCancel = useCallback(() => {
    console.log('[RNTimePicker] Time selection cancelled');
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
        <Text style={styles.timeText}>{formatDisplayTime(displayValue)}</Text>
        <Ionicons name="time" size={20} color={colors.primary} />
      </TouchableOpacity>

      {/* react-native-date-picker Modal */}
      <DatePicker
        modal
        open={open}
        date={currentDate}
        mode="time"
        locale="de"
        title="Zeit auswählen"
        confirmText="Bestätigen"
        cancelText="Abbrechen"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
};
