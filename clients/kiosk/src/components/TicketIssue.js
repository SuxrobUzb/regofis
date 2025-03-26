const { ipcRenderer } = require('electron');
const axios = require('axios');
const offlineSync = require('../utils/offlineSync');
const i18n = require('../i18n');

class TicketIssue {
  constructor() {
    this.ticketNumber = 0;
    this.tariff = null;
    this.orgStyles = null;
    this.loading = false;
    this.init();
  }

  async init() {
    ipcRenderer.on('license-data', (event, license) => {
      this.tariff = license;
      this.updateUI();
    });
    ipcRenderer.on('org-data', (event, org) => {
      this.orgStyles = org.styles;
      this.applyStyles();
    });
    document.getElementById('issueButton').addEventListener('click', () => this.issueTicket());
    this.render();
  }

  applyStyles() {
    if (this.orgStyles) {
      document.body.style.backgroundColor = this.orgStyles.backgroundColor || '#f0f0f0';
      document.getElementById('issueButton').style.backgroundColor = this.orgStyles.buttonColor || '#4CAF50';
    }
  }

  async issueTicket() {
    if (this.loading) return;
    this.loading = true;
    this.render();

    try {
      const token = localStorage.getItem('token');
      const orgId = ipcRenderer.sendSync('get-org-id'); // Main.js’dan olish uchun
      const response = await axios.post(
        'http://localhost:3000/api/tickets/issue',
        { timestamp: new Date().toISOString(), orgId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      this.ticketNumber = response.data.ticketNumber;
      offlineSync.storeTicket(this.ticketNumber);
    } catch (error) {
      console.error('Talon berishda xato:', error);
      offlineSync.storePending({ type: 'issue', timestamp: new Date().toISOString() });
    } finally {
      this.loading = false;
      this.render();
    }
  }

  render() {
    document.getElementById('app').innerHTML = `
      <div>
        <h1>${i18n.t('issueTicket')}</h1>
        ${this.loading ? '<div class="spinner">Yuklanmoqda...</div>' : `
          <button id="issueButton">${i18n.t('getTicket')}</button>
          ${this.ticketNumber ? `<p>${i18n.t('yourTicket')}: ${this.ticketNumber}</p>` : ''}
        `}
      </div>
    `;
    this.applyStyles();
    if (!this.loading) {
      document.getElementById('issueButton').addEventListener('click', () => this.issueTicket());
    }
  }
}

module.exports = TicketIssue;