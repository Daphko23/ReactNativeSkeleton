import React from 'react';
import {TextInput} from 'react-native-paper';
import {StyleSheet} from 'react-native';
import { useTheme } from '../../../core/theme/theme.system';

interface FormTextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  error?: boolean;
  disabled?: boolean;
}

const createStyles = (theme: any) => StyleSheet.create({
  input: {
    marginBottom: theme.spacing[4],
  },
});

/**
 * FormTextInput component styled according to the App Theme.
 */
export const FormTextInput = ({
  label,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize,
  autoCorrect,
  error = false,
  disabled = false,
}: FormTextInputProps) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  
  return (
    <TextInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      autoCorrect={autoCorrect}
      mode="outlined"
      error={error}
      disabled={disabled}
      style={styles.input}
    />
  );
};
