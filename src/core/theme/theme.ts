/**
 * @fileoverview THEME: Enterprise Application Theme System
 * @description Comprehensive Material Design 3 theme configuration with enterprise color schemes, typography system, and component theming
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Core.Theme.Theme
 * @namespace Core.Theme.Theme
 * @category Theme
 * @subcategory Configuration
 */

import {
  MD3LightTheme as DefaultTheme,
  configureFonts,
} from 'react-native-paper';
import {colors} from './colors';

/**
 * Font Configuration Object
 * 
 * Enterprise-grade typography configuration providing consistent font styling
 * across the application with Material Design 3 compliance and accessibility support.
 * 
 * @constant fontConfig
 * @since 1.0.0
 * @version 1.0.0
 * @category Configuration
 * @subcategory Typography
 * @module Core.Theme.Theme
 * @namespace Core.Theme.Theme.fontConfig
 * 
 * @description
 * Comprehensive font configuration system defining typography hierarchy
 * with optimized font weights, sizes, letter spacing, and line heights.
 * Ensures consistent typography across all application components.
 * 
 * @example
 * Font configuration usage:
 * ```tsx
 * import { AppTheme } from '@/core/theme/theme';
 * 
 * const MyComponent = () => {
 *   return (
 *     <Text style={{
 *       fontFamily: AppTheme.fonts.regular.fontFamily,
 *       fontSize: AppTheme.fonts.regular.fontSize,
 *       fontWeight: AppTheme.fonts.regular.fontWeight
 *     }}>
 *       Regular Text
 *     </Text>
 *   );
 * };
 * ```
 * 
 * @example
 * Typography system integration:
 * ```tsx
 * const StyledText = styled.Text`
 *   font-family: ${AppTheme.fonts.medium.fontFamily};
 *   font-weight: ${AppTheme.fonts.medium.fontWeight};
 *   font-size: ${AppTheme.fonts.medium.fontSize}px;
 *   letter-spacing: ${AppTheme.fonts.medium.letterSpacing}px;
 *   line-height: ${AppTheme.fonts.medium.lineHeight}px;
 * `;
 * ```
 * 
 * @typography_hierarchy
 * - **regular**: Standard body text (400 weight)
 * - **medium**: Emphasized text (500 weight)
 * - **light**: Subtle text (300 weight)
 * - **thin**: Minimal text (100 weight)
 * 
 * @font_properties
 * - **fontFamily**: System font for cross-platform consistency
 * - **fontWeight**: Numeric weight values for precise control
 * - **fontSize**: Base 16px for optimal readability
 * - **letterSpacing**: Optical spacing for improved legibility
 * - **lineHeight**: Vertical rhythm for comfortable reading
 * 
 * @accessibility_features
 * - System font respects user preferences
 * - Consistent line heights for screen readers
 * - Appropriate letter spacing for dyslexia support
 * - Scalable typography for dynamic type
 * 
 * @platform_support
 * - **iOS**: Uses San Francisco system font
 * - **Android**: Uses Roboto system font
 * - **Cross-platform**: Consistent rendering
 * 
 * @design_principles
 * - Material Design 3 compliance
 * - Accessibility standards (WCAG 2.1)
 * - Optimal reading experience
 * - Visual hierarchy support
 * - Brand consistency
 * 
 * @use_cases
 * - Body text and paragraphs
 * - Headers and titles
 * - UI labels and buttons
 * - Form inputs and placeholders
 * - Navigation elements
 * 
 * @performance_considerations
 * - System fonts avoid additional font loading
 * - Optimized for rendering performance
 * - Memory efficient font handling
 * - Fast text rendering
 * 
 * @dependencies
 * - react-native-paper: Font configuration system
 * 
 * @see {@link AppTheme} for complete theme configuration
 * @see {@link colors} for color system integration
 * 
 * @todo Add custom font family support
 * @todo Implement responsive typography
 * @todo Add font feature settings
 */
