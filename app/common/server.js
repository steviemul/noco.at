const express = require('express');
const path = require('path');
const app = express();
const utils = require('./utils');
const model = require('../tf/model');
const lookup = require('../weather');
const generateResults = require('./results');
const security = require('./security');
const request = require('./request');

 const KEYS = security.genKeys();

module.exports = (coatModel) => {

  app.get('/model', (req, res) => {
    const data = model.retrieve(req.query.format || 'json');

    res.send(data);
  });

  app.post('/api/correction', (req, res) => {

    const body = req.body;

    const verifiedContent = request.verifyRequest(body.token, KEYS);

    console.log(verifiedContent);

    res.status(202);
    res.send({
      status: 'Correction accepted'
    });
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

    if ((req.query.lon && req.query.lat) || req.query.city) {
      lookup(req).then((response) => {
        const data = request.addTokenToLookupRequest(
          generateResults(req, response, coatModel), KEYS);

        res.send(data);
      });
    }
    else {
      res.status(400);
      res.send('Invalid query, you must specify longtiture and latitude or a city name');
    }
  });

  app.get(['/forecast', '/settings'], (req, res) => {
    res.sendFile(path.join(__dirname, '../static', 'index.html'));
  });

  app.use('/', express.static(path.join(__dirname, '../static')));
  app.use(express.json());
  
  return app;
};



