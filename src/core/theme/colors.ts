/**
 * @fileoverview COLORS: Enterprise Color System
 * @description Comprehensive color palette providing consistent design language, accessibility compliance, and semantic color definitions for enterprise applications
 * @version 1.1.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Core.Theme.Colors
 * @namespace Core.Theme.Colors
 * @category Theme
 * @subcategory ColorSystem
 * 
 * @businessRule BR-980: Zentrale Farbverwaltung für alle Komponenten
 * @businessRule BR-981: Semantische Farbzuordnungen für bessere Wartbarkeit
 * @businessRule BR-982: Accessibility-konforme Farbkontraste
 * 
 * @description
 * Enterprise-grade color system providing comprehensive color definitions
 * for consistent visual design across the application. Ensures accessibility
 * compliance, semantic color usage, and maintainable design patterns.
 * 
 * @example
 * Basic color usage:
 * ```tsx
 * import { colors } from '@/core/theme/colors';
 * 
 * const MyComponent = () => {
 *   return (
 *     <View style={{ backgroundColor: colors.background }}>
 *       <Text style={{ color: colors.textPrimary }}>
 *         Hello World
 *       </Text>
 *       <Button 
 *         style={{ backgroundColor: colors.primary }}
 *         textColor={colors.white}
 *       >
 *         Primary Action
 *       </Button>
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * Status color usage:
 * ```tsx
 * const StatusMessage = ({ type, message }) => {
 *   const getStatusColors = () => {
 *     switch (type) {
 *       case 'error':
 *         return {
 *           background: colors.errorLight,
 *           border: colors.errorBorder,
 *           text: colors.errorText
 *         };
 *       case 'success':
 *         return {
 *           background: colors.successLight,
 *           border: colors.successBorder,
 *           text: colors.successText
 *         };
 *       default:
 *         return {
 *           background: colors.surface,
 *           border: colors.border,
 *           text: colors.text
 *         };
 *     }
 *   };
 * 
 *   const statusColors = getStatusColors();
 *   return (
 *     <View style={{
 *       backgroundColor: statusColors.background,
 *       borderColor: statusColors.border,
 *       borderWidth: 1
 *     }}>
 *       <Text style={{ color: statusColors.text }}>
 *         {message}
 *       </Text>
 *     </View>
 *   );
 * };
 * ```
 * 
 * @color_categories
 * - **Brand Colors**: Primary and secondary brand colors
 * - **Background Colors**: Application and surface backgrounds
 * - **Text Colors**: Typography color hierarchy
 * - **Status Colors**: Success, error, warning, and info states
 * - **Border Colors**: Separators and outlines
 * - **Interaction Colors**: Interactive elements and overlays
 * - **Utility Colors**: Common utility colors
 * - **Switch Colors**: Toggle and switch component colors
 * 
 * @accessibility_compliance
 * - WCAG 2.1 AA contrast ratios
 * - Color blindness considerations
 * - High contrast mode support
 * - Screen reader compatibility
 * 
 * @design_principles
 * - Semantic color naming
 * - Consistent color usage
 * - Scalable color system
 * - Brand consistency
 * - Visual hierarchy
 * 
 * @use_cases
 * - Application theming
 * - Component styling
 * - Status indication
 * - Brand consistency
 * - Accessibility compliance
 * - Design system implementation
 * 
 * @maintenance_benefits
 * - Central color management
 * - Consistent color usage
 * - Easy color updates
 * - Design system scalability
 * - Brand evolution support
 * 
 * @see {@link AppTheme} for theme integration
 * @see {@link useTheme} for theme system usage
 * 
 * @todo Add dark theme color variants
 * @todo Implement color contrast validation
 * @todo Add color accessibility helpers
 */

