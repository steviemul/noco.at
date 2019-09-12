const PARAM_TEMP = 't';
const PARAM_WIND = 'w';
const PARAM_RAIN = 'r';
const PARAM_HUMIDITY = 'h';

const paramToValidValue = (query, param, errors) => {
  try {
    const value = parseFloat(query[param]);

    return value;
  } catch (e) {
    errors.push(`Invalid parmater value ${query[param]} for '${param}'`);
  }
};

const paramsToObject = (query) => {
  const errors = [];

  const tolerance = parseInt(query.n || 2);
  const activity = parseInt(query.a || 1);

  for (const param of [PARAM_TEMP, PARAM_WIND, PARAM_RAIN, PARAM_HUMIDITY]) {
    if (!query[param]) {
      errors.push(`Expected mandatory parameter ${param}`);
    }
  }

  const temp = paramToValidValue(query, PARAM_TEMP, errors);
  const wind = paramToValidValue(query, PARAM_WIND, errors);
  const rain = paramToValidValue(query, PARAM_RAIN, errors);
  const humidity = paramToValidValue(query, PARAM_HUMIDITY, errors);

  if (errors.length > 0) {
    throw {
      error: true,
      errors
    };
  }

  return [temp, wind, rain, humidity, tolerance, activity];
};

const responseToObject = (response, tolerance, activity) => {
  return [
    response.temperature,
    response.windspeed,
    response.rain,
    response.humidity,
    tolerance,
    activity
  ];
};

module.exports = {
  paramsToObject,
  responseToObject
}
;
