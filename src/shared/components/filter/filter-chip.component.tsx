/**
 * @file Wiederverwendbare Chip-Komponente für Filter mit generischem Typ.
 */

import {Chip} from 'react-native-paper';
import {StyleSheet} from 'react-native';
import {colors, spacing} from '@core/theme';
import {Icons} from '@shared/icons/icons';

/**
 * Props für FilterChip mit generischem Typ-Parameter.
 */
interface FilterChipProps<T extends string> {
  /** Anzeigetext */
  label: string;
  /** Wert dieses Filters */
  value: T;
  /** Aktuell ausgewählter Wert */
  currentValue?: T;
  /** Callback bei Klick */
  onToggle: (value: T) => void;
  /** Optionales Styling */
  style?: object;
  /** Optionales Icon */
  iconType?: keyof typeof Icons;
}

/**
 * Wiederverwendbare Chip-Komponente für Filter mit Toggle-Funktion.
 * Generisch implementiert für verschiedene Enum-Typen.
 */
export function FilterChip<T extends string>({
  label,
  value,
  currentValue,
  onToggle,
  style,
  iconType,
}: FilterChipProps<T>) {
  return (
    <Chip
      icon={iconType ? Icons[iconType] : undefined}
      selected={currentValue === value}
      onPress={() => onToggle(value)}
      style={[styles.chip, style]}>
      {label}
    </Chip>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: colors.background,
    marginRight: spacing.xs,
  },
});
FilterChip.displayName = 'FilterChip';
