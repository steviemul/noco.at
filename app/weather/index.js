const codes = require('./codes');
const fetch = require('node-fetch');
const CURRENT_API_PATH = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_API_PATH = 'https://api.openweathermap.org/data/2.5/forecast';

const APP_ID = '9d0220a01b6485088d44d4f72071819a';

const isRaining = (weather) => {
  let raining = 0;

  for (const condition of weather) {
    for (const code of [codes.RAIN_CODES, codes.DRIZZLE_CODES, codes.SNOW_CODES, codes.THUNDER_CODES]) {
      if (code[condition.id]) {
        raining = 1;``
      }
    }
  }

  return raining;
};

async function lookup(lon, lat, type = 'current') {

  const apiPath = (type === 'current' ? CURRENT_API_PATH : FORECAST_API_PATH);

  const weatherUrl = `${apiPath}?appId=${APP_ID}&lat=${lat}&lon=${lon}&units=metric`;

  const response = await fetch(weatherUrl);
  const json = await response.json();

  return {
    'temperature': json.main.temp,
    'windspeed': json.wind.speed,
    'rain': isRaining(json.weather),
    'weather': json.weather,
    'humidity': json.main.humidity
  }
}

module.exports = lookup;