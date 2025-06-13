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
import { useProfileCompletion } from '../../hooks/use-profile-completion.hook';

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
    completenessPercentage,
    completionStatus,
    progressColor,
    
    // Suggestions
    visibleSuggestions,
    hiddenSuggestionsCount,
    hasSuggestions,
    
    // UI State
    showAllSuggestions,
    
    // Actions
    handleSuggestionPress: hookSuggestionPress,
    toggleShowAllSuggestions,
    
    // UI Helpers
    getPriorityColor,
    
    // Computed States
    congratulationsVisible,
  } = useProfileCompletion({
    profile,
    showSuggestions,
    maxSuggestions,
  });

  // =============================================================================
  // UI EVENT HANDLERS - DELEGATE TO HOOK OR PROPS
  // =============================================================================

  const handleSuggestionPress = (field: string) => {
    // Use external handler if provided, otherwise use hook handler
    if (onSuggestionPress) {
      onSuggestionPress(field);
    } else {
      hookSuggestionPress(field);
    }
  };

  // =============================================================================
  // UI RENDERING FUNCTIONS
  // =============================================================================

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <Title style={styles.title}>{t('profile.completionCard.title')}</Title>
        <Badge size={24} style={[styles.badge, { backgroundColor: progressColor }]}>
          {`${completenessPercentage}%`}
        </Badge>
      </View>
      <Paragraph style={styles.status}>
        {completionStatus}
      </Paragraph>
    </View>
  );

  const renderProgress = () => (
    <View style={styles.progressContainer}>
      <ProgressBar
        progress={completenessPercentage / 100}
        color={progressColor}
        style={styles.progressBar}
      />
      <Paragraph style={styles.progressText}>
        {t('profile.completionCard.progress', { percentage: completenessPercentage })}
      </Paragraph>
    </View>
  );

  const renderSuggestions = () => {
    if (!hasSuggestions) return null;

    return (
      <View style={styles.suggestionsContainer}>
        <Title style={styles.suggestionsTitle}>
          {t('profile.completionCard.suggestions.title')}
        </Title>
        
        {visibleSuggestions.map((suggestion, _index) => (
          <List.Item
            key={suggestion.field}
            title={t(suggestion.titleKey)}
            description={t(suggestion.descriptionKey)}
            left={(props) => (
              <List.Icon 
                {...props} 
                icon={suggestion.icon} 
                color={getPriorityColor(suggestion.priority)}
              />
            )}
            right={(props) => (
              <View style={styles.suggestionRight}>
                <Paragraph style={[
                  styles.priorityText, 
                  { color: getPriorityColor(suggestion.priority) }
                ]}>
                  {t(`profile.completionCard.priority.${suggestion.priority}`)}
                </Paragraph>
                <List.Icon {...props} icon="chevron-right" />
              </View>
            )}
            onPress={() => handleSuggestionPress(suggestion.field)}
            style={styles.suggestionItem}
          />
        ))}
        
        {hiddenSuggestionsCount > 0 && (
          <Button
            mode="text"
            onPress={toggleShowAllSuggestions}
            style={styles.viewAllButton}
          >
            {showAllSuggestions 
              ? t('profile.completionCard.showLess')
              : t('profile.completionCard.viewAll', { count: hiddenSuggestionsCount })
            }
          </Button>
        )}
      </View>
    );
  };

  const renderCongratulations = () => {
    if (!congratulationsVisible) return null;

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