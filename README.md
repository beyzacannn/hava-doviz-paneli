# Hava Durumu ve Döviz Paneli API

Node.js ve Express ile yazılmış, hava durumu ve döviz kuru bilgisi sunan bir REST API. Dış API'lerden veri çeker, sonuçları önbellekte saklar ve hataları düzgün şekilde yönetir.

## Özellikler

- Şehre göre güncel hava durumu (OpenWeather API)
- İki para birimi arasında güncel döviz kuru (Frankfurter API)
- `node-cache` ile önbellekleme (hava durumu: 10 dk, döviz: 1 saat)
- Hata yönetimi: geçersiz şehir, geçersiz para birimi, eksik parametre, dış servis hatası
- API anahtarı `.env` dosyasında saklanır

## Kullanılan Teknolojiler

Node.js, Express, node-cache, dotenv, OpenWeather API, Frankfurter API

## Kurulum

```bash
git clone https://github.com/beyzacannn/hava-doviz-paneli.git
cd hava-doviz-paneli
npm install
```

Proje klasöründe `.env` dosyası oluştur ve `.env.example` içindeki değişkenleri doldur. OpenWeather API anahtarını openweathermap.org adresinden ücretsiz alabilirsin.

```bash
npm run dev
```

Sunucu `http://localhost:3000` adresinde çalışır. Node.js 18 veya üzeri gerekir.

## Endpoint'ler

### Hava durumu

`GET /api/weather?city=Istanbul`

```json
{
  "city": "Istanbul",
  "country": "TR",
  "temperature": 16,
  "feelsLike": 15,
  "humidity": 70,
  "description": "parçalı bulutlu",
  "windSpeed": 4,
  "fromCache": false
}
```

### Döviz kuru

`GET /api/currency?base=USD&target=TRY`

```json
{
  "base": "USD",
  "target": "TRY",
  "rate": 40.5,
  "date": "2026-10-20",
  "fromCache": false
}
```

### Hata cevapları

| Durum | Açıklama |
|-------|----------|
| 400 | Eksik veya hatalı parametre |
| 404 | Şehir veya para birimi bulunamadı |
| 502 | Dış servise ulaşılamadı |

## Proje Yapısı

```
src/
├── routes/      # Gelen istekleri karşılar
├── services/    # Dış API'lerle konuşur, önbellek yönetir
└── app.js       # Sunucu giriş noktası
```
