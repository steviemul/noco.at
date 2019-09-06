const model = require('./app/tf/model');
const {createServer} = require('./app/common/server');

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
}

start();