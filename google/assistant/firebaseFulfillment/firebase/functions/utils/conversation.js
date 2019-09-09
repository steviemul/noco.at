const {getName, setName} = require('./session');

const getCity = (conv) => {
  return conv.data.city;
};

const setCity = (conv, city) => {
  conv.data.city = city;
};

const getCoordinates = (conv) => {
  return conv.data.coordinates;
};

const setCoordinates = (conv, coordinates) => {
  conv.data.coordinates = coordinates;
};

const getTimeframe = (conv) => {
  return conv.data.timeframe;
};

const setTimeframe = (conv, timeframe) => {
  conv.data.timeframe = timeframe;
};

module.exports = {
  getName,
  setName,
  getCity,
  setCity,
  getCoordinates,
  setCoordinates,
  getTimeframe,
  setTimeframe
};
