const express = require('express');
const path = require('path');
const app = express();
const utils = require('./utils');
const model = require('../tf/model');
const lookup = require('../weather');
const generateResults = require('./results');

module.exports = (coatModel) => {

  app.get('/model', (req, res) => {
    const data = model.retrieve(req.query.format || 'json');

    res.send(data);
  });

  app.get('/api/prediction', (req, res) => {

    try {
      const query = utils.paramsToObject(req.query);
      const prediction = model.predict(coatModel, query);

      res.send(prediction);
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  });

  app.get('/api/lookup', (req, res) => {

    if (req.query.lon && req.query.lat) {
      lookup(req.query.lon, req.query.lat, req.query.type).then((response) => {
        const data = generateResults(req, response, coatModel);

        res.send(data);
      });
    }
    else {
      res.status(400);
      res.send('Longitute and latitude parmaters not specified');
    }
  });

  app.get(['/forecast', '/settings'], (req, res) => {
    res.sendFile(path.join(__dirname, '../static', 'index.html'));
  });

  app.use('/', express.static(path.join(__dirname, '../static')));
  
  return app;
};



