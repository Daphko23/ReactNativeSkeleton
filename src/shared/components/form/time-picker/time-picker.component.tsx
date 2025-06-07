/**
 * @fileoverview TIME-PICKER-COMPONENT: Legacy Time Selection Component (DEPRECATED)
 * @description Cross-platform time picker component using native DateTimePicker - DEPRECATED
 * @version 1.0.0
 * @since 1.0.0
 * @deprecated Use direct implementation in form components or RNTimePicker instead
 * @author ReactNativeSkeleton Enterprise Team
 * @module Shared.Components.Form.TimePicker
 * @namespace Shared.Components.Form.TimePicker.TimePicker
 * @category Components
 * @subcategory Form
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

/**
 * Props interface for the deprecated TimePicker component.
 * 
 * @interface TimePickerProps
 * @deprecated Use RNTimePickerProps or direct implementation instead
 * @since 1.0.0
 * @version 1.0.0
 * @category Props
 * @subcategory Components
 * 
 * @example
 * Legacy time picker usage (DEPRECATED):
 * ```tsx
 * const timePickerProps: TimePickerProps = {
 *   value: '14:30',
 *   onChange: (time) => setSelectedTime(time),
 *   label: 'Uhrzeit'
 * };
 * ```
 */
export interface TimePickerProps {
  /**
   * Currently selected time in HH:mm format.
   * 24-hour format for consistency.
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
   * @type {(time: string) => void}
   * @required
   * @param time - Selected time in HH:mm format
   * @example (time) => setSelectedTime(time)
   */
  onChange: (time: string) => void;

  /**
   * Display label for the time picker field.
   * 
   * @type {string}
   * @required
   * @example "Startzeit"
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
   * @example "start-time-picker"
   */
  testID?: string;

  /**
   * Accessibility label for screen readers.
   * 
   * @type {string}
   * @optional
   * @example "Startzeit auswählen"
   */
  accessibilityLabel?: string;
}

/**
 * Time Picker Component (DEPRECATED)
 * 
 * A legacy cross-platform time picker component that provided time selection functionality
 * using native DateTimePicker. This component has been deprecated in favor of direct
 * implementations or the RNTimePicker component for better performance and maintainability.
 * 
 * @component
 * @function TimePicker
 * @param {TimePickerProps} props - The component props
 * @returns {React.ReactElement} Rendered time picker component
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @deprecated Use direct implementation in form components or RNTimePicker instead
 * @author ReactNativeSkeleton Enterprise Team
 * @category Components
 * @subcategory Form
 * @module Shared.Components.Form.TimePicker
 * @namespace Shared.Components.Form.TimePicker.TimePicker
 * 
 * @example
 * DEPRECATED - Legacy usage:
 * ```tsx
 * import { TimePicker } from '@/shared/components/form/time-picker';
 * 
 * const AppointmentForm = () => {
 *   const [startTime, setStartTime] = useState<string>('');
 * 
 *   return (
 *     <TimePicker
 *       label="Startzeit"
 *       value={startTime}
 *       onChange={setStartTime}
 *       hasError={!startTime}
 *     />
 *   );
 * };
 * ```
 * 
 * @example
 * RECOMMENDED - Use RNTimePicker instead:
 * ```tsx
 * import { RNTimePicker } from '@/shared/components/form/time-picker';
 * 
 * const ModernForm = () => {
 *   const [time, setTime] = useState<string>('');
 * 
 *   return (
 *     <RNTimePicker
 *       label="Zeit auswählen"
 *       value={time}
 *       onChange={setTime}
 *     />
 *   );
 * };
 * ```
 * 
 * @migration_guide
 * To migrate from TimePicker to RNTimePicker:
 * 1. Replace import: TimePicker → RNTimePicker
 * 2. Props remain the same for basic usage
 * 3. Better performance and UX out of the box
 * 4. No breaking changes for standard use cases
 * 
 * @deprecation_reason
 * - Performance issues with native modal handling
 * - Complex platform-specific code maintenance
 * - Better alternatives available (RNTimePicker)
 * - Reduced bundle size with dedicated implementation
 * 
 * @features
 * - Cross-platform compatibility (iOS/Android)
 * - HH:mm time format handling
 * - Platform-specific UI implementations
 * - Error state visualization
 * - Accessibility support
 * - Internationalization ready
 * - 24-hour time format
 * - Modal presentation on iOS
 * - Native dialog on Android
 * 
 * @architecture
 * - Platform-specific rendering logic
 * - React hooks for state management
 * - Native DateTimePicker integration
 * - Modal wrapper for iOS
 * - Callback-based change handling
 * - Theme system integration
 * 
 * @styling
 * - Material Design principles
 * - Theme-aware colors
 * - Error state styling
 * - Icon indicators
 * - Modal overlay styling
 * - Platform-specific adjustments
 * 
 * @accessibility
 * - Screen reader support
 * - Descriptive labels
 * - Touch target optimization
 * - Proper semantic roles
 * - High contrast compatibility
 * 
 * @performance
 * - State synchronization overhead
 * - Modal rendering performance impact
 * - Memory usage considerations
 * - Re-render optimization needed
 * 
 * @use_cases
 * - Appointment scheduling (DEPRECATED)
 * - Event time setting (DEPRECATED)
 * - Working hours configuration (DEPRECATED)
 * - Reminder time selection (DEPRECATED)
 * 
 * @best_practices
 * - Migrate to RNTimePicker for new implementations
 * - Use direct form implementation for simple cases
 * - Consider UX improvements with modern alternatives
 * - Plan migration strategy for existing usage
 * 
 * @dependencies
 * - react: Core React hooks and components
 * - react-native: Platform components and utilities
 * - react-native-paper: Material Design components
 * - @react-native-community/datetimepicker: Native time picker
 * - react-native-vector-icons: Icon components
 * - react-i18next: Internationalization
 * - @core/theme: Design system values
 * 
 * @see {@link RNTimePicker} for recommended alternative
 * @see {@link RNTimePickerProps} for modern interface
 * 
 * @todo Remove in next major version
 * @todo Complete migration guide documentation
 * @todo Add deprecation warnings in development
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
