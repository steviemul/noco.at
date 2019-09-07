const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const model = require('../tf/model');

const {spawn} = require('child_process');

const INTERVAL = process.env.CNC_WATCH_INTERVAL || 5000;

let TRAINING = false;
let DIGEST;
let updateModel;

const run = () => {
  const script = path.join(__dirname, '../../scripts/train_model.js');

  TRAINING = true;

  console.info('Retraining model');

  const train = spawn(script);

  train.stdout.on('data', (data) => {
    console.info(data.toString());
  });

  train.stderr.on('data', (data) => {
    console.error(data.toString());
    TRAINING = false;
  });

  train.on('exit', () => {
    model.load().then((updatedModel) => {
      updateModel(updatedModel);

      TRAINING = false;
      console.log('Training complete');
    });
  });
};

const checkModelFile = () => {
  if (TRAINING) return;

  const modelLocation = path.join(__dirname, '../tf/model/data/training_data.json');

  const contents = fs.readFileSync(modelLocation, 'utf8');

  const digest = crypto.createHash('md5').update(contents).digest('hex');

  if (digest !== DIGEST) {
    if (DIGEST) {
      run();
    }

    DIGEST = digest;
  }
};

const watch = (callback) => {
  updateModel = callback;

  setInterval(checkModelFile, INTERVAL);
};

module.exports = watch;
