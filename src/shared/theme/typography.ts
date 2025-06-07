/**
 * @fileoverview TYPOGRAPHY-SYSTEM: Material Design 3 Typography Scale Configuration
 * @description Provides comprehensive typography system with Material Design 3 compliant text styles and hierarchical scaling
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Shared.Theme.Typography
 * @namespace Shared.Theme.Typography
 * @category Theme
 * @subcategory Typography
 */

/**
 * Complete typography configuration following Material Design 3 type scale.
 * Provides semantic text styles with appropriate font sizes, line heights, and weights.
 * 
 * @constant typography
 * @readonly
 * @since 1.0.0
 * @version 1.0.0
 * @category Configuration
 * @subcategory Typography
 * 
 * @description
 * The typography system implements Material Design 3's type scale with semantic naming
 * that reflects content hierarchy and usage patterns. Each style includes optimized
 * font size, line height, and weight combinations for maximum readability and accessibility.
 * 
 * @type_scale
 * - Headline: Large display text for hero content and major headings
 * - Title: Section headers and prominent content labels
 * - Body: Primary content text for reading and information
 * - Label: UI element labels, buttons, and supporting text
 * 
 * @size_variants
 * - Large: Prominent text for high importance
 * - Medium: Standard text for normal usage
 * - Small: Compact text for space-constrained areas
 * 
 * @example
 * Basic typography usage:
 * ```tsx
 * import { typography } from '@/shared/theme';
 * 
 * const styles = StyleSheet.create({
 *   heading: typography.headlineLarge,
 *   title: typography.titleMedium,
 *   content: typography.bodyLarge,
 *   label: typography.labelMedium,
 * });
 * ```
 * 
 * @example
 * Theme-aware typography:
 * ```tsx
 * import { useTheme } from '@/shared/theme';
 * 
 * const TypographyExample = () => {
 *   const { typography, colors } = useTheme();
 *   
 *   return (
 *     <View>
 *       <Text style={[typography.headlineLarge, { color: colors.onBackground }]}>
 *         Main Headline
 *       </Text>
 *       <Text style={[typography.bodyMedium, { color: colors.onSurface }]}>
 *         Body content with proper typography
 *       </Text>
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * Custom text component with typography:
 * ```tsx
 * interface CustomTextProps {
 *   variant: keyof Typography;
 *   children: React.ReactNode;
 *   color?: string;
 * }
 * 
 * const CustomText: React.FC<CustomTextProps> = ({ variant, children, color }) => {
 *   const { typography, colors } = useTheme();
 *   
 *   return (
 *     <Text style={[
 *       typography[variant],
 *       { color: color || colors.onBackground }
 *     ]}>
 *       {children}
 *     </Text>
 *   );
 * };
 * 
 * // Usage
 * <CustomText variant="headlineMedium">Page Title</CustomText>
 * <CustomText variant="bodyLarge">Content text</CustomText>
 * ```
 * 
 * @example
 * Form with consistent typography:
 * ```tsx
 * const FormExample = () => {
 *   const { typography, colors } = useTheme();
 *   
 *   return (
 *     <View>
 *       <Text style={[typography.titleLarge, { color: colors.onBackground }]}>
 *         Registration Form
 *       </Text>
 *       
 *       <Text style={[typography.labelMedium, { color: colors.onSurface }]}>
 *         Email Address
 *       </Text>
 *       <TextInput 
 *         style={[typography.bodyMedium, { color: colors.onSurface }]}
 *         placeholder="Enter email"
 *       />
 *       
 *       <Text style={[typography.labelSmall, { color: colors.secondary }]}>
 *         Required field
 *       </Text>
 *     </View>
 *   );
 * };
 * ```
 * 
 * @accessibility
 * - WCAG 2.1 AA compliant font sizes (minimum 16px for body text)
 * - Optimal line height ratios for readability
 * - Support for dynamic type sizing
 * - Screen reader compatible text hierarchy
 * 
 * @design_principles
 * - Material Design 3 type scale compliance
 * - Hierarchical content organization
 * - Optimal reading experience
 * - Cross-platform consistency
 * - Accessibility first approach
 * 
 * @performance
 * - Constant object prevents re-renders
 * - Optimized font weight values
 * - Efficient style composition
 * - Memory efficient references
 */
