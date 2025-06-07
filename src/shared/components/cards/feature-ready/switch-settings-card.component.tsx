/**
 * SwitchSettingsCard Component - Enterprise Feature-Ready Component
 * Specialized card for managing switch-based settings
 */

import React from 'react';
import { View } from 'react-native';
import { 
  Card, 
  Switch, 
  Divider, 
  Text 
} from 'react-native-paper';

import type { BaseCardProps } from '../types/card.types';

export interface SwitchSetting {
  id: string;
  title: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
  testID?: string;
}

export interface SwitchSettingsCardProps extends BaseCardProps {
  title: string;
  description?: string;
  settings: SwitchSetting[];
  t?: (key: string, options?: any) => string;
}

/**
 * @component SwitchSettingsCard
 * @description Specialized card for switch-based settings management
 */
export const SwitchSettingsCard: React.FC<SwitchSettingsCardProps> = ({
  title,
  description,
  settings,
  theme,
  t: _t = (key: string) => key,
  style,
  testID,
  ...cardProps
}) => {
  const styles = React.useMemo(() => ({
    sectionContent: {
      paddingVertical: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: theme?.colors?.onSurface || '#000',
      marginBottom: 8,
    },
    sectionDescription: {
      fontSize: 14,
      color: theme?.colors?.onSurfaceVariant || '#666',
      marginBottom: 16,
      lineHeight: 20,
    },
    switchContainer: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
      paddingVertical: 12,
    },
    switchLabel: {
      flex: 1,
      marginRight: 16,
    },
    switchTitle: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: theme?.colors?.onSurface || '#000',
      marginBottom: 4,
    },
    switchDescription: {
      fontSize: 14,
      color: theme?.colors?.onSurfaceVariant || '#666',
      lineHeight: 18,
    },
  }), [theme]);

  return (
    <Card 
      style={[
        {
          backgroundColor: theme?.colors?.surface || '#ffffff',
          marginBottom: 16,
          borderRadius: 12,
          elevation: 2,
        },
        style
      ]}
      testID={testID}
      {...cardProps}
    >
      <Card.Content style={styles.sectionContent}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {description && (
          <Text style={styles.sectionDescription}>{description}</Text>
        )}

        {settings.map((setting, index) => (
          <React.Fragment key={setting.id}>
            <View style={styles.switchContainer}>
              <View style={styles.switchLabel}>
                <Text style={styles.switchTitle}>{setting.title}</Text>
                <Text style={styles.switchDescription}>{setting.description}</Text>
              </View>
              <Switch
                value={setting.value}
                onValueChange={setting.onChange}
                testID={setting.testID}
              />
            </View>
            
            {index < settings.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </Card.Content>
    </Card>
  );
};

SwitchSettingsCard.displayName = 'SwitchSettingsCard'; 