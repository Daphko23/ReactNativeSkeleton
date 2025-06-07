/**
 * @fileoverview SPACING-SYSTEM: Consistent Spacing Configuration
 * @description Provides standardized spacing values for consistent layouts and component spacing throughout the application
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Shared.Theme.Spacing
 * @namespace Shared.Theme.Spacing
 * @category Theme
 * @subcategory Spacing
 */

/**
 * Standardized spacing values following an 8-point grid system.
 * Provides consistent spacing throughout the application for margins, padding, and layout gaps.
 * 
 * @constant spacing
 * @readonly
 * @since 1.0.0
 * @version 1.0.0
 * @category Configuration
 * @subcategory Spacing
 * 
 * @description
 * The spacing system follows Material Design principles with an 8-point grid base unit.
 * All values are multiples of 4 to ensure pixel-perfect alignment across different screen densities.
 * 
 * @grid_system
 * - Base unit: 4px
 * - Scale: Exponential progression for visual hierarchy
 * - Platform: Optimized for both iOS and Android
 * - Accessibility: Meets minimum touch target requirements
 * 
 * @example
 * Basic spacing usage:
 * ```tsx
 * import { spacing } from '@/shared/theme';
 * 
 * const styles = StyleSheet.create({
 *   container: {
 *     margin: spacing.md,        // 16px
 *     padding: spacing.lg,       // 24px
 *     gap: spacing.sm,          // 8px
 *   },
 *   button: {
 *     paddingHorizontal: spacing.xl,  // 32px
 *     paddingVertical: spacing.md,    // 16px
 *   },
 * });
 * ```
 * 
 * @example
 * Responsive spacing with theme:
 * ```tsx
 * import { useTheme } from '@/shared/theme';
 * 
 * const MyComponent = () => {
 *   const { spacing } = useTheme();
 *   
 *   return (
 *     <View style={{
 *       marginTop: spacing.lg,
 *       paddingHorizontal: spacing.md,
 *       gap: spacing.sm
 *     }}>
 *       <Text>Consistently spaced content</Text>
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * Layout grid usage:
 * ```tsx
 * const GridLayout = () => (
 *   <View style={{
 *     padding: spacing.md,
 *     gap: spacing.sm,
 *     flexDirection: 'row',
 *     flexWrap: 'wrap',
 *   }}>
 *     <View style={{ flex: 1, margin: spacing.xs }}>Item 1</View>
 *     <View style={{ flex: 1, margin: spacing.xs }}>Item 2</View>
 *   </View>
 * );
 * ```
 * 
 * @example
 * Component spacing patterns:
 * ```tsx
 * const CardComponent = () => (
 *   <View style={{
 *     margin: spacing.md,           // Card margin
 *     padding: spacing.lg,          // Card padding
 *     borderRadius: spacing.sm,     // Corner radius
 *   }}>
 *     <Text style={{ marginBottom: spacing.md }}>Title</Text>
 *     <Text style={{ marginBottom: spacing.sm }}>Content</Text>
 *     <View style={{ marginTop: spacing.lg }}>
 *       <Button title="Action" />
 *     </View>
 *   </View>
 * );
 * ```
 * 
 * @spacing_values
 * - xs (4px): Minimal spacing for tight layouts, border radius, small gaps
 * - sm (8px): Small spacing for list items, small components, minimal padding
 * - md (16px): Standard spacing for most UI elements, default padding/margin
 * - lg (24px): Large spacing for sections, prominent padding, visual separation
 * - xl (32px): Extra large spacing for major sections, generous padding
 * - xxl (48px): Very large spacing for page sections, significant visual breaks
 * - xxxl (64px): Maximum spacing for major layout divisions, hero sections
 * 
 * @use_cases
 * - Component internal spacing (padding)
 * - Component external spacing (margin)
 * - Layout gaps and gutters
 * - Border radius values
 * - List item spacing
 * - Form field spacing
 * - Card and container spacing
 * - Navigation spacing
 * - Grid system spacing
 * 
 * @accessibility
 * - Minimum touch target size (44px) achievable with spacing.lg + content
 * - Sufficient spacing for screen readers to distinguish elements
 * - Clear visual hierarchy through spacing relationships
 * - Consistent spacing for predictable user experience
 * 
 * @performance
 * - Constant object prevents unnecessary re-renders
 * - Numeric values for optimal performance
 * - No runtime calculations required
 * - Memory efficient constant references
 * 
 * @best_practices
 * - Use spacing values instead of hardcoded numbers
 * - Maintain consistent spacing patterns across components
 * - Use appropriate spacing for visual hierarchy
 * - Consider touch target requirements for interactive elements
 * - Test spacing on different screen sizes
 * - Follow platform-specific spacing guidelines when needed
 * 
 * @design_principles
 * - 8-point grid system alignment
 * - Exponential scale for visual hierarchy
 * - Platform consistency
 * - Accessibility compliance
 * - Responsive design support
 */
