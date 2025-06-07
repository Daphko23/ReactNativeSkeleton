/**
 * GenericDialog Component - Enterprise Shared Component
 * Fully reusable dialog component for various dialog types
 */

import React from 'react';
import { Dialog, Portal, Text, Button } from 'react-native-paper';

export type DialogType = 'confirmation' | 'warning' | 'error' | 'info' | 'delete' | 'custom';

export interface DialogAction {
  id: string;
  label: string;
  mode?: 'text' | 'outlined' | 'contained';
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  color?: string;
  testID?: string;
}

export interface GenericDialogProps {
  // Visibility
  visible: boolean;
  onDismiss: () => void;
  
  // Dialog type and content
  type: DialogType;
  title: string;
  content: string;
  
  // Custom icon (overrides type-based icon)
  customIcon?: string;
  
  // Actions
  actions: DialogAction[];
  
  // Theming
  theme?: any;
  t?: (key: string, options?: any) => string;
  
  // Test ID
  testID?: string;
}

/**
 * @component GenericDialog
 * @description Fully reusable dialog component for various use cases
 */
export const GenericDialog: React.FC<GenericDialogProps> = ({
  visible,
  onDismiss,
  type,
  title,
  content,
  customIcon,
  actions,
  theme,
  t: _t = (key: string) => key,
  testID
}) => {
  // Get icon based on dialog type
  const getTypeIcon = () => {
    if (customIcon) return customIcon;
    
    switch (type) {
      case 'confirmation':
        return 'help-circle';
      case 'warning':
        return 'alert';
      case 'error':
        return 'alert-circle';
      case 'info':
        return 'information';
      case 'delete':
        return 'alert-octagon';
      case 'custom':
      default:
        return 'help-circle';
    }
  };

  // Get dialog colors based on type
  const getTypeColors = () => {
    switch (type) {
      case 'warning':
        return {
          iconColor: theme?.colors?.warning || '#ff9800',
          titleColor: theme?.colors?.warning || '#ff9800',
        };
      case 'error':
      case 'delete':
        return {
          iconColor: theme?.colors?.error || '#f44336',
          titleColor: theme?.colors?.error || '#f44336',
        };
      case 'info':
        return {
          iconColor: theme?.colors?.info || theme?.colors?.primary || '#2196f3',
          titleColor: theme?.colors?.info || theme?.colors?.primary || '#2196f3',
        };
      case 'confirmation':
      case 'custom':
      default:
        return {
          iconColor: theme?.colors?.primary || '#6200ea',
          titleColor: theme?.colors?.text || theme?.colors?.onSurface || '#000',
        };
    }
  };

  const colors = getTypeColors();

  const styles = React.useMemo(() => ({
    dialog: {
      borderRadius: theme?.borderRadius?.md || 8, // Weniger rund
    },
    title: {
      color: colors.titleColor,
      fontSize: theme?.typography?.fontSizes?.lg || 18,
      fontWeight: theme?.typography?.fontWeights?.semibold || '600',
    },
    content: {
      fontSize: theme?.typography?.fontSizes?.base || 16,
      lineHeight: theme?.typography?.lineHeights?.relaxed * theme?.typography?.fontSizes?.base || 24,
      color: theme?.colors?.text || '#000',
      marginTop: theme?.spacing?.[2] || 8,
    },
    actions: {
      flexDirection: 'row' as const,
      paddingHorizontal: theme?.spacing?.[4] || 16,
      paddingBottom: theme?.spacing?.[4] || 16,
      paddingTop: theme?.spacing?.[6] || 24,
      justifyContent: 'flex-end' as const,
    },
    actionButton: {
      borderRadius: theme?.borderRadius?.md || 8,
      height: theme?.components?.button?.height?.md || 40,
      marginLeft: theme?.spacing?.[3] || 12,
    },
  }), [colors, theme]);

  return (
    <Portal>
      <Dialog 
        visible={visible} 
        onDismiss={onDismiss}
        style={[
          styles.dialog,
          {
            borderRadius: theme?.borderRadius?.md || 8,
            overflow: 'hidden'
          }
        ]}
        testID={testID}
      >
        <Dialog.Icon 
          icon={getTypeIcon()} 
          color={colors.iconColor}
          size={28}
        />
        
        <Dialog.Title style={styles.title}>
          {title}
        </Dialog.Title>
        
        <Dialog.Content>
          <Text style={styles.content}>
            {content}
          </Text>
        </Dialog.Content>
        
        <Dialog.Actions style={styles.actions}>
          {actions.map((action, index) => {
            const isContained = action.mode === 'contained' || (action.mode === undefined && index === actions.length - 1);
            const buttonBgColor = isContained ? (action.color || theme?.colors?.primary || '#6200ea') : undefined;
            const textColor = isContained ? '#FFFFFF' : (action.color || theme?.colors?.primary || '#6200ea');
            
            return (
              <Button
                key={action.id}
                mode={action.mode || (index === actions.length - 1 ? 'contained' : 'text')}
                onPress={action.onPress}
                disabled={action.disabled}
                loading={action.loading}
                buttonColor={buttonBgColor}
                textColor={textColor}
                style={[
                  styles.actionButton,
                  index === 0 ? { marginLeft: 0 } : {}
                ]}
                contentStyle={{ 
                  height: styles.actionButton.height,
                  paddingHorizontal: 16
                }}
                labelStyle={{ 
                  fontSize: theme?.typography?.fontSizes?.base || 16,
                  fontWeight: theme?.typography?.fontWeights?.medium || '500',
                  color: textColor
                }}
                testID={action.testID}
              >
                {action.label}
              </Button>
            );
          })}
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

GenericDialog.displayName = 'GenericDialog'; 