const codes = require('./codes');
const fetch = require('node-fetch');
const HttpsProxyAgent = require('https-proxy-agent');

const CURRENT_API_PATH = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_API_PATH = 'https://api.openweathermap.org/data/2.5/forecast';

const APP_ID = '9d0220a01b6485088d44d4f72071819a';
const SPEED_CONVERSION = 2.23694;

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

const transformItem = (item) => {
  
  return {
    'temperature': parseInt(item.main.temp),
    'windspeed': parseInt(item.wind.speed * SPEED_CONVERSION),
    'rain': isRaining(item.weather),
    'weather': item.weather,
    'humidity': item.main.humidity,
    'dt': item.dt
  };
};

async function lookup(lon, lat, type = 'current') {

  const apiPath = (type === 'current' ? CURRENT_API_PATH : FORECAST_API_PATH);

  const weatherUrl = `${apiPath}?appId=${APP_ID}&lat=${lat}&lon=${lon}&units=metric`;

  const options = {};

  if (process.env.HTTP_PROXY) {
    options.agent = new HttpsProxyAgent(process.env.HTTP_PROXY);
  }

  const weatherResponse = await fetch(weatherUrl, options);
  const json = await weatherResponse.json();

  const result = (type === 'current') ? 
    {
      'item': transformItem(json)
    } : 
    {
      'items': json.list.map(item => transformItem(item))
    }
    ;
    
  const query = {
    lon,
    lat,
    city: json.city ? json.city.name : json.name
  };

  return {
    result,
    query
  }
}

module.exports = lookup;