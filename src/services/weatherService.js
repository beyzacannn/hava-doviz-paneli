const NodeCache = require('node-cache');

const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// stdTTL: verinin bellekte kalma süresi (saniye). 600 = 10 dakika
const cache = new NodeCache({ stdTTL: 600 });

async function getWeatherByCity(city) {
  const cacheKey = city.trim().toLowerCase();

  // 1. Önce önbelleğe bak
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    console.log(`Önbellekten döndü: ${cacheKey}`);
    return { ...cachedData, fromCache: true };
  }

  // 2. Önbellekte yoksa OpenWeather'a git
  console.log(`API'den çekiliyor: ${cacheKey}`);
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=tr`;

  const response = await fetch(url);

  if (response.status === 404) {
    const error = new Error('Şehir bulunamadı');
    error.status = 404;
    throw error;
  }

  if (!response.ok) {
    const error = new Error('Hava durumu servisine ulaşılamadı');
    error.status = 502;
    throw error;
  }

  const data = await response.json();

  const weather = {
    city: data.name,
    country: data.sys.country,
    temperature: data.main.temp,
    feelsLike: data.main.feels_like,
    humidity: data.main.humidity,
    description: data.weather[0].description,
    windSpeed: data.wind.speed,
  };

  // 3. Sonucu önbelleğe kaydet
  cache.set(cacheKey, weather);

  return { ...weather, fromCache: false };
}

module.exports = { getWeatherByCity };