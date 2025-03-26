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
            userManagement: 'Foydalanuvchilarni boshqarish',
            tariffManagement: 'Tariflarni boshqarish',
            licenseManagement: 'Litsenziyalarni boshqarish',
            statistics: 'Statistika',
            contentManagement: 'Kontentni boshqarish',
            adminLogs: 'Admin loglari',
            backupManagement: 'Rezerv nusxalarni boshqarish',
            createBackup: 'Rezerv nusxa yaratish',
            availableBackups: 'Mavjud rezerv nusxalar',
            selectBackup: 'Rezerv nusxa tanlash',
            restoreBackup: 'Rezerv nusxadan tiklash',
            updateManagement: 'Yangilanishlarni boshqarish',
            uploadUpdate: 'Yangilanishni yuklash',
            audioManagement: 'Ovozli sozlamalarni boshqarish',
            uploadAudio: 'Ovoz yuklash',
            currentAudio: 'Joriy ovozlar',
            createUser: 'Foydalanuvchi yaratish',
        },
      },
      ru: {
        translation: {
            userManagement: 'Управление пользователями',
            tariffManagement: 'Управление тарифами',
            licenseManagement: 'Управление лицензиями',
            statistics: 'Статистика',
            contentManagement: 'Управление контентом',
            adminLogs: 'Логи администратора',
            backupManagement: 'Управление резервными копиями',
            createBackup: 'Создать резервную копию',
            availableBackups: 'Доступные резервные копии',
            selectBackup: 'Выбрать резервную копию',
            restoreBackup: 'Восстановить из резервной копии',
            updateManagement: 'Управление обновлениями',
            uploadUpdate: 'Загрузить обновление',
            audioManagement: 'Управление звуковыми настройками',
            uploadAudio: 'Загрузить звук',
            currentAudio: 'Текущие звуки',
            createUser: 'Создать пользователя',
        },
      },
      en: {
        translation: {
            userManagement: 'User Management',
            tariffManagement: 'Tariff Management',
            licenseManagement: 'License Management',
            statistics: 'Statistics',
            contentManagement: 'Content Management',
            adminLogs: 'Admin Logs',
            backupManagement: 'Backup Management',
            createBackup: 'Create Backup',
            availableBackups: 'Available Backups',
            selectBackup: 'Select Backup',
            restoreBackup: 'Restore Backup',
            updateManagement: 'Update Management',
            uploadUpdate: 'Upload Update',
            audioManagement: 'Audio Settings Management',
            uploadAudio: 'Upload Audio',
            currentAudio: 'Current Audio',
            createUser: 'Create User',
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