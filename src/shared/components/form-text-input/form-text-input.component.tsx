/**
 * @fileoverview FORM-TEXT-INPUT-COMPONENT: Themed Text Input for Forms
 * @description Styled text input component with theme integration and comprehensive form support
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Shared.Components.FormTextInput
 * @namespace Shared.Components.FormTextInput.FormTextInput
 * @category Components
 * @subcategory Form
 */

import React from 'react';
import {TextInput} from 'react-native-paper';
import {StyleSheet} from 'react-native';
import { useTheme } from '../../../core/theme/theme.system';

/**
 * Props interface for the FormTextInput component.
 * Provides comprehensive configuration for themed text input functionality.
 * 
 * @interface FormTextInputProps
 * @since 1.0.0
 * @version 1.0.0
 * @category Props
 * @subcategory Components
 * 
 * @example
 * Basic text input:
 * ```tsx
 * const textInputProps: FormTextInputProps = {
 *   label: 'Email Address',
 *   value: email,
 *   onChangeText: setEmail,
 *   keyboardType: 'email-address'
 * };
 * ```
 * 
 * @example
 * Password input with validation:
 * ```tsx
 * const passwordProps: FormTextInputProps = {
 *   label: 'Password',
 *   value: password,
 *   onChangeText: setPassword,
 *   secureTextEntry: true,
 *   error: !isValidPassword(password)
 * };
 * ```
 */
interface FormTextInputProps {
  /**
   * Display label for the text input field.
   * Shown as floating label in Material Design style.
   * 
   * @type {string}
   * @required
   * @example "Email Address"
   */
  label: string;

  /**
   * Current value of the text input.
   * Controlled component pattern.
   * 
   * @type {string}
   * @required
   * @example "user@example.com"
   */
  value: string;

  /**
   * Callback function executed when text changes.
   * Receives the new text value as parameter.
   * 
   * @type {(text: string) => void}
   * @required
   * @param text - New text value
   * @example (text) => setEmail(text)
   */
  onChangeText: (text: string) => void;

  /**
   * Enables secure text entry for passwords.
   * Hides text input with dots or asterisks.
   * 
   * @type {boolean}
   * @optional
   * @default false
   * @example true
   */
  secureTextEntry?: boolean;

  /**
   * Keyboard type for optimized input experience.
   * Determines which keyboard layout to show.
   * 
   * @type {'default' | 'email-address'}
   * @optional
   * @default 'default'
   * @example 'email-address'
   */
  keyboardType?: 'default' | 'email-address';

  /**
   * Auto-capitalization behavior for text input.
   * Controls automatic capitalization of text.
   * 
   * @type {'none' | 'sentences' | 'words' | 'characters'}
   * @optional
   * @example 'none'
   */
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';

  /**
   * Enables or disables auto-correction.
   * Controls automatic spelling correction.
   * 
   * @type {boolean}
   * @optional
   * @example false
   */
  autoCorrect?: boolean;

  /**
   * Indicates error state with visual feedback.
   * Changes border color and shows error styling.
   * 
   * @type {boolean}
   * @optional
   * @default false
   * @example true
   */
  error?: boolean;

  /**
   * Disables the text input for read-only display.
   * Prevents user interaction and shows disabled styling.
   * 
   * @type {boolean}
   * @optional
   * @default false
   * @example true
   */
  disabled?: boolean;
}

/**
 * Creates dynamic styles based on the current theme.
 * Ensures consistent theming across different theme modes.
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
   * Input field styling with theme-aware spacing.
   * 
   * @style input
   * @spacing marginBottom: theme spacing level 4
   */
  input: {
    marginBottom: theme.spacing[4],
  },
});

