/**
 * This is a list of weather codes that indicate rain.
 * 
 * sourced from https://openweathermap.org/weather-conditions
 */
const RAIN_CODES = {
  500: 'light rain',
  501: 'moderate rain',
  502: 'heavy intensity rain',
  503: 'very heavy rain',
  504: 'extreme rain',
  511: 'freezing rain',
  520: 'light intensity shower rain',
  521: 'shower rain',
  522: 'heavy intensity show rain',
  531: 'ragged shower rain'
};

const DRIZZLE_CODES = {
  300: 'light intensity drizzle',
  301: 'drizzle',
  302: 'heavy intensity drizzle',
  310: 'light intensity drizzle rain',
  311: 'drizzle rain',
  312: 'heavy intensity drizzle rain',
  313: 'shower rain and drizzle',
  314: 'heavy shower rain and drizzle',
  321: 'shower drizzle'
};

const SNOW_CODES = {
  600: 'light snow',
  601: 'snow',
  602: 'heavy snow',
  611: 'sleet',
  612: 'shower sleet',
  615: 'light rain and snow',
  616: 'rain and snow',
  620: 'light shower snow',
  621: 'shower snow',
  622: 'heavy shower snow'
};

const THUNDER_CODES = {
  200: 'thunderstorm with light rain',
  201: 'thunderstorm with rain',
  202: 'thunderstorm with heavy rain',
  210: 'light thunderstorm',
  211: 'thunderstorm',
  212: 'heavy thunderstorm',
  221: 'ragged thunderstorm',
  230: 'thunderstorm with light drizzle',
  231: 'thunderstorm with drizzle',
  232: 'thunderstorm with heavy drizzle'
};

module.exports = {
  RAIN_CODES,
  SNOW_CODES,
  THUNDER_CODES,
  DRIZZLE_CODES
}