/**
 * @fileoverview PRESENTATION-STYLES-005: Password Change Screen Styles
 * @description Styles für den optimierten Password Change Screen mit Enterprise Features.
 * Bietet moderne Material Design Komponenten für sichere Passwort-Änderung.
 * 
 * @businessRule BR-530: Modern Material Design styling
 * @businessRule BR-531: Password strength visualization
 * @businessRule BR-532: Requirements checklist styling
 * @businessRule BR-533: Responsive design patterns
 * @businessRule BR-534: Accessibility-compliant styling
 * 
 * @architecture Material Design 3.0 principles
 * @architecture Responsive design patterns
 * @architecture Accessibility-first approach
 * 
 * @since 1.0.0
 * @version 2.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module PasswordChangeScreenStyles
 * @namespace Auth.Presentation.Screens.Styles
 */

import { StyleSheet, Dimensions } from 'react-native';
import { spacing, colors } from '@core/theme';

const { width: screenWidth } = Dimensions.get('window');

/**
 * @constant passwordChangeScreenStyles
 * @description Comprehensive styles for password change screen
 */
export const passwordChangeScreenStyles = StyleSheet.create({
  // ==========================================
  // 📱 CONTAINER STYLES
  // ==========================================
  
  /**
   * Main container with full screen coverage
   */
  container: {
    flex: 1,
    backgroundColor: colors.background || '#f9fafb',
  },

  /**
   * Scroll container with proper spacing
   */
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: spacing.xl || 24,
  },

  // ==========================================
  // 📝 HEADER STYLES
  // ==========================================
  
  /**
   * Header section container
   */
  header: {
    padding: spacing.xl || 24,
    backgroundColor: colors.surface || '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: colors.border || '#e5e7eb',
  },

  /**
   * Main title styling
   */
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text || '#111827',
    marginBottom: spacing.sm || 12,
    textAlign: 'center',
    letterSpacing: -0.5,
  },

  /**
   * Subtitle styling
   */
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary || '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: spacing.md || 16,
  },

  // ==========================================
  // 📋 FORM STYLES
  // ==========================================
  
  /**
   * Form container with proper spacing
   */
  formContainer: {
    padding: spacing.xl || 24,
    backgroundColor: colors.surface || '#ffffff',
    margin: spacing.md || 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  /**
   * Validation error text styling
   */
  validationError: {
    fontSize: 14,
    color: colors.error || '#ef4444',
    marginTop: spacing.xs || 8,
    marginBottom: spacing.md || 16,
    lineHeight: 20,
  },

  // ==========================================
  // 💪 PASSWORD STRENGTH STYLES
  // ==========================================
  
  /**
   * Password strength container
   */
  passwordStrengthContainer: {
    marginTop: spacing.md || 16,
    marginBottom: spacing.lg || 20,
    padding: spacing.md || 16,
    backgroundColor: colors.surfaceVariant || '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border || '#e5e7eb',
  },

  /**
   * Password strength header with label and status
   */
  passwordStrengthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm || 12,
  },

  /**
   * Password strength label
   */
  passwordStrengthLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text || '#374151',
  },

  /**
   * Password strength status text
   */
  passwordStrengthText: {
    fontSize: 14,
    fontWeight: '600',
  },

  /**
   * Password strength progress bar
   */
  passwordStrengthBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.surfaceVariant || '#f1f5f9',
  },

  // ==========================================
  // ✅ REQUIREMENTS STYLES
  // ==========================================
  
  /**
   * Requirements container
   */
  requirementsContainer: {
    marginTop: spacing.lg || 20,
    marginBottom: spacing.md || 16,
    padding: spacing.md || 16,
    backgroundColor: colors.surfaceVariant || '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border || '#e5e7eb',
  },

  /**
   * Requirements title
   */
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text || '#374151',
    marginBottom: spacing.md || 16,
  },

  /**
   * Individual requirement item
   */
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm || 8,
  },

  /**
   * Requirement check/cross icon
   */
  requirementIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: spacing.sm || 12,
    width: 20,
    textAlign: 'center',
  },

  /**
   * Requirement text
   */
  requirementText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },

  // ==========================================
  // 🔒 SECURITY INFO STYLES
  // ==========================================
  
  /**
   * Security info container
   */
  securityInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: spacing.xl || 24,
    padding: spacing.md || 16,
    backgroundColor: colors.info || '#f0f9ff',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary || '#3b82f6',
  },

  /**
   * Security info icon
   */
  securityInfoIcon: {
    fontSize: 20,
    marginRight: spacing.md || 16,
    marginTop: 2,
  },

  /**
   * Security info text
   */
  securityInfoText: {
    fontSize: 14,
    color: colors.primary || '#1e40af',
    lineHeight: 20,
    flex: 1,
  },

  // ==========================================
  // 📱 RESPONSIVE STYLES
  // ==========================================
  
  /**
   * Responsive adjustments for smaller screens
   */
  ...(screenWidth < 375 && {
    scrollContainer: {
      paddingHorizontal: 16,
      paddingTop: 24,
    },
    
    title: {
      fontSize: 24,
    },
    
    subtitle: {
      fontSize: 14,
    },
    
    formContainer: {
      gap: 16,
    },
  }),

  /**
   * Responsive adjustments for larger screens
   */
  ...(screenWidth > 414 && {
    scrollContainer: {
      paddingHorizontal: 32,
      maxWidth: 480,
      alignSelf: 'center',
      width: '100%',
    },
  }),

  // ===================================
  // BUTTON STYLES
  // ===================================
  buttonContainer: {
    marginTop: spacing.xl || 24,
  },

  // ===================================
  // ACCESSIBILITY STYLES
  // ===================================
  accessibilityHint: {
    fontSize: 12,
    color: colors.textSecondary || '#9ca3af',
    marginTop: spacing.xs || 4,
    fontStyle: 'italic',
  },

  // ===================================
  // LOADING STYLES
  // ===================================
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },

  loadingText: {
    marginTop: spacing.md || 16,
    fontSize: 16,
    color: colors.text || '#374151',
    fontWeight: '500',
  },

  // ===================================
  // ERROR STYLES
  // ===================================
  errorContainer: {
    backgroundColor: colors.surface || '#fef2f2',
    padding: spacing.md || 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.error || '#fecaca',
    marginBottom: spacing.md || 16,
  },

  errorText: {
    fontSize: 14,
    color: colors.error || '#dc2626',
    textAlign: 'center',
    lineHeight: 20,
  },

  // ===================================
  // SUCCESS STYLES
  // ===================================
  successContainer: {
    backgroundColor: colors.surface || '#f0fdf4',
    padding: spacing.md || 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.success || '#bbf7d0',
    marginBottom: spacing.md || 16,
  },

  successText: {
    fontSize: 14,
    color: colors.success || '#16a34a',
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
  },
}); 