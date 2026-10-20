require('dotenv').config();
const express = require('express');
const logger = require('./middleware/logger');
const noteRoutes = require('./routes/notes');

const app = express();

app.use(express.json());
app.use(logger);
app.use('/api/notes', noteRoutes);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({ message: 'Hava durumu ve döviz paneli API çalışıyor' });
});

const weatherRoutes = require('./routes/weather');
const currencyRoutes = require('./routes/currency');
app.use('/api/weather', weatherRoutes);
app.use('/api/currency', currencyRoutes);

app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});