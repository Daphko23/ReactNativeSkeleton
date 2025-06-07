/**
 * useCache - Performance Caching Hook
 * Provides intelligent caching with TTL and memory management
 */

import { useState, useCallback, useRef, useEffect } from 'react';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
  hits: number;
}

interface CacheConfig {
  defaultTTL?: number; // in milliseconds
  maxSize?: number;
  cleanupInterval?: number;
}

export interface UseCacheReturn<T> {
  get: (key: string) => T | null;
  set: (key: string, data: T, ttl?: number) => void;
  invalidate: (key: string) => void;
  clear: () => void;
  has: (key: string) => boolean;
  getStats: () => CacheStats;
  getCachedOrFetch: (key: string, fetcher: () => Promise<T>, ttl?: number) => Promise<T>;
}

interface CacheStats {
  size: number;
  maxSize: number;
  hitRate: number;
  totalHits: number;
  totalMisses: number;
}

export const useCache = <T>(config: CacheConfig = {}): UseCacheReturn<T> => {
  const {
    defaultTTL = 5 * 60 * 1000, // 5 minutes
    maxSize = 100,
    cleanupInterval = 60 * 1000, // 1 minute
  } = config;

  const cacheRef = useRef<Map<string, CacheItem<T>>>(new Map());
  const statsRef = useRef({
    totalHits: 0,
    totalMisses: 0,
  });

  const [, _forceUpdate] = useState({});

  // Cleanup expired items
  useEffect(() => {
    const cleanup = () => {
      const now = Date.now();
      const cache = cacheRef.current;
      
      for (const [key, item] of cache.entries()) {
        if (now - item.timestamp > item.ttl) {
          cache.delete(key);
        }
      }

      // Enforce max size by removing least used items
      if (cache.size > maxSize) {
        const entries = Array.from(cache.entries());
        entries.sort(([, a], [, b]) => a.hits - b.hits);
        
        const itemsToRemove = cache.size - maxSize;
        for (let i = 0; i < itemsToRemove; i++) {
          cache.delete(entries[i][0]);
        }
      }
    };

    const interval = setInterval(cleanup, cleanupInterval);
    return () => clearInterval(interval);
  }, [maxSize, cleanupInterval]);

  const get = useCallback((key: string): T | null => {
    const cache = cacheRef.current;
    const item = cache.get(key);

    if (!item) {
      statsRef.current.totalMisses++;
      return null;
    }

    const now = Date.now();
    if (now - item.timestamp > item.ttl) {
      cache.delete(key);
      statsRef.current.totalMisses++;
      return null;
    }

    // Update hit count
    item.hits++;
    statsRef.current.totalHits++;
    
    return item.data;
  }, []);

  const set = useCallback((key: string, data: T, ttl = defaultTTL) => {
    const cache = cacheRef.current;
    
    cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      hits: 0,
    });

    // Enforce max size immediately if needed
    if (cache.size > maxSize) {
      const entries = Array.from(cache.entries());
      entries.sort(([, a], [, b]) => a.hits - b.hits);
      cache.delete(entries[0][0]);
    }
  }, [defaultTTL, maxSize]);

  const invalidate = useCallback((key: string) => {
    cacheRef.current.delete(key);
  }, []);

  const clear = useCallback(() => {
    cacheRef.current.clear();
    statsRef.current.totalHits = 0;
    statsRef.current.totalMisses = 0;
  }, []);

  const has = useCallback((key: string): boolean => {
    const item = cacheRef.current.get(key);
    if (!item) return false;
    
    const now = Date.now();
    if (now - item.timestamp > item.ttl) {
      cacheRef.current.delete(key);
      return false;
    }
    
    return true;
  }, []);

  const getStats = useCallback((): CacheStats => {
    const { totalHits, totalMisses } = statsRef.current;
    const total = totalHits + totalMisses;
    
    return {
      size: cacheRef.current.size,
      maxSize,
      hitRate: total > 0 ? totalHits / total : 0,
      totalHits,
      totalMisses,
    };
  }, [maxSize]);

  const getCachedOrFetch = useCallback(async (
    key: string, 
    fetcher: () => Promise<T>, 
    ttl = defaultTTL
  ): Promise<T> => {
    const cached = get(key);
    if (cached !== null) {
      return cached;
    }

    const data = await fetcher();
    set(key, data, ttl);
    return data;
  }, [get, set, defaultTTL]);

  return {
    get,
    set,
    invalidate,
    clear,
    has,
    getStats,
    getCachedOrFetch,
  };
}; 