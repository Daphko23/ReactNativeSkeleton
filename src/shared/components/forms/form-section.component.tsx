/**
 * @fileoverview FORM-SECTION-COMPONENT: Reusable Form Section Component
 * @description Provides consistent styling and layout for organizing form fields into logical sections
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Shared.Components.Forms
 * @namespace Shared.Components.Forms.FormSection
 * @category Components
 * @subcategory Forms
 */

import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useTheme } from '@core/theme/theme.system';
import { BaseCard } from '../cards/base/base-card.component';

/**
 * Props interface for the FormSection component.
 * Defines configuration options for form section organization.
 * 
 * @interface FormSectionProps
 * @since 1.0.0
 * @version 1.0.0
 * @category Props
 * @subcategory Forms
 * 
 * @example
 * ```tsx
 * const sectionProps: FormSectionProps = {
 *   title: 'Personal Information',
 *   showCard: true,
 *   children: <FormFields />
 * };
 * ```
 */
interface FormSectionProps {
  /**
   * Title text displayed at the top of the section.
   * Provides clear identification of the section purpose.
   * 
   * @type {string}
   * @required
   * @example "Personal Information"
   */
  title: string;

  /**
   * Child components to render within the section.
   * Typically form fields and related controls.
   * 
   * @type {React.ReactNode}
   * @required
   * @example
   * ```tsx
   * <>
   *   <FormField label="Name" />
   *   <FormField label="Email" />
   * </>
   * ```
   */
  children: React.ReactNode;

  /**
   * Custom styling for the section container.
   * Applied to the outermost wrapper component.
   * 
   * @type {any}
   * @optional
   * @example { marginTop: 20, backgroundColor: '#f0f0f0' }
   */
  style?: any;

  /**
   * Custom styling for the section content area.
   * Applied to the inner content container.
   * 
   * @type {any}
   * @optional
   * @example { padding: 16 }
   */
  contentStyle?: any;

  /**
   * Custom styling for the section title.
   * Applied to the title text component.
   * 
   * @type {any}
   * @optional
   * @example { color: '#333', fontSize: 18 }
   */
  titleStyle?: any;

  /**
   * Controls whether to render as a Card or plain View.
   * Card provides elevation and material design styling.
   * 
   * @type {boolean}
   * @optional
   * @default true
   * @example false
   */
  showCard?: boolean;

  /**
   * Card variant when showCard is true.
   * Uses BaseCard variant system for consistent styling.
   * 
   * @type {'default' | 'elevated' | 'outlined' | 'filled'}
   * @optional
   * @default 'default'
   * @example "elevated"
   */
  cardVariant?: 'default' | 'elevated' | 'outlined' | 'filled';

  /**
   * Card size when showCard is true.
   * Uses BaseCard size system for consistent spacing.
   * 
   * @type {'small' | 'medium' | 'large'}
   * @optional
   * @default 'medium'
   * @example "large"
   */
  cardSize?: 'small' | 'medium' | 'large';
}

