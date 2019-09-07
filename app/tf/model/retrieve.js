const fs = require('fs');
const path = require('path');

const TRAINING_DATA_PATH = 'data/training_data.json';

const itemToArray = (item) => {
  return [
    item.temperature,
    item.windspeed,
    item.rain,
    item.humidity,
    item.tolerance,
    item.activity,
    item.result
  ];
};

const formatCSV = (data) => {
  let csv = 'temperature,windspeed,rain,humidity,tolerance,activity,coat\n';

  csv = csv + data.reduce((buffer, item) => {
    return buffer + itemToArray(item).join(',') + '\n';
  }, '');

  return csv;
};

module.exports = (format = 'json') => {
  const data = fs.readFileSync(path.join(__dirname, TRAINING_DATA_PATH), 'utf8');

  const dataJson = JSON.parse(data);

  if (format === 'csv') {
    return formatCSV(dataJson);
  }

  return dataJson;
};
