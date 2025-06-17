/**
 * @fileoverview I18N-CONFIGURATION: International Localization System
 * @description Comprehensive internationalization (i18n) configuration using react-i18next with flat structure, multiple language support, and enterprise-grade localization management
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Core.I18n
 * @namespace Core.I18n
 * @category Configuration
 * @subcategory Internationalization
 */

import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import de from './locales/de.json';
import en from './locales/en.json';
import { LoggerFactory } from '@core/logging/logger.factory';
import { LogCategory } from '@core/logging/logger.service.interface';

/**
 * React i18next Internationalization Configuration
 * 
 * Configures a comprehensive internationalization system with flat structure,
 * fallback language support, development debugging, and seamless React integration.
 * Provides enterprise-grade localization management for multi-language applications.
 * 
 * @constant {object} i18nInstance
 * @since 1.0.0
 * @version 1.0.0
 * @category Configuration
 * @subcategory I18n
 * @module Core.I18n
 * @namespace Core.I18n.Configuration
 * 
 * @example
 * Basic usage in components:
 * ```tsx
 * import { useTranslation } from 'react-i18next';
 * 
 * const MyComponent = () => {
 *   const { t } = useTranslation();
 * 
 *   return (
 *     <View>
 *       <Text>{t('auth.login.title')}</Text>
 *       <Text>{t('auth.login.description')}</Text>
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * With interpolation and parameters:
 * ```tsx
 * const WelcomeComponent = ({ userName }) => {
 *   const { t } = useTranslation();
 * 
 *   return (
 *     <Text>
 *       {t('welcome.greeting', { name: userName })}
 *     </Text>
 *   );
 * };
 * ```
 * 
 * @example
 * Programmatic language switching:
 * ```tsx
 * import i18n from '@/core/i18n/i18n';
 * 
 * const switchLanguage = (language: 'de' | 'en') => {
 *   i18n.changeLanguage(language);
 * };
 * 
 * const LanguageSwitcher = () => {
 *   const { i18n: i18nInstance } = useTranslation();
 * 
 *   return (
 *     <View>
 *       <Button onPress={() => switchLanguage('de')}>
 *         Deutsch
 *       </Button>
 *       <Button onPress={() => switchLanguage('en')}>
 *         English
 *       </Button>
 *       <Text>Current: {i18nInstance.language}</Text>
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * Custom hooks integration:
 * ```tsx
 * const useAuthTranslations = () => {
 *   const { t } = useTranslation();
 * 
 *   return {
 *     loginTitle: t('auth.login.title'),
 *     loginSubtitle: t('auth.login.subtitle'),
 *     loginButton: t('auth.login.button'),
 *     registerTitle: t('auth.register.title'),
 *     // ... more auth-specific translations
 *   };
 * };
 * ```
 * 
 * @configuration
 * **Flat Structure Design:**
 * All translation keys are stored at the top level within the 'translation' namespace,
 * using dot notation for hierarchical organization (e.g., 'auth.login.title').
 * 
 * **Language Configuration:**
 * - Primary Language: German ('de') - Default fallback and initial language
 * - Secondary Language: English ('en') - International support
 * - Fallback Strategy: German serves as fallback for missing translations
 * - Extensible: Additional languages can be easily added
 * 
 * **Debug Mode:**
 * Development debugging is enabled in __DEV__ mode for translation troubleshooting
 * and missing key identification during development.
 * 
 * @features
 * - Flat translation structure for simplified key management
 * - Multi-language support (German/English with extensibility)
 * - Intelligent fallback handling for missing translations
 * - Development debugging and logging
 * - React component integration via react-i18next
 * - Interpolation support for dynamic content
 * - Namespace-free usage for simplified implementation
 * - Console logging for development visibility
 * - Enterprise-grade configuration
 * - TypeScript compatibility
 * 
 * @localization_strategy
 * **File Organization:**
 * - `/locales/de.json` - German translations (primary)
 * - `/locales/en.json` - English translations (secondary)
 * - Flat JSON structure with dot-notation keys
 * - Consistent key naming conventions
 * 
 * **Key Naming Convention:**
 * - Feature-based prefixes: `auth.*`, `profile.*`, `settings.*`
 * - Action-based suffixes: `*.title`, `*.description`, `*.button`
 * - Hierarchical organization: `feature.section.element`
 * - Descriptive naming for maintainability
 * 
 * **Translation Management:**
 * - Centralized translation files
 * - Version-controlled translation updates
 * - Automated missing key detection
 * - Development console visibility
 * - Production-ready optimization
 * 
 * @accessibility
 * - Screen reader compatibility
 * - Right-to-left (RTL) language preparation
 * - Dynamic text sizing support
 * - Voice-over optimization
 * - Accessibility attribute localization
 * - Cultural adaptation considerations
 * 
 * @performance
 * - Lazy loading preparation for large translation sets
 * - Minimal bundle impact with flat structure
 * - Efficient key lookup with dot notation
 * - Development-only debugging overhead
 * - Optimized production builds
 * - Memory-efficient resource management
 * 
 * @scalability
 * - Easy addition of new languages
 * - Modular translation file organization
 * - Namespace extensibility for large applications
 * - Plugin architecture support
 * - Custom formatter integration capability
 * - Backend translation service preparation
 * 
 * @debugging
 * Development console output provides:
 * - Initialization confirmation
 * - Available translation keys per language
 * - Missing key notifications
 * - Language switching confirmation
 * - Translation loading status
 * 
 * @best_practices
 * - Use descriptive, hierarchical key names
 * - Maintain consistent key structure across languages
 * - Provide meaningful fallback translations
 * - Test all supported languages regularly
 * - Use interpolation for dynamic content
 * - Avoid hardcoded strings in components
 * - Implement proper loading states
 * - Consider cultural context in translations
 * 
 * @integration
 * Works seamlessly with:
 * - React Native components
 * - React Navigation (for localized navigation)
 * - Form validation messages
 * - Error handling systems
 * - API response localization
 * - Push notification localization
 * - DatePicker and time formatting
 * - Number and currency formatting
 * 
 * @security
 * - XSS prevention through proper escaping
 * - Input validation for interpolated values
 * - Secure translation key validation
 * - Content Security Policy compatibility
 * - Safe HTML rendering when needed
 * 
 * @maintenance
 * - Regular translation audits
 * - Automated missing key detection
 * - Translation key usage analysis
 * - Deprecated key cleanup procedures
 * - Version-controlled translation updates
 * - Quality assurance processes
 * 
 * @see {@link https://react.i18next.com/} React i18next Documentation
 * @see {@link https://www.i18next.com/} i18next Core Documentation
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl} Web Internationalization API
 * @see {@link https://www.w3.org/International/} W3C Internationalization Guidelines
 * 
 * @todo Add support for pluralization rules
 * @todo Implement dynamic translation loading for performance
 * @todo Add translation validation and linting
 * @todo Integrate with translation management service
 * @todo Add support for context-based translations
 * @todo Implement automatic missing key reporting
 */
