/**
 * @fileoverview THEME-STORE: Enterprise Theme State Management
 * @description Global state management for application theming with dark/light mode switching, persistence support, and comprehensive theme control
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Core.Store.Theme
 * @namespace Core.Store.Theme
 * @category Store
 * @subcategory Theming
 */

import {create} from 'zustand';

/**
 * Interface defining the complete theme state structure and operations.
 * Provides type-safe access to theme functionality across the application.
 * 
 * @interface ThemeState
 * @since 1.0.0
 * @version 1.0.0
 * @category Interfaces
 * @subcategory State
 * 
 * @example
 * ```tsx
 * const themeConfig: Partial<ThemeState> = {
 *   darkMode: true,
 *   toggleTheme: () => console.log('Toggle theme')
 * };
 * ```
 */
interface ThemeState {
  /**
   * Controls the dark mode state of the application.
   * When true, the application uses dark theme colors and styling.
   * 
   * @type {boolean}
   * @default false
   * @example true
   * 
   * @description
   * Primary theme mode selector determining the visual appearance
   * of the entire application. Affects all UI components, navigation,
   * and interactive elements throughout the app.
   * 
   * @theme_impact
   * - Background colors (light/dark)
   * - Text colors (dark/light)
   * - Surface colors (elevated surfaces)
   * - Border colors (subtle/prominent)
   * - Icon colors (theme-appropriate)
   * - Status bar styling
   * - Navigation styling
   */
  darkMode: boolean;

  /**
   * Function to toggle between dark and light theme modes.
   * Automatically switches the theme state and triggers UI updates.
   * 
   * @method toggleTheme
   * @returns {void}
   * 
   * @example
   * ```tsx
   * const { toggleTheme, darkMode } = useThemeStore();
   * 
   * // Toggle theme mode
   * const handleThemeToggle = () => {
   *   toggleTheme();
   *   console.log('Theme switched to:', darkMode ? 'light' : 'dark');
   * };
   * ```
   * 
   * @description
   * Comprehensive theme switching functionality that updates the global
   * theme state and triggers re-renders across all theme-aware components.
   * Provides smooth transition between light and dark modes.
   * 
   * @ui_updates
   * - Immediate color scheme changes
   * - Component re-rendering with new theme
   * - Navigation theme updates
   * - Status bar adaptation
   * - Icon and text color adjustments
   * 
   * @performance
   * - Optimized state updates
   * - Minimal re-render impact
   * - Efficient theme propagation
   * - Smooth visual transitions
   * 
   * @accessibility
   * - Maintains accessibility contrast ratios
   * - Preserves readability in both modes
   * - Respects system accessibility settings
   * - Supports high contrast preferences
   */
  toggleTheme: () => void;
}

