'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const { dialogflow, Permission } = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

// Instantiate the Dialogflow client.
const app = dialogflow({ debug: true });

const fetch = require('node-fetch');

const getLocation = (conv) => {
  const permissions = ['NAME'];
  const context = 'First I need to know your location';

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

// Handle the Dialogflow intent named 'favorite color'.
// The intent collects a parameter named 'color'.
app.intent('favorite color', (conv, { color }, confirmationGranted) => {

  const { location } = conv.device;
  const { name } = conv.user;

  if (location && name) {
    const lng = location.coordinates.longitude;
    const lat = location.coordinates.latitude;

    const url = `https://coat-node-coat.appspot.com/api/lookup?lon=${lng}&lat=${lat}`;

    console.log('Calling ' + url);

    return new Promise((resolve, reject) => {
      fetch(url)
        .then(response => response.json())
        .then(response => {
          if (response.item.result.label === 'coat') {
            conv.close('Goodbye ' + name.given + ' you should wear a coat in ' + response.query.city);
          }
          else {
            conv.close('Goodbye ' + name.given + ' you don\'t need a coat today in ' + response.query.city + ', enjoy the good weather');
          }

          resolve();
        });
    });


  }
  else {
    getLocation(conv);
  }
});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);