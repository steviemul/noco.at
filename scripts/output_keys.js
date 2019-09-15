#! /usr/local/bin/node

const fs = require('fs');
const path = require('path');
const stdin = process.stdin;
let buffer = '';

stdin.on('data', (chunk) => {
  buffer = buffer + chunk;
});

stdin.on('end', () => {
  console.log(buffer);
  const keys = JSON.parse(buffer);

  const publicKey = keys.publicKey;
  const privateKey = keys.privateKey;

  fs.writeFileSync(
    path.join(__dirname, '../', 'app', 'static', 'push.public'),
    publicKey,
    'utf8'
  );

  fs.writeFileSync(
    path.join(__dirname, '../', '.private', 'push.private'),
    privateKey,
    'utf8'
  );
});
