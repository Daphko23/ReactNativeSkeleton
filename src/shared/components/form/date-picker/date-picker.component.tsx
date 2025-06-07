/**
 * @file Funktionierende DatePicker-Komponente für beide Plattformen
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

export interface DatePickerProps {
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
    return `${day}.${month}.${year}`;
  } catch {
    return 'Datum auswählen';
  }
};

/**
 * Konvertiert ISO-String (YYYY-MM-DD) zu Date-Objekt
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
 * Konvertiert Date-Objekt zu ISO-String (YYYY-MM-DD)
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
 * Einfache und zuverlässige DatePicker-Komponente
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
