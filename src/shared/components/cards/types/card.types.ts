/**
 * Shared Card Types - Enterprise Type Definitions
 * Common interfaces and types for reusable card components
 */

import React from 'react';
import { ViewStyle, TextStyle } from 'react-native';
import { MD3Theme } from 'react-native-paper';

// Base Card Types
export interface BaseCardProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  theme?: MD3Theme;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  testID?: string;
  elevated?: boolean;
  compact?: boolean;
}

export interface CardContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

// Specialized Card Types
export interface InfoCardProps extends BaseCardProps {
  icon?: string;
  iconColor?: string;
  value?: string | number;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export interface ActionCardProps extends BaseCardProps {
  actions: ActionItem[];
  onActionPress?: (actionId: string) => void;
  accessibilityRole?: string;
  accessibilityLabel?: string;
}

export interface StatsCardProps extends BaseCardProps {
  stats: StatItem[];
  layout?: 'horizontal' | 'vertical' | 'grid';
}

export interface DangerCardProps extends BaseCardProps {
  dangerLevel?: 'low' | 'medium' | 'high' | 'critical';
  confirmationRequired?: boolean;
  onConfirm?: () => void;
  confirmText?: string;
  warningText?: string;
  t?: (key: string, options?: any) => string;
}

// Content Types
export interface ActionItem {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  iconColor?: string;
  disabled?: boolean;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  primary?: boolean;
}

export interface StatItem {
  id: string;
  label: string;
  value: string | number;
  icon?: string;
  iconColor?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  description?: string;
}

// Support Content Types
export interface SupportItem extends ActionItem {
  type: 'help' | 'contact' | 'documentation' | 'community';
  url?: string;
  external?: boolean;
}

export interface SupportCardContentProps {
  items: SupportItem[];
  onItemPress: (item: SupportItem) => void;
  theme?: MD3Theme;
  t: (key: string, options?: any) => string;
}

// Security Content Types
export interface SecurityItem extends StatItem {
  type: 'login' | 'sessions' | 'mfa' | 'devices' | 'attempts';
  status?: 'secure' | 'warning' | 'danger';
  lastUpdated?: Date;
}

export interface SecurityCardContentProps {
  items: SecurityItem[];
  onItemPress?: (item: SecurityItem) => void;
  theme?: MD3Theme;
  t: (key: string, options?: any) => string;
}

// Data Stats Content Types
export interface DataStatsItem extends StatItem {
  type: 'usage' | 'backup' | 'devices' | 'storage' | 'bandwidth';
  unit?: string;
  limit?: number;
  percentage?: number;
}

export interface DataStatsContentProps {
  items: DataStatsItem[];
  onExportData?: () => void;
  isExporting?: boolean;
  theme?: MD3Theme;
  t: (key: string, options?: any) => string;
}

// Style Types
export interface CardStyles {
  container: ViewStyle;
  content: ViewStyle;
  header: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  body: ViewStyle;
  footer: ViewStyle;
  divider: ViewStyle;
  elevated: ViewStyle;
  compact: ViewStyle;
}

export interface CardThemeOverrides {
  colors?: {
    cardBackground?: string;
    cardBorder?: string;
    cardShadow?: string;
    dangerBackground?: string;
    dangerBorder?: string;
    warningBackground?: string;
    warningBorder?: string;
  };
  spacing?: {
    cardPadding?: number;
    contentPadding?: number;
    itemSpacing?: number;
  };
  typography?: {
    titleSize?: number;
    subtitleSize?: number;
    bodySize?: number;
  };
}

// Utility Types
export type CardVariant = 'default' | 'elevated' | 'outlined' | 'filled';
export type CardSize = 'small' | 'medium' | 'large';
export type CardLayout = 'vertical' | 'horizontal' | 'grid'; 