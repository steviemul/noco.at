const express = require('express');
const path = require('path');
const app = express();
const utils = require('./utils');
const model = require('../tf/model');
const lookup = require('../weather');

module.exports = (coatModel) => {

  COAT_MODEL = coatModel;

  app.get('/model', (req, res) => {
    const data = model.retrieve(req.query.format || 'json');

    res.send(data);
  });

  app.get('/api/prediction', (req, res) => {

    try {
      const query = utils.paramsToObject(req.query);

      if (req.query.retrain) {
        model.retrain(query, req.query.retrain).then(() => {
          COAT_MODEL = model.load();
          res.send('success');
        });
      }
      else {
        const prediction = model.predict(coatModel, query);

        res.send(prediction);
      }
  
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  });

  app.get('/api/lookup', (req, res) => {

    if (req.query.lon && req.query.lat) {
      lookup(req.query.lon, req.query.lat, req.query.type).then((response) => {
        const query = utils.responseToObject(response);

        const prediction = model.predict(coatModel, query);

        const data = {
          'result': prediction,
          'data': response
        };

        res.send(data);
      });
    }
    else {
      res.status(400);
      res.send('Longitute and latitude parmaters not specified');
    }
  });

  app.use('/', express.static(path.join(__dirname, '../static')));

  return app;
};



