/**
 * @fileoverview FORM-SECTION-COMPONENT: Form Organization Section
 * @description Structured section component for organizing form elements with title and content area
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Shared.Components.FormSection
 * @namespace Shared.Components.FormSection.FormSection
 * @category Components
 * @subcategory Form
 */

import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';
import {colors, spacing} from '@core/theme';

/**
 * Props interface for the FormSection component.
 * Defines the structure for form section organization.
 * 
 * @interface FormSectionProps
 * @since 1.0.0
 * @version 1.0.0
 * @category Props
 * @subcategory Components
 * 
 * @example
 * Basic form section:
 * ```tsx
 * const formSectionProps: FormSectionProps = {
 *   title: 'Personal Information',
 *   children: <TextInput />,
 *   testID: 'personal-info-section'
 * };
 * ```
 */
interface FormSectionProps {
  /**
   * Title for the form section.
   * Displayed as a header above the content area.
   * 
   * @type {string}
   * @required
   * @example "Personal Information"
   */
  title: string;

  /**
   * Child components to render within the section.
   * Typically form inputs, buttons, or other form elements.
   * 
   * @type {React.ReactNode}
   * @required
   * @example <TextInput label="Name" />
   */
  children: React.ReactNode;

  /**
   * Test identifier for automated testing.
   * 
   * @type {string}
   * @optional
   * @example "personal-info-section"
   */
  testID?: string;
}

