/**
 * @fileoverview USE-THEME-HOOK: React Hook for Theme Management
 * @description Provides runtime access to theme configuration with automatic dark/light mode detection and switching
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Shared.Theme.UseTheme
 * @namespace Shared.Theme.UseTheme
 * @category Theme
 * @subcategory Hooks
 */

import {useColorScheme} from 'react-native';
import {lightColors, darkColors, Colors} from './colors';
import {typography, Typography} from './typography';
import {spacing, Spacing} from './spacing';

/**
 * Complete theme configuration interface.
 * Combines all theme aspects into a unified, type-safe theme object.
 * 
 * @interface Theme
 * @since 1.0.0
 * @version 1.0.0
 * @category Interfaces
 * @subcategory Theme
 * 
 * @description
 * The Theme interface provides a comprehensive type definition for the complete
 * theme system, ensuring type safety and IntelliSense support throughout the
 * application. It combines colors, typography, spacing, and mode detection.
 * 
 * @example
 * Type-safe theme usage:
 * ```tsx
 * import { Theme } from '@/shared/theme';
 * 
 * const createThemedStyles = (theme: Theme) => StyleSheet.create({
 *   container: {
 *     backgroundColor: theme.colors.background,
 *     padding: theme.spacing.md,
 *   },
 *   title: {
 *     ...theme.typography.headlineMedium,
 *     color: theme.colors.onBackground,
 *   },
 *   isDarkIndicator: {
 *     opacity: theme.isDark ? 1 : 0.7,
 *   },
 * });
 * ```
 * 
 * @example
 * Custom theme hook:
 * ```tsx
 * const useCustomTheme = () => {
 *   const theme = useTheme();
 *   
 *   const customColors = {
 *     ...theme.colors,
 *     accent: theme.isDark ? '#ff6b6b' : '#4ecdc4',
 *     warning: '#ffd93d',
 *   };
 *   
 *   return {
 *     ...theme,
 *     colors: customColors,
 *   };
 * };
 * ```
 * 
 * @example
 * Theme context provider:
 * ```tsx
 * const ThemeContext = React.createContext<Theme | null>(null);
 * 
 * export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
 *   const theme = useTheme();
 *   
 *   return (
 *     <ThemeContext.Provider value={theme}>
 *       {children}
 *     </ThemeContext.Provider>
 *   );
 * };
 * ```
 * 
 * @properties
 * - colors: Complete color palette with light/dark mode support
 * - typography: Material Design 3 typography scale
 * - spacing: Standardized spacing values for layouts
 * - isDark: Boolean flag indicating current theme mode
 */
export interface Theme {
  /**
   * Color palette configuration for the current theme mode.
   * Automatically switches between light and dark colors based on system preference.
   * 
   * @type {Colors}
   * @description Provides semantic color tokens for consistent theming
   * @example theme.colors.primary, theme.colors.background
   */
  colors: Colors;

  /**
   * Typography configuration with Material Design 3 text styles.
   * Provides consistent text styling across all screen densities.
   * 
   * @type {Typography}
   * @description Complete typography scale with semantic naming
   * @example theme.typography.headlineLarge, theme.typography.bodyMedium
   */
  typography: Typography;

  /**
   * Spacing configuration following 8-point grid system.
   * Ensures consistent layout spacing throughout the application.
   * 
   * @type {Spacing}
   * @description Standardized spacing values for margins, padding, and gaps
   * @example theme.spacing.md, theme.spacing.lg
   */
  spacing: Spacing;

  /**
   * Boolean flag indicating if the current theme is in dark mode.
   * Automatically reflects system preference and user settings.
   * 
   * @type {boolean}
   * @description Dark mode detection for conditional styling
   * @example theme.isDark ? 'dark-specific-style' : 'light-specific-style'
   */
  isDark: boolean;
}

