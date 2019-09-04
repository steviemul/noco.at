
const utils = require('./utils');
const model = require('../tf/model');

const predict = (response, coatModel, tolerance = 0, activity = 0) => {
  const query = utils.responseToObject(response, tolerance, activity);

  const prediction = model.predict(coatModel, query);

  return {
    'result': prediction,
    'data': response
  };
}

const generate = (request, response, coatModel) => {

  const type = request.query.type || 'current';
  const tolerance = request.query.tolerance || 0;
  const activity = request.query.activity || 0;

  let result = {
    query: response.query
  };

  if (type === 'current') {
    result.item = predict(response.result.item, coatModel, tolerance, activity);
  }
  else {
    result.items = response.result.items.map((item) => predict(item, coatModel, tolerance, activity));
  }

  return result;
};

module.exports = generate;