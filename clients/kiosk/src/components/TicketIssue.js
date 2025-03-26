const { ipcRenderer } = require('electron');
const axios = require('axios');

class TicketIssue {
  constructor() {
    this.ticketNumber = 0;
    this.init();
  }

  async init() {
    document.getElementById('issueButton').addEventListener('click', () => this.issueTicket());
  }

  async issueTicket() {
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
    document.getElementById('currentTicket').innerText = `Текущий талон: ${this.ticketNumber}`;
  }

  handleOfflineMode() {
    // Логика для оффлайн-режима
    localStorage.setItem('offlineTicket', this.ticketNumber + 1);
    this.ticketNumber++;
    this.printTicket();
    this.updateDisplay();
  }
}

new TicketIssue();

module.exports = TicketIssue;