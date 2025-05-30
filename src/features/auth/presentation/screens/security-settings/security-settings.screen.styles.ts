/**
 * @fileoverview PRESENTATION-STYLES-004: Optimized Security Settings Screen Styles
 * @description Vollständige Styles für den optimierten Security Settings Screen.
 * Implementiert moderne Material Design Prinzipien mit Enterprise UX.
 * 
 * @since 1.0.0
 * @version 2.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module SecuritySettingsScreenStyles
 * @namespace Auth.Presentation.Screens.Styles
 */

import { StyleSheet, Dimensions } from 'react-native';
import { spacing, colors } from '@core/theme';

const _width = Dimensions.get('window').width;
const _height = Dimensions.get('window').height;

/**
 * Stylesheet for the optimized SecuritySettingsScreen component.
 */
export const securitySettingsScreenStyles = StyleSheet.create({
  // ===================================
  // CONTAINER STYLES
  // ===================================
  container: {
    flex: 1,
    backgroundColor: colors.background || '#f9fafb',
  },

  // ===================================
  // HEADER STYLES
  // ===================================
  header: {
    padding: spacing.xl || 24,
    backgroundColor: colors.surface || '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: colors.border || '#e5e7eb',
    marginBottom: spacing.md || 16,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text || '#111827',
    marginBottom: spacing.sm || 12,
    letterSpacing: -0.5,
  },

  subtitle: {
    fontSize: 16,
    color: colors.textSecondary || '#6b7280',
    lineHeight: 24,
  },

  // ===================================
  // SECTION STYLES
  // ===================================
  section: {
    backgroundColor: colors.surface || '#ffffff',
    marginVertical: spacing.sm || 12,
    marginHorizontal: spacing.md || 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg || 24,
  },

  sectionIcon: {
    fontSize: 24,
    marginRight: spacing.md || 16,
  },

  sectionTitleContainer: {
    flex: 1,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text || '#111827',
    marginBottom: spacing.xs || 4,
  },

  sectionDescription: {
    fontSize: 14,
    color: colors.textSecondary || '#6b7280',
    lineHeight: 20,
  },

  // ===================================
  // SETTING ITEM STYLES
  // ===================================
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md || 16,
    minHeight: 64,
  },

  settingContent: {
    flex: 1,
    marginRight: spacing.md || 16,
  },

  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text || '#111827',
    marginBottom: spacing.xs || 4,
  },

  settingDescription: {
    fontSize: 14,
    color: colors.textSecondary || '#6b7280',
    lineHeight: 20,
  },

  loadingIndicator: {
    marginLeft: spacing.sm || 12,
  },

  // ===================================
  // MFA FACTORS STYLES
  // ===================================
  factorsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.sm || 12,
  },

  factorBadge: {
    backgroundColor: colors.primary || '#3b82f6',
    borderRadius: 4,
    marginRight: spacing.sm || 12,
    marginBottom: spacing.xs || 4,
  },

  // ===================================
  // DIVIDER STYLES
  // ===================================
  divider: {
    marginVertical: spacing.md || 16,
    backgroundColor: colors.border || '#e5e7eb',
  },

  // ===================================
  // ACTION BUTTON STYLES
  // ===================================
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md || 16,
    backgroundColor: colors.surface || '#f9fafb',
    borderRadius: 8,
    marginBottom: spacing.md || 16,
    borderWidth: 1,
    borderColor: colors.border || '#e5e7eb',
  },

  actionButtonText: {
    fontSize: 16,
    color: colors.text || '#374151',
    fontWeight: '500',
  },

  actionButtonArrow: {
    fontSize: 18,
    color: colors.textSecondary || '#9ca3af',
  },

  // ===================================
  // INFO BOX STYLES
  // ===================================
  infoBox: {
    backgroundColor: colors.info || '#f0f9ff',
    padding: spacing.md || 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary || '#3b82f6',
    marginTop: spacing.md || 16,
  },

  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary || '#1e40af',
    marginBottom: spacing.sm || 12,
  },

  infoText: {
    fontSize: 13,
    color: colors.primary || '#1e40af',
    marginBottom: spacing.xs || 4,
    lineHeight: 18,
  },

  // ===================================
  // SESSION STYLES
  // ===================================
  centerLoader: {
    marginVertical: spacing.xl || 32,
  },

  sessionItem: {
    backgroundColor: colors.surface || '#f9fafb',
    borderRadius: 8,
    padding: spacing.md || 16,
    marginBottom: spacing.md || 16,
    borderWidth: 1,
    borderColor: colors.border || '#e5e7eb',
  },

  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm || 12,
  },

  sessionDevice: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text || '#111827',
    flex: 1,
  },

  sessionInfo: {
    fontSize: 14,
    color: colors.textSecondary || '#6b7280',
    marginBottom: spacing.xs || 4,
  },

  sessionIp: {
    fontSize: 12,
    color: colors.textSecondary || '#9ca3af',
    fontFamily: 'monospace',
    marginBottom: spacing.sm || 12,
  },

  currentBadge: {
    backgroundColor: colors.success || '#dcfce7',
  },

  terminateButton: {
    backgroundColor: colors.error || '#fef2f2',
    paddingHorizontal: spacing.md || 16,
    paddingVertical: spacing.sm || 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.errorBorder || '#fecaca',
    alignSelf: 'flex-start',
  },

  terminateButtonText: {
    fontSize: 14,
    color: colors.errorText || '#dc2626',
    fontWeight: '500',
  },

  // ===================================
  // DANGER BUTTON STYLES
  // ===================================
  dangerButton: {
    backgroundColor: colors.error || '#fef2f2',
    padding: spacing.md || 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.errorBorder || '#fecaca',
    marginTop: spacing.md || 16,
  },

  dangerButtonText: {
    textAlign: 'center',
    fontSize: 14,
    color: colors.errorText || '#dc2626',
    fontWeight: '600',
  },

  // ===================================
  // EVENT STYLES
  // ===================================
  eventItem: {
    backgroundColor: colors.surface || '#f9fafb',
    borderRadius: 8,
    padding: spacing.md || 16,
    marginBottom: spacing.md || 16,
    borderWidth: 1,
    borderColor: colors.border || '#e5e7eb',
  },

  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm || 12,
  },

  eventDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text || '#111827',
    flex: 1,
    marginRight: spacing.md || 16,
  },

  eventInfo: {
    fontSize: 14,
    color: colors.textSecondary || '#6b7280',
  },

  riskBadge: {
    paddingHorizontal: spacing.sm || 8,
    paddingVertical: spacing.xs || 4,
    borderRadius: 4,
    minWidth: 50,
    alignItems: 'center',
  },

  riskBadgeText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
  },

  // ===================================
  // EMERGENCY STYLES
  // ===================================
  emergencyButton: {
    backgroundColor: colors.warning || '#fef2f2',
    padding: spacing.md || 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.warningBorder || '#fde68a',
    marginBottom: spacing.md || 16,
  },

  emergencyButtonText: {
    textAlign: 'center',
    fontSize: 16,
    color: colors.warningText || '#d97706',
    fontWeight: '600',
  },

  deleteButton: {
    backgroundColor: colors.error || '#fef2f2',
    borderColor: colors.errorBorder || '#ef4444',
  },

  deleteButtonText: {
    color: colors.errorText || '#dc2626',
  },

  // ===================================
  // NOT LOGGED IN STYLES
  // ===================================
  notLoggedInContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl || 40,
  },

  notLoggedInIcon: {
    fontSize: 64,
    marginBottom: spacing.xl || 32,
  },

  notLoggedInTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text || '#111827',
    marginBottom: spacing.md || 16,
    textAlign: 'center',
  },

  notLoggedInText: {
    fontSize: 16,
    color: colors.textSecondary || '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
}); 