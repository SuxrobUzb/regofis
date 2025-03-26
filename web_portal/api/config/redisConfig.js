const redis = require('redis');

const client = redis.createClient({
  url: 'redis://localhost:6379', // Standart Redis porti
});

client.on('error', (err) => console.error('Redis xatosi:', err));

(async () => {
  await client.connect();
  console.log('Redis ulandi');
})();

module.exports = client;