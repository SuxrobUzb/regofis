const axios = require('axios');

class OfflineSync {
  constructor() {
    this.offlineTickets = JSON.parse(localStorage.getItem('offlineTickets') || '[]');
    this.syncInterval = setInterval(() => this.sync(), 60000); // Синхронизация каждую минуту
  }

  addOfflineTicket(ticket) {
    this.offlineTickets.push(ticket);
    localStorage.setItem('offlineTickets', JSON.stringify(this.offlineTickets));
  }

  async sync() {
    if (this.offlineTickets.length === 0) return;

    try {
      const response = await axios.post('http://localhost:3000/api/tickets/bulk', {
        tickets: this.offlineTickets,
      });
      if (response.status === 200) {
        this.offlineTickets = [];
        localStorage.setItem('offlineTickets', JSON.stringify([]));
        console.log('Offline tickets synced successfully');
      }
    } catch (error) {
      console.error('Error syncing offline tickets:', error);
    }
  }

  getNextOfflineNumber() {
    const lastNumber = this.offlineTickets.length > 0 
      ? Math.max(...this.offlineTickets.map(t => t.number))
      : 0;
    return lastNumber + 1;
  }
}

module.exports = new OfflineSync();