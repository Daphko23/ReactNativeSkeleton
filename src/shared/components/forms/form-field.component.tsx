/**
 * FormField - Universal Form Field Component
 * Provides consistent styling, validation, and accessibility for form inputs
 */

import React, { memo, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, HelperText, Paragraph } from 'react-native-paper';
import { useTheme } from '../../../core/theme/theme.system';

export interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'url';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  secureTextEntry?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  showCharacterCount?: boolean;
  required?: boolean;
  helperText?: string;
  style?: any;
  testID?: string;
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    marginBottom: theme.spacing[4],
  },
  input: {
    backgroundColor: theme.colors.surface,
  },
  characterCount: {
    textAlign: 'right',
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing[1],
  },
  requiredLabel: {
    color: theme.colors.error,
  },
});

export const FormField = memo<FormFieldProps>(({
  label,
  value,
  onChangeText,
  onBlur,
  error,
  placeholder,
  disabled = false,
  multiline = false,
  numberOfLines,
  maxLength,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoCorrect = true,
  secureTextEntry = false,
  leftIcon,
  rightIcon,
  onRightIconPress,
  showCharacterCount = false,
  required = false,
  helperText,
  style,
  testID
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const displayLabel = useMemo(() => {
    return required ? `${label} *` : label;
  }, [label, required]);

  const characterCountText = useMemo(() => {
    if (!showCharacterCount || !maxLength) return null;
    return `${value?.length || 0}/${maxLength}`;
  }, [showCharacterCount, maxLength, value]);

  const inputProps = useMemo(() => {
    const props: any = {
      label: displayLabel,
      value: value || '',
      onChangeText,
      onBlur,
      mode: 'outlined' as const,
      error: !!error,
      disabled,
      style: [styles.input, style],
      placeholder,
      multiline,
      keyboardType,
      autoCapitalize,
      autoCorrect,
      secureTextEntry,
      maxLength,
      testID,
    };

    if (numberOfLines) {
      props.numberOfLines = numberOfLines;
    }

    if (leftIcon) {
      props.left = <TextInput.Icon icon={leftIcon} />;
    }

    if (rightIcon) {
      props.right = (
        <TextInput.Icon 
          icon={rightIcon} 
          onPress={onRightIconPress}
          disabled={!onRightIconPress}
        />
      );
    }

    return props;
  }, [
    displayLabel, value, onChangeText, onBlur, error, disabled, styles.input, 
    style, placeholder, multiline, numberOfLines, keyboardType, autoCapitalize, 
    autoCorrect, secureTextEntry, maxLength, leftIcon, rightIcon, onRightIconPress, testID
  ]);

  return (
    <View style={styles.container}>
      <TextInput {...inputProps} />
      
      {/* Error Message */}
      {error && (
        <HelperText type="error" visible={!!error}>
          {error}
        </HelperText>
      )}
      
      {/* Helper Text */}
      {helperText && !error && (
        <HelperText type="info" visible={true}>
          {helperText}
        </HelperText>
      )}
      
      {/* Character Count */}
      {characterCountText && (
        <Paragraph style={styles.characterCount}>
          {characterCountText}
        </Paragraph>
      )}
    </View>
  );
});

FormField.displayName = 'FormField'; 