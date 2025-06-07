import React from 'react';
import {Button} from 'react-native-paper';
import {StyleSheet} from 'react-native';
import { useTheme } from '../../../core/theme/theme.system';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

const createStyles = (theme: any) => StyleSheet.create({
  button: {
    borderRadius: theme.borderRadius.md,
    marginVertical: theme.spacing[2],
  },
  content: {
    height: 48,
  },
  label: {
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.bold,
  },
});

/**
 * PrimaryButton component styled according to the App Theme.
 */
export const PrimaryButton = ({
  label,
  onPress,
  loading = false,
  disabled = false,
}: PrimaryButtonProps) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  
  return (
    <Button
      mode="contained"
      onPress={onPress}
      loading={loading}
      disabled={disabled}
      style={styles.button}
      labelStyle={styles.label}
      contentStyle={styles.content}>
      {label}
    </Button>
  );
};
