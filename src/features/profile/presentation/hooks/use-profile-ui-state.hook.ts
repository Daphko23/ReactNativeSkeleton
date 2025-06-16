/**
 * @fileoverview Profile UI State Hook - CHAMPION
 * 
 * 🏆 CHAMPION STANDARDS 2025:
 * ✅ Single Responsibility: Profile UI state only
 * ✅ TanStack Query + Use Cases: No mixing with UI state
 * ✅ Optimistic Updates: Immediate UI response
 * ✅ Mobile Performance: Minimal overhead
 * ✅ Enterprise Logging: Essential UI interactions
 * ✅ Clean Interface: Simplified Champion API
 */

import { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { LoggerFactory } from '@core/logging/logger.factory';
import { LogCategory } from '@core/logging/logger.service.interface';

const logger = LoggerFactory.createServiceLogger('ProfileUIState');

// 🏆 CHAMPION INTERFACES: Simplified & Mobile-Optimized
export interface ExpandedSections {
  completeness: boolean;
  enhancements: boolean;
  security: boolean;
  quickActions: boolean;
  permissions: boolean;
}

export interface QuickAction {
  id: string;
  title: string;
  icon: string;
  label: string;
  category: 'primary' | 'secondary' | 'admin';
  onPress: () => void;
}

export interface UseProfileUIStateProps {
  variant?: 'compact' | 'detailed' | 'admin';
  userId?: string;
  enableLogging?: boolean;
}

export interface UseProfileUIStateReturn {
  // 🏆 Core UI State
  expandedSections: ExpandedSections;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  
  // 🏆 Champion Loading States
  isEnhancementLoading: boolean;
  isLoadingEnhanced: boolean;
  
  // 🏆 Modal/Dialog States
  showSecurityPrompt: boolean;
  showEnhancedInfo: boolean;
  showActionMenu: boolean;
  
  // 🏆 Champion Section Actions
  toggleSection: (section: keyof ExpandedSections) => void;
  expandAllSections: () => void;
  collapseAllSections: () => void;
  
  // 🏆 Champion Loading Actions
  setEnhancementLoading: (loading: boolean) => void;
  setLoadingEnhanced: (loading: boolean) => void;
  setRefreshing: (refreshing: boolean) => void;
  
  // 🏆 Champion Modal Actions
  dismissSecurityPrompt: () => void;
  toggleEnhancedInfo: () => void;
  toggleActionMenu: () => void;
  
  // 🏆 UI Data
  quickActions: QuickAction[];
  variantSettings: {
    showCompleteness: boolean;
    showSecurity: boolean;
    showEnhancements: boolean;
    compactLayout: boolean;
  };
  
  // 🏆 Mobile Performance Helpers
  hasExpandedSections: boolean;
  expandedSectionCount: number;
  clearError: () => void;
  resetToDefaults: () => void;
  
  // 🏆 Helper Functions
  getRoleColor: (role: string) => string;
  formatLastActivity: (date: Date) => string;
}

// 🏆 CHAMPION CONFIG: Mobile Performance
const DEFAULT_EXPANDED_SECTIONS = {
  compact: {
    completeness: false,
    enhancements: false,
    security: false,
    quickActions: false,
    permissions: false,
  },
  detailed: {
    completeness: true,
    enhancements: false,
    security: false,
    quickActions: false,
    permissions: false,
  },
  admin: {
    completeness: true,
    enhancements: true,
    security: true,
    quickActions: true,
    permissions: true,
  },
} as const;

/**
 * 🏆 CHAMPION PROFILE UI STATE HOOK
 * 
 * ✅ CHAMPION PATTERNS:
 * - Single Responsibility: UI state management only
 * - Mobile Performance: Minimal state overhead
 * - Enterprise Logging: Essential UI interactions
 * - Clean Interface: Simplified UI state API
 * - Optimistic Updates: Immediate UI feedback
 */
export const useProfileUIState = (props?: UseProfileUIStateProps): UseProfileUIStateReturn => {
  const { variant = 'detailed', userId = '', enableLogging = true } = props || {};
  
  const { t } = useTranslation();
  
  // 🏆 CHAMPION STATE (Essential Only)
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>(
    DEFAULT_EXPANDED_SECTIONS[variant]
  );
  const [isEnhancementLoading, setIsEnhancementLoading] = useState(false);
  const [isLoadingEnhanced, setIsLoadingEnhanced] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSecurityPrompt, setShowSecurityPrompt] = useState(false);
  const [showEnhancedInfo, setShowEnhancedInfo] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 🏆 CHAMPION SECTION ACTIONS
  const toggleSection = useCallback((section: keyof ExpandedSections) => {
    const wasExpanded = expandedSections[section];
    
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
    
    if (enableLogging) {
      logger.info('Profile section toggled', LogCategory.BUSINESS, {
        userId,
        metadata: { section, newState: !wasExpanded, variant }
      });
    }
  }, [expandedSections, enableLogging, userId, variant]);
  
  const expandAllSections = useCallback(() => {
    setExpandedSections({
      completeness: true,
      enhancements: true,
      security: true,
      quickActions: true,
      permissions: true,
    });
    
    if (enableLogging) {
      logger.info('All profile sections expanded', LogCategory.BUSINESS, { userId, metadata: { variant } });
    }
  }, [enableLogging, userId, variant]);
  
  const collapseAllSections = useCallback(() => {
    setExpandedSections({
      completeness: false,
      enhancements: false,
      security: false,
      quickActions: false,
      permissions: false,
    });
    
    if (enableLogging) {
      logger.info('All profile sections collapsed', LogCategory.BUSINESS, { userId, metadata: { variant } });
    }
  }, [enableLogging, userId, variant]);
  
  // 🏆 CHAMPION MODAL ACTIONS
  const dismissSecurityPrompt = useCallback(() => {
    setShowSecurityPrompt(false);
    
    if (enableLogging) {
      logger.info('Security prompt dismissed', LogCategory.BUSINESS, { userId });
    }
  }, [enableLogging, userId]);
  
  const toggleEnhancedInfo = useCallback(() => {
    setShowEnhancedInfo(prev => {
      const newState = !prev;
      
      if (enableLogging) {
        logger.info('Enhanced info toggled', LogCategory.BUSINESS, { 
          userId, 
          metadata: { newState, variant } 
        });
      }
      
      return newState;
    });
  }, [enableLogging, userId, variant]);
  
  const toggleActionMenu = useCallback(() => {
    setShowActionMenu(prev => {
      const newState = !prev;
      
      if (enableLogging) {
        logger.info('Action menu toggled', LogCategory.BUSINESS, { 
          userId, 
          metadata: { newState, variant } 
        });
      }
      
      return newState;
    });
  }, [enableLogging, userId, variant]);
  
  // 🏆 CHAMPION HELPER ACTIONS
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  const resetToDefaults = useCallback(() => {
    setExpandedSections(DEFAULT_EXPANDED_SECTIONS[variant]);
    setIsEnhancementLoading(false);
    setIsLoadingEnhanced(false);
    setIsRefreshing(false);
    setShowSecurityPrompt(false);
    setShowEnhancedInfo(false);
    setShowActionMenu(false);
    setError(null);
    
    if (enableLogging) {
      logger.info('Profile UI state reset to defaults', LogCategory.BUSINESS, { userId, metadata: { variant } });
    }
  }, [variant, enableLogging, userId]);
  
  // 🏆 CHAMPION COMPUTED VALUES (Memoized for Performance)
  const isLoading = useMemo(() => {
    return isEnhancementLoading || isLoadingEnhanced || isRefreshing;
  }, [isEnhancementLoading, isLoadingEnhanced, isRefreshing]);
  
  const hasExpandedSections = useMemo(() => {
    return Object.values(expandedSections).some(Boolean);
  }, [expandedSections]);
  
  const expandedSectionCount = useMemo(() => {
    return Object.values(expandedSections).filter(Boolean).length;
  }, [expandedSections]);
  
  const variantSettings = useMemo(() => {
    switch (variant) {
      case 'compact':
        return {
          showCompleteness: false,
          showSecurity: false,
          showEnhancements: false,
          compactLayout: true,
        };
      case 'admin':
        return {
          showCompleteness: true,
          showSecurity: true,
          showEnhancements: true,
          compactLayout: false,
        };
      case 'detailed':
      default:
        return {
          showCompleteness: true,
          showSecurity: true,
          showEnhancements: false,
          compactLayout: false,
        };
    }
  }, [variant]);
  
  // 🏆 CHAMPION QUICK ACTIONS
  const quickActions = useMemo((): QuickAction[] => {
    const baseActions: QuickAction[] = [
      {
        id: 'edit',
        title: t('profile.actions.edit'),
        icon: 'edit',
        label: t('profile.actions.edit'),
        category: 'primary',
        onPress: () => {
          if (enableLogging) {
            logger.info('Edit action triggered', LogCategory.BUSINESS, { userId, metadata: { variant } });
          }
          // Navigation would be handled by parent component
        }
      },
      {
        id: 'share',
        title: t('profile.actions.share'),
        icon: 'share',
        label: t('profile.actions.share'),
        category: 'secondary',
        onPress: () => {
          if (enableLogging) {
            logger.info('Share action triggered', LogCategory.BUSINESS, { userId, metadata: { variant } });
          }
          // Share logic would be handled by parent component
        }
      }
    ];

    // Add admin-specific actions
    if (variant === 'admin') {
      baseActions.push({
        id: 'manage',
        title: t('profile.actions.manage'),
        icon: 'settings',
        label: t('profile.actions.manage'),
        category: 'admin',
        onPress: () => {
          if (enableLogging) {
            logger.info('Manage action triggered', LogCategory.BUSINESS, { userId, metadata: { variant } });
          }
          // Admin logic would be handled by parent component
        }
      });
    }

    return baseActions;
  }, [t, variant, enableLogging, userId]);
  
  // 🏆 CHAMPION UI HELPERS
  const getRoleColor = useCallback((role: string): string => {
    const roleColors: Record<string, string> = {
      'admin': '#ef4444',
      'moderator': '#f59e0b',
      'user': '#10b981',
      'premium': '#8b5cf6',
      'guest': '#6b7280'
    };
    return roleColors[role.toLowerCase()] || '#6b7280';
  }, []);
  
  const formatLastActivity = useCallback((date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return t('profile.lastActivity.today');
    if (diffDays === 1) return t('profile.lastActivity.yesterday');
    if (diffDays < 7) return t('profile.lastActivity.daysAgo', { count: diffDays });
    if (diffDays < 30) return t('profile.lastActivity.weeksAgo', { count: Math.floor(diffDays / 7) });
    return t('profile.lastActivity.monthsAgo', { count: Math.floor(diffDays / 30) });
  }, [t]);
  
  return {
    // 🏆 Core UI State
    expandedSections,
    isLoading,
    isRefreshing,
    error,
    
    // 🏆 Champion Loading States
    isEnhancementLoading,
    isLoadingEnhanced,
    
    // 🏆 Modal/Dialog States
    showSecurityPrompt,
    showEnhancedInfo,
    showActionMenu,
    
    // 🏆 Champion Section Actions
    toggleSection,
    expandAllSections,
    collapseAllSections,
    
    // 🏆 Champion Loading Actions
    setEnhancementLoading: setIsEnhancementLoading,
    setLoadingEnhanced: setIsLoadingEnhanced,
    setRefreshing: setIsRefreshing,
    
    // 🏆 Champion Modal Actions
    dismissSecurityPrompt,
    toggleEnhancedInfo,
    toggleActionMenu,
    
    // 🏆 UI Data
    quickActions,
    variantSettings,
    
    // 🏆 Mobile Performance Helpers
    hasExpandedSections,
    expandedSectionCount,
    clearError,
    resetToDefaults,
    
    // 🏆 Helper Functions
    getRoleColor,
    formatLastActivity,
  };
};