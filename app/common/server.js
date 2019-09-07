const express = require('express');
const path = require('path');
const utils = require('./utils');
const model = require('../tf/model');
const lookup = require('../weather');
const generateResults = require('./results');
const security = require('./security');
const request = require('./request');
const watch = require('./watch');

const KEYS = security.genKeys();

let ACTIVE_MODEL;

const updateModel = (activeModel) => {
  ACTIVE_MODEL = activeModel;
};

const createServer = (activeModel) => {
  ACTIVE_MODEL = activeModel;

  const app = express();

  app.use(express.json());

  app.get('/model', (req, res) => {
    const data = model.retrieve(req.query.format || 'json');

    res.send(data);
  });

  app.post('/api/correction', (req, res) => {
    const body = req.body;

    const verifiedContent = request.verifyRequest(body.token, KEYS);

    const correction = body.item.result.label === 'coat' ? 0 : 1;

    model.correct(verifiedContent, correction);

    res.status(202);
    res.send({
      status: 'Correction accepted'
    });
  });

  app.get('/api/prediction', (req, res) => {
    try {
      const query = utils.paramsToObject(req.query);
      const prediction = model.predict(ACTIVE_MODEL, query);

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
          generateResults(req, response, ACTIVE_MODEL), KEYS);

        res.send(data);
      });
    } else {
      res.status(400);
      res.send('Invalid query, you must specify longtiture and latitude or a city name');
    }
  });

  app.get(['/forecast', '/settings'], (req, res) => {
    res.sendFile(path.join(__dirname, '../static', 'index.html'));
  });

  app.use('/', express.static(path.join(__dirname, '../static')));

  watch(updateModel);

  return app;
};

module.exports = {
  updateModel,
  createServer,
};


