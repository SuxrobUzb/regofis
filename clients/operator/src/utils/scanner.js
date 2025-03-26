const Quagga = require('quagga'); // QR va barcode skaner
const { ipcRenderer } = require('electron');

class Scanner {
  constructor() {
    this.init();
  }

  init() {
    Quagga.init({
      inputStream: {
        name: 'Live',
        type: 'LiveStream',
        target: document.querySelector('#scanner-container'),
        constraints: {
          width: 640,
          height: 480,
          facingMode: 'environment' // Orqa kamera
        }
      },
      decoder: {
        readers: ['code_128_reader', 'qr_reader'] // QR va barcode
      }
    }, (err) => {
      if (err) {
        console.error('Scanner xatosi:', err);
        return;
      }
      Quagga.start();
    });

    Quagga.onDetected((data) => {
      this.handleScan(data.codeResult.code);
    });
  }

  async handleScan(code) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:3000/api/tickets/verify',
        { ticketCode: code },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.valid) {
        ipcRenderer.send('notify', { type: 'success', message: `Talon tasdiqlandi: ${code}` });
      } else {
        ipcRenderer.send('notify', { type: 'error', message: 'Yaroqsiz talon' });
      }
    } catch (error) {
      console.error('Talon tasdiqlashda xato:', error);
      ipcRenderer.send('notify', { type: 'error', message: 'Xato yuz berdi' });
    }
  }

  stop() {
    Quagga.stop();
  }
}

module.exports = Scanner;