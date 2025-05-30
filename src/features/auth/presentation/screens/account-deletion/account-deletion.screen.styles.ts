/**
 * @fileoverview PRESENTATION-STYLES-007: Account Deletion Screen Styles
 * @description Styles für den Account Deletion Screen mit GDPR Compliance.
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module AccountDeletionScreenStyles
 * @namespace Auth.Presentation.Screens.Styles
 */

import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export const accountDeletionScreenStyles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },

  // Processing State
  processingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
  },

  processingTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ef4444',
    marginTop: 24,
    textAlign: 'center',
  },

  processingMessage: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 24,
  },

  exportProgress: {
    marginTop: 24,
    alignItems: 'center',
  },

  exportProgressText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
  },

  // Header Styles
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },

  headerIcon: {
    fontSize: 72,
    marginBottom: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },

  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },

  // Form Styles
  formContainer: {
    gap: 20,
  },

  validationError: {
    fontSize: 14,
    color: '#ef4444',
    marginTop: -16,
    marginBottom: 4,
    paddingHorizontal: 4,
  },

  // Warning Box Styles
  warningBox: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#fecaca',
    marginBottom: 16,
  },

  warningTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#dc2626',
    marginBottom: 12,
  },

  warningText: {
    fontSize: 15,
    color: '#7f1d1d',
    lineHeight: 22,
  },

  // GDPR Box Styles
  gdprBox: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    marginBottom: 16,
  },

  gdprTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 8,
  },

  gdprText: {
    fontSize: 14,
    color: '#1e40af',
    lineHeight: 20,
  },

  // Option Container Styles
  optionContainer: {
    marginVertical: 8,
  },

  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },

  checkboxText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
    flex: 1,
    marginTop: 2,
  },

  // Button Container Styles
  buttonContainer: {
    marginTop: 32,
    gap: 16,
  },

  primaryButton: {
    backgroundColor: '#ef4444',
  },

  deleteButton: {
    backgroundColor: '#dc2626',
  },

  cancelButton: {
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },

  cancelButtonText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },

  backButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },

  backButtonText: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '500',
  },

  // Responsive Styles
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
    
    warningBox: {
      padding: 16,
    },
    
    gdprBox: {
      padding: 12,
    },
  }),

  ...(screenWidth > 414 && {
    scrollContainer: {
      paddingHorizontal: 32,
      maxWidth: 600,
      alignSelf: 'center',
      width: '100%',
    },
  }),
}); 