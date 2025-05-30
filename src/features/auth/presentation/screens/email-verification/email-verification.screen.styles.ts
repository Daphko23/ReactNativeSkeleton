/**
 * @fileoverview PRESENTATION-STYLES-006: Email Verification Screen Styles
 * @description Styles für den Email Verification Screen mit Supabase Integration.
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module EmailVerificationScreenStyles
 * @namespace Auth.Presentation.Screens.Styles
 */

import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export const emailVerificationScreenStyles = StyleSheet.create({
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

  // Loading Styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
  },

  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 16,
    textAlign: 'center',
  },

  // Success Styles
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
  },

  successIcon: {
    fontSize: 72,
    marginBottom: 24,
  },

  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#22c55e',
    textAlign: 'center',
    marginBottom: 12,
  },

  successMessage: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },

  // Header Styles
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },

  headerIcon: {
    fontSize: 64,
    marginBottom: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
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

  attemptsText: {
    fontSize: 14,
    color: '#f59e0b',
    textAlign: 'center',
    marginTop: -8,
    fontWeight: '500',
  },

  // Info Box Styles
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },

  infoIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },

  infoText: {
    fontSize: 14,
    color: '#1e40af',
    lineHeight: 20,
    flex: 1,
  },

  // Back Button Styles
  backButton: {
    marginTop: 24,
    alignItems: 'center',
    paddingVertical: 12,
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
  }),

  ...(screenWidth > 414 && {
    scrollContainer: {
      paddingHorizontal: 32,
      maxWidth: 480,
      alignSelf: 'center',
      width: '100%',
    },
  }),
}); 