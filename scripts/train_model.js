#!/usr/local/bin/node

const train = require('../app/tf/model/train');

async function run() {
  await train();

  console.log('Finished');
}

run();
