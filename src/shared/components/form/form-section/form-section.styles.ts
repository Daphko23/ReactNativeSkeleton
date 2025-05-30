import {colors, spacing, typography} from '@core/theme';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  content: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    padding: spacing.md,
  },
  title: {
    ...typography.label,
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
});
