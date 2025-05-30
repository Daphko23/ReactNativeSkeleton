/**
 * @file DatePicker mit react-native-date-picker Library
 */

import React, {useState, useCallback} from 'react';
import {TouchableOpacity, StyleProp, ViewStyle} from 'react-native';
import {Text} from 'react-native-paper';
// @ts-expect-error - Optional dependency
import DatePicker from 'react-native-date-picker';
import {colors} from '@core/theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {styles} from './date-picker.style';

export interface RNDatePickerProps {
  /** Aktuell ausgewähltes Datum als ISO-String 'YYYY-MM-DD' */
  value: string;
  /** Callback bei Änderung des Datums - erhält ISO-String 'YYYY-MM-DD' */
  onChange: (isoDate: string) => void;
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
  /** Optional: Funktion zum Formatieren des Datums */
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
