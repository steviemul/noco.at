const codes = require('./codes');
const fetch = require('node-fetch');
const HttpsProxyAgent = require('https-proxy-agent');

// URL to get the current weather
const CURRENT_API_PATH = 'https://api.openweathermap.org/data/2.5/weather';

// URL to return a 5 day forecast
const FORECAST_API_PATH = 'https://api.openweathermap.org/data/2.5/forecast';

const APP_ID = '9d0220a01b6485088d44d4f72071819a';

// The ratio to convert meters/sec to miles/hour
const SPEED_CONVERSION = 2.23694;

// Returns true if the weather condition is any of those that indicate rain.
const isRaining = (weather) => {
  let raining = 0;

  for (const condition of weather) {
    for (const code of [codes.RAIN_CODES, codes.DRIZZLE_CODES, codes.SNOW_CODES, codes.THUNDER_CODES]) {
      if (code[condition.id]) {
        raining = 1; ``;
      }
    }
  }

  return raining;
};

const transformItem = (item, tolerance) => {
  return {
    temperature: parseInt(item.main.temp),
    windspeed: parseInt(item.wind.speed * SPEED_CONVERSION),
    rain: isRaining(item.weather),
    weather: item.weather,
    humidity: item.main.humidity,
    tolerance,
    dt: item.dt
  };
};

/**
 * Returns the weather condition for the passed in longitude and latitude.
 *
 * @param {*} req  the express request option
 * @return {*} result this will contain the reponse from the weather api
 */
async function lookup(req) {
  const lon = req.query.lon;
  const lat = req.query.lat;
  const type = req.query.type || 'current';
  const city = req.query.city;
  const tolerance = req.query.n || 2;

  const apiPath = (type === 'current' ? CURRENT_API_PATH : FORECAST_API_PATH);

  const weatherUrl = city ?
    `${apiPath}?appId=${APP_ID}&q=${city}&units=metric` :
    `${apiPath}?appId=${APP_ID}&lat=${lat}&lon=${lon}&units=metric`;

  const options = {};

  if (process.env.HTTP_PROXY) {
    options.agent = new HttpsProxyAgent(process.env.HTTP_PROXY);
  }

  const weatherResponse = await fetch(weatherUrl, options);
  const json = await weatherResponse.json();

  const result = (type === 'current') ?
    {
      'item': transformItem(json, tolerance)
    } :
    {
      'items': json.list.map((item) => transformItem(item, tolerance))
    };

  const query = {
    lon,
    lat,
    city: json.city ? json.city.name : json.name
  };

  return {
    result,
    query
  };
}

module.exports = lookup;
