const crypto = require('crypto');
const generator = require('generate-password');

const genKeys = () => {
  const passphrase = generator.generate({
    length: 30
  });

  const {publicKey, privateKey} = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      cipher: 'aes-256-cbc',
      passphrase
    }
  });

  return {
    publicKey,
    privateKey,
    passphrase
  };
};

module.exports = {
  genKeys
};
