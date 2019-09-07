const jwt = require('jsonwebtoken');

const addTokenToLookupRequest = (payload, keys) => {
  if (payload.item) {
    const {privateKey, passphrase} = keys;

    const token = jwt.sign(payload.item.data, {
      key: privateKey,
      passphrase
    }, {
      algorithm: 'RS256',
      expiresIn: 600000
    });

    payload.token = token;
  };

  return payload;
};

const verifyRequest = (token, keys) => {
  const {publicKey} = keys;

  return jwt.verify(token, publicKey);
};

module.exports = {
  addTokenToLookupRequest,
  verifyRequest
};
