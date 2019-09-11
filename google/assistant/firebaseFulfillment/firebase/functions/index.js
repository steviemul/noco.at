'use strict';

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

const {
  dialogflow,
  Permission,
  Suggestions
} = require('actions-on-google');

// queries
const {
  chuckQuery,
  query,
  locationQuery
} = require('./utils/queries');

// reply formatters
const {
  buildReply
} = require('./utils/response');

// conversation helpers, these get and set context for the user and conversation
const {
  getName,
  setName,
  getCity,
  getCoordinates,
  setCoordinates,
  getTimeframe,
  setTimeframe,
  setCity
} = require('./utils/conversation');

const NOW = 'now';

// Instantiate the Dialogflow client.
const app = dialogflow({
  debug: true
});

const getUserInformation = (conv) => {
  const permissions = [];
  let context = 'Hey ';

  const name = getName(conv);

  if (!name || name === undefined || name === '') {
    permissions.push('NAME');
  } else {
    context = context + name;
  }

  if (conv.user.verification === 'VERIFIED') {
    permissions.push('DEVICE_PRECISE_LOCATION');
  }

  const options = {
    context,
    permissions,
  };

  conv.ask(new Permission(options));
};

const prompt = (conv) => {
  conv.ask('Can I check anything else for you ?');

  const suggestions = new Suggestions(
    'Yes, check in London',
    'Sure, how about later',
    'No'
  );

  conv.ask(suggestions);
};

app.intent('welcome intent', (conv) => {
  getUserInformation(conv);
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
      'Pop Music'
    ));
  } else {
    const {location} = conv.device;
    const {name} = conv.user;

    setName(conv, name.given);
    setCoordinates(conv, location.coordinates);

    const lng = location.coordinates.longitude;
    const lat = location.coordinates.latitude;

    return new Promise((resolve) => {
      locationQuery(lng, lat).then((response) => {
        const reply = buildReply(response, name.given);

        conv.ask(reply);
        prompt(conv);

        resolve();
      });
    });
  }
});


app.intent('city query', (conv, {city, timeframe}) => {
  return new Promise((resolve) => {
    console.info(`Querying for city ${city} and timeframe ${timeframe}`);

    query(city, getCoordinates(conv), timeframe).then((response) => {
      const reply = buildReply(response, null, timeframe);
      conv.close(reply);
      resolve();
    }, (error) => {
      conv.ask(error.message);
      prompt(conv);
      resolve();
    });
  });
});

app.intent('coat query - location', (conv, {city}) => {
  setCity(conv, city);

  const timeframe = getTimeframe(conv) || NOW;

  return new Promise((resolve) => {
    query(getCity(conv), getCoordinates(conv), timeframe).then((response) => {
      const name = getName(conv);

      const reply = buildReply(response, name, timeframe);
      conv.ask(reply);
      prompt(conv);
      resolve();
    }, (error) => {
      conv.ask(error.message);
      prompt(conv);
      resolve();
    });
  });
});

app.intent('coat query - time', (conv, {timeframe}) => {
  setTimeframe(conv, timeframe);

  return new Promise((resolve) => {
    query(getCity(conv), getCoordinates(conv), getTimeframe(conv)).then((response) => {
      const name = getName(conv);

      const reply = buildReply(response, name, getTimeframe(conv));
      conv.ask(reply);
      prompt(conv);
      resolve();
    }, (error) => {
      conv.ask(error.message);
      prompt(conv);
      resolve();
    });
  });
});

app.intent('call me chuck', (conv) => {
  return new Promise((resolve) => {
    chuckQuery().then((response) => {
      conv.ask(response.fact);
      prompt(conv);
      resolve();
    });
  });
});

app.intent('clear', (conv) => {
  conv.user.storage = {};
  conv.ask('You details have been cleared.');
  prompt(conv);
});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
