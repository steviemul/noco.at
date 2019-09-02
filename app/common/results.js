
const utils = require('./utils');
const model = require('../tf/model');

const predict = (response, coatModel) => {
  const query = utils.responseToObject(response);

  const prediction = model.predict(coatModel, query);

  return {
    'result': prediction,
    'data': response
  };
}

const generate = (type = 'current', response, coatModel) => {

  let result = {
    query: response.query
  };

  if (type === 'current') {
    result.item = predict(response.result.item, coatModel);
  }
  else {
    result.items = response.result.items.map((item) => predict(item, coatModel));
  }

  return result;
};

module.exports = generate;