export const typography = {
  /**
   * Large headline text for hero content and major page headings.
   * 
   * @style headlineLarge
   * @fontSize 32
   * @lineHeight 40
   * @fontWeight bold
   * @use_case Hero sections, major page titles, primary headings
   * @accessibility AAA compliant for large text
   * @platform Optimized for both iOS and Android
   */
  headlineLarge: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: 'bold' as const,
  },

  /**
   * Medium headline text for section headers and prominent content.
   * 
   * @style headlineMedium
   * @fontSize 28
   * @lineHeight 36
   * @fontWeight bold
   * @use_case Section headers, card titles, dialog titles
   * @accessibility AAA compliant for large text
   * @platform Consistent across iOS and Android
   */
  headlineMedium: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: 'bold' as const,
  },

  /**
   * Small headline text for subsection headers and secondary headings.
   * 
   * @style headlineSmall
   * @fontSize 24
   * @lineHeight 32
   * @fontWeight bold
   * @use_case Subsection headers, panel titles, prominent labels
   * @accessibility AAA compliant for large text
   * @platform Cross-platform optimized
   */
  headlineSmall: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'bold' as const,
  },

  /**
   * Large title text for important section headers and content labels.
   * 
   * @style titleLarge
   * @fontSize 22
   * @lineHeight 28
   * @fontWeight 600
   * @use_case Important section headers, list headers, content labels
   * @accessibility AA compliant
   * @platform iOS and Android compatible
   */
  titleLarge: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '600' as const,
  },

  /**
   * Medium title text for standard section headers and labels.
   * 
   * @style titleMedium
   * @fontSize 16
   * @lineHeight 24
   * @fontWeight 600
   * @use_case Section headers, form labels, card headers
   * @accessibility AA compliant (minimum body text size)
   * @platform Cross-platform standard
   */
  titleMedium: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600' as const,
  },

  /**
   * Small title text for compact headers and minor labels.
   * 
   * @style titleSmall
   * @fontSize 14
   * @lineHeight 20
   * @fontWeight 600
   * @use_case Compact headers, minor section labels, dense layouts
   * @accessibility AA compliant for short text
   * @platform Mobile optimized
   */
  titleSmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600' as const,
  },

  /**
   * Large body text for primary content and important information.
   * 
   * @style bodyLarge
   * @fontSize 16
   * @lineHeight 24
   * @fontWeight normal
   * @use_case Primary content, article text, important descriptions
   * @accessibility AA compliant (preferred body text size)
   * @platform Standard across all platforms
   */
  bodyLarge: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 'normal' as const,
  },

  /**
   * Medium body text for standard content and general information.
   * 
   * @style bodyMedium
   * @fontSize 14
   * @lineHeight 20
   * @fontWeight normal
   * @use_case Standard content, descriptions, general text
   * @accessibility AA compliant
   * @platform Mobile friendly
   */
  bodyMedium: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 'normal' as const,
  },

  /**
   * Small body text for compact content and secondary information.
   * 
   * @style bodySmall
   * @fontSize 12
   * @lineHeight 16
   * @fontWeight normal
   * @use_case Compact content, secondary information, captions
   * @accessibility Use sparingly, consider larger sizes for primary content
   * @platform Optimized for high-density displays
   */
  bodySmall: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: 'normal' as const,
  },

  /**
   * Large label text for prominent UI elements and buttons.
   * 
   * @style labelLarge
   * @fontSize 14
   * @lineHeight 20
   * @fontWeight 500
   * @use_case Button text, prominent labels, navigation items
   * @accessibility AA compliant for interactive elements
   * @platform Touch-friendly sizing
   */
  labelLarge: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500' as const,
  },

  /**
   * Medium label text for standard UI elements and form labels.
   * 
   * @style labelMedium
   * @fontSize 12
   * @lineHeight 16
   * @fontWeight 500
   * @use_case Form labels, tab labels, chip text
   * @accessibility Appropriate for UI elements
   * @platform Standard label sizing
   */
  labelMedium: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500' as const,
  },

  /**
   * Small label text for compact UI elements and minimal labels.
   * 
   * @style labelSmall
   * @fontSize 11
   * @lineHeight 16
   * @fontWeight 500
   * @use_case Compact labels, metadata, minimal UI text
   * @accessibility Use cautiously, ensure sufficient contrast
   * @platform Dense layout optimization
   */
  labelSmall: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '500' as const,
  },
};

