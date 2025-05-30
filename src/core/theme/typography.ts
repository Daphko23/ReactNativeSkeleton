/**
 * @fileoverview CORE-THEME-003: Central Typography System
 * @description Zentrale Typografie-Definitionen für konsistente Text-Gestaltung
 * 
 * @businessRule BR-986: Konsistente Typografie für alle Text-Elemente
 * @businessRule BR-987: Accessibility-konforme Schriftgrößen und Kontraste
 * @businessRule BR-988: Responsive Typography für unterschiedliche Bildschirmgrößen
 * 
 * @since 1.0.0
 * @version 1.1.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module CoreTypography
 * @namespace Core.Theme
 */

export const typography = {
  // ==========================================
  // 📝 HEADER TYPOGRAPHY
  // ==========================================
  heading: {
    h1: {
      fontSize: 32,
      fontWeight: 'bold' as const,
      lineHeight: 40,
    },
    h2: {
      fontSize: 28,
      fontWeight: 'bold' as const,
      lineHeight: 36,
    },
    h3: {
      fontSize: 24,
      fontWeight: 'bold' as const,
      lineHeight: 32,
    },
    h4: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 28,
    },
    h5: {
      fontSize: 18,
      fontWeight: '600' as const,
      lineHeight: 26,
    },
    h6: {
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 24,
    },
  },
  
  // ==========================================
  // 📄 BODY TYPOGRAPHY
  // ==========================================
  text: {
    large: {
      fontSize: 18,
      fontWeight: '400' as const,
      lineHeight: 28,
    },
    regular: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 24,
    },
    small: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
    },
    tiny: {
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 18,
    },
  },
  
  // ==========================================
  // 🏷️ LABEL & CAPTION TYPOGRAPHY
  // ==========================================
  labelText: {
    large: {
      fontSize: 16,
      fontWeight: '500' as const,
      lineHeight: 22,
    },
    medium: {
      fontSize: 14,
      fontWeight: '500' as const,
      lineHeight: 20,
    },
    small: {
      fontSize: 12,
      fontWeight: '500' as const,
      lineHeight: 16,
    },
  },
  
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  
  // ==========================================
  // 🔘 INTERACTIVE TYPOGRAPHY
  // ==========================================
  buttonText: {
    large: {
      fontSize: 18,
      fontWeight: '600' as const,
      lineHeight: 24,
    },
    medium: {
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 22,
    },
    small: {
      fontSize: 14,
      fontWeight: '600' as const,
      lineHeight: 20,
    },
  },
  
  link: {
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 22,
    textDecorationLine: 'underline' as const,
  },
  
  // ==========================================
  // 🏗️ SPECIAL PURPOSE TYPOGRAPHY
  // ==========================================
  code: {
    fontSize: 14,
    fontFamily: 'monospace',
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  
  input: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  
  // ==========================================
  // 🔢 LEGACY COMPATIBILITY (DEPRECATED)
  // ==========================================
  /** @deprecated Use heading.h3 instead */
  titleLarge: {
    fontSize: 24,
    fontWeight: 'bold' as const,
  },
  
  /** @deprecated Use labelText.medium instead */
  label: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  
  /** @deprecated Use text.regular instead */
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
  },
  
  /** @deprecated Use buttonText.medium instead */
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
};
