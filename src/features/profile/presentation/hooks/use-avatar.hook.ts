/**
 * useAvatar Hook - Enterprise Edition
 * Hook for managing avatar state and operations with advanced caching and optimization
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@features/auth/presentation/hooks';
import { avatarService } from '../../data/factories/avatar.container';

export interface UseAvatarReturn {
  // State
  avatarUrl: string | null;
  isLoading: boolean;
  error: string | null;
  loadingState: 'idle' | 'loading' | 'loaded' | 'error';
  
  // Actions
  refreshAvatar: () => Promise<void>;
  refreshAvatarAfterUpload: () => Promise<void>;
  clearAvatar: () => void;
  preloadAvatar: () => Promise<void>;
  
  // Utils
  hasAvatar: boolean;
  shouldShowSkeleton: boolean;
  shouldShowDefaultAvatar: boolean;
}

// Enterprise Avatar Cache Manager
class AvatarCacheManager {
  private static instance: AvatarCacheManager;
  private cache = new Map<string, string>();
  private pendingRequests = new Map<string, Promise<string | null>>();
  private loadingStates = new Map<string, boolean>();

  static getInstance(): AvatarCacheManager {
    if (!AvatarCacheManager.instance) {
      AvatarCacheManager.instance = new AvatarCacheManager();
    }
    return AvatarCacheManager.instance;
  }

  async getAvatarUrl(userId: string, forceRefresh = false): Promise<string | null> {
    // Return cached URL if available and not forcing refresh
    if (!forceRefresh && this.cache.has(userId)) {
      console.log('AvatarCache: Returning cached URL for user:', userId);
      return this.cache.get(userId) || null;
    }

    // If already loading, return existing promise
    if (this.pendingRequests.has(userId)) {
      console.log('AvatarCache: Request already in progress for user:', userId);
      return this.pendingRequests.get(userId) || null;
    }

    // Set loading state
    this.loadingStates.set(userId, true);

    // Create and cache the promise
    const promise = this.fetchAvatarUrl(userId);
    this.pendingRequests.set(userId, promise);

    try {
      const url = await promise;
      
      // Cache the result
      if (url) {
        this.cache.set(userId, url);
        console.log('AvatarCache: Cached avatar URL for user:', userId);
      } else {
        // Remove from cache if no URL available
        this.cache.delete(userId);
        console.log('AvatarCache: No avatar URL available for user:', userId);
      }

      return url;
    } catch (error) {
      console.error('AvatarCache: Failed to fetch avatar URL:', error);
      // Remove from cache on error
      this.cache.delete(userId);
      throw error;
    } finally {
      // Cleanup
      this.pendingRequests.delete(userId);
      this.loadingStates.set(userId, false);
    }
  }

  private async fetchAvatarUrl(userId: string): Promise<string | null> {
    console.log('AvatarCache: Fetching avatar URL from service for user:', userId);
    return await avatarService.getAvatarUrl(userId);
  }

  isLoading(userId: string): boolean {
    return this.loadingStates.get(userId) || false;
  }

  invalidateCache(userId: string): void {
    console.log('AvatarCache: Invalidating cache for user:', userId);
    this.cache.delete(userId);
    this.pendingRequests.delete(userId);
    this.loadingStates.delete(userId);
  }

  clearCache(): void {
    console.log('🧹 AvatarCache: Clearing all cache completely');
    try {
      this.cache.clear();
      this.pendingRequests.clear();
      this.loadingStates.clear();
      console.log('🧹 AvatarCache: All cache cleared successfully');
    } catch (error) {
      console.error('🧹 AvatarCache: Error clearing cache:', error);
    }
  }

  preloadAvatar(userId: string): Promise<string | null> {
    console.log('AvatarCache: Preloading avatar for user:', userId);
    return this.getAvatarUrl(userId, false);
  }
}

export const useAvatar = (): UseAvatarReturn => {
  const { user } = useAuth();
  const cacheManager = useRef(AvatarCacheManager.getInstance()).current;
  
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [loadingState, setLoadingState] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle');

  // Initialize loading state based on existing avatar
  useEffect(() => {
    if (avatarUrl && loadingState === 'idle') {
      console.log('🔄 useAvatar: Found existing avatar URL, setting to loaded state');
      setLoadingState('loaded');
    }
  }, [avatarUrl, loadingState]);

  const refreshAvatar = useCallback(async (forceRefresh = false): Promise<void> => {
    if (!user?.id) {
      console.log('useAvatar: No user ID, clearing avatar');
      setAvatarUrl(null);
      setLoadingState('idle');
      setHasInitialized(true);
      return;
    }

    // Don't show loading on subsequent calls unless force refresh
    const shouldShowLoading = !hasInitialized || forceRefresh;
    
    try {
      if (shouldShowLoading) {
        setIsLoading(true);
        setLoadingState('loading');
      }
      setError(null);
      
      console.log('useAvatar: Refreshing avatar for user:', user.id, { forceRefresh });
      const url = await cacheManager.getAvatarUrl(user.id, forceRefresh);
      
      if (url !== avatarUrl) {
        console.log('useAvatar: Avatar URL changed, updating state');
        setAvatarUrl(url);
      }
      
      setLoadingState('loaded');
    } catch (err: any) {
      const errorMessage = err?.message || 'Avatar konnte nicht geladen werden';
      setError(errorMessage);
      setLoadingState('error');
      console.error('useAvatar: Failed to refresh avatar:', {
        error: err,
        userId: user?.id,
        errorMessage,
      });
      
      // Set avatar to null on error to prevent showing stale data
      setAvatarUrl(null);
    } finally {
      if (shouldShowLoading) {
        setIsLoading(false);
      }
      setHasInitialized(true);
    }
  }, [user?.id, avatarUrl, hasInitialized, cacheManager]);

  // Special refresh function for after upload to handle caching issues
  const refreshAvatarAfterUpload = useCallback(async (): Promise<void> => {
    if (!user?.id) {
      console.log('useAvatar: No user ID for post-upload refresh');
      return;
    }

    console.log('🔄 useAvatar: Force refreshing avatar after upload/change...');
    
    try {
      // Clear ALL cache to ensure fresh data
      cacheManager.clearCache();
      console.log('🔄 useAvatar: Cache cleared completely');
      
      // Wait a moment to ensure database has been updated
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Force refresh with bypass cache
      console.log('🔄 useAvatar: Force fetching fresh avatar data...');
      await refreshAvatar(true);
      
      console.log('🔄 useAvatar: Post-upload refresh completed successfully');
    } catch (error) {
      console.error('🔄 useAvatar: Error in post-upload refresh:', error);
      // Fallback: try one more time with normal refresh
      await refreshAvatar(false);
    }
  }, [refreshAvatar, user?.id, cacheManager]);

  const preloadAvatar = useCallback(async (): Promise<void> => {
    if (!user?.id) {
      return;
    }

    try {
      console.log('useAvatar: Preloading avatar for user:', user.id);
      await cacheManager.preloadAvatar(user.id);
    } catch (err) {
      console.warn('useAvatar: Avatar preload failed:', err);
      // Don't throw error for preload failures
    }
  }, [user?.id, cacheManager]);

  const clearAvatar = useCallback(() => {
    console.log('🔄 useAvatar: Clearing avatar state');
    if (user?.id) {
      cacheManager.invalidateCache(user.id);
    }
    setAvatarUrl(null);
    setError(null);
    setLoadingState('idle');
    setHasInitialized(false);
  }, [user?.id, cacheManager]);

  // Load avatar on mount and when user changes
  useEffect(() => {
    if (user?.id && !hasInitialized) {
      // Use cached data immediately if available, then refresh in background
      const loadInitialAvatar = async () => {
        let cachedUrl: string | null = null;
        
        try {
          setLoadingState('loading');
          
          // Try to get cached URL first
          console.log('🔄 useAvatar: Checking cache for user:', user.id);
          cachedUrl = await cacheManager.getAvatarUrl(user.id, false);
          
          if (cachedUrl && cachedUrl !== avatarUrl) {
            console.log('🔄 useAvatar: Found cached URL, setting immediately');
            setAvatarUrl(cachedUrl);
            setLoadingState('loaded');
          } else if (!cachedUrl) {
            console.log('🔄 useAvatar: No cached URL, setting to loaded state');
            setLoadingState('loaded');
          }
        } catch (err) {
          console.warn('useAvatar: Initial load failed:', err);
          setLoadingState('error');
        }
        
        // Then do a full refresh in background if needed
        if (!cachedUrl) {
          refreshAvatar(false);
        }
      };

      loadInitialAvatar();
    }
  }, [user?.id, hasInitialized, avatarUrl, refreshAvatar, cacheManager]);

  const hasAvatar = Boolean(avatarUrl && !isLoading);
  
  // Improved logic to prevent gray skeleton state on tab switches
  const shouldShowSkeleton = (loadingState === 'idle' || loadingState === 'loading') && !avatarUrl;
  const shouldShowDefaultAvatar = loadingState === 'error' || (!avatarUrl && loadingState === 'loaded');
  
  // Debug logging for tab switch issues
  React.useEffect(() => {
    console.log('🔍 Avatar State Debug:', {
      avatarUrl: !!avatarUrl,
      loadingState,
      shouldShowSkeleton,
      shouldShowDefaultAvatar,
      hasAvatar,
      isLoading,
      hasInitialized,
    });
  }, [avatarUrl, loadingState, shouldShowSkeleton, shouldShowDefaultAvatar, hasAvatar, isLoading, hasInitialized]);

  return {
    // State
    avatarUrl,
    isLoading,
    error,
    loadingState,
    
    // Actions
    refreshAvatar: () => refreshAvatar(false),
    refreshAvatarAfterUpload,
    clearAvatar,
    preloadAvatar,
    
    // Utils
    hasAvatar,
    shouldShowSkeleton,
    shouldShowDefaultAvatar,
  };
}; 