const retrieve = require('./retrieve');
const fs = require('fs');
const path = require('path');

const SPEED_CONVERSION = 2.23694;
const TRAINING_DATA_PATH = 'data/training_data.json';

const addCorrection = (amendment, result) => {
  const data = retrieve();

  const entry = {
    temperature: amendment.temperature,
    windspeed: parseInt(amendment.windspeed / SPEED_CONVERSION),
    rain: amendment.rain,
    humidity: amendment.humidity,
    tolerance: amendment.tolerance,
    activity: 0,
    result
  };

  console.info('Correction accepted', entry);

  data.push(entry);

  fs.writeFileSync(path.join(__dirname, TRAINING_DATA_PATH), JSON.stringify(data, null, 2), 'utf8');
};

module.exports = addCorrection;
