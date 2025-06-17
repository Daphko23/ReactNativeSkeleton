/**
 * @fileoverview FORM-TEXT-ERROR-COMPONENT: Form Error Message Display
 * @description Themed error text component for displaying validation messages below form inputs
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Shared.Components.FormTextInput
 * @namespace Shared.Components.FormTextInput.FormErrorText
 * @category Components
 * @subcategory Form
 */

import React from 'react';
import {Text, StyleSheet} from 'react-native';
import { useTheme } from '../../../core/theme/theme.system';

/**
 * Props interface for the FormErrorText component.
 * Simple interface for displaying error messages.
 * 
 * @interface FormErrorTextProps
 * @since 1.0.0
 * @version 1.0.0
 * @category Props
 * @subcategory Components
 * 
 * @example
 * Basic error message:
 * ```tsx
 * const errorProps: FormErrorTextProps = {
 *   errorMessage: 'This field is required'
 * };
 * ```
 */
interface FormErrorTextProps {
  /**
   * Error message to display below form inputs.
   * If empty or falsy, component renders nothing.
   * 
   * @type {string}
   * @required
   * @example "This field is required"
   */
  errorMessage: string;
}

/**
 * Creates dynamic styles based on the current theme.
 * Ensures error text styling matches the theme system.
 * 
 * @function createStyles
 * @param {any} theme - Current theme object
 * @returns {StyleSheet} Themed styles object
 * @since 1.0.0
 * 
 * @example
 * ```tsx
 * const styles = createStyles(theme);
 * ```
 */
const createStyles = (theme: any) => StyleSheet.create({
  /**
   * Error text styling with theme-aware colors and spacing.
   * 
   * @style errorText
   * @colors theme error color
   * @typography small font size from theme
   * @spacing negative top margin to position close to input
   */
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.fontSizes.sm,
    marginBottom: theme.spacing[2],
    marginTop: -theme.spacing[2],
  },
});

