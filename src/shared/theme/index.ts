/**
 * @fileoverview THEME-INDEX: Main Theme System Export Module
 * @description Central export module for the complete theme system including colors, typography, spacing, and theme hooks
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Shared.Theme
 * @namespace Shared.Theme.Index
 * @category Theme
 * @subcategory Index
 */

/**
 * Re-exports all color system components including light/dark themes and color types.
 * Provides consistent color palette management across the application.
 * 
 * @example
 * ```tsx
 * import { lightColors, darkColors, Colors } from '@/shared/theme';
 * 
 * const myColor: Colors['primary'] = lightColors.primary;
 * ```
 * 
 * @exports lightColors - Light theme color palette
 * @exports darkColors - Dark theme color palette  
 * @exports Colors - TypeScript type for color configuration
 * 
 * @see {@link colors.ts} for detailed color system documentation
 */
export * from './colors';

/**
 * Re-exports all typography system components including font sizes, weights, and line heights.
 * Provides consistent text styling across the application following Material Design 3.
 * 
 * @example
 * ```tsx
 * import { typography, Typography } from '@/shared/theme';
 * 
 * const headingStyle = typography.headlineLarge;
 * ```
 * 
 * @exports typography - Complete typography configuration object
 * @exports Typography - TypeScript type for typography configuration
 * 
 * @see {@link typography.ts} for detailed typography system documentation
 */
export * from './typography';

/**
 * Re-exports all spacing system components including predefined spacing values.
 * Provides consistent spacing and layout dimensions across the application.
 * 
 * @example
 * ```tsx
 * import { spacing, Spacing } from '@/shared/theme';
 * 
 * const marginValue = spacing.lg; // 24
 * ```
 * 
 * @exports spacing - Spacing configuration object with predefined values
 * @exports Spacing - TypeScript type for spacing configuration
 * 
 * @see {@link spacing.ts} for detailed spacing system documentation
 */
export * from './spacing';

/**
 * Re-exports the main theme hook and theme interface.
 * Provides runtime theme management with automatic dark/light mode switching.
 * 
 * @example
 * ```tsx
 * import { useTheme, Theme } from '@/shared/theme';
 * 
 * const MyComponent = () => {
 *   const theme = useTheme();
 *   
 *   return (
 *     <View style={{ backgroundColor: theme.colors.background }}>
 *       <Text style={theme.typography.bodyLarge}>Hello World</Text>
 *     </View>
 *   );
 * };
 * ```
 * 
 * @exports useTheme - React hook for accessing current theme
 * @exports Theme - TypeScript interface for complete theme object
 * 
 * @see {@link useTheme.ts} for detailed theme hook documentation
 */
export * from './useTheme';

/**
 * @overview Theme System Architecture
 * 
 * The theme system provides a comprehensive design foundation for the React Native application,
 * implementing Material Design 3 principles with support for both light and dark modes.
 * 
 * @features
 * - Automatic light/dark mode detection and switching
 * - Material Design 3 compliant typography scale
 * - Consistent color palette with semantic naming
 * - Standardized spacing system for layouts
 * - Type-safe theme configuration
 * - Runtime theme access via React hooks
 * - Centralized design token management
 * - Cross-platform consistency
 * 
 * @architecture
 * - colors.ts: Color palette definitions for light/dark themes
 * - typography.ts: Complete typography scale with Material Design 3 variants
 * - spacing.ts: Predefined spacing values for consistent layouts
 * - useTheme.ts: React hook for runtime theme access and management
 * - index.ts: Central export module for all theme components
 * 
 * @usage_pattern
 * ```tsx
 * // Component-level theme usage
 * import { useTheme } from '@/shared/theme';
 * 
 * const MyComponent = () => {
 *   const theme = useTheme();
 *   
 *   const styles = StyleSheet.create({
 *     container: {
 *       backgroundColor: theme.colors.background,
 *       padding: theme.spacing.md,
 *     },
 *     title: {
 *       ...theme.typography.headlineMedium,
 *       color: theme.colors.onBackground,
 *     },
 *   });
 * 
 *   return (
 *     <View style={styles.container}>
 *       <Text style={styles.title}>Themed Component</Text>
 *     </View>
 *   );
 * };
 * ```
 * 
 * @design_tokens
 * - Colors: Primary, secondary, background, surface, error with 'on' variants
 * - Typography: Headline, title, body, label variants in large/medium/small sizes
 * - Spacing: xs(4), sm(8), md(16), lg(24), xl(32), xxl(48), xxxl(64)
 * 
 * @best_practices
 * - Always use theme values instead of hardcoded colors/sizes
 * - Access theme through useTheme hook in components
 * - Follow Material Design 3 color semantics
 * - Use appropriate typography variants for content hierarchy
 * - Maintain consistent spacing using predefined values
 * - Test components in both light and dark modes
 * 
 * @dependencies
 * - react-native: useColorScheme for system theme detection
 * - Material Design 3: Typography and color system guidelines
 * 
 * @see {@link https://m3.material.io/} Material Design 3 Guidelines
 * @see {@link https://reactnative.dev/docs/usecolorscheme} React Native useColorScheme
 */
