/**
 * DataStatsContent Component - Enterprise Content Component
 * Reusable content component for data usage statistics
 */

import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { StatsCard } from '../specialized/stats-card.component';
import type { DataStatsContentProps, StatItem } from '../types/card.types';

/**
 * @component DataStatsContent
 * @description Content component for data usage statistics with export functionality
 * 
 * @param {DataStatsContentProps} props - Component props
 * @returns {React.ReactElement} Data stats content component
 * 
 * @example
 * ```tsx
 * <DataStatsContent
 *   items={[
 *     { id: 'storage', type: 'storage', label: 'Storage Used', value: '2.4 GB', unit: 'GB' },
 *     { id: 'backup', type: 'backup', label: 'Last Backup', value: '2 days ago' }
 *   ]}
 *   onExportData={() => console.log('Export')}
 *   t={(key) => key}
 * />
 * ```
 */
export const DataStatsContent: React.FC<DataStatsContentProps> = ({
  items,
  onExportData,
  isExporting = false,
  theme,
  t
}) => {
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
        <View style={{ marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: theme?.colors.outlineVariant }}>
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
 * Formats value with unit and percentage if available
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
 * Gets default icon for data item type
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
 * Gets color based on percentage usage
 */
const getDataColor = (percentage?: number, theme?: any): string => {
  if (!theme || percentage === undefined) return theme?.colors.onSurfaceVariant || '#666';
  
  if (percentage >= 90) return theme.colors.error;
  if (percentage >= 75) return theme.colors.tertiary;
  return theme.colors.primary;
};

/**
 * Formats description based on data item
 */
const formatDescription = (item: any, t: (key: string) => string): string | undefined => {
  if (item.limit && item.percentage !== undefined) {
    return t('account.dataUsage.limitDescription');
  }
  return undefined;
};

export default DataStatsContent; 