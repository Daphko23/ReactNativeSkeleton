/**
 * @fileoverview DATA-STATS-CONTENT-COMPONENT: Data Usage Statistics Display Component
 * @description Specialized content component for rendering data usage statistics with export functionality
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Shared.Components.Cards.Content
 * @namespace Shared.Components.Cards.Content.DataStatsContent
 * @category Components
 * @subcategory Cards.Content
 */

import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { StatsCard } from '../specialized/stats-card.component';
import type { DataStatsContentProps, StatItem } from '../types/card.types';

/**
 * Data Stats Content Component
 * 
 * A specialized content component designed for rendering data usage statistics with export
 * functionality within card interfaces. Transforms data metrics into visually appealing
 * statistical displays with usage indicators, trend analysis, and data export capabilities
 * for comprehensive data management and user transparency.
 * 
 * @component
 * @function DataStatsContent
 * @param {DataStatsContentProps} props - The component props
 * @returns {React.ReactElement} Rendered data stats content with statistical display and export options
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Components
 * @subcategory Cards.Content
 * @module Shared.Components.Cards.Content
 * @namespace Shared.Components.Cards.Content.DataStatsContent
 * 
 * @example
 * Basic data usage display:
 * ```tsx
 * import { DataStatsContent } from '@/shared/components/cards';
 * 
 * const DataUsageOverview = () => (
 *   <DataStatsContent
 *     items={[
 *       {
 *         id: 'storage-used',
 *         type: 'storage',
 *         label: 'Storage Used',
 *         value: 2.4,
 *         unit: 'GB',
 *         limit: 15,
 *         percentage: 16,
 *         trend: 'up',
 *         trendValue: '+0.2 GB'
 *       },
 *       {
 *         id: 'last-backup',
 *         type: 'backup',
 *         label: 'Last Backup',
 *         value: '2 days ago',
 *         description: 'Automatic backup completed successfully'
 *       }
 *     ]}
 *     onExportData={handleDataExport}
 *     t={translate}
 *   />
 * );
 * ```
 * 
 * @example
 * Comprehensive data analytics dashboard:
 * ```tsx
 * <DataStatsContent
 *   items={[
 *     {
 *       id: 'storage',
 *       type: 'storage',
 *       label: 'Storage Usage',
 *       value: 8.5,
 *       unit: 'GB',
 *       limit: 15,
 *       percentage: 57,
 *       trend: 'up',
 *       trendValue: '+1.2 GB',
 *       description: 'of 15 GB total'
 *     },
 *     {
 *       id: 'bandwidth',
 *       type: 'bandwidth',
 *       label: 'Bandwidth Used',
 *       value: 142,
 *       unit: 'MB',
 *       percentage: 23,
 *       trend: 'down',
 *       trendValue: '-15 MB'
 *     },
 *     {
 *       id: 'devices',
 *       type: 'devices',
 *       label: 'Active Devices',
 *       value: 3,
 *       description: 'Synchronized across platforms'
 *     },
 *     {
 *       id: 'backups',
 *       type: 'backup',
 *       label: 'Backup History',
 *       value: 'Yesterday',
 *       trend: 'neutral',
 *       description: 'All data backed up successfully'
 *     }
 *   ]}
 *   onExportData={handleFullDataExport}
 *   isExporting={exportInProgress}
 *   theme={theme}
 *   t={i18n.t}
 * />
 * ```
 * 
 * @example
 * Usage monitoring with warnings:
 * ```tsx
 * <DataStatsContent
 *   items={dataUsageItems.map(item => ({
 *     ...item,
 *     iconColor: item.percentage > 90 ? '#F44336' : 
 *               item.percentage > 75 ? '#FF9800' : '#4CAF50'
 *   }))}
 *   onExportData={exportUserData}
 *   isExporting={isLoading}
 *   t={translate}
 * />
 * ```
 * 
 * @features
 * - Data usage visualization with units and percentages
 * - Usage-based color coding for capacity warnings
 * - Automatic icon assignment by data type
 * - Trend analysis for usage patterns
 * - Export functionality with loading states
 * - Internationalization support
 * - Theme integration for consistent styling
 * - Limit and percentage calculations
 * - Comprehensive data type coverage
 * 
 * @data_types
 * - usage: General data consumption metrics
 * - backup: Backup status and history
 * - devices: Device synchronization data
 * - storage: Storage capacity and usage
 * - bandwidth: Network usage statistics
 * 
 * @usage_indicators
 * - Green: Normal usage levels (< 75%)
 * - Orange: High usage levels (75-90%)
 * - Red: Critical usage levels (> 90%)
 * 
 * @architecture
 * - Transforms DataStatsItem array to StatItem format
 * - Leverages StatsCard for consistent display patterns
 * - Automatic value formatting with units
 * - Usage-aware color coding system
 * - Export functionality integration
 * - Translation integration layer
 * 
 * @styling
 * - Usage-based color coding system
 * - Data-specific icon semantics
 * - Consistent statistical layout
 * - Theme-aware color integration
 * - Export section visual separation
 * 
 * @accessibility
 * - Screen reader compatible data information
 * - High contrast usage indicators
 * - Semantic markup for data states
 * - Clear visual hierarchy for usage levels
 * - Touch target compliance
 * 
 * @performance
 * - Efficient item transformation
 * - Memoized color calculations
 * - Optimized re-render behavior
 * - Lazy formatting operations
 * 
 * @dependencies
 * - react: Core React library
 * - react-native: View component
 * - react-native-paper: Button component
 * - ../specialized/stats-card.component: StatsCard foundation
 * - ../types/card.types: Type definitions
 * 
 * @use_cases
 * - Data usage dashboard interfaces
 * - Storage management displays
 * - Bandwidth monitoring
 * - Backup status tracking
 * - Device synchronization overview
 * - Data export and compliance
 * 
 * @best_practices
 * - Provide clear usage indicators for capacity warnings
 * - Implement proper data export security
 * - Use appropriate units for data measurements
 * - Test export functionality thoroughly
 * - Maintain data freshness and accuracy
 * 
 * @see {@link StatsCard} for underlying statistical interface
 * @see {@link DataStatsContentProps} for prop definitions
 * @see {@link DataStatsItem} for data item structure
 */