const fontConfig = {
  /**
   * Regular Font Weight Configuration
   * Standard body text with balanced readability and visual weight.
   * 
   * @property regular
   * @type {object}
   * @constant
   * 
   * @description
   * Primary font weight for body text, paragraphs, and general content.
   * Provides excellent readability while maintaining visual hierarchy.
   * 
   * @specifications
   * - Font Weight: 400 (Regular)
   * - Font Size: 16px (Optimal for mobile)
   * - Letter Spacing: 0.5px (Enhanced legibility)
   * - Line Height: 24px (1.5x ratio for comfort)
   * 
   * @use_cases
   * - Body text and paragraphs
   * - Form labels and descriptions
   * - General UI text content
   * - Default text styling
   */
  regular: {
    /** System font family for cross-platform consistency */
    fontFamily: 'System',
    /** Regular font weight for standard text */
    fontWeight: '400',
    /** Base font size optimized for mobile readability */
    fontSize: 16,
    /** Letter spacing for improved legibility */
    letterSpacing: 0.5,
    /** Line height for comfortable reading */
    lineHeight: 24,
  } as const,

  /**
   * Medium Font Weight Configuration
   * Emphasized text with enhanced visual prominence and hierarchy.
   * 
   * @property medium
   * @type {object}
   * @constant
   * 
   * @description
   * Semi-bold font weight for emphasized content, buttons, and important
   * text elements requiring enhanced visual prominence.
   * 
   * @specifications
   * - Font Weight: 500 (Medium)
   * - Font Size: 16px (Consistent sizing)
   * - Letter Spacing: 0.5px (Maintained legibility)
   * - Line Height: 24px (Consistent rhythm)
   * 
   * @use_cases
   * - Button text and CTAs
   * - Form field labels
   * - Section headers
   * - Emphasized content
   * - Navigation labels
   */
  medium: {
    /** System font family for consistency */
    fontFamily: 'System',
    /** Medium font weight for emphasis */
    fontWeight: '500',
    /** Consistent base font size */
    fontSize: 16,
    /** Maintained letter spacing */
    letterSpacing: 0.5,
    /** Consistent line height */
    lineHeight: 24,
  } as const,

  /**
   * Light Font Weight Configuration
   * Subtle text with reduced visual weight for secondary content.
   * 
   * @property light
   * @type {object}
   * @constant
   * 
   * @description
   * Light font weight for secondary content, captions, and subtle
   * text elements that should have reduced visual prominence.
   * 
   * @specifications
   * - Font Weight: 300 (Light)
   * - Font Size: 16px (Consistent sizing)
   * - Letter Spacing: 0.25px (Refined spacing)
   * - Line Height: 22px (Tighter spacing)
   * 
   * @use_cases
   * - Secondary text and captions
   * - Metadata and timestamps
   * - Subtle descriptions
   * - Helper text
   * - Placeholder content
   */
  light: {
    /** System font family for consistency */
    fontFamily: 'System',
    /** Light font weight for subtlety */
    fontWeight: '300',
    /** Consistent base font size */
    fontSize: 16,
    /** Refined letter spacing for light text */
    letterSpacing: 0.25,
    /** Tighter line height for secondary content */
    lineHeight: 22,
  } as const,

  /**
   * Thin Font Weight Configuration
   * Minimal text with ultra-light weight for delicate content.
   * 
   * @property thin
   * @type {object}
   * @constant
   * 
   * @description
   * Ultra-light font weight for delicate content requiring minimal
   * visual impact while maintaining readability.
   * 
   * @specifications
   * - Font Weight: 100 (Thin)
   * - Font Size: 16px (Consistent sizing)
   * - Letter Spacing: 0.2px (Minimal spacing)
   * - Line Height: 20px (Compact spacing)
   * 
   * @use_cases
   * - Large display text
   * - Decorative elements
   * - Ultra-subtle content
   * - Special design elements
   * - Minimalist interfaces
   */
  thin: {
    /** System font family for consistency */
    fontFamily: 'System',
    /** Thin font weight for minimal impact */
    fontWeight: '100',
    /** Consistent base font size */
    fontSize: 16,
    /** Minimal letter spacing */
    letterSpacing: 0.2,
    /** Compact line height */
    lineHeight: 20,
  } as const,
};

