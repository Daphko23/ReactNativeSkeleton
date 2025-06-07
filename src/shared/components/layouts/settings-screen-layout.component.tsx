/**
 * SettingsScreenLayout Component - Enterprise Layout Component
 * Generic layout for all settings screens with consistent structure
 */

import React from 'react';
import { ScrollView, View, RefreshControlProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator, Text, Button, Card } from 'react-native-paper';

import { LoadingOverlay } from '../ui/loading-overlay.component';

export interface SettingsSection {
  id: string;
  component: React.ReactElement;
}

export interface SettingsActionButton {
  id: string;
  label: string;
  mode?: 'contained' | 'outlined';
  disabled?: boolean;
  loading?: boolean;
  onPress: () => void;
  testID?: string;
}

export interface SettingsScreenLayoutProps {
  // Content
  sections: SettingsSection[];
  
  // Loading states
  isLoading?: boolean;
  isUpdating?: boolean;
  loadingMessage?: string;
  
  // Error handling
  error?: string | null;
  
  // Action buttons
  actionButtons?: SettingsActionButton[];
  showActionButtons?: boolean;
  
  // Refresh control
  refreshControl?: React.ReactElement<RefreshControlProps>;
  
  // UI theme
  theme?: any;
  t?: (key: string, options?: any) => string;
  
  // Test IDs
  testID?: string;
  scrollViewTestID?: string;
  
  // Styling
  style?: any;
}

/**
 * @component SettingsScreenLayout
 * @description Generic layout component for all settings screens
 */
export const SettingsScreenLayout: React.FC<SettingsScreenLayoutProps> = ({
  sections,
  isLoading = false,
  isUpdating = false,
  loadingMessage,
  error,
  actionButtons = [],
  showActionButtons = false,
  refreshControl,
  theme,
  t = (key: string) => key,
  testID,
  scrollViewTestID,
  style
}) => {
  const styles = React.useMemo(() => ({
    container: {
      flex: 1,
      backgroundColor: theme?.colors?.background || '#f5f5f5',
    },
    loadingContainer: {
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    },
    loadingText: {
      marginTop: 16,
      fontSize: 16,
      color: theme?.colors?.onSurface || '#000',
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: 16,
      paddingBottom: showActionButtons ? 100 : 16,
    },
    errorCard: {
      backgroundColor: theme?.colors?.errorContainer || '#ffebee',
      borderColor: theme?.colors?.error || '#f44336',
      borderWidth: 1,
      marginBottom: 16,
    },
    errorTitle: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: theme?.colors?.error || '#f44336',
      marginBottom: 8,
    },
    errorDescription: {
      fontSize: 14,
      color: theme?.colors?.onErrorContainer || '#d32f2f',
      lineHeight: 20,
    },
    actionButtons: {
      position: 'absolute' as const,
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      padding: 16,
      backgroundColor: theme?.colors?.surface || '#ffffff',
      borderTopWidth: 1,
      borderTopColor: theme?.colors?.outline || '#e0e0e0',
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    actionButton: {
      flex: 1,
      marginHorizontal: 8,
    },
  }), [theme, showActionButtons]);

  // Loading State
  if (isLoading) {
    return (
      <SafeAreaView 
        style={[styles.container, styles.loadingContainer]}
        edges={['bottom', 'left', 'right']}
        testID={`${testID}-loading`}
      >
        <ActivityIndicator size="large" color={theme?.colors?.primary} />
        <Text style={styles.loadingText}>
          {loadingMessage || t('common.loading', { defaultValue: 'Lädt...' })}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView 
      style={[styles.container, style]}
      edges={['bottom', 'left', 'right']}
      testID={testID}
    >
      <LoadingOverlay 
        visible={isUpdating}
        message={loadingMessage || t('common.loading', { defaultValue: 'Lädt...' })}
      />

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        testID={scrollViewTestID}
        showsVerticalScrollIndicator={false}
        refreshControl={refreshControl}
      >
        {/* Error Display */}
        {error && (
          <Card style={styles.errorCard}>
            <Card.Content>
              <Text style={styles.errorTitle}>
                {t('errors.title', { defaultValue: 'Fehler' })}
              </Text>
              <Text style={styles.errorDescription}>{error}</Text>
            </Card.Content>
          </Card>
        )}

        {/* Render all sections */}
        {sections.map((section) => (
          <React.Fragment key={section.id}>
            {section.component}
          </React.Fragment>
        ))}
      </ScrollView>

      {/* Action Buttons */}
      {showActionButtons && actionButtons.length > 0 && (
        <View style={styles.actionButtons}>
          {actionButtons.map((button) => (
            <Button
              key={button.id}
              mode={button.mode || 'contained'}
              onPress={button.onPress}
              disabled={button.disabled}
              loading={button.loading}
              style={styles.actionButton}
              contentStyle={{ height: 48 }}
              testID={button.testID}
            >
              {button.label}
            </Button>
          ))}
        </View>
      )}
    </SafeAreaView>
  );
};

SettingsScreenLayout.displayName = 'SettingsScreenLayout'; 