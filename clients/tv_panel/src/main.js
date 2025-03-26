const { app, BrowserWindow, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const axios = require('axios');

async function checkLicense() {
  const licenseKey = localStorage.getItem('licenseKey') || await promptLicenseKey();
  if (!licenseKey) {
    app.quit();
    return null;
  }

  try {
    const response = await axios.post('http://localhost:4000/api/licenses/verify', { key: licenseKey });
    if (!response.data.valid) {
      dialog.showErrorBox('Ошибка', 'Litsenziya noto‘g‘ri yoki muddati tugagan');
      app.quit();
      return null;
    }
    localStorage.setItem('licenseKey', licenseKey);
    return response.data;
  } catch (error) {
    dialog.showErrorBox('Ошибка', 'Litsenziyani tekshirib bo‘lmadi. Internet aloqasini tekshiring.');
    app.quit();
    return null;
  }
}

async function promptLicenseKey() {
  const { response, checkboxChecked } = await dialog.showMessageBox({
    type: 'question',
    title: 'Litsenziya kalitini kiriting',
    message: 'Iltimos, litsenziya kalitingizni kiriting:',
    buttons: ['OK', 'Bekor qilish'],
    input: true,
    inputPlaceholder: 'XXXX-XXXX-XXXX-XXXX',
  });
  if (response === 0 && checkboxChecked) return checkboxChecked;
  return null;
}

function createWindow(license) {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile('index.html');
  win.setFullScreen(true);

  win.webContents.on('did-finish-load', async () => {
    const orgResponse = await axios.get(`http://localhost:3000/api/organizations/${ORG_ID}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    win.webContents.send('license-data', license);
    win.webContents.send('org-data', orgResponse.data);
  });
}

app.whenReady().then(async () => {
  autoUpdater.checkForUpdatesAndNotify();

  const license = await checkLicense();
  if (license) {
    createWindow(license);
  }

  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      const license = await checkLicense();
      if (license) createWindow(license);
    }
  });
});

autoUpdater.on('update-available', () => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Yangilanish mavjud',
    message: 'Yangi versiya mavjud. Yuklab olinmoqda...',
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

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});