/**
 * SkillsInput - Specialized Skills Management Component
 * Provides an intuitive interface for adding and removing skills
 */

import React, { memo, useState, useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Chip, Paragraph } from 'react-native-paper';
import { useTheme } from '../../../core/theme/theme.system';

interface SkillsInputProps {
  label: string;
  placeholder?: string;
  skills: string[];
  onAddSkill: (skill: string) => void;
  onRemoveSkill: (index: number) => void;
  maxSkills?: number;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  style?: any;
  testID?: string;
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    marginBottom: theme.spacing[4],
  },
  skillsInput: {
    marginBottom: theme.spacing[3],
    backgroundColor: theme.colors.surface,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[2],
    marginTop: theme.spacing[2],
  },
  skillChip: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    marginBottom: theme.spacing[1],
    elevation: 1,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  fieldLabel: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    marginBottom: theme.spacing[2],
    color: theme.colors.text,
  },
  helperText: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing[1],
  },
  errorText: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.error,
    marginTop: theme.spacing[1],
  },
  maxSkillsText: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textTertiary,
    textAlign: 'right',
    marginTop: theme.spacing[1],
  },
});

export const SkillsInput = memo<SkillsInputProps>(({
  label,
  placeholder = "Skill hinzufügen",
  skills = [],
  onAddSkill,
  onRemoveSkill,
  maxSkills = 20,
  disabled = false,
  error,
  helperText,
  style,
  testID
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = useCallback(() => {
    const trimmedSkill = newSkill.trim();
    
    if (!trimmedSkill) return;
    
    // Check for duplicates
    if (skills.some(skill => skill.toLowerCase() === trimmedSkill.toLowerCase())) {
      return; // Could show toast here
    }
    
    // Check max skills limit
    if (skills.length >= maxSkills) {
      return; // Could show alert here
    }
    
    onAddSkill(trimmedSkill);
    setNewSkill('');
  }, [newSkill, skills, maxSkills, onAddSkill]);

  const handleKeySubmit = useCallback(() => {
    handleAddSkill();
  }, [handleAddSkill]);

  const handleRemoveSkill = useCallback((index: number) => {
    onRemoveSkill(index);
  }, [onRemoveSkill]);

  const canAddMore = useMemo(() => {
    return skills.length < maxSkills;
  }, [skills.length, maxSkills]);

  const skillCountText = useMemo(() => {
    if (maxSkills) {
      return `${skills.length}/${maxSkills}`;
    }
    return `${skills.length}`;
  }, [skills.length, maxSkills]);

  return (
    <View style={[styles.container, style]}>
      <Paragraph style={styles.fieldLabel}>{label}</Paragraph>
      
      {/* Skills Input */}
      <TextInput
        value={newSkill}
        onChangeText={setNewSkill}
        placeholder={canAddMore ? placeholder : `Maximum erreicht (${maxSkills})`}
        mode="outlined"
        style={styles.skillsInput}
        onSubmitEditing={handleKeySubmit}
        disabled={disabled || !canAddMore}
        error={!!error}
        right={
          <TextInput.Icon
            icon="plus"
            onPress={handleAddSkill}
            disabled={!newSkill.trim() || disabled || !canAddMore}
          />
        }
        testID={testID}
      />

      {/* Skills Chips */}
      {skills.length > 0 && (
        <View style={styles.skillsContainer}>
          {skills.map((skill, index) => (
            <Chip
              key={`${skill}-${index}`}
              mode="outlined"
              onClose={() => handleRemoveSkill(index)}
              style={styles.skillChip}
              disabled={disabled}
              testID={`skill-chip-${index}`}
            >
              {skill}
            </Chip>
          ))}
        </View>
      )}

      {/* Helper/Error Text */}
      {error ? (
        <Paragraph style={styles.errorText}>{error}</Paragraph>
      ) : helperText ? (
        <Paragraph style={styles.helperText}>{helperText}</Paragraph>
      ) : null}

      {/* Skills Count */}
      <Paragraph style={styles.maxSkillsText}>
        {skillCountText}
      </Paragraph>
    </View>
  );
});

SkillsInput.displayName = 'SkillsInput'; 