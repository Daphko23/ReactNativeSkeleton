/**
 * @fileoverview Professional Info Section Component - Enterprise React Native 2025
 * 
 * 🚀 HOOK-CENTRIC COMPONENT
 * ✅ Pure UI Rendering - NO Business Logic
 * ✅ Professional Information Form Fields
 * ✅ Enterprise Accessibility & Testing Standards
 */

import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@core/theme/theme.system';

// Shared Components
import { FormSection, FormField } from '@shared/components';

// Types
import { UseProfileFormReturn } from '../../../hooks/use-profile-form.hook';

interface ProfessionalInfoSectionProps {
  profileForm: UseProfileFormReturn;
  testIds: any;
}

export const ProfessionalInfoSection: React.FC<ProfessionalInfoSectionProps> = ({
  profileForm,
  testIds,
}) => {
  const { t } = useTranslation();
  const { theme: _theme } = useTheme();

  // Work location options
  const workLocationOptions = useMemo(() => [
    { value: 'remote', label: t('profile.editScreen.workLocation.remote') },
    { value: 'onsite', label: t('profile.editScreen.workLocation.onsite') },
    { value: 'hybrid', label: t('profile.editScreen.workLocation.hybrid') },
  ], [t]);

  return (
    <FormSection title={t('profile.editScreen.sections.professionalInfo')}>
      {/* Company */}
      <FormField
        label={t('profile.editScreen.fields.company')}
        value={profileForm.formData.company || ''}
        onChangeText={(value) => profileForm.setValue('company', value)}
        error={profileForm.fieldErrors.company}
        accessibilityLabel={t('profile.editScreen.accessibility.company')}
        testID={testIds.COMPANY_INPUT}
      />

      {/* Job Title */}
      <FormField
        label={t('profile.editScreen.fields.jobTitle')}
        value={profileForm.formData.jobTitle || ''}
        onChangeText={(value) => profileForm.setValue('jobTitle', value)}
        error={profileForm.fieldErrors.jobTitle}
        accessibilityLabel={t('profile.editScreen.accessibility.jobTitle')}
        testID={testIds.JOB_TITLE_INPUT}
      />

      {/* Industry */}
      <FormField
        label={t('profile.editScreen.fields.industry')}
        value={profileForm.formData.industry || ''}
        onChangeText={(value) => profileForm.setValue('industry', value)}
        error={profileForm.fieldErrors.industry}
        accessibilityLabel={t('profile.editScreen.accessibility.industry')}
        testID={testIds.INDUSTRY_INPUT}
      />

      {/* Work Location */}
      <View>
        <Text style={{ marginBottom: 8, fontSize: 16, fontWeight: 'bold' }}>
          {t('profile.editScreen.fields.workLocation')}
        </Text>
        <SegmentedButtons
          value={profileForm.formData.workLocation || 'remote'}
          onValueChange={(value) => profileForm.setValue('workLocation', value)}
          buttons={workLocationOptions}
        />
      </View>
    </FormSection>
  );
}; 