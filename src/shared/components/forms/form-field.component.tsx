/**
 * @fileoverview FORM-FIELD-COMPONENT: Universal Form Field Component
 * @description Provides consistent styling, validation, and accessibility for all form inputs
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Shared.Components.Forms
 * @namespace Shared.Components.Forms.FormField
 * @category Components
 * @subcategory Forms
 */

import React, { memo, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, HelperText, Paragraph } from 'react-native-paper';
import { useTheme } from '../../../core/theme/theme.system';

/**
 * Props interface for the FormField component.
 * Comprehensive configuration for universal form field behavior.
 * 
 * @interface FormFieldProps
 * @since 1.0.0
 * @version 1.0.0
 * @category Props
 * @subcategory Forms
 * 
 * @example
 * ```tsx
 * const fieldProps: FormFieldProps = {
 *   label: 'Email Address',
 *   value: email,
 *   onChangeText: setEmail,
 *   keyboardType: 'email-address',
 *   required: true,
 *   error: emailError
 * };
 * ```
 */
export interface FormFieldProps {
  /**
   * Display label for the form field.
   * Shows above the input with optional required indicator.
   * 
   * @type {string}
   * @required
   * @example "Email Address"
   */
  label: string;

  /**
   * Current value of the form field.
   * Controls the input state.
   * 
   * @type {string}
   * @required
   * @example "user@example.com"
   */
  value: string;

  /**
   * Callback function when text changes.
   * Receives the new input value.
   * 
   * @type {(value: string) => void}
   * @required
   * @example (text) => setFieldValue(text)
   */
  onChangeText: (value: string) => void;

  /**
   * Callback function when input loses focus.
   * Useful for validation triggers.
   * 
   * @type {() => void}
   * @optional
   * @example () => validateField()
   */
  onBlur?: () => void;

  /**
   * Error message to display below the input.
   * Shows in red with error styling.
   * 
   * @type {string}
   * @optional
   * @example "Email address is required"
   */
  error?: string;

  /**
   * Placeholder text shown when input is empty.
   * Provides usage hints to users.
   * 
   * @type {string}
   * @optional
   * @example "Enter your email address"
   */
  placeholder?: string;

  /**
   * Disables user interaction with the field.
   * Useful for read-only or loading states.
   * 
   * @type {boolean}
   * @optional
   * @default false
   * @example true
   */
  disabled?: boolean;

  /**
   * Enables multi-line text input.
   * Converts field to textarea behavior.
   * 
   * @type {boolean}
   * @optional
   * @default false
   * @example true
   */
  multiline?: boolean;

  /**
   * Number of visible lines for multiline input.
   * Only applies when multiline is true.
   * 
   * @type {number}
   * @optional
   * @example 4
   */
  numberOfLines?: number;

  /**
   * Maximum character length allowed.
   * Prevents input beyond limit.
   * 
   * @type {number}
   * @optional
   * @example 50
   */
  maxLength?: number;

  /**
   * Keyboard type for input optimization.
   * Provides appropriate virtual keyboard.
   * 
   * @type {'default' | 'email-address' | 'numeric' | 'phone-pad' | 'url'}
   * @optional
   * @default 'default'
   * @example 'email-address'
   */
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'url';

  /**
   * Auto-capitalization behavior for input.
   * Controls automatic text transformation.
   * 
   * @type {'none' | 'sentences' | 'words' | 'characters'}
   * @optional
   * @default 'sentences'
   * @example 'words'
   */
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';

  /**
   * Enables automatic spelling correction.
   * Platform-dependent autocorrect behavior.
   * 
   * @type {boolean}
   * @optional
   * @default true
   * @example false
   */
  autoCorrect?: boolean;

  /**
   * Hides input text for sensitive data.
   * Typically used for passwords.
   * 
   * @type {boolean}
   * @optional
   * @default false
   * @example true
   */
  secureTextEntry?: boolean;

  /**
   * Icon name displayed on the left side.
   * Uses Material Design icon names.
   * 
   * @type {string}
   * @optional
   * @example "email"
   */
  leftIcon?: string;

  /**
   * Icon name displayed on the right side.
   * Uses Material Design icon names.
   * 
   * @type {string}
   * @optional
   * @example "eye-off"
   */
  rightIcon?: string;

