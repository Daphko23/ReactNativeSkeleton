import { StyleSheet } from 'react-native';

/**
 * Styles for ProfessionalInfoCard component
 * 
 * @description Theme-aware styles for the professional information card component
 * providing comprehensive styling for professional details display, skills management,
 * experience visualization, and accessibility features. Supports enterprise-grade
 * professional profile UI patterns with comprehensive skill and experience tracking.
 * 
 * @param theme - Theme configuration object with colors, spacing, typography, etc.
 * @returns StyleSheet object with all component styles
 * 
 * @since 1.0.0
 * @author Enterprise Development Team
 * @layer Presentation
 */
export const createProfessionalInfoCardStyles = (theme: any) => StyleSheet.create({
  card: {
    marginBottom: theme.spacing[4],
    backgroundColor: theme.colors.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[4],
  },
  title: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing[8],
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
    marginVertical: theme.spacing[4],
  },
  addButton: {
    marginTop: theme.spacing[2],
  },
  jobInfo: {
    marginBottom: theme.spacing[4],
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },
  infoText: {
    marginLeft: theme.spacing[2],
    flex: 1,
    color: theme.colors.text,
  },
  experienceSection: {
    marginBottom: theme.spacing[4],
  },
  experienceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },
  experienceBadge: {
    alignSelf: 'flex-start',
    color: 'white',
  },
  workLocationSection: {
    marginBottom: theme.spacing[4],
  },
  availabilitySection: {
    marginBottom: theme.spacing[4],
  },
  skillsSection: {
    marginBottom: theme.spacing[4],
  },
  skillsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },
  skillsHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionLabel: {
    marginLeft: theme.spacing[2],
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text,
  },
  skillCount: {
    backgroundColor: theme.colors.surfaceVariant,
    color: theme.colors.onSurfaceVariant,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[2],
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
  skillText: {
    fontSize: theme.typography.fontSizes.xs,
  },
  customFieldsSection: {
    marginBottom: theme.spacing[4],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },
  customField: {
    flexDirection: 'row',
    marginBottom: theme.spacing[2],
  },
  customFieldLabel: {
    fontWeight: theme.typography.fontWeights.medium,
    minWidth: 100,
    color: theme.colors.text,
  },
  customFieldValue: {
    flex: 1,
    color: theme.colors.textSecondary,
  },
}); 