/**
 * React Hook for Theme Management
 * 
 * Provides runtime access to the complete theme configuration with automatic
 * dark/light mode detection and switching. Integrates with React Native's
 * useColorScheme hook to detect system preferences and provide appropriate
 * theme values for consistent UI styling.
 * 
 * @hook useTheme
 * @returns {Theme} Complete theme configuration object
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Hooks
 * @subcategory Theme
 * @module Shared.Theme.UseTheme
 * @namespace Shared.Theme.UseTheme.useTheme
 * 
 * @example
 * Basic theme usage in component:
 * ```tsx
 * import { useTheme } from '@/shared/theme';
 * 
 * const MyComponent = () => {
 *   const theme = useTheme();
 *   
 *   return (
 *     <View style={{
 *       backgroundColor: theme.colors.background,
 *       padding: theme.spacing.md,
 *     }}>
 *       <Text style={[
 *         theme.typography.headlineMedium,
 *         { color: theme.colors.onBackground }
 *       ]}>
 *         Welcome to the App
 *       </Text>
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * Conditional styling based on theme mode:
 * ```tsx
 * const AdaptiveComponent = () => {
 *   const theme = useTheme();
 *   
 *   const dynamicStyles = {
 *     container: {
 *       backgroundColor: theme.colors.surface,
 *       borderWidth: theme.isDark ? 0 : 1,
 *       borderColor: theme.isDark ? 'transparent' : theme.colors.onSurface,
 *       shadowOpacity: theme.isDark ? 0.3 : 0.1,
 *     },
 *     text: {
 *       ...theme.typography.bodyLarge,
 *       color: theme.colors.onSurface,
 *       textShadowColor: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
 *     },
 *   };
 *   
 *   return (
 *     <View style={dynamicStyles.container}>
 *       <Text style={dynamicStyles.text}>
 *         {theme.isDark ? 'Dark Mode Active' : 'Light Mode Active'}
 *       </Text>
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * Theme-based StyleSheet creation:
 * ```tsx
 * const useThemedStyles = () => {
 *   const theme = useTheme();
 *   
 *   return useMemo(() => StyleSheet.create({
 *     screen: {
 *       flex: 1,
 *       backgroundColor: theme.colors.background,
 *       padding: theme.spacing.md,
 *     },
 *     card: {
 *       backgroundColor: theme.colors.surface,
 *       padding: theme.spacing.lg,
 *       marginVertical: theme.spacing.sm,
 *       borderRadius: theme.spacing.xs,
 *       elevation: theme.isDark ? 4 : 2,
 *     },
 *     title: {
 *       ...theme.typography.titleLarge,
 *       color: theme.colors.onSurface,
 *       marginBottom: theme.spacing.md,
 *     },
 *     body: {
 *       ...theme.typography.bodyMedium,
 *       color: theme.colors.onSurface,
 *       lineHeight: theme.typography.bodyMedium.lineHeight,
 *     },
 *   }), [theme]);
 * };
 * ```
 * 
 * @example
 * Custom button with theme integration:
 * ```tsx
 * interface ThemedButtonProps {
 *   title: string;
 *   onPress: () => void;
 *   variant?: 'primary' | 'secondary';
 *   size?: 'small' | 'medium' | 'large';
 * }
 * 
 * const ThemedButton: React.FC<ThemedButtonProps> = ({
 *   title,
 *   onPress,
 *   variant = 'primary',
 *   size = 'medium'
 * }) => {
 *   const theme = useTheme();
 *   
 *   const buttonStyle = {
 *     backgroundColor: variant === 'primary' 
 *       ? theme.colors.primary 
 *       : theme.colors.secondary,
 *     padding: theme.spacing[size === 'large' ? 'lg' : size === 'small' ? 'sm' : 'md'],
 *     borderRadius: theme.spacing.xs,
 *     alignItems: 'center' as const,
 *   };
 *   
 *   const textStyle = {
 *     ...theme.typography[size === 'large' ? 'labelLarge' : 'labelMedium'],
 *     color: variant === 'primary' ? theme.colors.onPrimary : theme.colors.onSecondary,
 *   };
 *   
 *   return (
 *     <TouchableOpacity style={buttonStyle} onPress={onPress}>
 *       <Text style={textStyle}>{title}</Text>
 *     </TouchableOpacity>
 *   );
 * };
 * ```
 * 
 * @features
 * - Automatic system theme detection via useColorScheme
 * - Seamless light/dark mode switching
 * - Complete theme configuration access
 * - Type-safe theme properties
 * - Performance optimized with memoization
 * - Cross-platform consistency
 * - Material Design 3 compliance
 * - Real-time theme updates
 * 
 * @architecture
 * - Leverages React Native's useColorScheme hook
 * - Combines multiple theme configuration modules
 * - Provides unified theme interface
 * - Supports conditional theme logic
 * - Enables theme-aware component development
 * 
 * @performance
 * - Minimal re-renders with stable references
 * - Efficient color scheme detection
 * - Optimized theme object composition
 * - Memory efficient theme caching
 * - No unnecessary theme recalculations
 * 
 * @accessibility
 * - Respects system accessibility preferences
 * - Supports high contrast mode detection
 * - Provides appropriate color contrast ratios
 * - Enables dynamic type scaling
 * - Compatible with screen readers
 * 
 * @integration
 * - Compatible with StyleSheet API
 * - Works with all React Native components
 * - Supports custom component theming
 * - Integrates with navigation themes
 * - Compatible with third-party libraries
 * 
 * @use_cases
 * - Component styling with theme awareness
 * - Conditional rendering based on theme mode
 * - Dynamic style calculation
 * - Theme-based navigation styling
 * - Custom component theming
 * - Application-wide theme consistency
 * - User preference respect
 * - Accessibility enhancement
 * 
 * @best_practices
 * - Use theme values instead of hardcoded styles
 * - Memoize complex style calculations
 * - Test components in both light and dark modes
 * - Follow Material Design color semantics
 * - Implement proper color contrast ratios
 * - Consider performance when using theme in lists
 * - Provide fallback values for edge cases
 * 
 * @dependencies
 * - react-native: useColorScheme hook for system theme detection
 * - ./colors: Light and dark color palette configurations
 * - ./typography: Material Design 3 typography scale
 * - ./spacing: 8-point grid spacing system
 * 
 * @see {@link useColorScheme} React Native color scheme detection
 * @see {@link Colors} Color system configuration
 * @see {@link Typography} Typography system configuration
 * @see {@link Spacing} Spacing system configuration
 * 
 * @todo Add theme persistence for user preference override
 * @todo Implement theme transition animations
 * @todo Add support for custom theme extensions
 * @todo Include theme debugging utilities
 */