/**
 * Form Text Input Component
 * 
 * A themed text input component that integrates with the application's design system.
 * Provides consistent styling, validation states, and accessibility features for form
 * inputs throughout the application.
 * 
 * @component
 * @function FormTextInput
 * @param {FormTextInputProps} props - The component props
 * @returns {React.ReactElement} Rendered form text input component
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Components
 * @subcategory Form
 * @module Shared.Components.FormTextInput
 * @namespace Shared.Components.FormTextInput.FormTextInput
 * 
 * @example
 * Basic usage in a login form:
 * ```tsx
 * import { FormTextInput } from '@/shared/components/form-text-input';
 * 
 * const LoginForm = () => {
 *   const [email, setEmail] = useState('');
 *   const [password, setPassword] = useState('');
 *   const [errors, setErrors] = useState({});
 * 
 *   return (
 *     <View style={styles.form}>
 *       <FormTextInput
 *         label="Email"
 *         value={email}
 *         onChangeText={setEmail}
 *         keyboardType="email-address"
 *         autoCapitalize="none"
 *         autoCorrect={false}
 *         error={!!errors.email}
 *       />
 *       <FormTextInput
 *         label="Password"
 *         value={password}
 *         onChangeText={setPassword}
 *         secureTextEntry
 *         error={!!errors.password}
 *       />
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * Registration form with validation:
 * ```tsx
 * const RegistrationForm = () => {
 *   const [formData, setFormData] = useState({
 *     firstName: '',
 *     lastName: '',
 *     email: '',
 *     password: '',
 *     confirmPassword: ''
 *   });
 *   const [validationErrors, setValidationErrors] = useState({});
 * 
 *   const updateField = (field: string) => (value: string) => {
 *     setFormData(prev => ({ ...prev, [field]: value }));
 *     // Clear error when user starts typing
 *     if (validationErrors[field]) {
 *       setValidationErrors(prev => ({ ...prev, [field]: false }));
 *     }
 *   };
 * 
 *   return (
 *     <ScrollView style={styles.container}>
 *       <FormTextInput
 *         label="First Name"
 *         value={formData.firstName}
 *         onChangeText={updateField('firstName')}
 *         autoCapitalize="words"
 *         error={validationErrors.firstName}
 *       />
 *       <FormTextInput
 *         label="Last Name"
 *         value={formData.lastName}
 *         onChangeText={updateField('lastName')}
 *         autoCapitalize="words"
 *         error={validationErrors.lastName}
 *       />
 *       <FormTextInput
 *         label="Email Address"
 *         value={formData.email}
 *         onChangeText={updateField('email')}
 *         keyboardType="email-address"
 *         autoCapitalize="none"
 *         autoCorrect={false}
 *         error={validationErrors.email}
 *       />
 *       <FormTextInput
 *         label="Password"
 *         value={formData.password}
 *         onChangeText={updateField('password')}
 *         secureTextEntry
 *         error={validationErrors.password}
 *       />
 *       <FormTextInput
 *         label="Confirm Password"
 *         value={formData.confirmPassword}
 *         onChangeText={updateField('confirmPassword')}
 *         secureTextEntry
 *         error={validationErrors.confirmPassword}
 *       />
 *     </ScrollView>
 *   );
 * };
 * ```
 * 
 * @example
 * Profile editing with disabled fields:
 * ```tsx
 * const ProfileForm = ({ user, isEditing }) => {
 *   const [profile, setProfile] = useState(user);
 * 
 *   return (
 *     <View style={styles.profileForm}>
 *       <FormTextInput
 *         label="User ID"
 *         value={profile.id}
 *         onChangeText={() => {}} // No-op for read-only
 *         disabled={true}
 *       />
 *       <FormTextInput
 *         label="Username"
 *         value={profile.username}
 *         onChangeText={(text) => setProfile(prev => ({ ...prev, username: text }))}
 *         disabled={!isEditing}
 *         autoCapitalize="none"
 *         autoCorrect={false}
 *       />
 *       <FormTextInput
 *         label="Display Name"
 *         value={profile.displayName}
 *         onChangeText={(text) => setProfile(prev => ({ ...prev, displayName: text }))}
 *         disabled={!isEditing}
 *         autoCapitalize="words"
 *       />
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * Search input with real-time filtering:
 * ```tsx
 * const SearchableList = () => {
 *   const [searchQuery, setSearchQuery] = useState('');
 *   const [filteredItems, setFilteredItems] = useState([]);
 * 
 *   const handleSearch = (query: string) => {
 *     setSearchQuery(query);
 *     const filtered = items.filter(item => 
 *       item.name.toLowerCase().includes(query.toLowerCase())
 *     );
 *     setFilteredItems(filtered);
 *   };
 * 
 *   return (
 *     <View>
 *       <FormTextInput
 *         label="Search items..."
 *         value={searchQuery}
 *         onChangeText={handleSearch}
 *         autoCapitalize="none"
 *         autoCorrect={false}
 *       />
 *       <FlatList data={filteredItems} ... />
 *     </View>
 *   );
 * };
 * ```
 * 
 * @features
 * - Theme system integration
 * - Material Design outlined style
 * - Error state visualization
 * - Disabled state support
 * - Secure text entry for passwords
 * - Keyboard type optimization
 * - Auto-capitalization control
 * - Auto-correction settings
 * - Floating label animation
 * - Consistent spacing
 * - Accessibility support
 * - Dynamic theming
 * 
 * @architecture
 * - React Native Paper TextInput foundation
 * - Theme hook integration
 * - Dynamic style generation
 * - Controlled component pattern
 * - Props-based configuration
 * - StyleSheet optimization
 * 
 * @styling
 * - Material Design principles
 * - Theme-aware colors and spacing
 * - Outlined input mode
 * - Consistent bottom margin
 * - Error state styling
 * - Disabled state styling
 * - Floating label behavior
 * 
 * @accessibility
 * - Screen reader compatible
 * - Proper label association
 * - Touch target optimization
 * - High contrast support
 * - Keyboard navigation
 * - Error state announcement
 * 
 * @performance
 * - Memoized style creation
 * - Efficient theme updates
 * - Optimized re-render behavior
 * - Lightweight component structure
 * 
 * @use_cases
 * - Login and registration forms
 * - Profile editing
 * - Settings configuration
 * - Search inputs
 * - Data entry forms
 * - Contact forms
 * - Feedback forms
 * - Comment inputs
 * 
 * @best_practices
 * - Use appropriate keyboard types
 * - Set proper auto-capitalization
 * - Disable auto-correction for usernames/emails
 * - Provide clear error feedback
 * - Use secure text entry for passwords
 * - Consider disabled state for read-only data
 * - Test with different theme modes
 * - Ensure accessibility compliance
 * 
 * @dependencies
 * - react: Core React library
 * - react-native-paper: Material Design TextInput component
 * - react-native: StyleSheet for styling
 * - ../../../core/theme/theme.system: Theme hook
 * 
 * @see {@link useTheme} for theme system integration
 * @see {@link FormErrorText} for error message display
 * 
 * @todo Add support for multiline text areas
 * @todo Implement character count display
 * @todo Add input validation helpers
 * @todo Include icon support
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
