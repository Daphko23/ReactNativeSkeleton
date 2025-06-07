/**
 * CustomDialog Component - Enterprise Shared Component
 * Fully custom dialog component without React Native Paper dependencies
 */

import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';

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

export interface CustomDialogProps {
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
 * @component CustomDialog
 * @description Fully custom dialog component with complete style control
 */
export const CustomDialog: React.FC<CustomDialogProps> = ({
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
          titleColor: theme?.colors?.text || '#000',
        };
    }
  };

  const colors = getTypeColors();

  const styles = React.useMemo(() => StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme?.spacing?.[4] || 16,
    },
    dialog: {
      backgroundColor: theme?.colors?.surface || '#FFFFFF',
      borderRadius: theme?.borderRadius?.md || 8, // Weniger rund!
      minWidth: 280,
      maxWidth: 360,
      width: '100%',
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    iconContainer: {
      alignItems: 'center',
      paddingTop: theme?.spacing?.[6] || 24,
      paddingBottom: theme?.spacing?.[2] || 8,
    },
    titleContainer: {
      paddingHorizontal: theme?.spacing?.[6] || 24,
      paddingBottom: theme?.spacing?.[2] || 8,
    },
    title: {
      fontSize: theme?.typography?.fontSizes?.lg || 18,
      fontWeight: theme?.typography?.fontWeights?.semibold || '600',
      color: colors.titleColor,
      textAlign: 'center',
      lineHeight: 24,
    },
    contentContainer: {
      paddingHorizontal: theme?.spacing?.[6] || 24,
      paddingBottom: theme?.spacing?.[6] || 24,
    },
    content: {
      fontSize: theme?.typography?.fontSizes?.base || 16,
      lineHeight: theme?.typography?.lineHeights?.relaxed * theme?.typography?.fontSizes?.base || 24,
      color: theme?.colors?.text || '#000',
      textAlign: 'center',
    },
    actionsContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      paddingHorizontal: theme?.spacing?.[4] || 16,
      paddingBottom: theme?.spacing?.[4] || 16,
      paddingTop: theme?.spacing?.[2] || 8,
    },
    actionButton: {
      borderRadius: theme?.borderRadius?.md || 8,
      paddingHorizontal: theme?.spacing?.[4] || 16,
      paddingVertical: theme?.spacing?.[3] || 12,
      marginLeft: theme?.spacing?.[3] || 12,
      minWidth: 80,
      height: theme?.components?.button?.height?.md || 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    actionButtonText: {
      fontSize: theme?.typography?.fontSizes?.base || 16,
      fontWeight: theme?.typography?.fontWeights?.medium || '500',
    },
    textButton: {
      backgroundColor: 'transparent',
    },
    outlinedButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme?.colors?.primary || '#6200ea',
    },
    containedButton: {
      backgroundColor: theme?.colors?.primary || '#6200ea',
    },
    textButtonText: {
      color: theme?.colors?.primary || '#6200ea',
    },
    outlinedButtonText: {
      color: theme?.colors?.primary || '#6200ea',
    },
    containedButtonText: {
      color: '#FFFFFF',
    },
    disabledButton: {
      backgroundColor: theme?.colors?.interactiveDisabled || '#CCCCCC',
    },
    disabledButtonText: {
      color: theme?.colors?.textTertiary || '#999999',
    },
  }), [colors, theme]);

  const renderAction = (action: DialogAction, index: number) => {
    const isContained = action.mode === 'contained' || (action.mode === undefined && index === actions.length - 1);
    const isOutlined = action.mode === 'outlined';
    const _isText = action.mode === 'text' || (action.mode === undefined && index !== actions.length - 1);

    const buttonStyle: any[] = [styles.actionButton];
    const textStyle: any[] = [styles.actionButtonText];

    // Apply mode styles
    if (isContained) {
      buttonStyle.push(styles.containedButton);
      textStyle.push(styles.containedButtonText);
      // Override background color if custom color provided
      if (action.color) {
        buttonStyle.push({ backgroundColor: action.color });
        // For contained buttons with custom colors, force white text
        textStyle.push({ color: '#FFFFFF' });
      }
    } else if (isOutlined) {
      buttonStyle.push(styles.outlinedButton);
      textStyle.push(styles.outlinedButtonText);
      if (action.color) {
        buttonStyle.push({ borderColor: action.color });
        textStyle.push({ color: action.color });
      }
    } else {
      buttonStyle.push(styles.textButton);
      textStyle.push(styles.textButtonText);
      if (action.color) {
        textStyle.push({ color: action.color });
      }
    }

    // Apply disabled styles
    if (action.disabled) {
      buttonStyle.push(styles.disabledButton);
      textStyle.push(styles.disabledButtonText);
    }

    // Remove margin from first button
    if (index === 0) {
      buttonStyle.push({ marginLeft: 0 });
    }

    return (
      <TouchableOpacity
        key={action.id}
        style={buttonStyle}
        onPress={action.onPress}
        disabled={action.disabled || action.loading}
        testID={action.testID}
      >
        <Text style={textStyle}>
          {action.loading ? '...' : action.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
      testID={testID}
    >
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <IconButton
              icon={getTypeIcon()}
              size={28}
              iconColor={colors.iconColor}
            />
          </View>

          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
          </View>

          {/* Content */}
          <View style={styles.contentContainer}>
            <Text style={styles.content}>{content}</Text>
          </View>

          {/* Actions */}
          <View style={styles.actionsContainer}>
            {actions.map((action, index) => renderAction(action, index))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

CustomDialog.displayName = 'CustomDialog'; 