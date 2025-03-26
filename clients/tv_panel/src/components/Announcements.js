const axios = require('axios');
const i18n = require('../i18n');

class Announcements {
  constructor() {
    this.advertisements = [];
    this.currentIndex = 0;
    this.init();
  }

  async init() {
    await this.fetchAds();
    this.render();
    setInterval(() => this.nextAd(), 10000);
  }

  async fetchAds() {
    try {
      const response = await axios.get('http://localhost:3000/api/content');
      const content = response.data.find(item => item.key === 'advertisements');
      this.advertisements = content ? content.value : [];
    } catch (error) {
      console.error('Error fetching advertisements:', error);
    }
  }

  nextAd() {
    if (this.advertisements.length === 0) return;
    this.currentIndex = (this.currentIndex + 1) % this.advertisements.length;
    this.render();
  }

  render() {
    const ad = this.advertisements[this.currentIndex];
    document.getElementById('announcements').innerHTML = ad
      ? `<div>${ad.text}${ad.image ? `<img src="${ad.image}" style="max-width: 100%;"/>` : ''}</div>`
      : `<div>${i18n.t('noAds')}</div>`;
  }
}

new Announcements();

module.exports = Announcements;