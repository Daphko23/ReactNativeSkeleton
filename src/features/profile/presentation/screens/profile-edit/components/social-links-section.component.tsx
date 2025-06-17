/**
 * @fileoverview Social Links Section Component - Hook-Centric UI Component
 * 
 * ✅ HOOK-CENTRIC ARCHITECTURE
 * - Pure UI component - NO business logic
 * - Receives all data and actions from useSocialLinksEdit hook
 * - Renders social links form fields with validation
 */

import React from 'react';
import { View as _View } from 'react-native';
import { useTranslation } from 'react-i18next';

// Shared Components
import { FormSection, FormField } from '@shared/components';

// Core Imports
import { useTheme } from '@core/theme/theme.system';

// Types
import { UseSocialLinksEditReturn } from '../../../hooks/use-social-links-edit.hook';
import { SocialLink } from '../../../../domain/types/social-links.types';

// Styles
import { createSocialLinksSectionStyles } from './social-links-section.component.styles';

/**
 * Component Props Interface
 */
interface SocialLinksSectionProps {
  socialLinksEdit: UseSocialLinksEditReturn;
  testIds: any;
}

/**
 * 🎯 SOCIAL LINKS SECTION - Pure UI Component
 * 
 * ✅ HOOK-CENTRIC EXCELLENCE:
 * - Receives all business logic from useSocialLinksEdit hook
 * - Pure rendering component with NO state management
 * - NO business logic, NO service calls, NO side effects
 */
export const SocialLinksSection: React.FC<SocialLinksSectionProps> = ({
  socialLinksEdit,
  testIds,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const _styles = React.useMemo(() => createSocialLinksSectionStyles(theme), [theme]);

  // Helper function to get link URL by platform
  const getLinkUrl = (platform: string): string => {
    const link = socialLinksEdit.socialLinks.find((l: SocialLink) => l.platform === platform);
    return link?.url || '';
  };

  // Helper function to get field error by platform
  const getFieldError = (platform: string): string | undefined => {
    return socialLinksEdit.getValidationError(platform as any);
  };

  // Helper function to update link by platform
  const updateLinkByPlatform = (platform: string, url: string) => {
    socialLinksEdit.updateSocialLink(platform as any, url);
  };

  return (
    <FormSection title={t('profile.editScreen.sections.socialLinks')}>
      {/* LinkedIn */}
      <FormField
        label={t('profile.editScreen.fields.linkedIn')}
        value={getLinkUrl('linkedin')}
        onChangeText={(value) => updateLinkByPlatform('linkedin', value)}
        error={getFieldError('linkedin')}
        keyboardType="url"
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="https://linkedin.com/in/username"
        accessibilityLabel={t('profile.editScreen.accessibility.linkedIn')}
        testID={testIds.LINKEDIN_INPUT}
      />

      {/* Twitter */}
      <FormField
        label={t('profile.editScreen.fields.twitter')}
        value={getLinkUrl('twitter')}
        onChangeText={(value) => updateLinkByPlatform('twitter', value)}
        error={getFieldError('twitter')}
        keyboardType="url"
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="https://twitter.com/username"
        accessibilityLabel={t('profile.editScreen.accessibility.twitter')}
        testID={testIds.TWITTER_INPUT}
      />

      {/* GitHub */}
      <FormField
        label={t('profile.editScreen.fields.github')}
        value={getLinkUrl('github')}
        onChangeText={(value) => updateLinkByPlatform('github', value)}
        error={getFieldError('github')}
        keyboardType="url"
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="https://github.com/username"
        accessibilityLabel={t('profile.editScreen.accessibility.github')}
        testID={testIds.GITHUB_INPUT}
      />

      {/* Instagram */}
      <FormField
        label={t('profile.editScreen.fields.instagram')}
        value={getLinkUrl('instagram')}
        onChangeText={(value) => updateLinkByPlatform('instagram', value)}
        error={getFieldError('instagram')}
        keyboardType="url"
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="https://instagram.com/username"
        accessibilityLabel={t('profile.editScreen.accessibility.instagram')}
        testID={testIds.INSTAGRAM_INPUT}
      />

      {/* Personal Website */}
      <FormField
        label={t('profile.editScreen.fields.personalWebsite')}
        value={getLinkUrl('website')}
        onChangeText={(value) => updateLinkByPlatform('website', value)}
        error={getFieldError('website')}
        keyboardType="url"
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="https://yourwebsite.com"
        accessibilityLabel={t('profile.editScreen.accessibility.personalWebsite')}
        testID={testIds.PERSONAL_WEBSITE_INPUT}
      />
    </FormSection>
  );
}; 