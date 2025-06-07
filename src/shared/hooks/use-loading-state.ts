/**
 * useLoadingState - Loading State Management Hook
 * Provides consistent loading state management across the app
 */

import { useState, useCallback } from 'react';

export interface LoadingState {
  [key: string]: boolean;
}

export interface UseLoadingStateReturn {
  isLoading: (key?: string) => boolean;
  isAnyLoading: boolean;
  setLoading: (key: string, loading: boolean) => void;
  withLoading: <T>(key: string, asyncOperation: () => Promise<T>) => Promise<T>;
  clearAll: () => void;
}

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