/**
 * @fileoverview Dialog Hook - CHAMPION
 * 
 * 🏆 CHAMPION STANDARDS 2025:
 * ✅ Single Responsibility: Dialog management only
 * ✅ TanStack Query + Use Cases: Dialog state caching
 * ✅ Optimistic Updates: Instant dialog feedback  
 * ✅ Mobile Performance: Battery-friendly dialog management
 * ✅ Enterprise Logging: Dialog analytics trails
 * ✅ Clean Interface: Essential dialog operations
 */

import React, { useCallback, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DialogType } from '../components/dialogs';
import { LoggerFactory } from '@core/logging/logger.factory';
import { LogCategory } from '@core/logging/logger.service.interface';

const logger = LoggerFactory.createServiceLogger('DialogChampion');

// 🏆 CHAMPION QUERY KEYS
export const dialogQueryKeys = {
  all: ['dialog'] as const,
  state: () => [...dialogQueryKeys.all, 'state'] as const,
  queue: () => [...dialogQueryKeys.all, 'queue'] as const,
  analytics: () => [...dialogQueryKeys.all, 'analytics'] as const,
} as const;

// 🏆 CHAMPION CONFIG: Mobile Performance
const DIALOG_CONFIG = {
  staleTime: 1000 * 2,            // 🏆 Mobile: 2 seconds for dialog state
  gcTime: 1000 * 10,              // 🏆 Mobile: 10 seconds garbage collection
  retry: 0,                       // 🏆 Mobile: No retry for dialog state
  refetchOnWindowFocus: false,    // 🏆 Mobile: Battery-friendly
  refetchOnReconnect: false,      // 🏆 Mobile: No network dependency
} as const;

/**
 * @interface DialogState
 * @description Dialog state interface with Champion enhancements
 */
export interface DialogState {
  visible: boolean;
  type: DialogType;
  title: string;
  content: string;
  onConfirm?: () => void;
  onDismiss?: () => void;
  confirmLoading?: boolean;
  itemName?: string;
  customIcon?: string;
  correlationId?: string;
  category?: 'user' | 'system' | 'error' | 'warning' | 'info';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  timestamp?: Date;
}

/**
 * @interface DialogAnalytics
 * @description Dialog usage analytics
 */
export interface DialogAnalytics {
  totalDialogs: number;
  confirmedDialogs: number;
  dismissedDialogs: number;
  averageDecisionTime: number;
  mostUsedType: DialogType | null;
  lastUpdated: Date;
}

/**
 * @interface DialogQueueItem
 * @description Dialog queue item
 */
export interface DialogQueueItem extends DialogState {
  id: string;
  queuedAt: Date;
}

/**
 * @interface UseDialogReturn
 * @description Champion Return Type für Dialog Hook
 */
export interface UseDialogReturn {
  // 🏆 Dialog Status
  dialogState: DialogState;
  isVisible: boolean;
  queuedDialogs: DialogQueueItem[];
  analytics: DialogAnalytics | null;
  
  // 🏆 Champion Loading States
  isLoading: boolean;
  
  // 🏆 Error Handling
  error: string | null;
  
  // 🏆 Champion Actions (Essential Only)
  showDeleteDialog: (options: {
    title?: string;
    content?: string;
    itemName?: string;
    onConfirm: () => void;
    category?: 'user' | 'system';
  }) => void;
  
  showSaveDialog: (options: {
    title?: string;
    content?: string;
    onSave: () => void;
    onDiscard?: () => void;
    category?: 'user' | 'system';
  }) => void;
  
  showWarningDialog: (options: {
    title?: string;
    content: string;
    onContinue?: () => void;
    priority?: 'low' | 'medium' | 'high';
  }) => void;
  
  showInfoDialog: (options: {
    title?: string;
    content: string;
    onAction?: () => void;
    category?: 'info' | 'system';
  }) => void;
  
  showCustomDialog: (options: {
    type: DialogType;
    title: string;
    content: string;
    customIcon?: string;
    onConfirm?: () => void;
    category?: 'user' | 'system' | 'error' | 'warning' | 'info';
    priority?: 'low' | 'medium' | 'high' | 'critical';
  }) => void;
  
