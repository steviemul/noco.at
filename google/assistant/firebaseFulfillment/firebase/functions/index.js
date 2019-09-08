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
const {getName, setName} = require('./utils/conversation');

// Instantiate the Dialogflow client.
const app = dialogflow({
  debug: true
});

const getLocation = (conv) => {
  const permissions = ['NAME'];
  const context = 'Hello';

  if (conv.user.verification === 'VERIFIED') {
    permissions.push('DEVICE_PRECISE_LOCATION');
  }

  const options = {
    context,
    permissions,
  };

  conv.ask(new Permission(options));
};


app.intent('welcome intent', (conv) => {
  const name = getName(conv);

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
    conv.ask(new Suggestions(
      'London',
      'Paris',
      'New York',
      'Munich',
      'Everyone talks about pop music'
    ));
  } else {
    const {location} = conv.device;
    const {name} = conv.user;

    setName(name);

    const lng = location.coordinates.longitude;
    const lat = location.coordinates.latitude;

    return new Promise((resolve, reject) => {
      locationQuery(lng, lat).then((response) => {
        const reply = buildReply(response, name.given);

        conv.ask(reply);
        conv.ask('Can I check anything else for you ?');

        const suggestions = new Suggestions(
          'Yes, check in London',
          'Sure, how about later',
          'No'
        );

        conv.ask(suggestions);

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

app.intent('coat query - location', (conv, {city}) => {
  conv.close(`City changed to ${city}`);
});

app.intent('coat query - time', (conv, {timeframe}) => {
  conv.close(`Timeframe set to ${timeframe}`);
});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
