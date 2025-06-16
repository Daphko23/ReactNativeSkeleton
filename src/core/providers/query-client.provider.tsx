/**
 * QueryClientProvider - React Native 2025 Enterprise Standards
 * TanStack Query setup für optimales Server State Management
 * 
 * ✅ Enterprise Features:
 * - Intelligent Caching Strategy für mobile Apps
 * - Optimized für React Native Performance
 * - Error Recovery & Retry Logic
 * - Background Sync für bessere UX
 * - DevTools für Development
 */

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoggerFactory } from '../logging/logger.factory';
import { LogCategory } from '../logging/logger.service.interface';

const logger = LoggerFactory.createServiceLogger('QueryClient');

/**
 * 🎯 REACT NATIVE OPTIMIZED QUERY CLIENT
 * Configuration für mobile-first performance
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 🚀 CACHING STRATEGY
      staleTime: 5 * 60 * 1000,        // 5min - data stays fresh für 5 minutes
      gcTime: 10 * 60 * 1000,          // 10min - garbage collection (ersetzt cacheTime)
      
      // 🔄 RETRY STRATEGY
      retry: (failureCount, error: any) => {
        // Don't retry auf auth errors
        if (error?.status === 401 || error?.status === 403) {
          return false;
        }
        // Max 3 retries für andere errors
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // 🎯 REACT NATIVE SPECIFIC
      refetchOnWindowFocus: false,      // Deaktiviert für mobile (kein "window focus")
      refetchOnReconnect: true,         // Wichtig für mobile - re-fetch wenn Netzwerk zurück
      refetchOnMount: true,             // Re-fetch wenn Component mounted
      
      // 📱 PERFORMANCE OPTIMIZATIONS
      notifyOnChangeProps: ['data', 'error', 'isLoading'] as const,   // Nur re-render wenn verwendete Props ändern
      
      // 🛡️ ERROR HANDLING - wird über individual query options gehandelt
    },
    
    mutations: {
      // 🔄 MUTATION RETRY STRATEGY
      retry: (failureCount, error: any) => {
        // Don't retry mutations auf client errors (4xx)
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        // Retry server errors (5xx) bis zu 2 mal
        return failureCount < 2;
      },
      
      // 🛡️ MUTATION ERROR HANDLING
      onError: (error: any) => {
        logger.error('Mutation error occurred', LogCategory.BUSINESS, {
          metadata: { 
            error: error.message,
            status: error.status,
            operation: 'mutation_error' 
          }
        }, error);
      },
    },
  },
});

/**
 * 🔧 GLOBAL ERROR HANDLER
 * Centralized error handling für alle queries/mutations
 */
queryClient.setMutationDefaults(['profile'], {
  mutationFn: async (_variables: any) => {
    // Global mutation logic kann hier implementiert werden
    throw new Error('Mutation function not implemented');
  },
  onSuccess: (data, _variables) => {
    logger.info('Mutation successful', LogCategory.BUSINESS, {
      metadata: { operation: 'mutation_success', data }
    });
  },
  onError: (error, _variables) => {
    logger.error('Mutation failed', LogCategory.BUSINESS, {
      metadata: { operation: 'mutation_failed', variables: _variables }
    }, error as Error);
  },
});

/**
 * 🎯 QUERY PROVIDER COMPONENT
 * Wraps App mit TanStack Query Context
 */
interface QueryProviderProps {
  children: React.ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  React.useEffect(() => {
    logger.info('TanStack Query Provider initialized', LogCategory.INFRASTRUCTURE, {
      metadata: { 
        staleTime: queryClient.getDefaultOptions().queries?.staleTime,
        gcTime: queryClient.getDefaultOptions().queries?.gcTime,
        operation: 'query_provider_init' 
      }
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

/**
 * 🛠️ QUERY CLIENT EXPORT
 * Für direkten Zugriff wenn benötigt (invalidation, etc.)
 */
export { queryClient };

/**
 * 🎯 QUERY KEYS FACTORY
 * Centralized query key management
 */
export const queryKeys = {
  // Profile Feature Keys
  profile: {
    all: ['profile'] as const,
    lists: () => [...queryKeys.profile.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.profile.lists(), { filters }] as const,
    details: () => [...queryKeys.profile.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.profile.details(), id] as const,
    privacy: (id: string) => [...queryKeys.profile.detail(id), 'privacy'] as const,
    history: (id: string) => [...queryKeys.profile.detail(id), 'history'] as const,
    analytics: (id: string) => [...queryKeys.profile.detail(id), 'analytics'] as const,
  },
  
  // Avatar Feature Keys
  avatar: {
    all: ['avatar'] as const,
    detail: (userId: string) => [...queryKeys.avatar.all, userId] as const,
    url: (userId: string) => [...queryKeys.avatar.detail(userId), 'url'] as const,
  },
  
  // Custom Fields Keys
  customFields: {
    all: ['customFields'] as const,
    detail: (userId: string) => [...queryKeys.customFields.all, userId] as const,
    templates: () => [...queryKeys.customFields.all, 'templates'] as const,
  },
} as const; 