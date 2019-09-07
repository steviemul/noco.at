const retrieve = require('./retrieve');
const fs = require('fs');
const path = require('path');

const TRAINING_DATA_PATH = 'data/training_data.json';

const addCorrection = (amendment, result) => {
  const data = retrieve();

  const entry = {
    temperature: amendment.temperature,
    windspeed: amendment.windspeed,
    rain: amendment.rain,
    humidity: amendment.humidity,
    tolerance: 0,
    activity: 0,
    result
  };

  data.push(entry);

  fs.writeFileSync(path.join(__dirname, TRAINING_DATA_PATH), JSON.stringify(data, null, 2), 'utf8');
};

module.exports = addCorrection;
