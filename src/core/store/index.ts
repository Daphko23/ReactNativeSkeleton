/**
 * @fileoverview STORE-INDEX: Enterprise State Management Exports
 * @description Central export point for all global state management stores providing theme, notifications, and application state management with Zustand
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Core.Store
 * @namespace Core.Store
 * @category Store
 * @subcategory StateManagement
 */

import {useThemeStore} from '@core/store/theme.store';
import {useSnackbarStore} from './snackbar.store';

/**
 * Global State Management Store Exports
 * 
 * Comprehensive collection of Zustand-based stores providing enterprise-grade
 * state management for theme control, notification system, and application-wide
 * state synchronization with performance optimization and type safety.
 * 
 * @exports useThemeStore - Global theme state management
 * @exports useSnackbarStore - Global notification state management
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @category Exports
 * @subcategory StateStores
 * 
 * @description
 * Enterprise state management system providing centralized stores for
 * application-wide state including theme preferences, notification management,
 * and cross-component state synchronization with optimal performance and
 * developer experience.
 * 
 * @example
 * Theme store usage:
 * ```tsx
 * import { useThemeStore } from '@/core/store';
 * 
 * const ThemeToggle = () => {
 *   const { darkMode, toggleTheme } = useThemeStore();
 * 
 *   return (
 *     <TouchableOpacity onPress={toggleTheme}>
 *       <Text>
 *         Switch to {darkMode ? 'Light' : 'Dark'} Mode
 *       </Text>
 *     </TouchableOpacity>
 *   );
 * };
 * ```
 * 
 * @example
 * Snackbar store usage:
 * ```tsx
 * import { useSnackbarStore } from '@/core/store';
 * 
 * const NotificationTrigger = () => {
 *   const { showSnackbar } = useSnackbarStore();
 * 
 *   const handleSuccess = () => {
 *     showSnackbar('Operation completed successfully!', 'success');
 *   };
 * 
 *   const handleError = () => {
 *     showSnackbar('An error occurred', 'error');
 *   };
 * 
 *   return (
 *     <View>
 *       <Button title="Show Success" onPress={handleSuccess} />
 *       <Button title="Show Error" onPress={handleError} />
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * Multiple store integration:
 * ```tsx
 * import { useThemeStore, useSnackbarStore } from '@/core/store';
 * 
 * const IntegratedComponent = () => {
 *   const { darkMode, toggleTheme } = useThemeStore();
 *   const { showSnackbar } = useSnackbarStore();
 * 
 *   const handleThemeChange = () => {
 *     toggleTheme();
 *     showSnackbar(
 *       `Switched to ${darkMode ? 'Light' : 'Dark'} mode`,
 *       'info'
 *     );
 *   };
 * 
 *   return (
 *     <TouchableOpacity onPress={handleThemeChange}>
 *       <Text>Toggle Theme & Notify</Text>
 *     </TouchableOpacity>
 *   );
 * };
 * ```
 * 
 * @store_features
 * - **Theme Management**: Global dark/light mode control
 * - **Notification System**: Centralized snackbar management
 * - **Type Safety**: Full TypeScript support for all stores
 * - **Performance Optimized**: Efficient state updates and subscriptions
 * - **Persistence Ready**: Prepared for state persistence
 * - **Developer Experience**: Intuitive API design
 * - **Cross-Component**: Seamless state sharing
 * 
 * @architecture_benefits
 * - **Centralized State**: Single source of truth for global state
 * - **Modular Design**: Separate stores for different concerns
 * - **Scalable Structure**: Easy addition of new stores
 * - **Performance**: Optimized re-renders and state updates
 * - **Maintainability**: Clear separation of state logic
 * - **Testing**: Easy unit testing of store logic
 * 
 * @state_management_patterns
 * - **Zustand Integration**: Lightweight and performant state management
 * - **Immutable Updates**: Safe state modifications
 * - **Selective Subscriptions**: Component-level optimization
 * - **Action-based Updates**: Clear state modification patterns
 * - **Computed Values**: Derived state calculations
 * - **Middleware Support**: Extensible store functionality
 * 
 * @performance_optimizations
 * - **Minimal Re-renders**: Optimized component subscriptions
 * - **Efficient Updates**: Batched state changes
 * - **Memory Management**: Proper cleanup and garbage collection
 * - **Bundle Size**: Lightweight store implementations
 * - **Runtime Performance**: Fast state access and updates
 * 
 * @development_features
 * - **DevTools Integration**: Redux DevTools compatibility
 * - **Hot Reloading**: Development-friendly state persistence
 * - **Type Inference**: Automatic TypeScript type inference
 * - **Error Handling**: Comprehensive error boundaries
 * - **Debugging Support**: Clear state inspection capabilities
 * 
 * @enterprise_capabilities
 * - **Audit Logging**: State change tracking for compliance
 * - **Security**: Secure state management practices
 * - **Scalability**: Handles large-scale application state
 * - **Monitoring**: Integration with application monitoring
 * - **Compliance**: Enterprise security and audit requirements
 * 
 * @use_cases
 * - Global application theming
 * - Cross-screen notification management
 * - User preference persistence
 * - Application-wide state synchronization
 * - Feature flag management
 * - Authentication state management
 * - Loading state coordination
 * 
 * @best_practices
 * - Use stores for truly global state only
 * - Keep store logic simple and focused
 * - Implement proper error handling
 * - Use TypeScript for type safety
 * - Test store logic independently
 * - Monitor performance impact
 * - Document state structure clearly
 * 
 * @dependencies
 * - zustand: Lightweight state management library
 * - @core/store/theme.store: Theme state management
 * - @core/store/snackbar.store: Notification state management
 * 
 * @see {@link useThemeStore} for theme management documentation
 * @see {@link useSnackbarStore} for notification management documentation
 */
export {useThemeStore, useSnackbarStore};
