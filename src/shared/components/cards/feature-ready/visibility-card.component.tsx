/**
 * VisibilityCard Component - Enterprise Feature-Ready Component
 * Specialized card for managing visibility settings with radio buttons
 */

import React from 'react';
import { View } from 'react-native';
import { 
  Card, 
  RadioButton, 
  Text 
} from 'react-native-paper';

import type { BaseCardProps } from '../types/card.types';

export interface VisibilityOption {
  value: string;
  label: string;
}

export interface VisibilityCardProps extends BaseCardProps {
  title: string;
  description?: string;
  value: string;
  options: VisibilityOption[];
  onChange: (value: string) => void;
  t?: (key: string, options?: any) => string;
}

/**
 * @component VisibilityCard
 * @description Specialized card for visibility settings management
 */
export const VisibilityCard: React.FC<VisibilityCardProps> = ({
  title,
  description,
  value,
  options,
  onChange,
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
    radioGroup: {
      marginTop: 8,
    },
    radioOption: {
      marginBottom: 4,
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
        
        <RadioButton.Group
          value={value}
          onValueChange={onChange}
        >
          <View style={styles.radioGroup}>
            {options.map((option) => (
              <View key={option.value} style={styles.radioOption}>
                <RadioButton.Item
                  label={option.label}
                  value={option.value}
                  position="leading"
                />
              </View>
            ))}
          </View>
        </RadioButton.Group>
      </Card.Content>
    </Card>
  );
};

VisibilityCard.displayName = 'VisibilityCard'; 