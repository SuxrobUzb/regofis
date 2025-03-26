const { ipcRenderer } = require('electron');

ipcRenderer.on('notification', (event, data) => {
  const notification = document.createElement('div');
  notification.className = `notification ${data.type}`; // success yoki error
  notification.innerText = data.message;
  notification.style.position = 'fixed';
  notification.style.top = '10px';
  notification.style.right = '10px';
  notification.style.padding = '10px';
  notification.style.backgroundColor = data.type === 'success' ? '#4CAF50' : '#F44336';
  notification.style.color = '#fff';
  notification.style.borderRadius = '5px';
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000); // 3 sekunddan keyin yo‘qoladi
});

// Qolgan renderer logikasi (masalan, boshqa komponentlarni ishga tushirish)
const QueueManagement = require('./components/QueueManagement');
const CallNext = require('./components/CallNext');
const Statistics = require('./components/Statistics');

new QueueManagement();
new CallNext();
new Statistics();