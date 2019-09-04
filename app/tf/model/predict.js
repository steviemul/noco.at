const tf = require('@tensorflow/tfjs-node');

const getLabel = (result) => {
  if (result > 0.5) {
    return 'coat';
  } else {
    return 'no coat';
  }
};

module.exports = (model, data) => {
  try {
    let result = model.predict(tf.tensor(data, [1, data.length])).arraySync();
    
    const label = getLabel(result[0][1]);
    let confidence = parseInt(result[0][1] * 100);

    if (label !== 'coat') {
      confidence = 100 - confidence;
    }

    return {
      confidence : confidence + '%',
      label
    };
  }
  catch (e) {
    console.error(e);
  }
};