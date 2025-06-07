/**
 * ProfileAvatarDemoScreen - Enterprise Presentation Layer
 * Demo screen for avatar upload functionality with Shared Components
 * Following enterprise patterns with accessibility, performance optimization, and proper error handling
 */

import React from 'react';
import {
  View,
  ScrollView,
  Alert,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

// Shared Components - Enterprise Architecture
import {
  InfoCard,
  LoadingOverlay,
} from '../../../../../shared/components';
import { PrimaryButton } from '../../../../../shared/components/buttons/primary-button.component';

// Theme System
import { useTheme } from '../../../../../core/theme/theme.system';

// Business Logic
import { AvatarUploader } from '../../components/avatar-uploader';
import { useAvatar } from '../../hooks/use-avatar.hook';
import { useAvatarUpload } from '../../hooks/use-avatar-upload.hook';
import { useAuth } from '@features/auth/presentation/hooks';

// Styles
import { createProfileAvatarDemoScreenStyles } from './profile-avatar-demo.screen.styles';

interface ProfileAvatarDemoScreenProps {
  navigation?: any;
}

export const ProfileAvatarDemoScreen: React.FC<ProfileAvatarDemoScreenProps> = ({
  navigation,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { user } = useAuth();

  // Fallback für Demo-Zwecke falls kein User eingeloggt ist
  const effectiveUser = user || {
    id: 'demo-user-123',
    displayName: 'Max Mustermann',
    email: 'max.mustermann@example.com',
  };

  // Avatar URL vom useAvatar Hook
  const { avatarUrl, refreshAvatar } = useAvatar();

  // Upload-Funktionen vom useAvatarUpload Hook
  const {
    isUploading,
    uploadProgress,
    removeAvatar,
  } = useAvatarUpload();

  const styles = createProfileAvatarDemoScreenStyles(theme);

  const handleRefreshAvatar = async () => {
    try {
      await refreshAvatar();
      Alert.alert('Avatar aktualisiert', 'Avatar wurde neu geladen.');
    } catch {
      Alert.alert('Fehler', 'Avatar konnte nicht aktualisiert werden.');
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      const success = await removeAvatar();
      if (success) {
        Alert.alert('Avatar gelöscht', 'Avatar wurde erfolgreich gelöscht.');
      } else {
        Alert.alert('Fehler', 'Avatar konnte nicht gelöscht werden.');
      }
    } catch {
      Alert.alert('Fehler', 'Avatar konnte nicht gelöscht werden.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <LoadingOverlay
        visible={isUploading}
        message={`${t('profile.avatarDemoScreen.uploading')} ${Math.round(uploadProgress)}%`}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t('profile.avatarDemoScreen.title')}</Text>
          <Text style={styles.subtitle}>
            Enterprise Avatar Management mit Clean Architecture
          </Text>
        </View>

        {/* User Info Card */}
        <InfoCard
          title={t('profile.avatarDemoScreen.userInfo')}
          description={`${effectiveUser.displayName}\n${effectiveUser.email}\nID: ${effectiveUser.id}`}
          theme={theme as any}
        />

        {/* Avatar Management Card */}
        <InfoCard
          title={t('profile.avatarDemoScreen.avatarManagement')}
          description={avatarUrl && !isUploading ? `✅ Avatar geladen: ${avatarUrl}` : 'Avatar wird geladen...'}
          theme={theme as any}
        >
          <View style={styles.avatarContainer}>
            <AvatarUploader
              userId={effectiveUser.id}
              userName={effectiveUser.displayName}
              size={150}
              editable={true}
              showUploadProgress={true}
              style={styles.avatar}
            />
          </View>
        </InfoCard>

        {/* Action Buttons Card */}
        <InfoCard
          title={t('profile.avatarDemoScreen.actions')}
          description="Avatar-Verwaltungsaktionen"
          theme={theme as any}
        >
          <View style={styles.actionsContainer}>
            <PrimaryButton
              label={t('profile.avatarDemoScreen.refreshAvatar')}
              onPress={handleRefreshAvatar}
              disabled={isUploading}
            />

            <PrimaryButton
              label={t('profile.avatarDemoScreen.deleteAvatar')}
              onPress={handleDeleteAvatar}
              disabled={isUploading}
            />

            {navigation && (
              <PrimaryButton
                label={t('profile.avatarDemoScreen.goBack')}
                onPress={() => navigation.goBack()}
                disabled={isUploading}
              />
            )}
          </View>
        </InfoCard>

        {/* Feature Information Card */}
        <InfoCard
          title={t('profile.avatarDemoScreen.featureInfo')}
          description="Enterprise Avatar Management mit Clean Architecture"
          theme={theme as any}
        />

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileAvatarDemoScreen; 