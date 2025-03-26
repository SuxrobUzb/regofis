const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const licenseRoutes = require('./routes/licenseRoutes');
const dbConfig = require('./config/dbConfig');

const app = express();
const port = 4000;

const pool = new Pool(dbConfig);

app.use(bodyParser.json());

// Маршруты
app.use('/api/licenses', licenseRoutes);

// Запуск сервера
app.listen(port, () => {
  console.log(`License service running on port ${port}`);
});

module.exports = app;