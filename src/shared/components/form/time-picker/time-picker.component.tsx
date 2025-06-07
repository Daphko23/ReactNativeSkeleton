/**
 * @file Legacy-Zeitauswahl-Komponente für Formulare (VERALTET).
 * @deprecated Bitte die direkte Implementation in der Formular-Komponente verwenden
 */

import React, {useState, useEffect, useCallback} from 'react';
import {
  TouchableOpacity,
  Platform,
  Modal,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {Text, Button} from 'react-native-paper';
import DateTimePicker, {
  DateTimePickerEvent,
// @ts-expect-error - Optional dependency
} from '@react-native-community/datetimepicker';
import {useTranslation} from 'react-i18next';
import {colors} from '@core/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {styles} from './time-picker.styles';

export interface TimePickerProps {
  /** Aktuell ausgewählte Zeit im Format 'HH:mm' */
  value: string;
  /** Callback bei Änderung der Zeit */
  onChange: (time: string) => void;
  /** Label für das Feld */
  label: string;
  /** Optionales Styling */
  style?: StyleProp<ViewStyle>;
  /** Zeigt Fehlerzustand an */
  hasError?: boolean;
  /** Basis Test-ID */
  testID?: string;
  /** Label für Screenreader */
  accessibilityLabel?: string;
}

/**
 * Veraltete Zeitauswahl-Komponente für Formulare mit nativer Plattform-Integration.
 * @deprecated Bitte die direkte Implementation in der Formular-Komponente verwenden
 */
export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  label,
  style,
  hasError = false,
  testID,
  accessibilityLabel,
}) => {
  const {t} = useTranslation();
  const [open, setOpen] = useState(false);
  const [tempTime, setTempTime] = useState<Date>(() => {
    const date = new Date();
    if (value && value.includes(':')) {
      const [hours, minutes] = value.split(':').map(n => parseInt(n, 10));
      date.setHours(hours, minutes, 0, 0);
    }
    return date;
  });

  useEffect(() => {
    if (value && value.includes(':')) {
      const [hours, minutes] = value.split(':').map(n => parseInt(n, 10));
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      setTempTime(date);
    }
  }, [value]);

  const displayValue =
    value || t('shared.timePicker.placeholder', {defaultValue: 'Zeit wählen'});

  const openPicker = useCallback(() => setOpen(true), []);
  const cancelPicker = useCallback(() => setOpen(false), []);
  const confirmPicker = useCallback(() => {
    const hours = tempTime.getHours().toString().padStart(2, '0');
    const minutes = tempTime.getMinutes().toString().padStart(2, '0');
    onChange(`${hours}:${minutes}`);
    setOpen(false);
  }, [tempTime, onChange]);

  const onAndroidChange = useCallback(
    (e: DateTimePickerEvent, d?: Date) => {
      setOpen(false);
      if (e.type === 'set' && d) {
        const hours = d.getHours().toString().padStart(2, '0');
        const minutes = d.getMinutes().toString().padStart(2, '0');
        onChange(`${hours}:${minutes}`);
      }
    },
    [onChange]
  );

  const onIOSChange = useCallback((_: DateTimePickerEvent, d?: Date) => {
    if (d) setTempTime(d);
  }, []);

  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.container, hasError && styles.errorContainer, style]}
        onPress={openPicker}
        testID={testID}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button">
        <Text style={styles.timeText}>{displayValue}</Text>
        <Ionicons name="time" size={20} color={colors.primary} />
      </TouchableOpacity>

      {Platform.OS === 'android' && open && (
        <DateTimePicker
          value={tempTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onAndroidChange}
          testID={testID ? `${testID}-native` : undefined}
        />
      )}

      {Platform.OS === 'ios' && (
        <Modal
          visible={open}
          transparent
          animationType="slide"
          testID={testID ? `${testID}-modal` : undefined}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {t('shared.timePicker.title', {defaultValue: 'Zeit wählen'})}
              </Text>
              <View style={styles.pickerContainer}>
                <DateTimePicker
                  value={tempTime}
                  mode="time"
                  is24Hour={true}
                  display="spinner"
                  onChange={onIOSChange}
                  style={styles.picker}
                  testID={testID ? `${testID}-native` : undefined}
                />
              </View>
              <View style={styles.modalButtonContainer}>
                <Button
                  mode="outlined"
                  onPress={cancelPicker}
                  testID={testID ? `${testID}-cancel` : undefined}>
                  <Text>{t('common.cancel', {defaultValue: 'Abbrechen'})}</Text>
                </Button>
                <Button
                  mode="contained"
                  onPress={confirmPicker}
                  testID={testID ? `${testID}-confirm` : undefined}>
                  <Text>
                    {t('shared.timePicker.confirm', {defaultValue: 'Bestätigen'})}
                  </Text>
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};
