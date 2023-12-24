const Store = require('electron-store');

let store = null

exports.init = () => {
  store = new Store({ encryptionKey: "sdfsdfsdfsd" })
};

exports.getItem = (key = "", ) => {
  if (!store) {
    this.init();
  }
  return store.get(key);
};

exports.setItem = (key, value) => {
  if (!key) {
    return;
  }
  if (!store) {
    this.init();
  }
  return store.set(key, value);
};

exports.deleteItem = (key = "") => {
  if (!store) {
    this.init();
  }
  return store.delete(key);
};

exports.hasItem = (key) => {
  if (!store) {
    this.init();
  }
  return store.has(key);
}
exports.deleteAll = () => {
  if (!store) {
    this.init();
  }
  return store.clear();
}

exports.reset = () => {
  if (!store) {
    this.init();
  }
  var dbConnection = this.getItem('db-connection')
  this.deleteAll()
  this.setItem('db-connection',dbConnection)
}
