import {StyleSheet} from 'react-native';
import {colors} from '@core/theme';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 56,
    padding: 12,
  },
  errorContainer: {
    borderColor: colors.error,
  },
  label: {
    color: colors.text,
    marginBottom: 8,
  },
  timeText: {
    color: colors.text,
    fontSize: 16,
  },
});
