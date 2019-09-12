const template = require('./template');

const DAYS = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday'
];

const GREETING_TEMPLATES = [
  'Hi {0}. ',
  'Hello {0}. '
];

const NO_COAT_RESPONSES = [
  'You should wear a coat in {0} '
];

const COAT_RESPONSES = [
  'You don\'t need a coat in {0} '
];

const buildReply = (response, name, timeframe) => {
  let reply = '';

  if (name) {
    reply += template.random(GREETING_TEMPLATES, name);
  }

  if (response.item.result.label === 'coat') {
    reply = reply + template.random(COAT_RESPONSES, response.query.city);
  } else {
    reply = reply + template.random(NO_COAT_RESPONSES, response.query.city);
  }

  if (timeframe) {
    if (DAYS.includes(timeframe.toLowerCase())) {
      reply = reply + ` on ${timeframe}`;
    } else {
      reply = reply + ` ${timeframe}`;
    }
  }

  reply = reply + '. ';

  return reply;
};

module.exports = {
  buildReply
};