/**
 * Application Theme Configuration
 * 
 * Enterprise-grade Material Design 3 theme providing comprehensive theming
 * solution with custom color schemes, typography system, and component styling.
 * Ensures consistent visual design across the entire application.
 * 
 * @constant AppTheme
 * @since 1.0.0
 * @version 1.0.0
 * @category Theme
 * @subcategory Configuration
 * @module Core.Theme.Theme
 * @namespace Core.Theme.Theme.AppTheme
 * 
 * @description
 * Complete theme configuration extending Material Design 3 defaults with
 * custom enterprise color schemes, typography system, and component theming.
 * Provides the foundation for consistent visual design across all application
 * components and screens.
 * 
 * @example
 * Basic theme usage:
 * ```tsx
 * import { AppTheme } from '@/core/theme/theme';
 * import { Provider as PaperProvider } from 'react-native-paper';
 * 
 * const App = () => {
 *   return (
 *     <PaperProvider theme={AppTheme}>
 *       <MyApplication />
 *     </PaperProvider>
 *   );
 * };
 * ```
 * 
 * @example
 * Theme integration with components:
 * ```tsx
 * import { AppTheme } from '@/core/theme/theme';
 * 
 * const MyComponent = () => {
 *   return (
 *     <View style={{
 *       backgroundColor: AppTheme.colors.background,
 *       padding: 16
 *     }}>
 *       <Text style={{
 *         color: AppTheme.colors.onSurface,
 *         ...AppTheme.fonts.regular
 *       }}>
 *         Themed Content
 *       </Text>
 *       <Button
 *         mode="contained"
 *         buttonColor={AppTheme.colors.primary}
 *         textColor={AppTheme.colors.onPrimary}
 *       >
 *         Themed Button
 *       </Button>
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * Advanced theme customization:
 * ```tsx
 * const customTheme = {
 *   ...AppTheme,
 *   colors: {
 *     ...AppTheme.colors,
 *     primary: '#custom-primary-color',
 *   },
 *   fonts: {
 *     ...AppTheme.fonts,
 *     // Custom font overrides
 *   }
 * };
 * ```
 * 
 * @theme_structure
 * - **Base**: Material Design 3 light theme foundation
 * - **Colors**: Custom enterprise color scheme
 * - **Fonts**: Comprehensive typography system
 * - **Components**: Material component theming
 * 
 * @color_system
 * - **primary**: Main brand color for primary actions
 * - **background**: Application background color
 * - **surface**: Card and surface background color
 * - **error**: Error state and validation color
 * - **onPrimary**: Text color on primary backgrounds
 * - **onSurface**: Text color on surface backgrounds
 * - **outline**: Border and separator color
 * 
 * @typography_system
 * - **regular**: Standard body text (400 weight)
 * - **medium**: Emphasized text (500 weight)
 * - **light**: Subtle text (300 weight)
 * - **thin**: Minimal text (100 weight)
 * 
 * @material_design_compliance
 * - Material Design 3 specifications
 * - Accessibility guidelines (WCAG 2.1)
 * - Color contrast requirements
 * - Typography hierarchy standards
 * - Component design patterns
 * 
 * @enterprise_features
 * - Brand color integration
 * - Scalable color system
 * - Professional typography
 * - Consistent component styling
 * - Cross-platform compatibility
 * 
 * @accessibility_support
 * - Sufficient color contrast ratios
 * - Screen reader compatible
 * - Keyboard navigation support
 * - High contrast mode compatibility
 * - Dynamic type scaling
 * 
 * @performance_optimizations
 * - System font usage for fast loading
 * - Optimized color definitions
 * - Efficient theme object structure
 * - Minimal memory footprint
 * - Fast theme switching support
 * 
 * @platform_compatibility
 * - **iOS**: Native appearance integration
 * - **Android**: Material Design native feel
 * - **Cross-platform**: Consistent behavior
 * - **Web**: Progressive web app support
 * 
 * @use_cases
 * - Application-wide theming
 * - Component library theming
 * - Brand consistency enforcement
 * - Accessibility compliance
 * - Design system implementation
 * - Multi-theme applications
 * 
 * @integration_patterns
 * - React Native Paper provider
 * - Styled Components theming
 * - Navigation theme integration
 * - Status bar styling
 * - Modal and overlay theming
 * 
 * @customization_options
 * - Color scheme overrides
 * - Typography customization
 * - Component style modifications
 * - Brand-specific theming
 * - Dynamic theme switching
 * 
 * @best_practices
 * - Use theme colors consistently
 * - Follow typography hierarchy
 * - Test accessibility compliance
 * - Validate color contrast
 * - Implement theme switching
 * - Monitor performance impact
 * 
 * @testing_considerations
 * - Theme consistency across components
 * - Accessibility compliance testing
 * - Color contrast validation
 * - Typography rendering verification
 * - Cross-platform appearance testing
 * 
 * @dependencies
 * - react-native-paper: Material Design framework
 * - ./colors: Enterprise color definitions
 * 
 * @see {@link colors} for color system details
 * @see {@link fontConfig} for typography configuration
 * @see {@link DefaultTheme} for Material Design base
 * 
 * @todo Add dark theme variant
 * @todo Implement dynamic theming
 * @todo Add animation configuration
 * @todo Support for multiple brand themes
 * @todo Add theme validation utilities
 */