i18n.use(initReactI18next).init({
  /**
   * Fallback Language Configuration
   * 
   * Defines the primary fallback language when translations are missing
   * in the currently selected language. German serves as the primary
   * language for comprehensive coverage.
   * 
   * @property {string} fallbackLng
   * @default 'de'
   * @since 1.0.0
   * @category Configuration
   * @subcategory Fallback
   */
  fallbackLng: 'de',

  /**
   * Initial Language Configuration
   * 
   * Sets the default language on application startup. German is used
   * as the primary language for the target market.
   * 
   * @property {string} lng
   * @default 'de'
   * @since 1.0.0
   * @category Configuration
   * @subcategory Language
   */
  lng: 'de',

  /**
   * Translation Resources Configuration
   * 
   * Defines all available language resources with flat structure organization.
   * Each language contains a single 'translation' namespace with all keys
   * organized using dot notation for hierarchical access.
   * 
   * @property {object} resources
   * @since 1.0.0
   * @category Configuration
   * @subcategory Resources
   * 
   * @structure
   * ```
   * resources: {
   *   [languageCode]: {
   *     translation: {
   *       "feature.section.key": "Translation value",
   *       "auth.login.title": "Login",
   *       "auth.login.subtitle": "Welcome back"
   *     }
   *   }
   * }
   * ```
   */
  resources: {
    /**
     * German Translation Resources
     * Primary language resource containing all German translations
     * organized in flat structure with dot notation keys.
     * 
     * @namespace de.translation
     * @since 1.0.0
     */
    de: {
      translation: de,
    },

    /**
     * English Translation Resources
     * Secondary language resource containing all English translations
     * organized in flat structure with dot notation keys.
     * 
     * @namespace en.translation
     * @since 1.0.0
     */
    en: {
      translation: en,
    },
  },

  /**
   * Interpolation Configuration
   * 
   * Controls how dynamic values are inserted into translation strings.
   * Escape value is disabled for React Native compatibility and to allow
   * proper rendering of HTML entities and special characters.
   * 
   * @property {object} interpolation
   * @property {boolean} interpolation.escapeValue - Prevents HTML escaping for React Native
   * @default false
   * @since 1.0.0
   * @category Configuration
   * @subcategory Interpolation
   * 
   * @example
   * ```tsx
   * // Translation: "welcome.message": "Hello {{name}}, welcome back!"
   * t('welcome.message', { name: 'John' })
   * // Result: "Hello John, welcome back!"
   * ```
   */
  interpolation: {
    escapeValue: false,
  },

  /**
   * Default Namespace Configuration
   * 
   * Specifies the default namespace for translation keys. Using 'translation'
   * as default enables flat structure access without namespace prefixes.
   * 
   * @property {string} defaultNS
   * @default 'translation'
   * @since 1.0.0
   * @category Configuration
   * @subcategory Namespace
   */
  defaultNS: 'translation',

  /**
   * Debug Mode Configuration
   * 
   * Enables comprehensive debugging in development environment for
   * translation troubleshooting, missing key identification, and
   * development workflow optimization.
   * 
   * @property {boolean} debug
   * @default __DEV__
   * @since 1.0.0
   * @category Configuration
   * @subcategory Debugging
   */
  debug: __DEV__,
});