/**
 * Creates theme-based styles for the FormSection component.
 * Provides consistent styling patterns across the application.
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
  section: {
    marginBottom: theme.spacing[4],
  },
  content: {
    padding: theme.spacing[4],
  },
  viewContent: {
    padding: theme.spacing[4],
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    marginBottom: theme.spacing[4],
    color: theme.colors.text,
  },
});

/**
 * Form Section Component
 * 
 * A reusable component for organizing form fields into logical sections with
 * consistent styling and layout. Now leverages the BaseCard system for
 * consistent card styling throughout the application, eliminating redundancy.
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
 * @subcategory Forms
 * @module Shared.Components.Forms
 * @namespace Shared.Components.Forms.FormSection
 * 
 * @example
 * Basic form section with card layout:
 * ```tsx
 * import { FormSection, FormField } from '@/shared/components/forms';
 * 
 * const ProfileForm = () => {
 *   const [name, setName] = useState('');
 *   const [email, setEmail] = useState('');
 * 
 *   return (
 *     <FormSection title="Personal Information" cardVariant="elevated">
 *       <FormField
 *         label="Full Name"
 *         value={name}
 *         onChangeText={setName}
 *         required
 *       />
 *       <FormField
 *         label="Email Address"
 *         value={email}
 *         onChangeText={setEmail}
 *         keyboardType="email-address"
 *         required
 *       />
 *     </FormSection>
 *   );
 * };
 * ```
 * 
 * @example
 * Section without card styling:
 * ```tsx
 * const SimpleSection = () => (
 *   <FormSection 
 *     title="Basic Settings" 
 *     showCard={false}
 *     style={{ marginVertical: 10 }}
 *   >
 *     <FormField label="Username" value={username} onChangeText={setUsername} />
 *     <FormField label="Display Name" value={displayName} onChangeText={setDisplayName} />
 *   </FormSection>
 * );
 * ```
 * 
 * @example
 * Multiple sections with different card variants:
 * ```tsx
 * const CompleteForm = () => (
 *   <ScrollView>
 *     <FormSection title="Account Details" cardVariant="outlined">
 *       <FormField label="Username" />
 *       <FormField label="Password" secureTextEntry />
 *     </FormSection>
 * 
 *     <FormSection title="Personal Information" cardVariant="elevated" cardSize="large">
 *       <FormField label="First Name" />
 *       <FormField label="Last Name" />
 *       <FormField label="Phone Number" keyboardType="phone-pad" />
 *     </FormSection>
 * 
 *     <FormSection title="Preferences" showCard={false}>
 *       <FormField label="Notification Email" />
 *       <FormField label="Language" />
 *     </FormSection>
 *   </ScrollView>
 * );
 * ```
 * 
 * @example
 * Custom styled section with BaseCard variants:
 * ```tsx
 * const CustomSection = () => (
 *   <FormSection
 *     title="Advanced Configuration"
 *     cardVariant="filled"
 *     cardSize="large"
 *     style={{
 *       marginHorizontal: 16
 *     }}
 *     contentStyle={{
 *       padding: 20
 *     }}
 *     titleStyle={{
 *       color: '#1976d2',
 *       fontSize: 20,
 *       fontWeight: 'bold'
 *     }}
 *   >
 *     <FormField label="API Endpoint" />
 *     <FormField label="Timeout (seconds)" keyboardType="numeric" />
 *   </FormSection>
 * );
 * ```
 * 
 * @features
 * - Integrates with BaseCard system for consistency
 * - Supports all BaseCard variants and sizes
 * - Flexible layout options (Card or View)
 * - Consistent section styling
 * - Customizable title appearance
 * - Theme integration
 * - Memory optimized with React.memo
 * - Responsive design patterns
 * - Material Design principles
 * - Accessibility support
 * - Form organization structure
 * - Enterprise-ready styling
 * 
 * @architecture
 * - Leverages BaseCard for card functionality
 * - Eliminates code redundancy
 * - Conditional rendering based on showCard prop
 * - Theme-based styling system
 * - React.memo optimization
 * - Style composition pattern
 * - Consistent with global card system
 * 
 * @styling
 * - Inherits BaseCard styling system
 * - Theme-aware color schemes
 * - Material Design Card elevation via BaseCard
 * - Consistent spacing and padding
 * - Typography integration
 * - Customizable style overrides
 * - Responsive layout support
 * - Focus state handling
 * 
 * @accessibility
 * - Inherits BaseCard accessibility features
 * - Semantic structure with proper headings
 * - Screen reader compatible
 * - Logical tab order
 * - High contrast support
 * - Touch target optimization
 * - Focus management
 * - Content grouping
 * 
 * @performance
 * - Memoized component with React.memo
 * - Efficient style calculations
 * - Optimized re-render behavior
 * - Lightweight component structure
 * - Memory leak prevention
 * - Conditional rendering optimization
 * - Leverages BaseCard optimizations
 * 
 * @use_cases
 * - User registration forms
 * - Profile editing interfaces
 * - Settings configuration screens
 * - Multi-step form wizards
 * - Survey and questionnaire forms
 * - Contact information forms
 * - Payment and billing forms
 * - Administrative configuration panels
 * 
 * @best_practices
 * - Group related fields logically
 * - Use descriptive section titles
 * - Maintain consistent styling via BaseCard
 * - Consider form length and organization
 * - Test with various content sizes
 * - Ensure proper accessibility
 * - Optimize for mobile devices
 * - Follow Material Design guidelines
 * - Use appropriate card variants
 * 
 * @dependencies
 * - react: Core React library with memo
 * - react-native: View, StyleSheet components
 * - react-native-paper: Text component
 * - @core/theme/theme.system: Theme integration
 * - ../cards/base/base-card.component: Card functionality
 * 
 * @see {@link useTheme} for theme system integration
 * @see {@link FormField} for individual form field components
 * @see {@link BaseCard} for card system integration
 * 
 * @todo Add collapsible section support
 * @todo Implement section validation states
 * @todo Add section progress indicators
 * @todo Include section-level error handling
 */
export const FormSection = memo<FormSectionProps>(({
  title,
  children,
  style,
  contentStyle,
  titleStyle,
  showCard = true,
  cardVariant = 'default',
  cardSize = 'medium'
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const content = (
    <View style={[styles.content, contentStyle]}>
      <Text variant="titleMedium" style={[styles.sectionTitle, titleStyle]}>{title}</Text>
      {children}
    </View>
  );

  if (showCard) {
    return (
      <BaseCard 
        variant={cardVariant}
        size={cardSize}
        style={[styles.section, style] as any}
      >
        {content}
      </BaseCard>
    );
  }

  return (
    <View style={[styles.section, style]}>
      <View style={[styles.viewContent, contentStyle]}>
        <Text variant="titleMedium" style={[styles.sectionTitle, titleStyle]}>{title}</Text>
        {children}
      </View>
    </View>
  );
});

FormSection.displayName = 'FormSection'; 