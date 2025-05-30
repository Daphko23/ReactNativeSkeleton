import React from 'react';
import {Button} from 'react-native-paper';
import {StyleSheet} from 'react-native';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

/**
 * PrimaryButton component styled according to the App Theme.
 */
export const PrimaryButton = ({
  label,
  onPress,
  loading = false,
  disabled = false,
}: PrimaryButtonProps) => {
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

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    marginVertical: 8,
  },
  content: {
    height: 48,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
