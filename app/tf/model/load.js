const path = require('path');
const tf = require('@tensorflow/tfjs-node');
const url = require('url');

const MODEL_STORE_LOCATION = url.pathToFileURL(path.join(__dirname, 'store/model.json')).href;

async function load () {
  const model = await tf.loadLayersModel(MODEL_STORE_LOCATION);

  return model;
}

module.exports = load;