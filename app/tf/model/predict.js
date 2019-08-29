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

     return {
       'condifence': parseInt(result[0][1] * 100),
       'label': getLabel(result[0][1])
     };
  }
  catch (e) {
    console.error(e);
  }
};