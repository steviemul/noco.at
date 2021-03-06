
const utils = require('./utils');
const model = require('../tf/model');

const predict = (response, coatModel, tolerance = 0, activity = 1) => {
  const query = utils.responseToObject(response, tolerance, activity);

  const prediction = model.predict(coatModel, query);

  return {
    'result': prediction,
    'data': response
  };
};

const generate = (request, response, coatModel) => {
  const type = request.query.type || 'current';
  const tolerance = request.query.n || 2;
  const activity = request.query.a || 1;

  let result = {
    query: response.query
  };

  if (type === 'current') {
    result.item = predict(response.result.item, coatModel, tolerance, activity);
  } else {
    result.items = response.result.items.map((item) => predict(item, coatModel, tolerance, activity));
  }

  return result;
};

module.exports = generate;
