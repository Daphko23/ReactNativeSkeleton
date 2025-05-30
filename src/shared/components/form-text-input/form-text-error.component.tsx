import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {colors} from '@core/theme';

interface FormErrorTextProps {
  errorMessage: string;
}

/**
 * Displays an error text below form inputs.
 */
export const FormErrorText = ({errorMessage}: FormErrorTextProps) => {
  if (!errorMessage) return null;

  console.error('FormErrorText', errorMessage);

  return <Text style={styles.errorText}>{errorMessage}</Text>;
};

const styles = StyleSheet.create({
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginBottom: 8,
    marginTop: -8,
  },
});
