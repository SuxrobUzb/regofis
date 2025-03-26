const { Howl } = require('howler');
const axios = require('axios');

const ORG_ID = '1'; // Tashkilot IDsi

class AudioPlayer {
  constructor() {
    this.sounds = {};
    this.loadSounds();
  }

  async loadSounds() {
    try {
      const response = await axios.get(`http://localhost:3000/api/audio/${ORG_ID}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      response.data.forEach(s => {
        this.sounds[s.key] = new Howl({ src: [s.url] });
      });
    } catch (error) {
      console.error('Ovoz fayllarini yuklashda xato:', error);
      this.sounds['ticket-call'] = new Howl({ src: ['../assets/ticket-call.mp3'] }); // Default
    }
  }

  playTicketCall(ticketNumber) {
    if (this.sounds['ticket-call']) {
      this.sounds['ticket-call'].play();
    }
  }
}

module.exports = new AudioPlayer();