import {colors, spacing} from '@core/theme';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
    marginVertical: 8,
  },
  searchBar: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    elevation: 1,
  },
  searchBarIcon: {
    color: colors.primary,
  },
  searchBarInput: {
    color: colors.text,
    fontSize: 14,
  },
});
