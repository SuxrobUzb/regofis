const { ipcRenderer } = require('electron');
const axios = require('axios');
const i18n = require('../i18n');

class Statistics {
  constructor() {
    this.stats = {
      calledTickets: 0,
      avgWaitTime: 0,
      totalTime: 0
    };
    this.init();
  }

  async init() {
    ipcRenderer.on('license-data', (event, license) => {
      this.tariff = license;
      this.fetchStats();
    });
    ipcRenderer.on('org-data', (event, org) => {
      this.orgStyles = org.styles;
      this.applyStyles();
    });
    this.render();
  }

  applyStyles() {
    if (this.orgStyles) {
      document.body.style.backgroundColor = this.orgStyles.backgroundColor || '#f0f0f0';
      document.querySelector('.stats-container').style.color = this.orgStyles.textColor || '#333';
    }
  }

  async fetchStats() {
    try {
      const token = localStorage.getItem('token');
      const operatorId = ipcRenderer.sendSync('get-user-id'); // Main.js’dan olish uchun
      const response = await axios.get(
        `http://localhost:3000/api/statistics/operator/${operatorId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      this.stats = {
        calledTickets: response.data.calledTickets,
        avgWaitTime: response.data.avgWaitTime, // sekundlarda
        totalTime: response.data.totalTime // minutlarda
      };
      this.render();
    } catch (error) {
      console.error('Statistikani olishda xato:', error);
    }
  }

  render() {
    document.getElementById('app').innerHTML = `
      <div class="stats-container">
        <h1>${i18n.t('operatorStats')}</h1>
        <p>${i18n.t('calledTickets')}: ${this.stats.calledTickets}</p>
        <p>${i18n.t('avgWaitTime')}: ${Math.round(this.stats.avgWaitTime)} ${i18n.t('seconds')}</p>
        <p>${i18n.t('totalTime')}: ${Math.round(this.stats.totalTime)} ${i18n.t('minutes')}</p>
        <button id="refreshStats">${i18n.t('refresh')}</button>
      </div>
    `;
    this.applyStyles();
    document.getElementById('refreshStats').addEventListener('click', () => this.fetchStats());
  }
}

module.exports = Statistics;