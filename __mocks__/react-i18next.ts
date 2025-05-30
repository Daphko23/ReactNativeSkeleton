export const useTranslation = () => ({
  t: (key: string) => key,
  i18n: {
    changeLanguage: jest.fn(),
  },
});

export const initReactI18next = {
  type: '3rdParty',
  init: jest.fn(),
};
