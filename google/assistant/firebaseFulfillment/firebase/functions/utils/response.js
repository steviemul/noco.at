const buildReply = (response, name) => {
  let reply = '';

  if (name) {
    reply += `Hi ${name}.`;
  }

  if (response.item.result.label === 'coat') {
    reply = reply + 'You should wear a coat ';
  } else {
    reply = reply + 'You don\'t need a coat ';
  }

  reply = reply + `in ${response.query.city}`;

  return reply;
};

module.exports = {
  buildReply
};
