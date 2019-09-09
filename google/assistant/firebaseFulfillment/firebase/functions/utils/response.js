const DAYS = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday'
];

const buildReply = (response, name, timeframe) => {
  let reply = '';

  if (name) {
    reply += `Hi ${name}.`;
  }

  if (response.item.result.label === 'coat') {
    reply = reply + 'You should wear a coat ';
  } else {
    reply = reply + 'You don\'t need a coat ';
  }

  reply = reply + `in ${response.query.city} `;

  if (timeframe) {
    if (DAYS.includes(timeframe.toLowerCase())) {
      reply = reply + ` on ${timeframe}`;
    } else {
      reply = reply + ` ${timeframe}`;
    }
  }

  reply = reply + '.';

  return reply;
};

module.exports = {
  buildReply
};