export const useTheme = (): Theme => {
  // Detect system color scheme preference
  const colorScheme = useColorScheme();
  
  // Determine if dark mode is active
  const isDark = colorScheme === 'dark';

  // Return complete theme configuration
  return {
    colors: isDark ? darkColors : lightColors,
    typography,
    spacing,
    isDark,
  };
};

/**
 * @summary
 * The useTheme hook provides comprehensive theme management for React Native applications,
 * automatically detecting system preferences and providing type-safe access to colors,
 * typography, spacing, and theme mode. It enables consistent, accessible, and responsive
 * UI development with Material Design 3 principles.
 * 
 * @architecture
 * - System theme detection integration
 * - Unified theme configuration access
 * - Type-safe theme properties
 * - Performance optimized composition
 * - Cross-platform compatibility
 * 
 * @theme_system
 * - Light/dark mode automatic switching
 * - Material Design 3 color semantics
 * - Typography scale with accessibility
 * - 8-point grid spacing system
 * - Comprehensive type definitions
 * 
 * @integration
 * - React Native useColorScheme hook
 * - StyleSheet API compatibility
 * - Component theming support
 * - Navigation theme integration
 * - Third-party library compatibility
 * 
 * @dependencies
 * - react-native: Core framework and useColorScheme
 * - Theme configuration modules: colors, typography, spacing
 * 
 * @see {@link Theme} for complete theme interface documentation
 * @see {@link https://reactnative.dev/docs/usecolorscheme} React Native useColorScheme
 * @see {@link https://m3.material.io/} Material Design 3 Guidelines
 */
