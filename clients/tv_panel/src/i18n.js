const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const path = require('path');

i18next
  .use(Backend)
  .init({
    lng: 'uz',
    fallbackLng: ['ru', 'en'],
    backend: {
      loadPath: path.join(__dirname, 'locales/{{lng}}/translation.json'),
    },
    interpolation: {
      escapeValue: false,
    },
  });

module.exports = i18next;