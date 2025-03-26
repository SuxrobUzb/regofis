const { ipcRenderer } = require('electron');
const axios = require('axios');
const offlineSync = require('../utils/offlineSync');
const i18n = require('../i18n');

class TicketIssue {
  constructor() {
    this.ticketNumber = 0;
    this.tariff = null;
    this.orgStyles = null;
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
    if (!this.tariff || !this.tariff.tariffId) {
      document.getElementById('currentTicket').innerText = i18n.t('noLicense');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/tickets/issue', {
        timestamp: new Date().toISOString(),
      });
      this.ticketNumber = response.data.ticketNumber;
      this.printTicket();
      this.updateDisplay();
    } catch (error) {
      console.error('Error issuing ticket:', error);
      this.handleOfflineMode();
    }
  }

  printTicket() {
    ipcRenderer.send('print-ticket', {
      number: this.ticketNumber,
      time: new Date().toLocaleTimeString(),
    });
  }

  updateDisplay() {
    document.getElementById('currentTicket').innerText = i18n.t('currentTicket', { number: this.ticketNumber });
  }

  handleOfflineMode() {
    this.ticketNumber = offlineSync.getNextOfflineNumber();
    const ticket = {
      number: this.ticketNumber,
      timestamp: new Date().toISOString(),
    };
    offlineSync.addOfflineTicket(ticket);
    this.printTicket();
    this.updateDisplay();
  }

  render() {
    document.querySelector('h1').innerText = i18n.t('title');
    document.getElementById('issueButton').innerText = i18n.t('issueButton');
    this.updateUI();
  }

  updateUI() {
    if (!this.tariff || !this.tariff.tariffId) {
      document.getElementById('issueButton').disabled = true;
      document.getElementById('currentTicket').innerText = i18n.t('noLicense');
    }
  }
}

new TicketIssue();

module.exports = TicketIssue;