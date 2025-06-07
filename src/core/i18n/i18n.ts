import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import de from './locales/de.json';
import en from './locales/en.json';

i18n.use(initReactI18next).init({
  fallbackLng: 'de',
  lng: 'de',
  resources: {
    de: {
      translation: de,
    },
    en: {
      translation: en,
    },
  },
  interpolation: {
    escapeValue: false,
  },
  defaultNS: 'translation',
  debug: __DEV__,
});

console.log('🔧 i18n initialized successfully with FLAT structure');
console.log('🔧 Available DE keys:', Object.keys(de));
console.log('🔧 Available EN keys:', Object.keys(en));

export default i18n;
