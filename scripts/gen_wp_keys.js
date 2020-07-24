#! /usr/local/bin/node

const webpush = require('web-push');
const path = require('path');
const fs = require('fs-extra');

const keys = webpush.generateVAPIDKeys();

const PUBLIC_OUTPUT = path.join(__dirname, '../', 'app', 'static');
const PRIVATE_OUTPUT = path.join(__dirname, '../', '.private');

!fs.existsSync(PUBLIC_OUTPUT) && fs.mkdirSync(PUBLIC_OUTPUT);
!fs.existsSync(PRIVATE_OUTPUT) && fs.mkdirSync(PRIVATE_OUTPUT);

fs.writeFileSync(
  path.join(PUBLIC_OUTPUT, 'push.public'),
  keys.publicKey,
  'utf8'
);

fs.writeFileSync(
  path.join(PRIVATE_OUTPUT, 'push.private'),
  keys.privateKey,
  'utf8'
);
