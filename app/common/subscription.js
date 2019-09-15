const fs = require('fs');
const path = require('path');
const webpush = require('web-push');

const privateKey = fs.readFileSync(path.join(__dirname, '../', '../', '.private', 'push.private'), 'utf8');
const publicKey = fs.readFileSync(path.join(__dirname, '../', 'static', 'push.public'), 'utf8');
const CONTACT = 'mailto:stephen.mulrennan@gmail.com';

webpush.setVapidDetails(
  CONTACT,
  publicKey,
  privateKey
);

async function process(details) {
  try {
    const response = await webpush.sendNotification(
      details.subscription,
      'Hi there, welcome to the big push, you should wear a coat today in belfast'
    );

    console.info('notification sent', response);
  } catch (e) {
    console.error('Error sending push', e);
  }
};

module.exports = process;
