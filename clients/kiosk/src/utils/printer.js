const { ipcMain } = require('electron');

module.exports = function setupPrinter(win) {
  ipcMain.on('print-ticket', (event, ticket) => {
    const printWindow = new BrowserWindow({ show: false });
    printWindow.loadURL(`data:text/html,<h1>Талон №${ticket.number}</h1><p>Время: ${ticket.time}</p>`);
    printWindow.webContents.on('did-finish-load', () => {
      printWindow.webContents.print({ silent: true }, () => {
        printWindow.close();
      });
    });
  });
};