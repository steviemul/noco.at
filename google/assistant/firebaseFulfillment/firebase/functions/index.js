'use strict';

const {
  dialogflow,
  Permission,
  Suggestions
} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

const {cityQuery, locationQuery} = require('./utils/queries');
const {buildReply} = require('./utils/response');

// Instantiate the Dialogflow client.
const app = dialogflow({
  debug: true
});

const getLocation = (conv) => {
  const permissions = ['NAME'];
  const context = 'Hello';

  if (conv.user.verification === 'VERIFIED') {
    // Could use DEVICE_COARSE_LOCATION instead for city, zip code
    permissions.push('DEVICE_PRECISE_LOCATION');
  }

  const options = {
    context,
    permissions,
  };

  conv.ask(new Permission(options));
};


app.intent('welcome intent', (conv) => {
  const name = conv.user.storage.userName;

  if (!name) {
    getLocation(conv);
  } else {
    conv.close('See ya sport');
  }
});

// Handle the Dialogflow intent named 'favorite color'.
// The intent collects a parameter named 'color'.
app.intent('coat query', (conv, {}, confirmationGranted) => {
  if (!confirmationGranted) {
    conv.ask('Ok no problem. Where are you ?');
    conv.ask(new Suggestions('Belfast', 'Dublin', 'London', 'New York', 'Paris', 'Rome'));
  } else {
    const {location} = conv.device;
    const {name} = conv.user;

    const lng = location.coordinates.longitude;
    const lat = location.coordinates.latitude;

    return new Promise((resolve, reject) => {
      locationQuery(lng, lat).then((response) => {
        const reply = buildReply(response, name.given);

        conv.close(reply);

        resolve();
      });
    });
  }
});

app.intent('city query', (conv, {city}) => {
  return new Promise((resolve, reject) => {
    cityQuery(city).then((response) => {
      const reply = buildReply(response);

      conv.close(reply);

      resolve();
    });
  });
});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
