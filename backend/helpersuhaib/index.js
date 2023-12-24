var fs = require('fs');

// all controls
module.exports = function (app) {

fs
    .readdirSync(`./backend/helpersuhaib`)
    .filter(function (file) {
      //read just files .js
      return (file.indexOf('.') !== 0)  && file !== 'index.js' && (file.slice(-3) === '.js');
    })
    .forEach(async function (file) {
      var helper = require(`./${file}`)
      helper(app)
    })
};