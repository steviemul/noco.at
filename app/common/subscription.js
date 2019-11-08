const fs = require('fs-extra');
const path = require('path');
const webpush = require('web-push');
const crypto = require('crypto');

const privateKey = fs.readFileSync(path.join(__dirname, '../', '../', '.private', 'push.private'), 'utf8');
const publicKey = fs.readFileSync(path.join(__dirname, '../', 'static', 'push.public'), 'utf8');
const CONTACT = 'mailto:stephen.mulrennan@gmail.com';

webpush.setVapidDetails(
  CONTACT,
  publicKey,
  privateKey
);

const createFilename = (content) => {
  const hash = crypto.createHash('md5');

  hash.update(content);

  return hash.digest('hex');
};

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

const updateSubscriptionStatus = (subscription) => {
  return {
    ...subscription,
    status: {
      lastProcessed: new Date(),
      processed: false
    }
  };
};

async function saveSubscription(details, content) {
  const outputLocation = path.join(__dirname, '../', '../', '.subscriptions');

  fs.ensureDirSync(outputLocation);

  const subscription = updateSubscriptionStatus({
    details,
    content
  });

  const filename = createFilename(JSON.stringify(subscription)) + '.json';
  const subscriptionLocation = path.join(outputLocation, filename);

  fs.writeFile(subscriptionLocation, JSON.stringify(subscription, null, 2), 'utf8');
};

module.exports = {
  process,
  saveSubscription
};