  setConfirmLoading: (loading: boolean) => void;
  dismissDialog: () => void;
  
  // 🏆 Mobile Performance Helpers
  refreshDialogState: () => Promise<void>;
  clearDialogError: () => void;
  
  // 🏆 Dialog Management
  clearQueue: () => void;
  showNextInQueue: () => void;
  getDialogAnalytics: () => DialogAnalytics | null;
}

/**
 * 🏆 CHAMPION DIALOG HOOK
 * 
 * ✅ CHAMPION PATTERNS:
 * - Single Responsibility: Dialog management only
 * - TanStack Query: Optimized dialog state caching
 * - Optimistic Updates: Immediate dialog feedback
 * - Mobile Performance: Battery-friendly dialog management
 * - Enterprise Logging: Dialog analytics trails
 * - Clean Interface: Essential dialog operations
 */
export const useDialogChampion = (): UseDialogReturn => {
  const queryClient = useQueryClient();
  const [localDialogState, setLocalDialogState] = React.useState<DialogState>({
    visible: false,
    type: 'confirmation',
    title: '',
    content: '',
    confirmLoading: false,
  });
  const [dialogQueue, setDialogQueue] = React.useState<DialogQueueItem[]>([]);
  const [analyticsData, setAnalyticsData] = React.useState<DialogAnalytics>({
    totalDialogs: 0,
    confirmedDialogs: 0,
    dismissedDialogs: 0,
    averageDecisionTime: 0,
    mostUsedType: null,
    lastUpdated: new Date(),
  });

  // 🔍 TANSTACK QUERY: Dialog State (Champion Pattern)
  const dialogStateQuery = useQuery({
    queryKey: dialogQueryKeys.state(),
    queryFn: async (): Promise<DialogState> => {
      const correlationId = `dialog_state_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      logger.info('Fetching dialog state (Champion)', LogCategory.BUSINESS, { correlationId });

      try {
        const state = { ...localDialogState };
        
        logger.info('Dialog state fetched successfully (Champion)', LogCategory.BUSINESS, { 
          correlationId,
          metadata: { visible: state.visible, type: state.type }
        });

        return state;
      } catch (error) {
        logger.error('Dialog state fetch failed (Champion)', LogCategory.BUSINESS, { 
          correlationId 
        }, error as Error);
        
        return localDialogState;
      }
    },
    initialData: localDialogState,
    ...DIALOG_CONFIG,
  });

  // 🔍 TANSTACK QUERY: Dialog Analytics (Champion Pattern)
  const analyticsQuery = useQuery({
    queryKey: dialogQueryKeys.analytics(),
    queryFn: async (): Promise<DialogAnalytics> => {
      const correlationId = `dialog_analytics_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      logger.info('Calculating dialog analytics (Champion)', LogCategory.BUSINESS, { correlationId });

      try {
        const analytics = { ...analyticsData };
        
        logger.info('Dialog analytics calculated successfully (Champion)', LogCategory.BUSINESS, { 
          correlationId,
          metadata: { totalDialogs: analytics.totalDialogs, confirmedDialogs: analytics.confirmedDialogs }
        });

        return analytics;
      } catch (error) {
        logger.error('Dialog analytics calculation failed (Champion)', LogCategory.BUSINESS, { 
          correlationId 
        }, error as Error);
        
        return analyticsData;
      }
    },
    initialData: analyticsData,
    ...DIALOG_CONFIG,
  });

  // 🏆 CHAMPION COMPUTED VALUES
  const dialogState = dialogStateQuery.data || localDialogState;
  const analytics = analyticsQuery.data || null;
  const isLoading = dialogStateQuery.isLoading;
  const error = dialogStateQuery.error?.message || analyticsQuery.error?.message || null;

  const isVisible = useMemo(() => {
    return dialogState.visible;
  }, [dialogState.visible]);

  const queuedDialogs = useMemo(() => {
    return dialogQueue;
  }, [dialogQueue]);

  // 🏆 CHAMPION ANALYTICS TRACKING
  const trackDialogAction = useCallback((action: 'shown' | 'confirmed' | 'dismissed', dialogType: DialogType) => {
    const correlationId = `dialog_action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    logger.info('Dialog action tracked (Champion)', LogCategory.BUSINESS, { 
      correlationId,
      metadata: { 
        action,
        dialogType,
        timestamp: new Date().toISOString()
      }
    });

    setAnalyticsData(prev => ({
      totalDialogs: action === 'shown' ? prev.totalDialogs + 1 : prev.totalDialogs,
      confirmedDialogs: action === 'confirmed' ? prev.confirmedDialogs + 1 : prev.confirmedDialogs,
      dismissedDialogs: action === 'dismissed' ? prev.dismissedDialogs + 1 : prev.dismissedDialogs,
      averageDecisionTime: prev.averageDecisionTime, // Would calculate from timing data
      mostUsedType: dialogType, // Would determine from usage stats
      lastUpdated: new Date(),
    }));

    // Invalidate analytics query
    queryClient.invalidateQueries({ queryKey: dialogQueryKeys.analytics() });
  }, [queryClient]);

  // 🏆 CHAMPION DIALOG CREATION
  const createDialog = useCallback((
    type: DialogType,
    title: string,
    content: string,
    options: {
      onConfirm?: () => void;
      onDismiss?: () => void;
      customIcon?: string;
      itemName?: string;
      category?: 'user' | 'system' | 'error' | 'warning' | 'info';
      priority?: 'low' | 'medium' | 'high' | 'critical';
    } = {}
  ) => {
    const correlationId = `dialog_create_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    logger.info('Creating dialog (Champion)', LogCategory.BUSINESS, { 
      correlationId,
      metadata: { 
        type,
        title,
        category: options.category || 'user',
        priority: options.priority || 'medium'
      }
    });

    const newDialogState: DialogState = {
      visible: true,
      type,
      title,
      content,
      onConfirm: options.onConfirm,
      onDismiss: options.onDismiss,
      customIcon: options.customIcon,
      itemName: options.itemName,
      correlationId,
      category: options.category || 'user',
      priority: options.priority || 'medium',
      timestamp: new Date(),
      confirmLoading: false,
    };

    setLocalDialogState(newDialogState);
    trackDialogAction('shown', type);

    // Invalidate dialog state query
    queryClient.invalidateQueries({ queryKey: dialogQueryKeys.state() });
  }, [queryClient, trackDialogAction]);

  // 🏆 CHAMPION ACTIONS
  const showDeleteDialog = useCallback((options: {
    title?: string;
    content?: string;
    itemName?: string;
    onConfirm: () => void;
    category?: 'user' | 'system';
  }) => {
    createDialog(
      'delete',
      options.title || 'Element löschen',
      options.content || 'Sind Sie sicher, dass Sie dieses Element löschen möchten?',
      {
        onConfirm: options.onConfirm,
        itemName: options.itemName,
        category: options.category || 'user',
        priority: 'high',
      }
    );
  }, [createDialog]);

  const showSaveDialog = useCallback((options: {
    title?: string;
    content?: string;
    onSave: () => void;
    onDiscard?: () => void;
    category?: 'user' | 'system';
  }) => {
    createDialog(
      'confirmation',
      options.title || 'Änderungen speichern?',
      options.content || 'Sie haben nicht gespeicherte Änderungen.',
      {
        onConfirm: options.onSave,
        onDismiss: options.onDiscard,
        category: options.category || 'user',
        priority: 'medium',
      }
    );
  }, [createDialog]);

  const showWarningDialog = useCallback((options: {
    title?: string;
    content: string;
    onContinue?: () => void;
    priority?: 'low' | 'medium' | 'high';
  }) => {
    createDialog(
      'warning',
      options.title || 'Warnung',
      options.content,
      {
        onConfirm: options.onContinue,
        category: 'warning',
        priority: options.priority || 'high',
      }
    );
  }, [createDialog]);

  const showInfoDialog = useCallback((options: {
    title?: string;
    content: string;
    onAction?: () => void;
    category?: 'info' | 'system';
  }) => {
    createDialog(
      'info',
      options.title || 'Information',
      options.content,
      {
        onConfirm: options.onAction,
        category: options.category || 'info',
        priority: 'low',
      }
    );
  }, [createDialog]);

  const showCustomDialog = useCallback((options: {
    type: DialogType;
    title: string;
    content: string;
    customIcon?: string;
    onConfirm?: () => void;
    category?: 'user' | 'system' | 'error' | 'warning' | 'info';
    priority?: 'low' | 'medium' | 'high' | 'critical';
  }) => {
    createDialog(options.type, options.title, options.content, {
      onConfirm: options.onConfirm,
      customIcon: options.customIcon,
      category: options.category || 'user',
      priority: options.priority || 'medium',
    });
  }, [createDialog]);

  const setConfirmLoading = useCallback((loading: boolean) => {
    setLocalDialogState(prev => ({
      ...prev,
      confirmLoading: loading,
    }));

    // Invalidate dialog state query
    queryClient.invalidateQueries({ queryKey: dialogQueryKeys.state() });
  }, [queryClient]);

  const dismissDialog = useCallback(() => {
    const correlationId = `dialog_dismiss_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    logger.info('Dismissing dialog (Champion)', LogCategory.BUSINESS, { 
      correlationId,
      metadata: { dialogType: dialogState.type }
    });

    trackDialogAction('dismissed', dialogState.type);

    setLocalDialogState(prev => ({
      ...prev,
      visible: false,
      confirmLoading: false,
    }));

    // Invalidate dialog state query
    queryClient.invalidateQueries({ queryKey: dialogQueryKeys.state() });

    // Show next dialog in queue if available
    if (dialogQueue.length > 0) {
      const nextDialog = dialogQueue[0];
      setDialogQueue(prev => prev.slice(1));
      
      setTimeout(() => {
        setLocalDialogState(nextDialog);
        queryClient.invalidateQueries({ queryKey: dialogQueryKeys.state() });
      }, 200); // Small delay for smooth UX
    }
  }, [dialogState.type, dialogQueue, queryClient, trackDialogAction]);

  // 🏆 MOBILE PERFORMANCE HELPERS
  const refreshDialogState = useCallback(async (): Promise<void> => {
    logger.info('Refreshing dialog state (Champion)', LogCategory.BUSINESS);
    await Promise.all([
      dialogStateQuery.refetch(),
      analyticsQuery.refetch()
    ]);
  }, [dialogStateQuery, analyticsQuery]);

  const clearDialogError = useCallback(() => {
    queryClient.setQueryData(dialogQueryKeys.state(), dialogStateQuery.data);
    queryClient.setQueryData(dialogQueryKeys.analytics(), analyticsQuery.data);
  }, [queryClient, dialogStateQuery.data, analyticsQuery.data]);

  // 🏆 DIALOG MANAGEMENT HELPERS
  const clearQueue = useCallback(() => {
    const correlationId = `dialog_clear_queue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    logger.info('Clearing dialog queue (Champion)', LogCategory.BUSINESS, { 
      correlationId,
      metadata: { queueSize: dialogQueue.length }
    });

    setDialogQueue([]);
  }, [dialogQueue.length]);

  const showNextInQueue = useCallback(() => {
    if (dialogQueue.length > 0) {
      const nextDialog = dialogQueue[0];
      setDialogQueue(prev => prev.slice(1));
      setLocalDialogState(nextDialog);
      queryClient.invalidateQueries({ queryKey: dialogQueryKeys.state() });
    }
  }, [dialogQueue, queryClient]);

  const getDialogAnalytics = useCallback((): DialogAnalytics | null => {
    return analytics;
  }, [analytics]);

  return {
    // 🏆 Dialog Status
    dialogState,
    isVisible,
    queuedDialogs,
    analytics,
    
    // 🏆 Champion Loading States
    isLoading,
    
    // 🏆 Error Handling
    error,
    
    // 🏆 Champion Actions
    showDeleteDialog,
    showSaveDialog,
    showWarningDialog,
    showInfoDialog,
    showCustomDialog,
    setConfirmLoading,
    dismissDialog,
    
    // 🏆 Mobile Performance Helpers
    refreshDialogState,
    clearDialogError,
    
    // 🏆 Dialog Management
    clearQueue,
    showNextInQueue,
    getDialogAnalytics,
  };
};