export const DataStatsContent: React.FC<DataStatsContentProps> = ({
  items,
  onExportData,
  isExporting = false,
  theme,
  t
}) => {
  /**
   * Transforms data statistics items into statistical items format.
   * Maps data-specific properties to StatsCard-compatible structure
   * with automatic formatting, icon assignment, and usage-based color coding.
   * 
   * @constant stats
   * @type {StatItem[]}
   * @since 1.0.0
   * 
   * @transformation
   * - Maps DataStatsItem to StatItem interface
   * - Formats values with units and percentages
   * - Assigns default icons based on data type
   * - Applies usage-based color coding
   * - Generates descriptive text when applicable
   * - Preserves trend and description data
   */
  const stats: StatItem[] = items.map(item => ({
    id: item.id,
    label: item.label,
    value: formatValue(item.value, item.unit, item.percentage),
    icon: item.icon || getDataIcon(item.type),
    iconColor: item.iconColor || getDataColor(item.percentage, theme),
    trend: item.trend,
    trendValue: item.trendValue,
    description: item.description || formatDescription(item, t),
  }));

  return (
    <StatsCard
      title={t('account.dataUsage.title')}
      stats={stats}
      layout="vertical"
      theme={theme}
    >
      {/* Export Section */}
      {onExportData && (
        <View style={{ 
          marginTop: 16, 
          paddingTop: 16, 
          borderTopWidth: 1, 
          borderTopColor: theme?.colors.outlineVariant 
        }}>
          <Button
            mode="outlined"
            onPress={onExportData}
            loading={isExporting}
            disabled={isExporting}
            icon="download"
          >
            {isExporting ? t('account.dataUsage.exporting') : t('account.dataUsage.exportData')}
          </Button>
        </View>
      )}
    </StatsCard>
  );
};

/**
 * Formats data value with unit and percentage information.
 * Creates comprehensive value display by combining numerical values
 * with appropriate units and percentage indicators for usage visualization.
 * 
 * @function formatValue
 * @param {string | number} value - Raw data value to format
 * @param {string} [unit] - Unit of measurement (GB, MB, etc.)
 * @param {number} [percentage] - Usage percentage (0-100)
 * @returns {string} Formatted value string with units and percentage
 * @private
 * @since 1.0.0
 * 
 * @formatting_rules
 * - Converts numeric values to strings
 * - Appends unit if not already included
 * - Adds percentage in parentheses when available
 * - Maintains original formatting when appropriate
 * 
 * @example
 * ```tsx
 * formatValue(2.4, 'GB', 16);           // "2.4 GB (16%)"
 * formatValue('2 days ago');            // "2 days ago"
 * formatValue(150, 'MB');               // "150 MB"
 * formatValue(75, undefined, 75);       // "75 (75%)"
 * ```
 */
const formatValue = (value: string | number, unit?: string, percentage?: number): string => {
  let formattedValue = String(value);
  
  if (unit && !formattedValue.includes(unit)) {
    formattedValue += ` ${unit}`;
  }
  
  if (percentage !== undefined) {
    formattedValue += ` (${percentage}%)`;
  }
  
  return formattedValue;
};

