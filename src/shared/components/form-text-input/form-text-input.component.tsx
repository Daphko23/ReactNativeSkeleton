import React from 'react';
import {TextInput} from 'react-native-paper';
import {StyleSheet} from 'react-native';

interface FormTextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address';
  error?: boolean;
  disabled?: boolean;
}

/**
 * FormTextInput component styled according to the App Theme.
 */
export const FormTextInput = ({
  label,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  error = false,
  disabled = false,
}: FormTextInputProps) => {
  return (
    <TextInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      mode="outlined"
      error={error}
      disabled={disabled}
      style={styles.input}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: 16,
  },
});
