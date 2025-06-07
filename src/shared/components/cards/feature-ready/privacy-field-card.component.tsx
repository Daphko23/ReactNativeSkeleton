/**
 * PrivacyFieldCard Component - Enterprise Feature-Ready Component
 * Specialized card for managing field-specific privacy settings
 */

import React from 'react';
import { View } from 'react-native';
import { 
  Card, 
  List, 
  RadioButton, 
  Divider, 
  Text 
} from 'react-native-paper';

import type { BaseCardProps } from '../types/card.types';

export interface PrivacyField {
  id: string;
  label: string;
  icon: string;
  value: string;
  onChange: (value: string) => void;
}

export interface PrivacyFieldCardProps extends BaseCardProps {
  title: string;
  description?: string;
  fields: PrivacyField[];
  visibilityOptions: Array<{ value: string; label: string }>;
  t?: (key: string, options?: any) => string;
}

/**
 * @component PrivacyFieldCard
 * @description Specialized card for field-specific privacy settings management
 */
export const PrivacyFieldCard: React.FC<PrivacyFieldCardProps> = ({
  title,
  description,
  fields,
  visibilityOptions,
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
    accordion: {
      backgroundColor: 'transparent',
      marginVertical: 4,
    },
    accordionTitle: {
      fontSize: 16,
      color: theme?.colors?.onSurface || '#000',
    },
    accordionContent: {
      paddingHorizontal: 16,
      paddingVertical: 8,
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

        {fields.map((field, index) => (
          <React.Fragment key={field.id}>
            <List.Accordion
              title={field.label}
              left={(props) => <List.Icon {...props} icon={field.icon} />}
              style={styles.accordion}
              titleStyle={styles.accordionTitle}
            >
              <View style={styles.accordionContent}>
                <RadioButton.Group
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  {visibilityOptions.map((option) => (
                    <RadioButton.Item
                      key={option.value}
                      label={option.label}
                      value={option.value}
                      position="leading"
                    />
                  ))}
                </RadioButton.Group>
              </View>
            </List.Accordion>
            
            {index < fields.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </Card.Content>
    </Card>
  );
};

PrivacyFieldCard.displayName = 'PrivacyFieldCard'; 