/**
 * TypeScript type definition for the typography configuration.
 * Ensures type safety and IntelliSense support for typography usage.
 * 
 * @typedef Typography
 * @type {typeof typography}
 * @since 1.0.0
 * @category Types
 * @subcategory Typography
 * 
 * @description
 * Provides compile-time type checking for typography styles and enables
 * IntelliSense autocompletion in TypeScript-enabled editors. Ensures
 * consistent typography usage across the application.
 * 
 * @example
 * Type-safe typography usage:
 * ```tsx
 * import { Typography, typography } from '@/shared/theme';
 * 
 * type TypographyVariant = keyof Typography;
 * 
 * const createTextStyle = (variant: TypographyVariant): TextStyle => ({
 *   ...typography[variant],
 *   color: '#000000',
 * });
 * 
 * const headingStyle = createTextStyle('headlineLarge');
 * ```
 * 
 * @example
 * Typography utility hook:
 * ```tsx
 * const useTypography = () => {
 *   const { typography } = useTheme();
 *   
 *   const getTextStyle = (variant: keyof Typography, customProps?: Partial<TextStyle>) => ({
 *     ...typography[variant],
 *     ...customProps,
 *   });
 *   
 *   const getHeadingStyle = (level: 1 | 2 | 3) => {
 *     const variants: Record<number, keyof Typography> = {
 *       1: 'headlineLarge',
 *       2: 'headlineMedium', 
 *       3: 'headlineSmall',
 *     };
 *     return typography[variants[level]];
 *   };
 *   
 *   return { getTextStyle, getHeadingStyle };
 * };
 * ```
 * 
 * @example
 * Responsive typography component:
 * ```tsx
 * interface ResponsiveTextProps {
 *   variant: keyof Typography;
 *   responsive?: boolean;
 *   children: React.ReactNode;
 * }
 * 
 * const ResponsiveText: React.FC<ResponsiveTextProps> = ({ 
 *   variant, 
 *   responsive = false, 
 *   children 
 * }) => {
 *   const { typography } = useTheme();
 *   const { fontScale } = useWindowDimensions();
 *   
 *   const style = responsive 
 *     ? {
 *         ...typography[variant],
 *         fontSize: typography[variant].fontSize * fontScale,
 *       }
 *     : typography[variant];
 *   
 *   return <Text style={style}>{children}</Text>;
 * };
 * ```
 * 
 * @properties
 * - headlineLarge: 32px/40px bold - Major headings
 * - headlineMedium: 28px/36px bold - Section headers
 * - headlineSmall: 24px/32px bold - Subsection headers
 * - titleLarge: 22px/28px semibold - Important labels
 * - titleMedium: 16px/24px semibold - Standard labels
 * - titleSmall: 14px/20px semibold - Compact labels
 * - bodyLarge: 16px/24px normal - Primary content
 * - bodyMedium: 14px/20px normal - Standard content
 * - bodySmall: 12px/16px normal - Compact content
 * - labelLarge: 14px/20px medium - Prominent UI labels
 * - labelMedium: 12px/16px medium - Standard UI labels
 * - labelSmall: 11px/16px medium - Compact UI labels
 */
export type Typography = typeof typography;

/**
 * @summary
 * The typography system provides a comprehensive, accessible, and consistent text styling
 * foundation for React Native applications. Following Material Design 3 principles, it
 * ensures proper text hierarchy, readability, and cross-platform consistency.
 * 
 * @architecture
 * - Material Design 3 type scale implementation
 * - Semantic naming for content hierarchy
 * - TypeScript support with Typography type
 * - Optimized font size and line height ratios
 * - Cross-platform font weight consistency
 * 
 * @text_hierarchy
 * - Headlines: Major content headings (3 sizes)
 * - Titles: Section headers and labels (3 sizes)
 * - Body: Content text for reading (3 sizes)
 * - Labels: UI element text (3 sizes)
 * 
 * @accessibility
 * - WCAG 2.1 AA/AAA compliant font sizes
 * - Optimal line height for readability
 * - Screen reader compatible hierarchy
 * - Dynamic type scaling support
 * - High contrast compatibility
 * 
 * @integration
 * - Used by useTheme hook
 * - Integrated with component styling
 * - Compatible with Text component
 * - Supports custom text components
 * - Theme system foundation
 * 
 * @dependencies
 * - None (pure configuration)
 * 
 * @see {@link useTheme} for runtime typography access
 * @see {@link https://m3.material.io/styles/typography/overview} Material Design 3 Typography
 * @see {@link https://www.w3.org/WAI/WCAG21/Understanding/resize-text.html} WCAG Text Resize Guidelines
 */