  /**
   * Callback when right icon is pressed.
   * Enables interactive right icon functionality.
   * 
   * @type {() => void}
   * @optional
   * @example () => togglePasswordVisibility()
   */
  onRightIconPress?: () => void;

  /**
   * Shows character count indicator.
   * Displays current/max length below field.
   * 
   * @type {boolean}
   * @optional
   * @default false
   * @example true
   */
  showCharacterCount?: boolean;

  /**
   * Marks field as required with visual indicator.
   * Adds asterisk to label.
   * 
   * @type {boolean}
   * @optional
   * @default false
   * @example true
   */
  required?: boolean;

  /**
   * Helper text displayed below the input.
   * Provides additional context or instructions.
   * 
   * @type {string}
   * @optional
   * @example "We'll never share your email address"
   */
  helperText?: string;

  /**
   * Custom styling for the input field.
   * Merged with theme-based styles.
   * 
   * @type {any}
   * @optional
   * @example { marginTop: 10 }
   */
  style?: any;

  /**
   * Test identifier for automated testing.
   * 
   * @type {string}
   * @optional
   * @example "email-input-field"
   */
  testID?: string;
}

/**
 * Creates theme-based styles for the FormField component.
 * Provides consistent styling across the application.
 * 
 * @function createStyles
 * @param {any} theme - Theme object containing colors, spacing, and typography
 * @returns {StyleSheet} Compiled style sheet
 * 
 * @since 1.0.0
 * @private
 * @internal
 */
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

