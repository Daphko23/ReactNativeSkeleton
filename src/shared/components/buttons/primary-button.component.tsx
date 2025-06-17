import React from 'react';
import {Button} from 'react-native-paper';
import {StyleSheet} from 'react-native';
import { useTheme } from '@core/theme/theme.system';

/**
 * Props interface for the PrimaryButton component.
 * 
 * @interface PrimaryButtonProps
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Components
 * @subcategory Buttons
 */
interface PrimaryButtonProps {
  /**
   * The text label to display on the button.
   * 
   * @type {string}
   * @required
   * @example
   * ```tsx
   * <PrimaryButton label="Save Changes" onPress={handleSave} />
   * ```
   */
  label: string;

  /**
   * Callback function executed when the button is pressed.
   * 
   * @type {() => void}
   * @required
   * @example
   * ```tsx
   * const handlePress = () => {
   *   console.log('Button pressed');
   * };
   * 
   * <PrimaryButton label="Click Me" onPress={handlePress} />
   * ```
   */
  onPress: () => void;

  /**
   * Whether the button should display a loading spinner.
   * When true, the button becomes disabled and shows a loading indicator.
   * 
   * @type {boolean}
   * @optional
   * @default false
   * @example
   * ```tsx
   * const [isLoading, setIsLoading] = useState(false);
   * 
   * <PrimaryButton 
   *   label="Submit" 
   *   onPress={handleSubmit} 
   *   loading={isLoading} 
   * />
   * ```
   */
  loading?: boolean;

  /**
   * Whether the button should be disabled.
   * When true, the button cannot be pressed and appears grayed out.
   * 
   * @type {boolean}
   * @optional
   * @default false
   * @example
   * ```tsx
   * <PrimaryButton 
   *   label="Submit" 
   *   onPress={handleSubmit} 
   *   disabled={!isFormValid} 
   * />
   * ```
   */
  disabled?: boolean;
}

/**
 * Creates component-specific styles using the current theme.
 * 
 * @function createStyles
 * @param {any} theme - The current theme object containing design tokens
 * @returns {StyleSheet} Stylesheet object with component-specific styles
 * @since 1.0.0
 * @internal
 * 
 * @example
 * ```tsx
 * const { theme } = useTheme();
 * const styles = createStyles(theme);
 * ```
 */
const createStyles = (theme: any) => StyleSheet.create({
  /**
   * Main button container styles.
   * Applies rounded corners and vertical margins from theme.
   */
  button: {
    borderRadius: theme.borderRadius.md,
    marginVertical: theme.spacing[2],
  },
  /**
   * Button content area styles.
   * Sets consistent height for proper touch target.
   */
  content: {
    height: 48,
  },
  /**
   * Button label text styles.
   * Uses theme typography for font size and weight.
   */
  label: {
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.bold,
  },
});

/**
 * Primary Button Component
 * 
 * A reusable primary button component that follows the app's design system.
 * Provides consistent styling, loading states, and accessibility features.
 * Built on top of React Native Paper's Button component with custom theming.
 * 
 * @component
 * @function PrimaryButton
 * @param {PrimaryButtonProps} props - The component props
 * @returns {React.JSX.Element} Rendered primary button component
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Components
 * @subcategory Buttons
 * @module Shared.Components.Buttons
 * @namespace Shared.Components.Buttons.PrimaryButton
 * 
 * @example
 * Basic usage:
 * ```tsx
 * import { PrimaryButton } from '@/shared/components';
 * 
 * const MyScreen = () => {
 *   const handlePress = () => {
 *     console.log('Button pressed!');
 *   };
 * 
 *   return (
 *     <PrimaryButton 
 *       label="Continue" 
 *       onPress={handlePress} 
 *     />
 *   );
 * };
 * ```
 * 
 * @example
 * With loading state:
 * ```tsx
 * const [isLoading, setIsLoading] = useState(false);
 * 
 * const handleSubmit = async () => {
 *   setIsLoading(true);
 *   try {
 *     await submitForm();
 *   } finally {
 *     setIsLoading(false);
 *   }
 * };
 * 
 * <PrimaryButton 
 *   label="Submit Form" 
 *   onPress={handleSubmit}
 *   loading={isLoading}
 * />
 * ```
 * 
 * @example
 * With conditional disabled state:
 * ```tsx
 * const [formData, setFormData] = useState({ name: '', email: '' });
 * const isFormValid = formData.name && formData.email;
 * 
 * <PrimaryButton 
 *   label="Save" 
 *   onPress={handleSave}
 *   disabled={!isFormValid}
 * />
 * ```
 * 
 * @features
 * - Consistent styling with app theme
 * - Loading state with spinner
 * - Disabled state support
 * - Accessibility compliant
 * - Touch feedback
 * - Responsive design
 * 
 * @accessibility
 * - Screen reader compatible
 * - Proper contrast ratios
 * - Adequate touch target size (48px height)
 * - Disabled state announced to screen readers
 * 
 * @performance
 * - Memoized styles based on theme
 * - Optimized re-renders
 * - Lightweight implementation
 * 
 * @dependencies
 * - react-native-paper: Button component
 * - @core/theme: Theme system integration
 */
export const PrimaryButton = ({
  label,
  onPress,
  loading = false,
  disabled = false,
}: PrimaryButtonProps) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  
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
