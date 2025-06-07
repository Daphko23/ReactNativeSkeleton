import React from 'react';
import {Text, StyleSheet} from 'react-native';
import { useTheme } from '../../../core/theme/theme.system';

interface FormErrorTextProps {
  errorMessage: string;
}

const createStyles = (theme: any) => StyleSheet.create({
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.fontSizes.sm,
    marginBottom: theme.spacing[2],
    marginTop: -theme.spacing[2],
  },
});

/**
 * Displays an error text below form inputs.
 */
export const FormErrorText = ({errorMessage}: FormErrorTextProps) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  
  if (!errorMessage) return null;

  console.error('FormErrorText', errorMessage);

  return <Text style={styles.errorText}>{errorMessage}</Text>;
};
