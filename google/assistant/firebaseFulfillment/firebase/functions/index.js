'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const {
  dialogflow,
  Permission
} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

// Instantiate the Dialogflow client.
const app = dialogflow({
  debug: true
});

const fetch = require('node-fetch');

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

const buildResponse = (name, response) => {

  let result = `Hi ${name}.`;

  const rainInference = response.item.data.rain === 0 ? ' not ' : '';

  result = result + `It's ${rainInference} raining in ${response.query.city} at the moment. `;

  result = result + `It's currently ${response.item.data.temperature} degrees celsius`;

  result = result + ` with a relative humidity of ${response.item.data.humidity} percent.`;
  
  if (response.item.result.label === 'coat') {
    result = result + 'You should wear a coat.';
  }
  else {
    result = result + 'You don\'t need a coat';

    if (rainInference === 1) {
      result = result + ' but maybe take an umbrella with you.';
    }
    else {
      result = result +'.';
    }
  }

  result = result + ' Have a nice day.';

  return result;
};

// Handle the Dialogflow intent named 'favorite color'.
// The intent collects a parameter named 'color'.
app.intent('favorite color', (conv, {
  color
}, confirmationGranted) => {

  const {
    location
  } = conv.device;
  const {
    name
  } = conv.user;

  if (location && name) {
    const lng = location.coordinates.longitude;
    const lat = location.coordinates.latitude;

    const url = `https://coat-node-coat.appspot.com/api/lookup?lon=${lng}&lat=${lat}`;

    console.log('Calling ' + url);

    return new Promise((resolve, reject) => {
      fetch(url)
        .then(response => response.json())
        .then(response => {
          const reply = buildResponse(name.given, response);

          conv.close(reply);

          resolve();
        });
    });


  } else {
    getLocation(conv);
  }
});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);