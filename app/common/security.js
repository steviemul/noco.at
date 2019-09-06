const crypto = require('crypto');

const genKeys = () => {
  const buf = crypto.randomBytes(48);
  const passphrase = 'steve'

  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
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
  }
}

module.exports = {
  genKeys
};