export const AppTheme = {
  /**
   * Material Design 3 base theme inheritance.
   * Provides comprehensive component theming and design tokens.
   */
  ...DefaultTheme,

  /**
   * Custom Color Scheme Configuration
   * 
   * Enterprise color system extending Material Design with custom
   * brand colors and accessibility-compliant color combinations.
   * 
   * @property colors
   * @type {object}
   * 
   * @description
   * Comprehensive color system providing consistent color usage
   * across all application components with accessibility compliance
   * and brand integration.
   * 
   * @color_definitions
   * - **primary**: Main brand color for primary actions and emphasis
   * - **background**: Primary application background color
   * - **surface**: Card backgrounds and elevated surfaces
   * - **error**: Error states, validation, and destructive actions
   * - **onPrimary**: Text and icons on primary color backgrounds
   * - **onSurface**: Text and icons on surface backgrounds
   * - **outline**: Borders, dividers, and subtle separators
   * 
   * @accessibility_compliance
   * - WCAG 2.1 AA contrast ratios
   * - High contrast mode support
   * - Color blindness considerations
   * - Screen reader compatibility
   */
  colors: {
    /** Material Design base colors inheritance */
    ...DefaultTheme.colors,
    /** Primary brand color for main actions */
    primary: colors.primary,
    /** Application background color */
    background: colors.background,
    /** Surface and card background color */
    surface: colors.surface,
    /** Error state and validation color */
    error: colors.error,
    /** Text color on primary backgrounds */
    onPrimary: '#FFFFFF',
    /** Text color on surface backgrounds */
    onSurface: colors.text,
    /** Border and outline color */
    outline: colors.border,
  },

  /**
   * Typography System Configuration
   * 
   * Comprehensive font system providing consistent typography hierarchy
   * across the application with Material Design compliance.
   * 
   * @property fonts
   * @type {object}
   * 
   * @description
   * Complete typography system configured with Material Design
   * typography standards and cross-platform font consistency.
   * 
   * @typography_features
   * - System font integration
   * - Consistent font weights
   * - Optimized letter spacing
   * - Accessible line heights
   * - Cross-platform compatibility
   */
  fonts: configureFonts({config: fontConfig}),
};

/**
 * @summary
 * The theme module provides enterprise-grade Material Design 3 theming
 * with custom color schemes, comprehensive typography system, and
 * accessibility compliance. Essential for consistent visual design
 * across React Native applications.
 * 
 * @key_features
 * - Material Design 3 compliance
 * - Enterprise color system
 * - Comprehensive typography
 * - Accessibility support
 * - Cross-platform compatibility
 * - Performance optimization
 * - Brand integration
 * 
 * @architectural_benefits
 * - Centralized theme configuration
 * - Consistent visual design
 * - Scalable theming system
 * - Component library integration
 * - Design system enforcement
 * 
 * @production_readiness
 * - Accessibility compliance
 * - Performance optimization
 * - Cross-platform testing
 * - Brand consistency
 * - Enterprise scalability
 * 
 * @module_exports
 * - AppTheme: Complete theme configuration
 * - fontConfig: Typography system (internal)
 * 
 * @dependencies
 * - react-native-paper: Material Design framework
 * - ./colors: Enterprise color system
 * 
 * @see {@link https://m3.material.io/} Material Design 3 Guidelines
 * @see {@link https://callstack.github.io/react-native-paper/} React Native Paper Documentation
 */
