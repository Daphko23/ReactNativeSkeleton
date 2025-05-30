export const getLocales = () => [
  {countryCode: 'US', languageTag: 'en-US', languageCode: 'en', isRTL: false},
  {countryCode: 'DE', languageTag: 'de-DE', languageCode: 'de', isRTL: false},
];

export const getNumberFormatSettings = () => ({
  decimalSeparator: '.',
  groupingSeparator: ',',
});

export const getCalendar = () => 'gregorian';
export const getCountry = () => 'US';
export const getCurrencies = () => ['USD'];
export const getTemperatureUnit = () => 'fahrenheit';
export const getTimeZone = () => 'America/New_York';
export const uses24HourClock = () => false;
export const usesMetricSystem = () => false;
export const findBestAvailableLanguage = () => ({
  languageTag: 'en-US',
  isRTL: false,
});
