const { app, BrowserWindow, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const axios = require('axios');
const setupPrinter = require('./utils/printer');
const WebSocket = require('ws');

const ORG_ID = '1'; // Tashkilot IDsi
const APP_TYPE = 'operator';
const CURRENT_VERSION = '1.0.0';

async function authenticate() {
  const { response, value } = await dialog.showMessageBox({
    type: 'question',
    title: 'Autentifikatsiya',
    message: 'Login va parolni kiriting:',
    buttons: ['OK', 'Bekor qilish'],
    inputs: [
      { type: 'text', placeholder: 'Login' },
      { type: 'password', placeholder: 'Parol' },
    ],
  });

  if (response === 0) {
    const [username, password] = value;
    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      return res.data.token;
    } catch (error) {
      dialog.showErrorBox('Xato', 'Login yoki parol xato');
      app.quit();
      return null;
    }
  }
  app.quit();
  return null;
}
async function checkLicense(token) {
  const licenseKey = localStorage.getItem('licenseKey') || await promptLicenseKey();
  if (!licenseKey) {
    app.quit();
    return null;
  }

  try {
    const response = await axios.post(
      'http://localhost:4000/api/licenses/verify',
      { key: licenseKey, orgId: ORG_ID },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!response.data.valid) {
      dialog.showErrorBox('Xato', 'Litsenziya noto‘g‘ri yoki muddati tugagan');
      app.quit();
      return null;
    }
    localStorage.setItem('licenseKey', licenseKey);
    return response.data;
  } catch (error) {
    dialog.showErrorBox('Xato', 'Litsenziyani tekshirib bo‘lmadi.');
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

function createWindow(license, token) {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile('index.html');
  setupPrinter(win);

  win.webContents.on('did-finish-load', async () => {
    const orgResponse = await axios.get(`http://localhost:3000/api/organizations/${ORG_ID}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    win.webContents.send('license-data', license);
    win.webContents.send('org-data', orgResponse.data);
  });

  const ws = new WebSocket('ws://localhost:3000', { headers: { Authorization: `Bearer ${token}` } });
  ws.on('message', (data) => {
    win.webContents.send('notification', JSON.parse(data));
  });
}

app.whenReady().then(async () => {
  ipcMain.on('get-org-id', (event) => {
    event.returnValue = ORG_ID;
  });
  ipcMain.on('get-user-id', (event) => {
    const token = localStorage.getItem('token');
    const decoded = jwt.decode(token);
    event.returnValue = decoded.id;
  });
  ipcMain.on('notify', (event, data) => {
    const win = BrowserWindow.getFocusedWindow();
    win.webContents.send('notification', data);
  });
  autoUpdater.checkForUpdates();

  const token = await authenticate();
  if (token) {
    const license = await checkLicense(token);
    if (license) createWindow(license, token);
  }
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