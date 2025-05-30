/**
 * @file Datumsfilter-Komponente für Matchday-Filter.
 */

import React, {memo} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, Button} from 'react-native-paper';
import {colors, spacing, typography} from '@core/theme';

interface DateFilterProps {
  /** Label des Filters */
  label: string;
  /** Aktueller Datumswert (ISO-String) */
  value?: string;
  /** Callback bei Klick */
  onPress: () => void;
  /** Optionales Styling */
  style?: object;
}

/**
 * Datumsfilter-Komponente mit Beschriftung und Button.
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
    ...typography.label,
  },
});

// Expliziter Display-Name für DevTools
DateFilter.displayName = 'DateFilter';