/**
 * Form Section Component
 * 
 * A structured container component that organizes form elements into logical sections
 * with a title header and styled content area. Provides consistent spacing, theming,
 * and visual hierarchy for complex forms.
 * 
 * @component
 * @function FormSection
 * @param {FormSectionProps} props - The component props
 * @returns {React.ReactElement} Rendered form section component
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Components
 * @subcategory Form
 * @module Shared.Components.FormSection
 * @namespace Shared.Components.FormSection.FormSection
 * 
 * @example
 * Basic usage in a form:
 * ```tsx
 * import { FormSection } from '@/shared/components/form-section';
 * 
 * const UserProfileForm = () => (
 *   <ScrollView>
 *     <FormSection title="Personal Information">
 *       <TextInput label="First Name" />
 *       <TextInput label="Last Name" />
 *       <DatePicker label="Birth Date" />
 *     </FormSection>
 *     
 *     <FormSection title="Contact Details">
 *       <TextInput label="Email" />
 *       <TextInput label="Phone" />
 *     </FormSection>
 *   </ScrollView>
 * );
 * ```
 * 
 * @example
 * Complex form with validation sections:
 * ```tsx
 * const RegistrationForm = () => {
 *   const [errors, setErrors] = useState({});
 * 
 *   return (
 *     <View style={styles.form}>
 *       <FormSection 
 *         title="Account Setup" 
 *         testID="account-section"
 *       >
 *         <TextInput 
 *           label="Username" 
 *           error={errors.username}
 *         />
 *         <TextInput 
 *           label="Password" 
 *           secureTextEntry 
 *           error={errors.password}
 *         />
 *       </FormSection>
 * 
 *       <FormSection 
 *         title="Preferences" 
 *         testID="preferences-section"
 *       >
 *         <Switch label="Email Notifications" />
 *         <Picker label="Language" />
 *       </FormSection>
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * Conditional sections with dynamic content:
 * ```tsx
 * const DynamicForm = () => {
 *   const [userType, setUserType] = useState('individual');
 * 
 *   return (
 *     <View>
 *       <FormSection title="User Type">
 *         <RadioButton.Group 
 *           onValueChange={setUserType} 
 *           value={userType}
 *         >
 *           <RadioButton.Item label="Individual" value="individual" />
 *           <RadioButton.Item label="Business" value="business" />
 *         </RadioButton.Group>
 *       </FormSection>
 * 
 *       {userType === 'business' && (
 *         <FormSection 
 *           title="Business Information" 
 *           testID="business-section"
 *         >
 *           <TextInput label="Company Name" />
 *           <TextInput label="Tax ID" />
 *         </FormSection>
 *       )}
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * Nested sections for complex forms:
 * ```tsx
 * const ComprehensiveForm = () => (
 *   <ScrollView>
 *     <FormSection title="Basic Information">
 *       <TextInput label="Name" />
 *       <TextInput label="Email" />
 *       
 *       <FormSection title="Address">
 *         <TextInput label="Street" />
 *         <TextInput label="City" />
 *         <TextInput label="ZIP Code" />
 *       </FormSection>
 *     </FormSection>
 * 
 *     <FormSection title="Additional Details">
 *       <TextArea label="Comments" />
 *     </FormSection>
 *   </ScrollView>
 * );
 * ```
 * 
 * @features
 * - Consistent form section structure
 * - Theme-aware styling
 * - Bold section title headers
 * - Rounded content containers
 * - Consistent spacing system
 * - Test identifier support
 * - Flexible content area
 * - Scalable design pattern
 * - Accessibility friendly
 * - Reusable component
 * 
 * @architecture
 * - Simple container component pattern
 * - Theme system integration
 * - StyleSheet optimization
 * - Flexible content composition
 * - Hierarchical structure support
 * 
 * @styling
 * - Material Design principles
 * - Theme-aware colors
 * - Consistent spacing using design system
 * - Bold typography for titles
 * - Rounded corners for modern appearance
 * - Surface background for content
 * - Proper visual hierarchy
 * 
 * @accessibility
 * - Semantic structure with proper headings
 * - Screen reader compatible
 * - Logical tab order
 * - High contrast support
 * - Clear visual grouping
 * 
 * @performance
 * - Lightweight component structure
 * - StyleSheet optimization
 * - Minimal re-render overhead
 * - Efficient layout composition
 * 
 * @use_cases
 * - User registration forms
 * - Settings and preferences
 * - Profile editing
 * - Multi-step wizards
 * - Complex data entry
 * - Survey forms
 * - Application forms
 * - Configuration panels
 * 
 * @best_practices
 * - Group related form fields logically
 * - Use descriptive section titles
 * - Keep sections focused and concise
 * - Consider visual hierarchy
 * - Test with screen readers
 * - Maintain consistent spacing
 * - Plan for responsive design
 * - Follow form usability guidelines
 * 
 * @dependencies
 * - react: Core React library
 * - react-native: Native components (View, StyleSheet)
 * - react-native-paper: Material Design Text component
 * - @core/theme: Design system values
 * 
 * @see {@link colors} for theme color system
 * @see {@link spacing} for spacing constants
 * 
 * @todo Add collapsible section support
 * @todo Implement section validation status
 * @todo Add section icons support
 * @todo Include animation capabilities
 */
export const FormSection: React.FC<FormSectionProps> = ({
  title,
  children,
  testID,
}) => {
  return (
    <View style={styles.container} testID={testID}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.content}>{children}</View>
    </View>
  );
};

/**
 * Optimized StyleSheet for FormSection component.
 * Uses theme values for consistent design system integration.
 * 
 * @constant styles
 * @type {StyleSheet}
 * @since 1.0.0
 * 
 * @styles
 * - container: Main section container with bottom margin
 * - title: Bold section header with theme typography
 * - content: Styled content area with background and padding
 */
const styles = StyleSheet.create({
  /**
   * Main container for the form section.
   * Provides bottom margin for section separation.
   * 
   * @style container
   * @spacing marginBottom: large spacing
   */
  container: {
    marginBottom: spacing.lg,
  },

  /**
   * Styled content area within the section.
   * Provides background, padding, and rounded corners.
   * 
   * @style content
   * @colors theme surface background
   * @spacing padding: medium spacing
   * @border borderRadius: 8px
   */
  content: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.md,
  },

  /**
   * Section title header styling.
   * Bold typography with theme colors and spacing.
   * 
   * @style title
   * @typography fontSize: 18px, fontWeight: bold
   * @colors theme text color
   * @spacing marginBottom: small spacing
   */
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
});
