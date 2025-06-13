/**
 * @fileoverview Profile Refresh Hook - CHAMPION
 * 
 * 🏆 CHAMPION STANDARDS 2025:
 * ✅ Single Responsibility: Profile refresh only
 * ✅ TanStack Query + Use Cases: Complete integration
 * ✅ Optimistic Updates: Mobile-first UX
 * ✅ Mobile Performance: Essential operations only
 * ✅ Enterprise Logging: Essential audit trails
 * ✅ Clean Interface: Simplified Champion API
 */

import React, { useCallback, useState, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { LoggerFactory } from '@core/logging/logger.factory';
import { LogCategory } from '@core/logging/logger.service.interface';

const logger = LoggerFactory.createServiceLogger('ProfileRefresh');

// 🏆 CHAMPION INTERFACE: Simplified & Mobile-Optimized
export interface UseProfileRefreshParams {
  currentUser: any;
  refreshProfile: () => Promise<void>;
  refreshAvatarAfterUpload: () => Promise<void>;
  preloadAvatar?: () => Promise<void>;
  shouldCheckForAvatarUpdate: React.MutableRefObject<boolean>;
  shouldCheckForProfileUpdate: React.MutableRefObject<boolean>;
}

export interface UseProfileRefreshReturn {
  // 🏆 Core State
  refreshing: boolean;
  hasInitialized: boolean;
  lastRefreshTime: number;
  
  // 🏆 Champion Actions
  onRefresh: () => Promise<void>;
  refreshNow: () => Promise<void>;
  
  // 🏆 Mobile Performance Stats
  refreshCount: number;
  averageRefreshDuration: number;
}

// 🏆 CHAMPION CONFIG: Mobile Performance
const REFRESH_CONFIG = {
  DEBOUNCE_TIME: 500,          // 🏆 Mobile: Quick debounce
  MIN_REFRESH_TIME: 1000,      // 🏆 Mobile: Minimum refresh duration for UX
  MAX_REFRESH_INTERVAL: 30000, // 🏆 Mobile: Max 30s between refreshes
} as const;

/**
 * 🏆 CHAMPION PROFILE REFRESH HOOK
 * 
 * ✅ CHAMPION PATTERNS:
 * - Single Responsibility: Profile refresh only
 * - Mobile Performance: Essential operations only
 * - Enterprise Logging: Minimal audit trails
 * - Clean Interface: Simplified refresh API
 * - Smart Refresh: Prevents unnecessary refreshes
 */
export const useProfileRefresh = ({
  currentUser,
  refreshProfile,
  refreshAvatarAfterUpload,
  preloadAvatar,
  shouldCheckForAvatarUpdate,
  shouldCheckForProfileUpdate,
}: UseProfileRefreshParams): UseProfileRefreshReturn => {
  
  const queryClient = useQueryClient();
  const userId = currentUser?.id || '';
  
  // 🏆 CHAMPION STATE (Simplified)
  const [refreshing, setRefreshing] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);
  const [totalRefreshDuration, setTotalRefreshDuration] = useState(0);
  
  // 🏆 Performance Refs
  const hasInitialized = useRef<boolean>(false);
  const lastRefreshTime = useRef<number>(0);
  const lastFocusTime = useRef<number>(0);

  // 🏆 CHAMPION: Smart Refresh Decision
  const shouldRefresh = useCallback((trigger: 'focus' | 'pull' | 'manual'): boolean => {
    const now = Date.now();
    const timeSinceLastRefresh = now - lastRefreshTime.current;
    const timeSinceLastFocus = now - lastFocusTime.current;
    
    // 🏆 Smart refresh rules for mobile
    switch (trigger) {
      case 'manual':
        return true; // Always allow manual refresh
      
      case 'pull':
        return timeSinceLastRefresh > REFRESH_CONFIG.DEBOUNCE_TIME;
      
      case 'focus':
        // Skip if just focused or recently refreshed
        if (timeSinceLastFocus < 1000) return false;
        if (timeSinceLastRefresh < REFRESH_CONFIG.MAX_REFRESH_INTERVAL) return false;
        
        // Refresh if updates are pending
        return shouldCheckForProfileUpdate.current || shouldCheckForAvatarUpdate.current || !hasInitialized.current;
      
      default:
        return false;
    }
  }, [shouldCheckForProfileUpdate, shouldCheckForAvatarUpdate]);

  // 🏆 CHAMPION: Execute Refresh
  const executeRefresh = useCallback(async (trigger: 'focus' | 'pull' | 'manual'): Promise<void> => {
    if (!userId || !shouldRefresh(trigger)) {
      logger.info('Refresh skipped by Champion rules', LogCategory.BUSINESS, { userId, trigger });
      return;
    }

    const startTime = Date.now();
    
    logger.info('Champion refresh started', LogCategory.BUSINESS, { userId, trigger });
    
    try {
      // 🏆 Determine what to refresh based on pending updates
      const promises: Promise<void>[] = [];
      
      if (shouldCheckForProfileUpdate.current || !hasInitialized.current) {
        promises.push(refreshProfile());
        shouldCheckForProfileUpdate.current = false;
      }
      
      if (shouldCheckForAvatarUpdate.current || !hasInitialized.current) {
        promises.push(refreshAvatarAfterUpload());
        shouldCheckForAvatarUpdate.current = false;
      }
      
      // 🏆 Execute refreshes in parallel for performance
      if (promises.length > 0) {
        await Promise.all(promises);
      } else if (preloadAvatar) {
        // Fallback: just preload avatar if nothing else to do
        await preloadAvatar();
      }
      
      // 🏆 Update performance metrics
      const duration = Date.now() - startTime;
      setRefreshCount(prev => prev + 1);
      setTotalRefreshDuration(prev => prev + duration);
      lastRefreshTime.current = Date.now();
      
      if (!hasInitialized.current) {
        hasInitialized.current = true;
      }
      
      logger.info('Champion refresh completed successfully', LogCategory.BUSINESS, { 
        userId, 
        trigger, 
        duration 
      });
      
    } catch (error) {
      logger.error('Champion refresh failed', LogCategory.BUSINESS, { 
        userId, 
        trigger 
      }, error as Error);
      
      throw error;
    }
  }, [userId, refreshProfile, refreshAvatarAfterUpload, preloadAvatar, shouldRefresh, shouldCheckForProfileUpdate, shouldCheckForAvatarUpdate]);

  // 🏆 CHAMPION: Focus Effect (Simplified)
  useFocusEffect(
    useCallback(() => {
      const now = Date.now();
      lastFocusTime.current = now;
      
      logger.info('Focus detected', LogCategory.BUSINESS, { userId });
      
      // Execute refresh if needed
      executeRefresh('focus').catch(error => {
        logger.error('Focus refresh failed', LogCategory.BUSINESS, { userId }, error as Error);
      });
    }, [executeRefresh, userId])
  );

  // 🏆 CHAMPION: Pull-to-Refresh
  const onRefresh = useCallback(async (): Promise<void> => {
    setRefreshing(true);
    
    try {
      logger.info('Pull-to-refresh initiated', LogCategory.BUSINESS, { userId });
      
      await executeRefresh('pull');
      
      logger.info('Pull-to-refresh completed', LogCategory.BUSINESS, { userId });
      
    } catch (error) {
      logger.error('Pull-to-refresh failed', LogCategory.BUSINESS, { userId }, error as Error);
    } finally {
      // 🏆 Minimum refresh time for better UX
      setTimeout(() => {
        setRefreshing(false);
      }, REFRESH_CONFIG.MIN_REFRESH_TIME);
    }
  }, [executeRefresh, userId]);

  // 🏆 CHAMPION: Manual Refresh
  const refreshNow = useCallback(async (): Promise<void> => {
    logger.info('Manual refresh requested', LogCategory.BUSINESS, { userId });
    
    // Force refresh by marking updates as pending
    shouldCheckForProfileUpdate.current = true;
    shouldCheckForAvatarUpdate.current = true;
    
    await executeRefresh('manual');
  }, [executeRefresh, userId]);

  // 🏆 CHAMPION: Computed Values
  const averageRefreshDuration = refreshCount > 0 ? totalRefreshDuration / refreshCount : 0;

  return {
    // 🏆 Core State
    refreshing,
    hasInitialized: hasInitialized.current,
    lastRefreshTime: lastRefreshTime.current,
    
    // 🏆 Champion Actions
    onRefresh,
    refreshNow,
    
    // 🏆 Mobile Performance Stats
    refreshCount,
    averageRefreshDuration,
  };
};