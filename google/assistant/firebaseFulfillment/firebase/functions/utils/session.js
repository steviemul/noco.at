const getName = (conv) => {
  return conv.user.storage.userName;
};

const setName = (conv, name) => {
  conv.user.storage.userName = name;
};

const clear = (conv) => {
  conv.user.storage = {};
};

module.exports = {
  getName,
  setName,
  clear
};
