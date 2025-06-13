/**
 * @fileoverview AuthAwareProfileCard Component - HOOK-CENTRIC UI Component
 * 
 * @description Pure UI component for auth-aware profile card.
 * NO BUSINESS LOGIC - all logic handled by useAuthAwareProfile hook.
 * Follows HOOK-CENTRIC architecture with complete separation of concerns.
 * 
 * @module AuthAwareProfileCardComponent
 * @since 2.0.0 (HOOK-CENTRIC Refactor)
 * @author ReactNativeSkeleton Enterprise Team
 * @layer Presentation (Pure UI Component)
 * @architecture HOOK-CENTRIC - Components only for UI rendering
 */

import React from 'react';
import {
  View,
} from 'react-native';
import {
  Card,
  Avatar,
  Chip,
  IconButton,
  ProgressBar,
  Badge,
  Divider,
  Surface,
  ActivityIndicator,
  Button,
  Title,
  Paragraph,
} from 'react-native-paper';
import { useTranslation } from 'react-i18next';

// Shared Components
import { InfoCard as _InfoCard, ActionCard as _ActionCard, StatsCard as _StatsCard } from '../../../../../shared/components';
import type { ActionItem as _ActionItem, StatItem as _StatItem } from '../../../../../shared/components/cards/types/card.types';

import { useAuthAwareProfile } from '../../hooks/use-auth-aware-profile.hook';
import { useTheme } from '../../../../../core/theme/theme.system';
import { createAuthAwareProfileCardStyles } from './auth-aware-profile-card.component.styles';

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

/**
 * Props interface for AuthAwareProfileCard component
 */
interface AuthAwareProfileCardProps {
  /** Target user ID, defaults to current authenticated user */
  userId?: string;
  
  /** Display variant for different use cases */
  variant?: 'compact' | 'detailed' | 'admin';
  
  /** Whether to show security status badges */
  showSecurityBadges?: boolean;
  
  /** Whether to display role information chips */
  showRoleInfo?: boolean;
  
  /** Whether to show user permissions section */
  showPermissions?: boolean;
  
  /** Enable quick action buttons for common tasks */
  enableQuickActions?: boolean;
  
  /** Navigation handler for profile edit screen */
  onNavigateToEdit?: () => void;
  
  /** Navigation handler for security settings */
  onNavigateToSecurity?: () => void;
  
  /** Navigation handler for activity history */
  onNavigateToHistory?: () => void;
}

// =============================================================================
// HOOK-CENTRIC COMPONENT - PURE UI ONLY
// =============================================================================

/**
 * AuthAwareProfileCard - Pure UI Component
 * 
 * @description HOOK-CENTRIC auth-aware profile card:
 * - ALL business logic in useAuthAwareProfile hook
 * - Component only handles UI rendering and user interactions
 * - Profile display, security badges, role management only
 * - Zero business logic, zero state management, zero service calls
 */
