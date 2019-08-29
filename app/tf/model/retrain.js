const retrieve = require('./retrieve');
const train = require('./train');
const fs = require('fs');
const path = require('path');

const TRAINING_DATA_PATH = 'data/training_data.json';

async function retrain(input, output) {

  const data = retrieve();

  const entry = {
    "temperature": input[0],
    "windspeed": input[1],
    "rain": input[2],
    "humidity": input[3],
    "result": parseInt(output)
  }

  data.push(entry);

  fs.writeFileSync(path.join(__dirname, TRAINING_DATA_PATH), JSON.stringify(data, null, 2), 'utf8');

  await train();
}
module.exports = retrain;