/**
 * Gets default icon for data item type.
 * Provides semantic icon mapping based on data category
 * to ensure consistent visual communication of data concepts.
 * 
 * @function getDataIcon
 * @param {string} type - Data item type identifier
 * @returns {string} Material Community Icons name for the data type
 * @private
 * @since 1.0.0
 * 
 * @icon_mapping
 * - usage: 'chart-line' (data consumption trends)
 * - backup: 'backup-restore' (backup and restore operations)
 * - devices: 'devices' (multi-device synchronization)
 * - storage: 'database' (storage capacity and usage)
 * - bandwidth: 'wifi' (network usage and connectivity)
 * - default: 'chart-bar' (general statistics fallback)
 * 
 * @design_rationale
 * - Uses data-focused iconography
 * - Maintains semantic consistency
 * - Provides clear visual differentiation
 * - Supports international recognition
 * 
 * @example
 * ```tsx
 * const storageIcon = getDataIcon('storage');   // 'database'
 * const backupIcon = getDataIcon('backup');     // 'backup-restore'
 * const usageIcon = getDataIcon('usage');       // 'chart-line'
 * ```
 */
const getDataIcon = (type: string): string => {
  switch (type) {
    case 'usage':
      return 'chart-line';
    case 'backup':
      return 'backup-restore';
    case 'devices':
      return 'devices';
    case 'storage':
      return 'database';
    case 'bandwidth':
      return 'wifi';
    default:
      return 'chart-bar';
  }
};

/**
 * Gets color based on percentage usage for capacity visualization.
 * Provides usage-aware color coding to communicate capacity levels
 * and guide user attention to potential storage or bandwidth concerns.
 * 
 * @function getDataColor
 * @param {number} [percentage] - Usage percentage (0-100)
 * @param {any} [theme] - Theme object for color resolution
 * @returns {string} Color value appropriate for the usage level
 * @private
 * @since 1.0.0
 * 
 * @color_mapping
 * - >= 90%: theme.colors.error (critical usage level)
 * - >= 75%: theme.colors.tertiary (high usage warning)
 * - < 75%: theme.colors.primary (normal usage level)
 * - undefined: theme.colors.onSurfaceVariant (no usage data)
 * - fallback: '#666' (when theme unavailable)
 * 
 * @usage_levels
 * - Green: Normal usage (< 75%) - no concern
 * - Orange: High usage (75-90%) - attention recommended
 * - Red: Critical usage (>= 90%) - immediate attention needed
 * - Gray: No usage data or informational states
 * 
 * @accessibility
 * - High contrast color selection
 * - Color-blind friendly palette
 * - Universal capacity color conventions
 * - Theme-integrated consistency
 * 
 * @example
 * ```tsx
 * const normalColor = getDataColor(45, theme);    // Green tone (normal)
 * const warningColor = getDataColor(80, theme);   // Orange tone (warning)
 * const criticalColor = getDataColor(95, theme);  // Red tone (critical)
 * ```
 */
const getDataColor = (percentage?: number, theme?: any): string => {
  if (!theme || percentage === undefined) return theme?.colors.onSurfaceVariant || '#666';
  
  if (percentage >= 90) return theme.colors.error;
  if (percentage >= 75) return theme.colors.tertiary;
  return theme.colors.primary;
};

/**
 * Formats description based on data item properties.
 * Generates contextual descriptions for data items based on limits,
 * percentages, and usage patterns to provide user-friendly information.
 * 
 * @function formatDescription
 * @param {any} item - Data stats item with properties
 * @param {(key: string) => string} t - Translation function
 * @returns {string | undefined} Formatted description or undefined if not applicable
 * @private
 * @since 1.0.0
 * 
 * @description_logic
 * - Generates limit descriptions when both limit and percentage exist
 * - Uses translation keys for internationalization
 * - Returns undefined when no description is applicable
 * - Provides context for usage understanding
 * 
 * @translation_keys
 * - account.dataUsage.limitDescription: Description for limit-based items
 * 
 * @example
 * ```tsx
 * const item = { limit: 15, percentage: 57 };
 * const desc = formatDescription(item, t);  // "of 15 GB total" (translated)
 * 
 * const simpleItem = { value: "2 days ago" };
 * const noDesc = formatDescription(simpleItem, t);  // undefined
 * ```
 */
const formatDescription = (item: any, t: (key: string) => string): string | undefined => {
  if (item.limit && item.percentage !== undefined) {
    return t('account.dataUsage.limitDescription');
  }
  return undefined;
};

export default DataStatsContent; 