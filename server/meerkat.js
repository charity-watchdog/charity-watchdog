const { execSync } = require('child_process');

const meerkatAPIKey = process.env.MEERKAT_API_KEY || new String(execSync('heroku config:get MEERKAT_API_KEY -a charity-watchdog')).trim();

const createAddressSubscription = (address) => {
  return fetch('https://meerkat.watch/api/v0/enterprise/subscribe/address', {
    method: "POST",
    headers: {
      "Authorization": `ApiKey ${meerkatAPIKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: {
      "address": address,
      "currency": "ETH",
      "callback": "https://charity-watchdog.herokuapp.com/webhook/v1/address"
    }
  });
}

const deleteAddressSubscription = (address) => {
  return fetch(`https://meerkat.watch/api/v0/enterprise/unsubscribe/address/${address}`, {
    method: "DELETE",
    headers: {
      "Authorization": `ApiKey ${meerkatAPIKey}`,
    }
  });
};

module.exports = {
  createAddressSubscription,
  deleteAddressSubscription,
};