export const spacing = {
  /**
   * Extra small spacing value.
   * 
   * @value 4
   * @unit px
   * @use_case Border radius, minimal gaps, tight layouts
   * @example `borderRadius: spacing.xs`
   */
  xs: 4,

  /**
   * Small spacing value.
   * 
   * @value 8
   * @unit px
   * @use_case List items, small component padding, minimal separation
   * @example `gap: spacing.sm`
   */
  sm: 8,

  /**
   * Medium spacing value (default).
   * 
   * @value 16
   * @unit px
   * @use_case Standard padding/margin, default component spacing
   * @example `padding: spacing.md`
   */
  md: 16,

  /**
   * Large spacing value.
   * 
   * @value 24
   * @unit px
   * @use_case Section spacing, prominent padding, visual separation
   * @example `marginVertical: spacing.lg`
   */
  lg: 24,

  /**
   * Extra large spacing value.
   * 
   * @value 32
   * @unit px
   * @use_case Major sections, generous padding, button padding
   * @example `paddingHorizontal: spacing.xl`
   */
  xl: 32,

  /**
   * Double extra large spacing value.
   * 
   * @value 48
   * @unit px
   * @use_case Page sections, significant visual breaks, hero spacing
   * @example `marginTop: spacing.xxl`
   */
  xxl: 48,

  /**
   * Triple extra large spacing value.
   * 
   * @value 64
   * @unit px
   * @use_case Major layout divisions, maximum spacing, hero sections
   * @example `paddingVertical: spacing.xxxl`
   */
  xxxl: 64,
};

/**
 * TypeScript type definition for the spacing configuration.
 * Ensures type safety when accessing spacing values.
 * 
 * @typedef Spacing
 * @type {typeof spacing}
 * @since 1.0.0
 * @category Types
 * @subcategory Spacing
 * 
 * @description
 * Provides compile-time type checking for spacing values and enables
 * IntelliSense autocompletion in TypeScript-enabled editors.
 * 
 * @example
 * Type-safe spacing usage:
 * ```tsx
 * import { Spacing, spacing } from '@/shared/theme';
 * 
 * const createPadding = (size: keyof Spacing): number => {
 *   return spacing[size]; // Type-safe access
 * };
 * 
 * const padding = createPadding('lg'); // 24
 * ```
 * 
 * @example
 * Custom spacing utility:
 * ```tsx
 * type SpacingKey = keyof Spacing;
 * 
 * const useSpacing = () => {
 *   const getSpacing = (key: SpacingKey): number => spacing[key];
 *   const getMultipliedSpacing = (key: SpacingKey, multiplier: number): number => 
 *     spacing[key] * multiplier;
 *   
 *   return { getSpacing, getMultipliedSpacing };
 * };
 * ```
 * 
 * @properties
 * - xs: 4 - Extra small spacing
 * - sm: 8 - Small spacing  
 * - md: 16 - Medium spacing (default)
 * - lg: 24 - Large spacing
 * - xl: 32 - Extra large spacing
 * - xxl: 48 - Double extra large spacing
 * - xxxl: 64 - Triple extra large spacing
 */
export type Spacing = typeof spacing;

/**
 * @summary
 * The spacing system provides a foundation for consistent layouts and visual hierarchy
 * throughout the React Native application. Following Material Design principles with
 * an 8-point grid system, it ensures pixel-perfect alignment and accessibility compliance
 * across all screen densities and platforms.
 * 
 * @architecture
 * - Constant object for optimal performance
 * - TypeScript support with Spacing type
 * - 8-point grid system alignment
 * - Exponential scale progression
 * - Platform-agnostic values
 * 
 * @integration
 * - Used by useTheme hook
 * - Integrated with component styling
 * - Compatible with StyleSheet
 * - Supports custom spacing utilities
 * - Theme system foundation
 * 
 * @dependencies
 * - None (pure configuration)
 * 
 * @see {@link useTheme} for runtime spacing access
 * @see {@link https://m3.material.io/foundations/layout/understanding-layout/spacing} Material Design Spacing Guidelines
 */