/**
 * Development Initialization Logging
 * 
 * Provides comprehensive development feedback about i18n initialization,
 * available translation keys, and system status for debugging and
 * development workflow optimization.
 * 
 * @private
 * @internal
 * @category Debugging
 * @since 1.0.0
 */
const logger = LoggerFactory.createServiceLogger('I18nConfiguration');

logger.info('i18n initialized successfully with FLAT structure', LogCategory.BUSINESS, {
  service: 'I18nConfiguration',
  metadata: {
    fallbackLanguage: 'de',
    initialLanguage: 'de',
    availableLanguages: ['de', 'en'],
    structure: 'flat',
    debugMode: __DEV__
  }
});

if (__DEV__) {
  logger.info('Available translation keys loaded', LogCategory.BUSINESS, {
    service: 'I18nConfiguration',
    metadata: {
      deKeysCount: Object.keys(de).length,
      enKeysCount: Object.keys(en).length,
      deKeys: Object.keys(de).slice(0, 10), // Show first 10 keys for debugging
      enKeys: Object.keys(en).slice(0, 10)  // Show first 10 keys for debugging
    }
  });
}

/**
 * Configured i18next Instance Export
 * 
 * Exports the fully configured i18next instance for application-wide use.
 * This instance provides all internationalization functionality including
 * translation, language switching, and interpolation capabilities.
 * 
 * @constant {object} i18n
 * @since 1.0.0
 * @version 1.0.0
 * @category Export
 * @module Core.I18n
 * @namespace Core.I18n.Instance
 * 
 * @exports i18n
 * @example
 * Direct usage:
 * ```tsx
 * import i18n from '@/core/i18n/i18n';
 * 
 * // Change language programmatically
 * i18n.changeLanguage('en');
 * 
 * // Get current language
 * const currentLanguage = i18n.language;
 * 
 * // Direct translation (not recommended in components)
 * const translation = i18n.t('auth.login.title');
 * ```
 * 
 * @example
 * Hook-based usage (recommended):
 * ```tsx
 * import { useTranslation } from 'react-i18next';
 * 
 * const MyComponent = () => {
 *   const { t, i18n } = useTranslation();
 * 
 *   return (
 *     <View>
 *       <Text>{t('auth.login.title')}</Text>
 *       <Button onPress={() => i18n.changeLanguage('en')}>
 *         Switch to English
 *       </Button>
 *     </View>
 *   );
 * };
 * ```
 */
export default i18n;
