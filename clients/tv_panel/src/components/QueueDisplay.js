const axios = require('axios');
const audioPlayer = require('../utils/audioPlayer');
const i18n = require('../i18n');

class QueueDisplay {
  constructor() {
    this.queue = [];
    this.currentTicket = null;
    this.lastCalledTicket = null;
    this.tariff = null;
    this.init();
  }

  async init() {
    ipcRenderer.on('license-data', (event, license) => {
      this.tariff = license;
      this.updateUI();
    });
    this.fetchQueue();
    setInterval(() => this.fetchQueue(), 5000);
  }

  async fetchQueue() {
    if (!this.tariff || !this.tariff.tariffId) return;

    try {
      const response = await axios.get('http://localhost:3000/api/queue');
      this.queue = response.data.queue.slice(0, 10);
      const newCurrent = response.data.current;

      if (newCurrent && (!this.currentTicket || newCurrent.id !== this.currentTicket.id)) {
        this.currentTicket = newCurrent;
        audioPlayer.playTicketCall(this.currentTicket.number);
        this.lastCalledTicket = this.currentTicket.id;
      } else {
        this.currentTicket = newCurrent;
      }

      this.render();
    } catch (error) {
      console.error('Error fetching queue:', error);
    }
  }

  render() {
    const queueList = this.queue.map(ticket => `<li>${i18n.t('current', { number: ticket.number })}</li>`).join('');
    document.getElementById('queueDisplay').innerHTML = `
      <h1>${i18n.t('current', { number: this.currentTicket ? this.currentTicket.number : i18n.t('noTicket') })}</h1>
      <h2>${i18n.t('queue')}</h2>
      <ul>${queueList}</ul>
    `;
  }

  updateUI() {
    if (!this.tariff || !this.tariff.tariffId) {
      document.getElementById('queueDisplay').innerHTML = `<h1>${i18n.t('noLicense')}</h1>`;
    }
  }
}

new QueueDisplay();

module.exports = QueueDisplay;