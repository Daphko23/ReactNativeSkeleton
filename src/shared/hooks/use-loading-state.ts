/**
 * @fileoverview USE-LOADING-STATE-HOOK: Loading State Management Hook
 * @description Custom React hook for managing multiple loading states with key-based organization
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Shared.Hooks
 * @namespace Shared.Hooks.UseLoadingState
 * @category Hooks
 * @subcategory State
 */

import { useState, useCallback } from 'react';

/**
 * Loading State Dictionary Interface
 * 
 * Defines the structure for storing multiple loading states identified by unique keys.
 * Each key represents a different loading operation or component state.
 * 
 * @interface LoadingState
 * @since 1.0.0
 * @version 1.0.0
 * @category Types
 * @subcategory State
 * 
 * @example
 * ```tsx
 * const loadingStates: LoadingState = {
 *   'fetchUsers': true,
 *   'saveProfile': false,
 *   'uploadImage': true
 * };
 * ```
 */
export interface LoadingState {
  /**
   * Loading state for a specific operation identified by key.
   * 
   * @type {boolean}
   * @index Key represents the operation identifier
   * @example loadingStates['fetchData'] = true
   */
  [key: string]: boolean;
}

/**
 * Loading State Hook Return Interface
 * 
 * Defines the return structure of the useLoadingState hook.
 * Provides comprehensive loading state management functionality.
 * 
 * @interface UseLoadingStateReturn
 * @since 1.0.0
 * @version 1.0.0
 * @category Types
 * @subcategory Hooks
 * 
 * @example
 * ```tsx
 * const { 
 *   isLoading, 
 *   setLoading, 
 *   withLoading 
 * }: UseLoadingStateReturn = useLoadingState();
 * ```
 */
export interface UseLoadingStateReturn {
  /**
   * Check if a specific operation is loading.
   * 
   * @type {(key?: string) => boolean}
   * @param {string} [key='default'] - The loading state key to check
   * @returns {boolean} True if the operation is loading, false otherwise
   * @example isLoading('fetchData')
   * @example isLoading() // uses 'default' key
   */
  isLoading: (key?: string) => boolean;

  /**
   * Check if any operation is currently loading.
   * 
   * @type {boolean}
   * @readonly
   * @example if (isAnyLoading) showGlobalSpinner();
   */
  isAnyLoading: boolean;

  /**
   * Set the loading state for a specific operation.
   * 
   * @type {(key: string, loading: boolean) => void}
   * @param {string} key - The operation identifier
   * @param {boolean} loading - The loading state to set
   * @example setLoading('fetchUsers', true)
   * @example setLoading('saveProfile', false)
   */
  setLoading: (key: string, loading: boolean) => void;

  /**
   * Execute an async operation with automatic loading state management.
   * 
   * @type {<T>(key: string, asyncOperation: () => Promise<T>) => Promise<T>}
   * @template T - The return type of the async operation
   * @param {string} key - The operation identifier
   * @param {() => Promise<T>} asyncOperation - The async function to execute
   * @returns {Promise<T>} The result of the async operation
   * @example withLoading('fetchData', () => api.getData())
   */
  withLoading: <T>(key: string, asyncOperation: () => Promise<T>) => Promise<T>;

  /**
   * Clear all loading states.
   * 
   * @type {() => void}
   * @example clearAll() // resets all loading states to false
   */
  clearAll: () => void;
}

