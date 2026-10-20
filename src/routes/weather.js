const express = require('express');
const { getWeatherByCity } = require('../services/weatherService');

const router = express.Router();

router.get('/', async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({
      error: 'city parametresi gerekli. Örnek: /api/weather?city=Istanbul',
    });
  }

  try {
    const weather = await getWeatherByCity(city);
    res.json(weather);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

module.exports = router;