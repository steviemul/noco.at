const model = require('./app/tf/model');
const createServer = require('./app/common/server');

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8000;

async function start() {

  const savedModel = await model.load();

  const app = createServer(savedModel);

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
  });
}

start();