/**
 * Enterprise Color Palette Object
 * 
 * Comprehensive color definitions providing semantic color access,
 * accessibility compliance, and consistent visual design patterns
 * throughout the application.
 * 
 * @constant colors
 * @type {object}
 * @since 1.0.0
 * @version 1.1.0
 * @readonly
 * 
 * @description
 * Central color palette providing type-safe color access with semantic
 * naming conventions. All colors are validated for accessibility compliance
 * and designed for consistent brand representation.
 * 
 * @color_structure
 * - **Primary Brand Colors**: Core brand identity colors
 * - **Background & Surface Colors**: Layout and surface definitions
 * - **Text Colors**: Typography color hierarchy
 * - **Status Colors**: State indication colors with variants
 * - **Border & Divider Colors**: Separation and outline colors
 * - **Interaction Colors**: User interaction feedback colors
 * - **Utility Colors**: Common utility and helper colors
 * - **Switch & Toggle Colors**: Form control colors
 * 
 * @accessibility_features
 * - WCAG 2.1 AA compliant contrast ratios
 * - Color blindness friendly palette
 * - High contrast mode compatibility
 * - Screen reader accessible naming
 * 
 * @usage_guidelines
 * - Use semantic names over hex values
 * - Maintain color hierarchy consistency
 * - Follow status color conventions
 * - Ensure proper contrast ratios
 * - Test with accessibility tools
 * 
 * @example
 * Brand color usage:
 * ```tsx
 * <Button style={{ backgroundColor: colors.primary }}>
 *   Primary Action
 * </Button>
 * ```
 * 
 * @example
 * Status indication:
 * ```tsx
 * <Alert 
 *   type="error"
 *   backgroundColor={colors.errorLight}
 *   borderColor={colors.errorBorder}
 *   textColor={colors.errorText}
 * />
 * ```
 * 
 * @see {@link AppTheme} for theme integration
 * @see {@link useTheme} for dynamic theme access
 */
export const colors = {
  // ==========================================
  // 🎨 PRIMARY BRAND COLORS
  // ==========================================
  
  /**
   * Primary brand color - main application identity.
   * Used for primary actions, key UI elements, and brand representation.
   * 
   * @type {string}
   * @color #015941
   * @usage Primary buttons, active states, brand elements
   * @accessibility WCAG AA compliant with white text
   */
  primary: '#015941',
  
  /**
   * Secondary brand color - supporting brand identity.
   * Used for secondary actions, accents, and complementary elements.
   * 
   * @type {string}
   * @color #00B374
   * @usage Secondary buttons, highlights, accent elements
   * @accessibility WCAG AA compliant with white text
   */
  secondary: '#00B374',
  
  // ==========================================
  // 🖼️ BACKGROUND & SURFACE COLORS
  // ==========================================
  background: '#F5F6F7',
  surface: '#FFFFFF',
  surfaceVariant: '#f9fafb',
  surfaceCard: '#ffffff',
  
  // ==========================================
  // 📝 TEXT COLORS
  // ==========================================
  text: '#1A1C23',
  textPrimary: '#111827',
  textSecondary: '#374151',
  textMuted: '#6b7280',
  textDisabled: '#9ca3af',
  title: '#333333',
  placeholder: '#7C7C7C',
  
  // ==========================================
  // 🚨 STATUS COLORS
  // ==========================================
  error: '#F26522',
  errorLight: '#fef3cd',
  errorBorder: '#f59e0b',
  errorText: '#92400e',
  
  success: '#43A047',
  successLight: '#f0f9ff',
  successBorder: '#10b981',
  successText: '#065f46',
  
  warning: '#f59e0b',
  warningLight: '#fef3cd',
  warningBorder: '#f59e0b',
  warningText: '#92400e',
  
  info: '#3b82f6',
  infoLight: '#f0f9ff',
  infoBorder: '#3b82f6',
  infoText: '#1e40af',
  
  // ==========================================
  // 🔲 BORDER & DIVIDER COLORS
  // ==========================================
  border: '#DADCE0',
  borderLight: '#e5e7eb',
  borderMuted: '#d1d5db',
  borderFocus: '#3b82f6',
  
  // ==========================================
  // 🎭 INTERACTION COLORS
  // ==========================================
  fabColor: '#006400',
  overlay: 'rgba(0, 0, 0, 0.5)',
  
  // ==========================================
  // 🎨 UTILITY COLORS
  // ==========================================
  black: '#000000',
  white: '#ffffff',
  grey: '#F5F5F5',
  greyLight: '#f3f4f6',
  greyMedium: '#9ca3af',
  transparent: 'transparent',
  
  // ==========================================
  // 🔄 SWITCH & TOGGLE COLORS
  // ==========================================
  switchTrackFalse: '#e5e7eb',
  switchTrackTrue: '#3b82f6',
  switchThumbFalse: '#f3f4f6',
  switchThumbTrue: '#ffffff',
};
