/**
 * @file TimePicker mit react-native-date-picker Library
 */

import React, {useState, useCallback} from 'react';
import {TouchableOpacity, StyleProp, ViewStyle} from 'react-native';
import {Text} from 'react-native-paper';
// @ts-expect-error - Optional dependency
import DatePicker from 'react-native-date-picker';
import {colors} from '@core/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {styles} from './time-picker.style';

export interface RNTimePickerProps {
  /** Aktuell ausgewählte Zeit als String 'HH:mm' */
  value: string;
  /** Callback bei Änderung der Zeit - erhält String 'HH:mm' */
  onChange: (timeString: string) => void;
  /** Label für das Feld */
  label: string;
  /** Optionales Styling für den Container */
  style?: StyleProp<ViewStyle>;
  /** Zeigt Fehlerzustand an */
  hasError?: boolean;
  /** Basis Test-ID für Tester */
  testID?: string;
  /** Label für Screenreader */
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
