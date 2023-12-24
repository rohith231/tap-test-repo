const {utils, constants, logger} = require("../helpers");
const {statusCodes} = constants;
module.exports = (app) => {
  app.use((req, res, next) => {
    return utils.response(statusCodes.NOT_FOUND, "Not Found", req, res);
  });

  app.use((err, req, res, next) => {
    return utils.response(statusCodes.SERVER_ERROR, err, req, res);
  });
};
