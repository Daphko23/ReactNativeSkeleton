/**
 * @fileoverview ProfileInformation Component - Enterprise Profile Information Display
 * 
 * @description Professional profile information component providing organized
 * display of user profile data with accessibility support and clean presentation.
 * Features structured information layout with proper labeling and responsive design.
 * 
 * @module ProfileInformationComponent
 * @since 1.0.0
 * @author Enterprise Development Team
 * @layer Presentation
 * @accessibility Full WCAG 2.1 AA compliance with screen reader support
 * @performance Optimized with memoization and efficient rendering
 * @responsive Adaptive layout for mobile and tablet devices
 * @testing Comprehensive test coverage with accessibility testing
 */

import React from 'react';
import { View, Text } from 'react-native';

import { PROFILE_CONSTANTS } from '../../constants/profile.constants';
import { CustomCard } from '../../../../../shared/components/ui/custom-card.component';
import { createProfileInformationStyles } from './profile-information.component.styles';

export interface ProfileInformationProps {
  profile: any;
  currentUser: any;
  theme: any;
  t: (key: string, options?: any) => string;
  testIds: typeof PROFILE_CONSTANTS.TEST_IDS;
}

export const ProfileInformation: React.FC<ProfileInformationProps> = React.memo(({
  profile,
  currentUser,
  theme,
  t,
  testIds,
}) => {
  const styles = React.useMemo(() => createProfileInformationStyles(theme), [theme]);

  const informationItems = React.useMemo(() => {
    const items = [
      {
        label: t('profile.mainScreen.email'),
        value: currentUser?.email || t('profile.mainScreen.na'),
        key: 'email',
      },
      {
        label: t('profile.mainScreen.bio'),
        value: profile?.bio || t('profile.mainScreen.notSet'),
        key: 'bio',
      },
      {
        label: t('profile.mainScreen.location'),
        value: profile?.location || t('profile.mainScreen.notSet'),
        key: 'location',
      },
    ];
    
    return items;
  }, [profile, currentUser, t]);

  return (
    <CustomCard 
      theme={theme}
      testID={testIds.INFO_CARD}
      accessibilityRole="summary"
      accessibilityLabel={t('profile.mainScreen.informationAccessibilityLabel')}
    >
      <Text style={styles.sectionTitle}>
        {t('profile.mainScreen.profileInformation')}
      </Text>
      
      <View style={styles.infoContainer}>
        {informationItems.map((item) => {
          return (
            <View 
              key={item.key}
              style={styles.infoItem}
              testID={`${testIds.INFO_CARD}-${item.key}`}
              accessibilityLabel={t('profile.mainScreen.infoItemAccessibilityLabel', { 
                label: item.label, 
                value: item.value 
              })}
            >
              <Text style={styles.infoLabel}>{item.label}:</Text>
              <Text style={styles.infoValue}>{item.value}</Text>
            </View>
          );
        })}
      </View>
    </CustomCard>
  );
});

// Styles now imported from separate file

ProfileInformation.displayName = 'ProfileInformation'; 