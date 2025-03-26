const axios = require('axios');
const i18n = require('../i18n');

class QueueManagement {
  constructor() {
    this.queue = [];
    this.currentTicket = null;
    this.operatorId = localStorage.getItem('operatorId');
    this.tariff = null;
    this.init();
  }

  async init() {
    ipcRenderer.on('license-data', (event, license) => {
      this.tariff = license;
      this.updateUI();
    });
    ipcRenderer.on('notification', (event, message) => {
      this.handleNotification(message);
    });
    this.fetchQueue();
    document.getElementById('callNextButton').addEventListener('click', () => this.callNext());
    setInterval(() => this.fetchQueue(), 5000);
    this.renderButton();
  }

  async fetchQueue() {
    if (!this.tariff || !this.tariff.tariffId) return;

    try {
      const response = await axios.get('http://localhost:3000/api/queue', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      this.queue = response.data.queue.filter(ticket => ticket.status === 'waiting');
      this.currentTicket = response.data.current;
      this.render();
    } catch (error) {
      console.error('Error fetching queue:', error);
    }
  }

  async callNext() {
    if (!this.tariff || !this.tariff.tariffId) return;

    try {
      const response = await axios.post(
        'http://localhost:3000/api/queue/call',
        { operatorId: this.operatorId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      this.currentTicket = response.data.ticket;
      this.fetchQueue();
    } catch (error) {
      console.error('Error calling next ticket:', error);
    }
  }

  render() {
    const queueList = this.queue.map(ticket => `<li>${i18n.t('current', { number: ticket.number })}</li>`).join('');
    document.getElementById('queueDisplay').innerHTML = `
      <h1>${i18n.t('current', { number: this.currentTicket ? this.currentTicket.number : i18n.t('noTicket') })}</h1>
      <h2>${i18n.t('queue')}</h2>
      <ul>${queueList}</ul>
    `;
    document.getElementById('callNextButton').disabled = this.queue.length === 0 || !this.tariff;
  }

  renderButton() {
    document.getElementById('callNextButton').innerText = i18n.t('callNext');
  }

  updateUI() {
    if (!this.tariff || !this.tariff.tariffId) {
      document.getElementById('queueDisplay').innerHTML = `<h1>${i18n.t('noLicense')}</h1>`;
      document.getElementById('callNextButton').disabled = true;
    }
  }

  handleNotification(message) {
    if (message.type === 'new_ticket') {
      alert(`Yangi chiqish qo'shildi: ${message.ticket}`);
      this.fetchQueue();
    } else if (message.type === 'ticket_called' && message.operatorId !== this.operatorId) {
      alert(`Chiqish ${message.ticket} boshqa operator tomonidan chaqirildi`);
      this.fetchQueue();
    }
  }
}

new QueueManagement();

module.exports = QueueManagement;