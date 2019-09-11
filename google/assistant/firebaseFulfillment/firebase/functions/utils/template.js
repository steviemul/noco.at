const getRandomInt = (max) => {
  return Math.round(Math.random() * max);
};

const stringify = (initialTemplate, ...strings) => {
  return strings.reduce((template, string, index) => {
    return template.replace(`{${index}}`, string);
  }, initialTemplate);
};

const random = (templates, ...strings) => {
  const initialTemplate = templates[getRandomInt(templates.length -1)];

  return stringify(initialTemplate, strings);
};

module.exports = {
  random,
  stringify
};