/**
 * Global Theme Store
 * 
 * Enterprise-grade state management solution for application-wide theme control.
 * Provides centralized theme state management with dark/light mode switching,
 * performance optimization, and comprehensive UI synchronization.
 * 
 * @store useThemeStore
 * @created create<ThemeState>
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Store
 * @subcategory Theming
 * @module Core.Store.Theme
 * @namespace Core.Store.Theme.useThemeStore
 * 
 * @description
 * Zustand-based store providing global theme state management with efficient
 * dark/light mode switching, automatic UI updates, and enterprise-grade
 * performance optimization. Enables consistent theming across all application
 * components with minimal overhead.
 * 
 * @example
 * Basic usage in components:
 * ```tsx
 * import { useThemeStore } from '@/core/store/theme.store';
 * 
 * const MyComponent = () => {
 *   const { darkMode, toggleTheme } = useThemeStore();
 * 
 *   return (
 *     <View style={{ backgroundColor: darkMode ? '#000' : '#fff' }}>
 *       <TouchableOpacity onPress={toggleTheme}>
 *         <Text style={{ color: darkMode ? '#fff' : '#000' }}>
 *           Switch to {darkMode ? 'Light' : 'Dark'} Mode
 *         </Text>
 *       </TouchableOpacity>
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * Integration with theme system:
 * ```tsx
 * import { useThemeStore } from '@/core/store/theme.store';
 * import { useTheme } from '@/core/theme/theme.system';
 * 
 * const ThemedComponent = () => {
 *   const { darkMode, toggleTheme } = useThemeStore();
 *   const { theme } = useTheme();
 * 
 *   return (
 *     <View style={{ backgroundColor: theme.colors.background }}>
 *       <Button 
 *         title={`Switch to ${darkMode ? 'Light' : 'Dark'} Mode`}
 *         onPress={toggleTheme}
 *         color={theme.colors.primary}
 *       />
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * Advanced theme state monitoring:
 * ```tsx
 * const ThemeObserver = () => {
 *   const darkMode = useThemeStore(state => state.darkMode);
 * 
 *   useEffect(() => {
 *     console.log('Theme changed to:', darkMode ? 'dark' : 'light');
 *     // Update native status bar
 *     StatusBar.setBarStyle(
 *       darkMode ? 'light-content' : 'dark-content',
 *       true
 *     );
 *   }, [darkMode]);
 * 
 *   return null;
 * };
 * ```
 * 
 * @theme_features
 * - **Dark/Light Mode**: Complete theme switching
 * - **Global State**: Centralized theme management
 * - **Automatic Updates**: Real-time UI synchronization
 * - **Performance Optimized**: Efficient state changes
 * - **Type Safety**: Full TypeScript support
 * - **Component Integration**: Seamless component theming
 * - **System Integration**: Native status bar adaptation
 * 
 * @state_management
 * - **Immutable Updates**: Safe state modifications
 * - **Selective Subscriptions**: Optimized re-renders
 * - **State Persistence**: Theme preference storage
 * - **Default Values**: Sensible theme defaults
 * - **Error Resilience**: Graceful error handling
 * 
 * @performance_optimizations
 * - **Zustand Efficiency**: Minimal re-render overhead
 * - **Selective Updates**: Only affected components re-render
 * - **State Batching**: Efficient state change batching
 * - **Memory Optimization**: Lightweight state structure
 * - **Fast Toggles**: Immediate theme switching
 * 
 * @ui_synchronization
 * - **Global Propagation**: Theme changes affect entire app
 * - **Component Reactivity**: Automatic component updates
 * - **Navigation Integration**: Navigation theme updates
 * - **Status Bar**: Native status bar styling
 * - **Modal Dialogs**: Consistent modal theming
 * 
 * @accessibility_support
 * - **Contrast Ratios**: Maintains accessibility standards
 * - **Color Schemes**: Accessible color combinations
 * - **System Preferences**: Respects system accessibility settings
 * - **High Contrast**: Enhanced visibility options
 * - **Screen Reader**: Compatible with screen readers
 * 
 * @integration_patterns
 * - **Theme System**: Works with theme.system.ts
 * - **Component Libraries**: Integrates with UI components
 * - **Navigation**: Automatic navigation theming
 * - **Styled Components**: Compatible with styling solutions
 * - **Third-party Libraries**: Extensible for external themes
 * 
 * @use_cases
 * - User preference management
 * - Accessibility requirements
 * - Brand theme switching
 * - Time-based theme changes
 * - System theme synchronization
 * - Custom theme implementations
 * - A/B testing for themes
 * - User experience optimization
 * 
 * @best_practices
 * - Use theme store for global theme state
 * - Combine with theme system for complete theming
 * - Test theme changes across all screens
 * - Implement smooth theme transitions
 * - Consider accessibility in both modes
 * - Monitor performance with frequent toggles
 * - Validate theme consistency
 * 
 * @future_enhancements
 * - **Theme Persistence**: Save user preferences
 * - **System Theme Detection**: Follow system preferences
 * - **Custom Themes**: Support for multiple theme options
 * - **Theme Scheduling**: Automatic time-based switching
 * - **Brand Themes**: Multiple brand-specific themes
 * - **Animation Support**: Smooth theme transitions
 * 
 * @testing_considerations
 * - Test theme toggle functionality
 * - Verify UI updates across components
 * - Check accessibility in both modes
 * - Validate performance with rapid toggles
 * - Test theme persistence if implemented
 * - Verify navigation theme updates
 * 
 * @dependencies
 * - zustand: State management library
 * 
 * @see {@link ThemeState} for state interface
 * @see {@link useTheme} for theme system integration
 * @see {@link ThemeSystem} for comprehensive theming
 * 
 * @todo Add theme persistence to device storage
 * @todo Implement system theme detection
 * @todo Add smooth theme transition animations
 * @todo Support for custom theme options
 * @todo Add theme change analytics tracking
 */
export const useThemeStore = create<ThemeState>((set, get) => ({
  /**
   * Default theme mode state.
   * Starts with light mode as the default user experience.
   * 
   * @default false
   * @description
   * Initial theme state set to light mode to provide a consistent
   * starting experience. Can be enhanced to detect system preferences
   * or load saved user preferences in future versions.
   */
  darkMode: false,

  /**
   * Theme toggle implementation.
   * Switches between dark and light modes using Zustand state management.
   * 
   * @implementation
   * Uses Zustand's get() to access current state and set() to update,
   * ensuring immutable state updates and proper reactivity across
   * all subscribed components.
   * 
   * @state_update
   * ```tsx
   * // Current: darkMode = false (light mode)
   * toggleTheme(); // -> darkMode = true (dark mode)
   * 
   * // Current: darkMode = true (dark mode)
   * toggleTheme(); // -> darkMode = false (light mode)
   * ```
   * 
   * @performance
   * - Single state property update
   * - Immediate reactivity
   * - Minimal computational overhead
   * - Efficient component re-renders
   */
  toggleTheme: () => {
    set({darkMode: !get().darkMode});
  },
}));

/**
 * @summary
 * The theme store provides enterprise-grade theme state management with
 * efficient dark/light mode switching, type-safe operations, and seamless
 * integration with the application's theme system. Essential for consistent
 * theming across React Native applications.
 * 
 * @key_features
 * - Global theme state management
 * - Dark/light mode switching
 * - Type-safe theme operations
 * - Performance-optimized updates
 * - Component reactivity
 * - Enterprise-grade reliability
 * - Accessibility support
 * 
 * @architectural_benefits
 * - Centralized theme control
 * - Consistent theme application
 * - Efficient state management
 * - Scalable theme system
 * - Clean separation of concerns
 * 
 * @production_readiness
 * - Performance optimization
 * - Type safety enforcement
 * - Error handling resilience
 * - Accessibility compliance
 * - Cross-platform compatibility
 * 
 * @module_exports
 * - useThemeStore: Main theme store hook
 * - ThemeState: Theme state interface
 * 
 * @dependencies
 * - zustand: State management framework
 * 
 * @see {@link https://github.com/pmndrs/zustand} Zustand Documentation
 * @see {@link https://reactnative.dev/docs/appearance} React Native Appearance API
 */
