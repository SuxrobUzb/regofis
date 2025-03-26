const { app, BrowserWindow, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const axios = require('axios');
const setupPrinter = require('./utils/printer');

const ORG_ID = '1'; // Tashkilot IDsi
const APP_TYPE = 'kiosk';
const CURRENT_VERSION = '1.0.0'; // Bu package.json dan olinishi mumkin

async function checkLicense() {
  const licenseKey = localStorage.getItem('licenseKey') || await promptLicenseKey();
  if (!licenseKey) {
    app.quit();
    return null;
  }

  try {
    const response = await axios.post('http://localhost:4000/api/licenses/verify', { key: licenseKey, orgId: ORG_ID });
    if (!response.data.valid) {
      dialog.showErrorBox('Xato', 'Litsenziya noto‘g‘ri yoki muddati tugagan');
      app.quit();
      return null;
    }
    localStorage.setItem('licenseKey', licenseKey);
    return response.data;
  } catch (error) {
    dialog.showErrorBox('Xato', 'Litsenziyani tekshirib bo‘lmadi. Internet aloqasini tekshiring.');
    app.quit();
    return null;
  }
}

function createWindow(license) {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile('index.html');
  win.setFullScreen(true);
  setupPrinter(win);

  win.webContents.on('did-finish-load', async () => {
    const orgResponse = await axios.get(`http://localhost:3000/api/organizations/${ORG_ID}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    win.webContents.send('license-data', license);
    win.webContents.send('org-data', orgResponse.data);
  });
}

app.whenReady().then(async () => {
  autoUpdater.setFeedURL({
    provider: 'generic',
    url: `http://localhost:3000/api/updates/check?orgId=${ORG_ID}&appType=${APP_TYPE}&currentVersion=${CURRENT_VERSION}`,
  });
  autoUpdater.checkForUpdates();

  const license = await checkLicense();
  if (license) {
    createWindow(license);
  }
});

autoUpdater.on('update-available', (info) => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Yangilanish mavjud',
    message: `Yangi versiya (${info.version}) mavjud. Yuklab olinmoqda...`,
  });
});

autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Yangilanish tayyor',
    message: 'Yangi versiya yuklab olindi. Dastur qayta ishga tushiriladi.',
    buttons: ['Qayta ishga tushirish'],
  }).then(() => {
    autoUpdater.quitAndInstall();
  });
});

autoUpdater.on('error', (error) => {
  dialog.showErrorBox('Yangilanish xatosi', `Yangilanishda xato: ${error.message}`);
});