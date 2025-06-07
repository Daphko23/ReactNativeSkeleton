/**
 * @fileoverview THEME-INDEX: Enterprise Theme System Exports
 * @description Central export point for the comprehensive theme system providing colors, spacing, typography, and theme configuration for enterprise applications
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Core.Theme
 * @namespace Core.Theme
 * @category Theme
 * @subcategory SystemExports
 */

/**
 * Color System Exports
 * 
 * Comprehensive color palette providing semantic color definitions,
 * accessibility-compliant color schemes, and consistent brand colors
 * for enterprise application theming.
 * 
 * @exports colors - Complete color palette object
 * @see {@link ./colors} for detailed color documentation
 * 
 * @example
 * ```tsx
 * import { colors } from '@/core/theme';
 * 
 * const MyComponent = () => (
 *   <View style={{ backgroundColor: colors.background }}>
 *     <Text style={{ color: colors.textPrimary }}>
 *       Themed Content
 *     </Text>
 *   </View>
 * );
 * ```
 */
export * from './colors';

/**
 * Spacing System Exports
 * 
 * Consistent spacing system providing standardized margins, padding,
 * and layout spacing values for cohesive visual design and responsive
 * layouts across all screen sizes.
 * 
 * @exports spacing - Spacing configuration object
 * @see {@link ./spacing} for detailed spacing documentation
 * 
 * @example
 * ```tsx
 * import { spacing } from '@/core/theme';
 * 
 * const styles = StyleSheet.create({
 *   container: {
 *     padding: spacing.medium,
 *     marginBottom: spacing.large,
 *   },
 * });
 * ```
 */
export * from './spacing';

/**
 * Typography System Exports
 * 
 * Complete typography system defining font families, sizes, weights,
 * and text styles for consistent and accessible text presentation
 * throughout the enterprise application.
 * 
 * @exports typography - Typography configuration object
 * @see {@link ./typography} for detailed typography documentation
 * 
 * @example
 * ```tsx
 * import { typography } from '@/core/theme';
 * 
 * const styles = StyleSheet.create({
 *   title: {
 *     ...typography.heading1,
 *     color: colors.textPrimary,
 *   },
 *   body: {
 *     ...typography.body,
 *     lineHeight: typography.lineHeights.relaxed,
 *   },
 * });
 * ```
 */
export * from './typography';

/**
 * Theme Configuration Exports
 * 
 * Main theme configuration system providing theme providers, hooks,
 * and utilities for dynamic theming, dark/light mode switching,
 * and comprehensive theme management.
 * 
 * @exports theme - Main theme configuration
 * @exports ThemeProvider - Theme context provider
 * @exports useTheme - Theme hook for components
 * @see {@link ./theme} for detailed theme system documentation
 * 
 * @example
 * ```tsx
 * import { ThemeProvider, useTheme } from '@/core/theme';
 * 
 * const App = () => (
 *   <ThemeProvider>
 *     <MyThemedApp />
 *   </ThemeProvider>
 * );
 * 
 * const MyThemedApp = () => {
 *   const { theme, isDark, toggleTheme } = useTheme();
 *   
 *   return (
 *     <View style={{ backgroundColor: theme.colors.background }}>
 *       <Button onPress={toggleTheme}>
 *         Switch to {isDark ? 'Light' : 'Dark'} Theme
 *       </Button>
 *     </View>
 *   );
 * };
 * ```
 */
export * from './theme';
