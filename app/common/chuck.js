const chuck = require('../json/cn.json');

const getRandomInt = (max) => {
  return Math.round(Math.random() * max);
};

const randomQuote = () => {
  const index = getRandomInt(chuck.length - 1);

  return chuck[index];
};

module.exports = randomQuote;
