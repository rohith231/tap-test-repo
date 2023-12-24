const pg = require('pg');
const env = process.env.NODE_ENV || 'development'
const config = require('./db/config/config.js')

const { KEYS } = require('../../common/config/env')

const Store = require('electron-store')
const store = new Store({
  encryptionKey: KEYS.store
})

var database = config[env].database;
var username = config[env].username;
var password = config[env].password;
var host = config[env].host;
var port = config[env].port;

if ( /*process.env.NODE_ENV !== 'development' && */ store.has('db-connection')) {
  database = store.get("db-connection.db_name");
  username = store.get("db-connection.db_username");
  password = store.get("db-connection.db_password");
  host = store.get("db-connection.db_host");
  port = store.get("db-connection.db_port");
}


module.exports = (callback) =>{
  

};
