const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require("../config");

exports.hashPassword = (planPassword) => {
 return bcrypt.hashSync(planPassword, 10)
};
exports.comparePassword = (planPassword, hashPassword) => {
  return bcrypt.compareSync(planPassword, hashPassword)
};
exports.JwTokenIssue = function (payload) {
  return jwt.sign(payload, config.jwtSecretKey, {algorithm: 'HS256'});
};
exports.JwTokenVerify = function (token, callback) {
  return jwt.verify(token, config.jwtSecretKey, {}, callback);
};


