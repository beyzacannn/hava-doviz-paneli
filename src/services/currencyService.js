const NodeCache = require('node-cache');

const BASE_URL = 'https://api.frankfurter.dev/v1/latest';

// Kurlar günde bir kez güncellendiği için 1 saat (3600 sn) saklıyoruz
const cache = new NodeCache({ stdTTL: 3600 });

async function getExchangeRate(base, target) {
  const from = base.trim().toUpperCase();
  const to = target.trim().toUpperCase();

  // Para birimi kodları 3 harf olmalı (USD, TRY, EUR gibi)
  const isValidCode = (code) => /^[A-Z]{3}$/.test(code);
  if (!isValidCode(from) || !isValidCode(to)) {
    const error = new Error('Para birimi kodu 3 harfli olmalı. Örnek: USD, TRY, EUR');
    error.status = 400;
    throw error;
  }

  const cacheKey = `${from}-${to}`;

  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    console.log(`Önbellekten döndü: ${cacheKey}`);
    return { ...cachedData, fromCache: true };
  }

  console.log(`API'den çekiliyor: ${cacheKey}`);
  const url = `${BASE_URL}?base=${from}&symbols=${to}`;
  const response = await fetch(url);

  if (response.status === 404 || response.status === 422) {
    const error = new Error('Geçersiz veya desteklenmeyen para birimi');
    error.status = 404;
    throw error;
  }

  if (!response.ok) {
    const error = new Error('Döviz servisine ulaşılamadı');
    error.status = 502;
    throw error;
  }

  const data = await response.json();

  const result = {
    base: data.base,
    target: to,
    rate: data.rates[to],
    date: data.date,
  };

  cache.set(cacheKey, result);

  return { ...result, fromCache: false };
}

module.exports = { getExchangeRate };