/**
 * @fileoverview I18N-INDEX: Enterprise Internationalization System Exports
 * @description Central export point for the comprehensive internationalization system providing i18n configuration, custom hooks, and localization utilities
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Core.I18n
 * @namespace Core.I18n
 * @category Internationalization
 * @subcategory SystemExports
 */

/**
 * Core i18n Configuration Export
 * 
 * Main internationalization configuration instance providing react-i18next
 * setup with flat structure, multi-language support, and enterprise-grade
 * localization management for German and English languages.
 * 
 * @exports default - Configured i18n instance
 * @see {@link ./i18n} for detailed i18n configuration documentation
 * 
 * @example
 * ```tsx
 * import i18n from '@/core/i18n';
 * 
 * // Programmatic language switching
 * const switchToGerman = () => {
 *   i18n.changeLanguage('de');
 * };
 * 
 * const switchToEnglish = () => {
 *   i18n.changeLanguage('en');
 * };
 * 
 * // Get current language
 * const currentLanguage = i18n.language;
 * ```
 */
export { default } from './i18n';

/**
 * Custom i18n Hooks Exports
 * 
 * Collection of custom React hooks providing enhanced internationalization
 * functionality, type-safe translation access, and specialized localization
 * utilities for enterprise application development.
 * 
 * @exports * - All custom i18n hooks
 * @see {@link ./hooks} for detailed hooks documentation
 * 
 * @example
 * ```tsx
 * import { useTranslation, useLanguageSwitch } from '@/core/i18n';
 * 
 * const MyComponent = () => {
 *   const { t } = useTranslation();
 *   const { currentLanguage, switchLanguage } = useLanguageSwitch();
 * 
 *   return (
 *     <View>
 *       <Text>{t('welcome.title')}</Text>
 *       <Button 
 *         title={`Switch to ${currentLanguage === 'de' ? 'English' : 'Deutsch'}`}
 *         onPress={() => switchLanguage(currentLanguage === 'de' ? 'en' : 'de')}
 *       />
 *     </View>
 *   );
 * };
 * ```
 */
export * from './hooks'; 