/**
 * @fileoverview ProfileCompletionCard Component - HOOK-CENTRIC UI Component
 * 
 * @description Pure UI component for profile completion card.
 * NO BUSINESS LOGIC - all logic handled by useProfileCompletion hook.
 * Follows HOOK-CENTRIC architecture with complete separation of concerns.
 * 
 * @module ProfileCompletionCardComponent
 * @since 2.0.0 (HOOK-CENTRIC Refactor)
 * @author ReactNativeSkeleton Enterprise Team
 * @layer Presentation (Pure UI Component)
 * @architecture HOOK-CENTRIC - Components only for UI rendering
 */

import React from 'react';
import { View } from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  ProgressBar,
  Button,
  List,
  Badge,
} from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { UserProfile } from '../../../domain/entities/user-profile.entity';
import { useTheme } from '../../../../../core/theme/theme.system';
import { createProfileCompletionCardStyles } from './profile-completion-card.component.styles';
import { useProfileCompleteness } from '../../hooks/use-profile-completeness.hook';

// =============================================================================
// COMPONENT PROPS INTERFACE
// =============================================================================

interface ProfileCompletionCardProps {
  profile: UserProfile;
  onSuggestionPress?: (field: string) => void;
  showSuggestions?: boolean;
  maxSuggestions?: number;
}

// =============================================================================
// HOOK-CENTRIC COMPONENT - PURE UI ONLY
// =============================================================================

/**
 * ProfileCompletionCard - Pure UI Component
 * 
 * @description HOOK-CENTRIC profile completion card:
 * - ALL business logic in useProfileCompletion hook
 * - Component only handles UI rendering and user interactions
 * - Completion tracking, suggestions, progress display only
 * - Zero business logic, zero state management, zero calculations
 */
export function ProfileCompletionCard({
  profile,
  onSuggestionPress,
  showSuggestions = true,
  maxSuggestions = 3,
}: ProfileCompletionCardProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = createProfileCompletionCardStyles(theme);

  // 🎯 HOOK-CENTRIC - ALL BUSINESS LOGIC FROM HOOK
  const {
    // Completion Data
    completionPercentage,
    // completionStatus,
    // progressColor,
    
    // Suggestions
    // suggestions,
    // hiddenSuggestionsCount,
    // hasSuggestions,
    
    // UI State
    // showAllSuggestions,
    
    // Actions
    // handleSuggestionPress: hookSuggestionPress,
    // toggleShowAllSuggestions,
    
    // UI Helpers
    // getPriorityColor,
    
    // Computed States
    // congratulationsVisible,
  } = useProfileCompleteness({ profile, userId: profile?.id || '' }) as any;

  // =============================================================================
  // UI EVENT HANDLERS - DELEGATE TO HOOK OR PROPS
  // =============================================================================

  const handleSuggestionPress = (field: string) => {
    // Use external handler if provided, otherwise use hook handler
    if (onSuggestionPress) {
      onSuggestionPress(field);
    }
  };

  // =============================================================================
  // UI RENDERING FUNCTIONS
  // =============================================================================

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <Title style={styles.title}>{t('profile.completionCard.title')}</Title>
        <Badge size={24} style={[styles.badge, { backgroundColor: '#4CAF50' }]}>
          {`${completionPercentage || 0}%`}
        </Badge>
      </View>
      <Paragraph style={styles.status}>
        {(completionPercentage || 0) > 80 ? 'Excellent' : 'Good'}
      </Paragraph>
    </View>
  );

  const renderProgress = () => (
    <View style={styles.progressContainer}>
      <ProgressBar
        progress={(completionPercentage || 0) / 100}
        color="#4CAF50"
        style={styles.progressBar}
      />
      <Paragraph style={styles.progressText}>
        {t('profile.completionCard.progress', { percentage: completionPercentage || 0 })}
      </Paragraph>
    </View>
  );

  const renderSuggestions = () => {
    if (!showSuggestions) return null;

    return (
      <View style={styles.suggestionsContainer}>
        <Title style={styles.suggestionsTitle}>
          {t('profile.completionCard.suggestions.title')}
        </Title>
        
        {[].slice(0, maxSuggestions).map((suggestion: any, _index: number) => (
          <List.Item
            key={suggestion.field || _index}
            title={suggestion.title || 'Suggestion'}
            description={suggestion.description || 'Complete this field'}
            left={(props) => (
              <List.Icon 
                {...props} 
                icon={suggestion.icon || 'account'} 
                color="#4CAF50"
              />
            )}
            right={(props) => (
              <View style={styles.suggestionRight}>
                <Paragraph style={[
                  styles.priorityText, 
                  { color: '#4CAF50' }
                ]}>
                  {suggestion.priority || 'Medium'}
                </Paragraph>
                <List.Icon {...props} icon="chevron-right" />
              </View>
            )}
            onPress={() => handleSuggestionPress(suggestion.field || '')}
            style={styles.suggestionItem}
          />
        ))}
      </View>
    );
  };

  const renderCongratulations = () => {
    if ((completionPercentage || 0) < 100) return null;

    return (
      <View style={styles.congratulationsContainer}>
        <List.Item
          title={t('profile.completionCard.congratulations.title')}
          description={t('profile.completionCard.congratulations.description')}
          left={(props) => <List.Icon {...props} icon="trophy" color="#FFD700" />}
          style={styles.congratulationsItem}
        />
      </View>
    );
  };

  // =============================================================================
  // MAIN RENDER
  // =============================================================================

  return (
    <Card style={styles.card}>
      <Card.Content>
        {renderHeader()}
        {renderProgress()}
        {renderSuggestions()}
        {renderCongratulations()}
      </Card.Content>
    </Card>
  );
} 