export function AuthAwareProfileCard({
  userId,
  variant = 'compact',
  showSecurityBadges = true,
  showRoleInfo = true,
  showPermissions = false,
  enableQuickActions = true,
  onNavigateToEdit,
  onNavigateToSecurity,
  onNavigateToHistory,
}: AuthAwareProfileCardProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = createAuthAwareProfileCardStyles(theme);

  // 🎯 HOOK-CENTRIC - ALL BUSINESS LOGIC FROM HOOK
  const {
    // Server State
    profile,
    enhancedData,
    isLoading,
    error,
    
    // UI State
    showEnhancedInfo,
    isLoadingEnhanced,
    
    // Computed States
    profileCompleteness,
    securityScore,
    securityBadgeColor,
    securityLevel: _securityLevel,
    
    // Actions
    loadEnhancedData,
    handleSecurityAction,
    handleAdminAction,
    
    // UI Helpers
    getRoleColor: _getRoleColor,
    formatLastActivity,
    getSecurityBadgeText,
    
    // Data Arrays
    quickActions,
    securityActions,
    rolesList,
    permissionsList,
  } = useAuthAwareProfile({ userId, variant });

  // =============================================================================
  // UI EVENT HANDLERS - DELEGATE TO HOOK
  // =============================================================================

  const handleEditPress = () => {
    onNavigateToEdit?.();
  };

  const handleSecurityPress = () => {
    if (securityActions.length > 0) {
      handleSecurityAction(securityActions[0]);
    }
    onNavigateToSecurity?.();
  };

  const handleHistoryPress = () => {
    onNavigateToHistory?.();
  };

  const handleEnhancedInfoToggle = () => {
    loadEnhancedData();
  };

  // =============================================================================
  // UI RENDERING FUNCTIONS
  // =============================================================================

  const renderAvatar = () => (
    <Avatar.Image
      source={{ uri: profile?.avatar || undefined }}
      size={variant === 'compact' ? 48 : 64}
      style={styles.avatar}
    />
  );

  const renderUserInfo = () => (
    <View style={styles.userInfo}>
      <Title style={styles.userName}>
        {profile?.firstName} {profile?.lastName}
      </Title>
      <Paragraph style={styles.userEmail}>
        {profile?.email}
      </Paragraph>
      {showRoleInfo && rolesList.length > 0 && (
        <View style={styles.rolesContainer}>
          {rolesList.slice(0, 2).map((role, index) => (
            <Chip
              key={index}
              mode="outlined"
              compact
              style={[styles.roleChip, { borderColor: role.color }]}
              textStyle={{ color: role.color }}
            >
              {role.name}
            </Chip>
          ))}
        </View>
      )}
    </View>
  );

  const renderSecurityBadges = () => {
    if (!showSecurityBadges) return null;

    return (
      <View style={styles.badgesContainer}>
        <Badge
          style={[styles.securityBadge, { backgroundColor: securityBadgeColor }]}
          size={24}
        >
          {securityScore}
        </Badge>
        <Paragraph style={styles.securityText}>
          {getSecurityBadgeText()}
        </Paragraph>
      </View>
    );
  };

  const renderProgressBar = () => {
    if (variant === 'compact') return null;

    return (
      <View style={styles.progressContainer}>
        <Paragraph style={styles.progressLabel}>
          {t('profile.completeness')}: {Math.round(profileCompleteness)}%
        </Paragraph>
        <ProgressBar
          progress={profileCompleteness / 100}
          color="#3b82f6"
          style={styles.progressBar}
        />
      </View>
    );
  };

  const renderQuickActions = () => {
    if (!enableQuickActions || variant === 'compact') return null;

    return (
      <View style={styles.actionsContainer}>
        {quickActions.map((action, index) => (
          <IconButton
            key={index}
            icon={action.icon}
            mode="contained-tonal"
            size={20}
            onPress={() => {
              if (action.id === 'edit') handleEditPress();
              else if (action.id === 'security') handleSecurityPress();
              else if (action.id === 'history') handleHistoryPress();
              else handleAdminAction(action.id);
            }}
            accessibilityLabel={action.label}
          />
        ))}
      </View>
    );
  };

  const renderEnhancedInfo = () => {
    if (variant !== 'detailed' && variant !== 'admin') return null;

    return (
      <View style={styles.enhancedContainer}>
        <Button
          mode="text"
          onPress={handleEnhancedInfoToggle}
          loading={isLoadingEnhanced}
          disabled={isLoadingEnhanced}
        >
          {showEnhancedInfo 
            ? t('profile.hideDetails') 
            : t('profile.showDetails')
          }
        </Button>

        {showEnhancedInfo && (
          <Surface style={styles.enhancedSurface} elevation={1}>
            <View style={styles.enhancedRow}>
              <Paragraph>{t('profile.lastActivity')}</Paragraph>
              <Paragraph>{formatLastActivity(new Date())}</Paragraph>
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.enhancedRow}>
              <Paragraph>{t('profile.sessions')}</Paragraph>
              <Paragraph>{'1'}</Paragraph>
            </View>
            
            {showPermissions && permissionsList.length > 0 && (
              <>
                <Divider style={styles.divider} />
                <View style={styles.permissionsContainer}>
                  <Paragraph style={styles.permissionsTitle}>
                    {t('profile.permissions')}
                  </Paragraph>
                  {permissionsList.map((permission, index) => (
                    <Chip
                      key={index}
                      mode="flat"
                      compact
                      style={styles.permissionChip}
                      textStyle={styles.permissionChipText}
                    >
                      {permission.name}
                    </Chip>
                  ))}
                </View>
              </>
            )}
          </Surface>
        )}
      </View>
    );
  };

  const renderError = () => {
    if (!error) return null;

    return (
      <Surface style={styles.errorContainer} elevation={1}>
        <Paragraph style={styles.errorText}>
          {t('profile.loadError')}
        </Paragraph>
        <Button
          mode="outlined"
          onPress={() => loadEnhancedData()}
          compact
        >
          {t('common.retry')}
        </Button>
      </Surface>
    );
  };

  const renderLoading = () => (
    <Card style={styles.loadingCard}>
      <Card.Content style={styles.loadingContent}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Paragraph style={styles.loadingText}>
          {t('profile.loading')}
        </Paragraph>
      </Card.Content>
    </Card>
  );

  // =============================================================================
  // MAIN RENDER
  // =============================================================================

  if (isLoading) {
    return renderLoading();
  }

  if (error) {
    return renderError();
  }

  return (
    <Card style={[styles.card, styles[`${variant}Card`]]} elevation={2}>
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          {renderAvatar()}
          {renderUserInfo()}
          {renderSecurityBadges()}
        </View>

        {renderProgressBar()}
        {renderQuickActions()}
        {renderEnhancedInfo()}
      </Card.Content>
    </Card>
  );
} 