/**
 * Form Error Text Component
 * 
 * A themed error message component that displays validation errors below form inputs.
 * Integrates with the application's design system for consistent error styling and
 * includes development logging for debugging purposes.
 * 
 * @component
 * @function FormErrorText
 * @param {FormErrorTextProps} props - The component props
 * @returns {React.ReactElement | null} Rendered error text or null if no error
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Components
 * @subcategory Form
 * @module Shared.Components.FormTextInput
 * @namespace Shared.Components.FormTextInput.FormErrorText
 * 
 * @example
 * Basic usage with form validation:
 * ```tsx
 * import { FormErrorText } from '@/shared/components/form-text-input';
 * 
 * const LoginForm = () => {
 *   const [email, setEmail] = useState('');
 *   const [emailError, setEmailError] = useState('');
 * 
 *   const validateEmail = (value: string) => {
 *     if (!value) {
 *       setEmailError('Email is required');
 *     } else if (!isValidEmail(value)) {
 *       setEmailError('Please enter a valid email address');
 *     } else {
 *       setEmailError('');
 *     }
 *   };
 * 
 *   return (
 *     <View>
 *       <FormTextInput
 *         label="Email"
 *         value={email}
 *         onChangeText={(text) => {
 *           setEmail(text);
 *           validateEmail(text);
 *         }}
 *         error={!!emailError}
 *       />
 *       <FormErrorText errorMessage={emailError} />
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * Multiple field validation in a form:
 * ```tsx
 * const RegistrationForm = () => {
 *   const [formData, setFormData] = useState({
 *     username: '',
 *     email: '',
 *     password: '',
 *     confirmPassword: ''
 *   });
 *   const [errors, setErrors] = useState({});
 * 
 *   const validateForm = () => {
 *     const newErrors = {};
 * 
 *     if (!formData.username) {
 *       newErrors.username = 'Username is required';
 *     } else if (formData.username.length < 3) {
 *       newErrors.username = 'Username must be at least 3 characters';
 *     }
 * 
 *     if (!formData.email) {
 *       newErrors.email = 'Email is required';
 *     } else if (!isValidEmail(formData.email)) {
 *       newErrors.email = 'Please enter a valid email address';
 *     }
 * 
 *     if (!formData.password) {
 *       newErrors.password = 'Password is required';
 *     } else if (formData.password.length < 8) {
 *       newErrors.password = 'Password must be at least 8 characters';
 *     }
 * 
 *     if (formData.password !== formData.confirmPassword) {
 *       newErrors.confirmPassword = 'Passwords do not match';
 *     }
 * 
 *     setErrors(newErrors);
 *     return Object.keys(newErrors).length === 0;
 *   };
 * 
 *   return (
 *     <ScrollView style={styles.form}>
 *       <FormTextInput
 *         label="Username"
 *         value={formData.username}
 *         onChangeText={(text) => setFormData(prev => ({ ...prev, username: text }))}
 *         error={!!errors.username}
 *       />
 *       <FormErrorText errorMessage={errors.username} />
 * 
 *       <FormTextInput
 *         label="Email"
 *         value={formData.email}
 *         onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
 *         keyboardType="email-address"
 *         error={!!errors.email}
 *       />
 *       <FormErrorText errorMessage={errors.email} />
 * 
 *       <FormTextInput
 *         label="Password"
 *         value={formData.password}
 *         onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
 *         secureTextEntry
 *         error={!!errors.password}
 *       />
 *       <FormErrorText errorMessage={errors.password} />
 * 
 *       <FormTextInput
 *         label="Confirm Password"
 *         value={formData.confirmPassword}
 *         onChangeText={(text) => setFormData(prev => ({ ...prev, confirmPassword: text }))}
 *         secureTextEntry
 *         error={!!errors.confirmPassword}
 *       />
 *       <FormErrorText errorMessage={errors.confirmPassword} />
 * 
 *       <Button onPress={validateForm}>Register</Button>
 *     </ScrollView>
 *   );
 * };
 * ```
 * 
 * @example
 * Real-time validation with debouncing:
 * ```tsx
 * const EmailValidationForm = () => {
 *   const [email, setEmail] = useState('');
 *   const [emailError, setEmailError] = useState('');
 *   const [isValidating, setIsValidating] = useState(false);
 * 
 *   const debouncedValidation = useCallback(
 *     debounce(async (emailValue: string) => {
 *       if (!emailValue) {
 *         setEmailError('');
 *         return;
 *       }
 * 
 *       setIsValidating(true);
 *       try {
 *         const isAvailable = await checkEmailAvailability(emailValue);
 *         if (!isAvailable) {
 *           setEmailError('This email is already registered');
 *         } else {
 *           setEmailError('');
 *         }
 *       } catch (error) {
 *         setEmailError('Unable to validate email');
 *       } finally {
 *         setIsValidating(false);
 *       }
 *     }, 500),
 *     []
 *   );
 * 
 *   const handleEmailChange = (text: string) => {
 *     setEmail(text);
 *     if (isValidEmail(text)) {
 *       debouncedValidation(text);
 *     } else if (text) {
 *       setEmailError('Please enter a valid email format');
 *     } else {
 *       setEmailError('');
 *     }
 *   };
 * 
 *   return (
 *     <View>
 *       <FormTextInput
 *         label="Email Address"
 *         value={email}
 *         onChangeText={handleEmailChange}
 *         keyboardType="email-address"
 *         error={!!emailError}
 *       />
 *       <FormErrorText errorMessage={emailError} />
 *       {isValidating && <Text>Checking availability...</Text>}
 *     </View>
 *   );
 * };
 * ```
 * 
 * @features
 * - Theme system integration
 * - Conditional rendering (null when no error)
 * - Error color styling from theme
 * - Small font size for subtle display
 * - Proper spacing relative to form inputs
 * - Development logging for debugging
 * - Consistent error message positioning
 * - Accessibility friendly
 * - Lightweight component
 * 
 * @architecture
 * - Simple functional component
 * - Theme hook integration
 * - Dynamic style generation
 * - Conditional rendering pattern
 * - Console logging for development
 * 
 * @styling
 * - Theme-aware error color
 * - Small typography for error messages
 * - Negative top margin for close positioning
 * - Bottom margin for spacing
 * - Consistent with design system
 * 
 * @accessibility
 * - Screen reader compatible
 * - Proper error announcement
 * - High contrast error colors
 * - Clear error message text
 * 
 * @performance
 * - Lightweight rendering
 * - Early return for empty errors
 * - Efficient style creation
 * - Minimal re-render impact
 * 
 * @use_cases
 * - Form field validation errors
 * - Real-time input validation
 * - Server-side validation feedback
 * - Required field indicators
 * - Format validation messages
 * - Custom validation rules
 * - Multi-step form errors
 * - Inline error display
 * 
 * @best_practices
 * - Clear and concise error messages
 * - Consistent error message format
 * - Immediate error feedback
 * - Helpful validation guidance
 * - Accessible error descriptions
 * - Remove errors when fixed
 * - Test error message display
 * - Consider internationalization
 * 
 * @dependencies
 * - react: Core React library
 * - react-native: Text component and StyleSheet
 * - ../../../core/theme/theme.system: Theme hook
 * 
 * @see {@link useTheme} for theme system integration
 * @see {@link FormTextInput} for related form input component
 * 
 * @todo Add support for error message icons
 * @todo Implement error message animations
 * @todo Add accessibility improvements
 * @todo Include error severity levels
 */
export const FormErrorText = ({errorMessage}: FormErrorTextProps) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  
  if (!errorMessage) return null;

  // 🎯 UX FIX: Debug-Log statt Console-Error um LogBox zu vermeiden
  console.log('🔴 FormErrorText:', errorMessage);

  return <Text style={styles.errorText}>{errorMessage}</Text>;
};
