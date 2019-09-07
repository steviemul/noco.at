const tf = require('@tensorflow/tfjs-node');
const path = require('path');
const url = require('url');

const MODEL_LOCATION = process.env.CNC_MODEL_ROOT || 'http://localhost:8000/model?format=csv';
const MODEL_STORE_LOCATION = url.pathToFileURL(path.join(__dirname, 'store')).href;

const transformData = ({
  xs,
  ys
}) => {
  const values = [
    xs.temperature,
    xs.windspeed,
    xs.rain,
    xs.humidity,
    xs.tolerance,
    xs.activity
  ];

  return {
    xs: values,
    ys: ys.coat
  };
};

const loadTrainingData = () => {
  return tf.data.csv(MODEL_LOCATION, {
      columnConfigs: {
        coat: {
          isLabel: true
        }
      }
    })
    .map(transformData)
    .shuffle(100)
    .batch(100);
};

const createModel = () => {
  const model = tf.sequential();

  model.add(tf.layers.dense({
    units: 100,
    activation: 'relu',
    inputShape: [6]
  }));

  model.add(tf.layers.dense({
    units: 512,
    activation: 'relu'
  }));

  model.add(tf.layers.dense({
    units: 2,
    activation: 'softmax'
  }));

  model.compile({
    optimizer: tf.train.adam(),
    loss: 'sparseCategoricalCrossentropy',
    metrics: ['accuracy']
  });

  return model;
};

let numTrainingIterations = 20;

async function train() {
  const data = loadTrainingData();
  const model = createModel();

  for (let i = 0; i < numTrainingIterations; i++) {
    console.log(`Training iteration : ${i+1} / ${numTrainingIterations}`);

    await model.fitDataset(data, {
      epochs: 20
    });
  }

  await model.save(MODEL_STORE_LOCATION);
}

module.exports = train;
