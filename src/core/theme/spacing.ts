/**
 * @fileoverview CORE-THEME-002: Central Spacing System
 * @description Zentrale Abstands-Definitionen für konsistente Layout-Gestaltung
 * 
 * @businessRule BR-983: Konsistente Abstände für alle Layout-Elemente
 * @businessRule BR-984: Responsive Spacing für unterschiedliche Bildschirmgrößen
 * @businessRule BR-985: Accessibility-konforme Touch-Target-Größen
 * 
 * @since 1.0.0
 * @version 1.1.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module CoreSpacing
 * @namespace Core.Theme
 */

export const spacing = {
  // ==========================================
  // 📏 BASE SPACING SCALE
  // ==========================================
  none: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
  
  // ==========================================
  // 🎯 COMPONENT-SPECIFIC SPACING
  // ==========================================
  component: {
    padding: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    margin: 8,
    marginVertical: 8,
    borderRadius: 12,
    borderRadiusSmall: 8,
    borderRadiusLarge: 16,
  },
  
  // ==========================================
  // 🔘 INTERACTIVE ELEMENTS
  // ==========================================
  touchTarget: {
    minimum: 44, // iOS/Android minimum touch target
    button: 48,
    icon: 24,
    switch: 32,
  },
  
  // ==========================================
  // 📱 LAYOUT SPACING
  // ==========================================
  layout: {
    screenPadding: 20,
    sectionSpacing: 24,
    cardSpacing: 16,
    listItemSpacing: 12,
  },
  
  // ==========================================
  // 🎨 SHADOW & ELEVATION
  // ==========================================
  shadow: {
    small: {
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    medium: {
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
    large: {
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 8,
    },
  },
};
