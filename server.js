const model = require('./app/tf/model');
const {createServer} = require('./app/common/server');
const https = require('https');
const fs = require('fs');

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8000;

async function start() {
  // load out saved tensorflow model.
  const savedModel = await model.load();

  // createServer returns an express app.
  const app = createServer(savedModel);

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
  });

  https.createServer({
    key: fs.readFileSync('./.private/key.pem'),
    cert: fs.readFileSync('./.private/cert.pem'),
    passphrase: 'password'
  }, app).listen(8443, () => {
    console.log(`Server listening on port 8443...`);
  });
}

start();
