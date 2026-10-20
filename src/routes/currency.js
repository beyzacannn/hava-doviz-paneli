const express = require('express');
const { getExchangeRate } = require('../services/currencyService');

const router = express.Router();

router.get('/', async (req, res) => {
  const { base, target } = req.query;

  if (!base || !target) {
    return res.status(400).json({
      error: 'base ve target parametreleri gerekli. Örnek: /api/currency?base=USD&target=TRY',
    });
  }

  try {
    const rate = await getExchangeRate(base, target);
    res.json(rate);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

module.exports = router;