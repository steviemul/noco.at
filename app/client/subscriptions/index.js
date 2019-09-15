const PUSH_KEY = '/push.public';

const urlBase64ToUint8Array = (base64String) => {
  let padding = '='.repeat((4 - base64String.length % 4) % 4);
  let base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  let rawData = window.atob(base64);
  let outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const sendSubscriptionRequest = (payload) => {
  fetch(`/api/subscriptions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  .then((response) => {
    if (response.status === 202) {
      console.log('subscription accepted');
    } else {
      console.log('subscription not accepted');
    }
  })
  .catch((e) => {
    console.error('error sending subscription', e);
  });
};

const ask = () => {
  return new Promise((resolve, reject) => {
    const permissionResult = Notification.requestPermission((result) => {
      resolve(result);
    });

    if (permissionResult) {
      permissionResult.then(resolve, reject);
    }
  });
};

const add = (details) => {
  ask().then((result) => {
    if (result === 'granted') {
      fetch(PUSH_KEY)
      .then((response) => response.text())
      .then((key) => {
        const subscribeOptions = {
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(key)
        };

        return swRegistration.pushManager.subscribe(subscribeOptions);
      })
      .then((pushSubscription) => {
        const payload = {
          query: details.query,
          token: details.token,
          subscription: pushSubscription
        };

        sendSubscriptionRequest(payload);
      });
    }
  });
};

const remove = (details) => {

};

const available = () => {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  if (!('PushManager' in window)) {
    return false;
  }

  if (!('swRegistration') in window) {
    return false;
  }

  return true;
};

export {
  add,
  available,
  remove
};