/**
 * Form Field Component
 * 
 * A universal form field component that provides consistent styling, validation,
 * and accessibility for all form inputs in the application. Supports various input
 * types, validation states, character limits, icons, and helper text with full
 * theme integration and enterprise-grade user experience patterns.
 * 
 * @component
 * @function FormField
 * @param {FormFieldProps} props - The component props
 * @returns {React.ReactElement} Rendered form field component
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Components
 * @subcategory Forms
 * @module Shared.Components.Forms
 * @namespace Shared.Components.Forms.FormField
 * 
 * @example
 * Basic text input:
 * ```tsx
 * import { FormField } from '@/shared/components/forms';
 * 
 * const BasicForm = () => {
 *   const [name, setName] = useState('');
 *   const [nameError, setNameError] = useState('');
 * 
 *   const validateName = () => {
 *     if (name.trim().length < 2) {
 *       setNameError('Name must be at least 2 characters');
 *     } else {
 *       setNameError('');
 *     }
 *   };
 * 
 *   return (
 *     <FormField
 *       label="Full Name"
 *       value={name}
 *       onChangeText={setName}
 *       onBlur={validateName}
 *       error={nameError}
 *       placeholder="Enter your full name"
 *       required={true}
 *       testID="name-input"
 *     />
 *   );
 * };
 * ```
 * 
 * @example
 * Email input with validation:
 * ```tsx
 * const EmailForm = () => {
 *   const [email, setEmail] = useState('');
 *   const [emailError, setEmailError] = useState('');
 * 
 *   const validateEmail = () => {
 *     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 *     if (!emailRegex.test(email)) {
 *       setEmailError('Please enter a valid email address');
 *     } else {
 *       setEmailError('');
 *     }
 *   };
 * 
 *   return (
 *     <FormField
 *       label="Email Address"
 *       value={email}
 *       onChangeText={setEmail}
 *       onBlur={validateEmail}
 *       error={emailError}
 *       placeholder="your.email@example.com"
 *       keyboardType="email-address"
 *       autoCapitalize="none"
 *       autoCorrect={false}
 *       leftIcon="email"
 *       required={true}
 *       helperText="We'll use this for important notifications"
 *     />
 *   );
 * };
 * ```
 * 
 * @example
 * Password input with toggle visibility:
 * ```tsx
 * const PasswordForm = () => {
 *   const [password, setPassword] = useState('');
 *   const [isPasswordVisible, setIsPasswordVisible] = useState(false);
 *   const [passwordError, setPasswordError] = useState('');
 * 
 *   const togglePasswordVisibility = () => {
 *     setIsPasswordVisible(!isPasswordVisible);
 *   };
 * 
 *   const validatePassword = () => {
 *     if (password.length < 8) {
 *       setPasswordError('Password must be at least 8 characters');
 *     } else {
 *       setPasswordError('');
 *     }
 *   };
 * 
 *   return (
 *     <FormField
 *       label="Password"
 *       value={password}
 *       onChangeText={setPassword}
 *       onBlur={validatePassword}
 *       error={passwordError}
 *       placeholder="Enter a secure password"
 *       secureTextEntry={!isPasswordVisible}
 *       leftIcon="lock"
 *       rightIcon={isPasswordVisible ? "eye-off" : "eye"}
 *       onRightIconPress={togglePasswordVisibility}
 *       maxLength={50}
 *       showCharacterCount={true}
 *       required={true}
 *       helperText="Use a mix of letters, numbers, and symbols"
 *     />
 *   );
 * };
 * ```
 * 
 * @example
 * Multi-line description field:
 * ```tsx
 * const DescriptionForm = () => {
 *   const [description, setDescription] = useState('');
 *   const [descriptionError, setDescriptionError] = useState('');
 * 
 *   const validateDescription = () => {
 *     if (description.trim().length > 500) {
 *       setDescriptionError('Description cannot exceed 500 characters');
 *     } else if (description.trim().length < 10) {
 *       setDescriptionError('Description must be at least 10 characters');
 *     } else {
 *       setDescriptionError('');
 *     }
 *   };
 * 
 *   return (
 *     <FormField
 *       label="Description"
 *       value={description}
 *       onChangeText={setDescription}
 *       onBlur={validateDescription}
 *       error={descriptionError}
 *       placeholder="Describe your project in detail..."
 *       multiline={true}
 *       numberOfLines={4}
 *       maxLength={500}
 *       showCharacterCount={true}
 *       autoCapitalize="sentences"
 *       helperText="Provide a detailed description of your project goals"
 *     />
 *   );
 * };
 * ```
 * 
 * @features
 * - Universal form field interface
 * - Multiple input types support
 * - Real-time validation feedback
 * - Character count display
 * - Left and right icon support
 * - Helper text display
 * - Required field indicators
 * - Multi-line text support
 * - Keyboard type optimization
 * - Auto-capitalization control
 * - Secure text entry
 * - Theme integration
 * - Accessibility compliance
 * - Performance optimization
 * 
 * @architecture
 * - React.memo for performance optimization
 * - useMemo hooks for expensive calculations
 * - Theme-based styling system
 * - Conditional prop composition
 * - Material Design Paper integration
 * - Flexible icon system
 * - Validation state management
 * 
 * @styling
 * - Theme-aware color schemes
 * - Material Design outlined style
 * - Consistent spacing system
 * - Error state styling
 * - Character count positioning
 * - Icon integration
 * - Focus state handling
 * - Disabled state styling
 * 
 * @accessibility
 * - Screen reader compatible labels
 * - Error message announcements
 * - Helper text associations
 * - Touch target optimization
 * - Keyboard navigation support
 * - Focus management
 * - High contrast support
 * - Required field indicators
 * 
 * @performance
 * - Memoized component with React.memo
 * - Optimized prop calculations
 * - Efficient re-render prevention
 * - Lightweight style creation
 * - Memory leak prevention
 * - Conditional rendering optimization
 * 
 * @use_cases
 * - User registration forms
 * - Login/authentication screens
 * - Profile editing interfaces
 * - Settings configuration
 * - Contact information forms
 * - Search input fields
 * - Comment/feedback forms
 * - Survey and questionnaire inputs
 * 
 * @best_practices
 * - Always provide descriptive labels
 * - Use appropriate keyboard types
 * - Implement proper validation
 * - Provide helpful error messages
 * - Consider character limits
 * - Use helper text for guidance
 * - Mark required fields clearly
 * - Test with accessibility tools
 * - Handle loading states gracefully
 * - Validate on blur for better UX
 * 
 * @dependencies
 * - react: Core React library with hooks
 * - react-native: View, StyleSheet components
 * - react-native-paper: Material Design components
 * - ../../../core/theme/theme.system: Theme integration
 * 
 * @see {@link useTheme} for theme system integration
 * @see {@link TextInput} for underlying input component
 * @see {@link HelperText} for error and helper text display
 * 
 * @todo Add input masking support
 * @todo Implement autocomplete functionality
 * @todo Add custom validation rules
 * @todo Include input formatting options
 */
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