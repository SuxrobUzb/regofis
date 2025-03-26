import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      uz: {
        translation: {
          welcome: 'Xush kelibsiz',
          description: 'Bu navbatni boshqarish tizimi',
        },
      },
      ru: {
        translation: {
          welcome: 'Добро пожаловать',
          description: 'Это система управления очередью',
        },
      },
      en: {
        translation: {
          welcome: 'Welcome',
          description: 'This is a queue management system',
        },
      },
    },
    lng: 'uz',
    fallbackLng: ['ru', 'en'],
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;