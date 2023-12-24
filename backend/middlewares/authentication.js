const { utils, constants, authentication } = require("../helpers");
const { statusCodes } = constants;

exports.decodeJWT = (req, res, next) => {
  try {
    const authorization = req.headers['authorization'];
    if (!authorization) {
      return utils.response(statusCodes.EXPECTATION_FAILED, "Token does not exist", req, res);
    }
    const jwtToken = authorization.split(" ");
    if (!jwtToken || !jwtToken[1]) {
      return utils.response(statusCodes.EXPECTATION_FAILED, "Token does not exist", req, res);
    }
    authentication.JwTokenVerify(jwtToken[1], (err, payload) => {
      if (err) {
        return utils.response(statusCodes.EXPECTATION_FAILED, "Token is not valid", req, res);
      }
      req.headers.userInfo = payload;
      return next();
    })
  } catch (err) {
    return utils.response(statusCodes.EXPECTATION_FAILED, "Token is not valid", req, res);
  }
};

exports.authorization = (req, res, next) => {
  return next();
};
