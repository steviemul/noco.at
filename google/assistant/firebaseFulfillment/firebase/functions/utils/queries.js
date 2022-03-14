const fetch = require('node-fetch');

const API_LOCATION = 'https://noco.at/api/lookup';
const CHUCK_API_LOCATION = 'https://noco.at/chuck';

const NOW = 'now';
const LATER = 'later';
const TOMORROW = 'tomorrow';

const DAYS = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday'
];

const getValidDays = () => {
  const today = new Date().getDay();

  VALID_DAYS = [];

  for (let i=0; i<5; i++) {
    const index = (today + i) < DAYS.length ? (today + i) : 0;

    VALID_DAYS.push(DAYS[index]);
  }

  console.info('Valid days', VALID_DAYS);

  return VALID_DAYS;
};

async function get(url) {
  const response = await fetch(url);

  const json = await response.json();

  return json;
}

async function chuckQuery() {
  return await get(CHUCK_API_LOCATION);
}

async function locationQuery(lng, lat) {
  const url = `${API_LOCATION}?lon=${lng}&lat=${lat}`;

  return await get(url);
};

async function cityQuery(city) {
  const url = `${API_LOCATION}?city=${city}`;

  return await get(url);
};

const transformResponse = (response, day) => {
  return {
    query: response.query,
    item: response.items.filter((item) => {
      const itemDay = new Date(item.data.dt * 1000).getDay();

      return (itemDay === day);
    })[0]
  };
};

async function query(city, coordinates, timeframe = NOW) {
  let tf;

  if (timeframe == undefined || timeframe === null || timeframe === '') {
    tf = NOW;
  } else {
    tf = timeframe.toLowerCase();
  }

  if (NOW === tf) {
    if (city) {
      return await cityQuery(city);
    } else {
      return await locationQuery(coordinates.longitude, coordinates.latitude);
    }
  }

  if (tf !== LATER && tf !== TOMORROW && !DAYS.includes(tf)) {
    throw new Error(`I don't know what you mean by ${tf}`);
  }

  let dayIndex = new Date().getDay();

  if (tf === TOMORROW) {
    dayIndex++;
  } else if (tf !== LATER) {
    dayIndex = DAYS.indexOf(tf);
  }

  const DAY = DAYS[dayIndex];

  console.info(`Day to query is ${DAY}`);

  if (!getValidDays().includes(DAY)) {
    throw new Error(`I can't see that far ahead in the future`);
  }

  const url = city ? `${API_LOCATION}?city=${city}&type=forecast`
    : `${API_LOCATION}?lon=${coordinates.longitude}&lat=${coordinates.latitude}&type=forecast`;

  console.info('Fetching', url);

  const response = await get(url);

  return transformResponse(response, dayIndex);
};

module.exports = {
  chuckQuery,
  query,
  cityQuery,
  locationQuery
};
