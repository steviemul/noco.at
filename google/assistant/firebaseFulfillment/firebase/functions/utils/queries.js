const fetch = require('node-fetch');

const API_LOCATION = 'https://coat-node-coat.appspot.com/api/lookup';

const DAYS = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday'
];

async function get(url) {
  const response = await fetch(url);

  const json = await response.json();

  return json;
}

async function locationQuery(lng, lat) {
  const url = `${API_LOCATION}?lon=${lng}&lat=${lat}`;

  return await get(url);
};

async function cityQuery(city) {
  const url = `${API_LOCATION}?city=${city}`;

  return await get(url);
};

module.exports = {
  cityQuery,
  locationQuery
};
