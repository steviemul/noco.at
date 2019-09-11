const chuck = require('../json/cn.json');

const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};

const randomQuote = () => {
  const index = getRandomInt(700);

  return chuck[index];
};

module.exports = randomQuote;