/**
 * Loading State Management Hook
 * 
 * Provides consistent loading state management across the application with support
 * for multiple concurrent loading operations identified by unique keys. Features
 * automatic loading state handling for async operations and comprehensive state
 * querying capabilities.
 * 
 * @function useLoadingState
 * @returns {UseLoadingStateReturn} Object containing loading state management functions
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Hooks
 * @subcategory State
 * @module Shared.Hooks
 * @namespace Shared.Hooks.UseLoadingState
 * 
 * @example
 * Basic loading state management:
 * ```tsx
 * import { useLoadingState } from '@/shared/hooks/use-loading-state';
 * 
 * const MyComponent = () => {
 *   const { isLoading, setLoading } = useLoadingState();
 * 
 *   const handleClick = async () => {
 *     setLoading('fetchData', true);
 *     try {
 *       const data = await fetchData();
 *       console.log(data);
 *     } finally {
 *       setLoading('fetchData', false);
 *     }
 *   };
 * 
 *   return (
 *     <View>
 *       <Button 
 *         title={isLoading('fetchData') ? 'Loading...' : 'Fetch Data'}
 *         onPress={handleClick}
 *         disabled={isLoading('fetchData')}
 *       />
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * Automatic loading with withLoading:
 * ```tsx
 * const DataScreen = () => {
 *   const { isLoading, withLoading } = useLoadingState();
 *   const [users, setUsers] = useState([]);
 *   const [posts, setPosts] = useState([]);
 * 
 *   const loadUsers = () => withLoading('users', async () => {
 *     const userData = await api.getUsers();
 *     setUsers(userData);
 *     return userData;
 *   });
 * 
 *   const loadPosts = () => withLoading('posts', async () => {
 *     const postData = await api.getPosts();
 *     setPosts(postData);
 *     return postData;
 *   });
 * 
 *   return (
 *     <View>
 *       <Button 
 *         title={isLoading('users') ? 'Loading Users...' : 'Load Users'}
 *         onPress={loadUsers}
 *         disabled={isLoading('users')}
 *       />
 *       
 *       <Button 
 *         title={isLoading('posts') ? 'Loading Posts...' : 'Load Posts'}
 *         onPress={loadPosts}
 *         disabled={isLoading('posts')}
 *       />
 *       
 *       {users.map(user => <UserItem key={user.id} user={user} />)}
 *       {posts.map(post => <PostItem key={post.id} post={post} />)}
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * Global loading indicator with multiple operations:
 * ```tsx
 * const App = () => {
 *   const { isAnyLoading, withLoading, clearAll } = useLoadingState();
 *   const [data, setData] = useState(null);
 * 
 *   const performMultipleOperations = async () => {
 *     try {
 *       // Multiple concurrent operations
 *       const [users, posts, comments] = await Promise.all([
 *         withLoading('users', () => api.getUsers()),
 *         withLoading('posts', () => api.getPosts()),
 *         withLoading('comments', () => api.getComments())
 *       ]);
 * 
 *       setData({ users, posts, comments });
 *     } catch (error) {
 *       console.error('Failed to load data:', error);
 *       clearAll(); // Clear all loading states on error
 *     }
 *   };
 * 
 *   return (
 *     <View>
 *       {isAnyLoading && (
 *         <View style={styles.globalLoader}>
 *           <ActivityIndicator size="large" />
 *           <Text>Loading...</Text>
 *         </View>
 *       )}
 *       
 *       <Button 
 *         title="Load All Data" 
 *         onPress={performMultipleOperations}
 *         disabled={isAnyLoading}
 *       />
 *       
 *       {data && <DataDisplay data={data} />}
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * Form submission with validation:
 * ```tsx
 * const ProfileForm = () => {
 *   const { isLoading, withLoading } = useLoadingState();
 *   const [profile, setProfile] = useState({ name: '', email: '' });
 *   const [errors, setErrors] = useState({});
 * 
 *   const handleSubmit = () => withLoading('submit', async () => {
 *     setErrors({});
 *     
 *     try {
 *       const validationResult = await validateProfile(profile);
 *       if (!validationResult.isValid) {
 *         setErrors(validationResult.errors);
 *         return;
 *       }
 * 
 *       await api.updateProfile(profile);
 *       alert('Profile updated successfully!');
 *     } catch (error) {
 *       setErrors({ general: error.message });
 *     }
 *   });
 * 
 *   return (
 *     <View>
 *       <TextInput 
 *         value={profile.name}
 *         onChangeText={(name) => setProfile(prev => ({ ...prev, name }))}
 *         placeholder="Name"
 *         editable={!isLoading('submit')}
 *       />
 *       
 *       <TextInput 
 *         value={profile.email}
 *         onChangeText={(email) => setProfile(prev => ({ ...prev, email }))}
 *         placeholder="Email"
 *         editable={!isLoading('submit')}
 *       />
 *       
 *       <Button 
 *         title={isLoading('submit') ? 'Saving...' : 'Save Profile'}
 *         onPress={handleSubmit}
 *         disabled={isLoading('submit')}
 *       />
 *       
 *       {errors.general && <Text style={styles.error}>{errors.general}</Text>}
 *     </View>
 *   );
 * };
 * ```
 * 
 * @features
 * - Multiple concurrent loading state management
 * - Key-based operation identification
 * - Automatic loading state handling with withLoading
 * - Global loading state checking
 * - Memory efficient state management
 * - TypeScript type safety
 * - Callback optimization with useCallback
 * - Error handling integration
 * - Cleanup functionality
 * - Enterprise-ready implementation
 * 
 * @architecture
 * - React hooks pattern
 * - State management with useState
 * - Callback optimization
 * - Key-value state organization
 * - Automatic cleanup handling
 * - Memory efficient implementation
 * - Functional programming principles
 * 
 * @state_management
 * - Centralized loading state storage
 * - Key-based state organization
 * - Automatic state updates
 * - State cleanup functionality
 * - Memory leak prevention
 * - Optimized re-renders
 * - State synchronization
 * 
 * @performance
 * - useCallback optimization
 * - Minimal re-renders
 * - Efficient state updates
 * - Memory efficient storage
 * - Optimized state queries
 * - Automatic cleanup
 * - Fast state access
 * 
 * @accessibility
 * - Enables loading state announcements
 * - Supports loading indicators
 * - Helps with screen reader feedback
 * - Improves user experience
 * - Provides loading context
 * 
 * @use_cases
 * - API data fetching
 * - Form submissions
 * - File uploads
 * - Image processing
 * - Database operations
 * - Authentication flows
 * - Multi-step processes
 * - Background operations
 * 
 * @best_practices
 * - Use descriptive keys for operations
 * - Handle errors appropriately
 * - Clear loading states on unmount
 * - Use withLoading for async operations
 * - Provide user feedback during loading
 * - Test loading state transitions
 * - Monitor loading performance
 * - Document loading states
 * 
 * @dependencies
 * - react: useState, useCallback hooks
 * 
 * @see {@link useState} for state management
 * @see {@link useCallback} for callback optimization
 * 
 * @todo Add loading state persistence
 * @todo Implement loading timeout handling
 * @todo Add loading progress tracking
 * @todo Include loading analytics
 */
export const useLoadingState = (): UseLoadingStateReturn => {
  const [loadingStates, setLoadingStates] = useState<LoadingState>({});

  const isLoading = useCallback((key = 'default'): boolean => {
    return loadingStates[key] || false;
  }, [loadingStates]);

  const isAnyLoading = Object.values(loadingStates).some(loading => loading);

  const setLoading = useCallback((key: string, loading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: loading,
    }));
  }, []);

  const withLoading = useCallback(async <T>(
    key: string,
    asyncOperation: () => Promise<T>
  ): Promise<T> => {
    setLoading(key, true);
    try {
      const result = await asyncOperation();
      return result;
    } finally {
      setLoading(key, false);
    }
  }, [setLoading]);

  const clearAll = useCallback(() => {
    setLoadingStates({});
  }, []);

  return {
    isLoading,
    isAnyLoading,
    setLoading,
    withLoading,
    clearAll,
  };
}; 