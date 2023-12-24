const {utils, constants} = require("../helpers");
const authenticationMiddleware = require("../middlewares/authentication");
const {statusCodes} = constants;
const prefix = `/api/v1/interrogators/`;

module.exports = (app) => {
  app.get(`${prefix}`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const interrogator = await app.get("models").Interrogator.findAll();
      return utils.response(statusCodes.SUCCESS, interrogator, req, res);
    } catch (err) {
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });

  app.put(`${prefix}:id`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const {id: interrogator_id} = req.params;
      const interrogatorData = req.body;
      const interrogator = await app.get("models").Interrogator.update({
        sleep: interrogatorData.sleep,
        description: interrogatorData.description,
        sleep_duration: interrogatorData.sleep_duration,
        delay_per_wave: interrogatorData.delay_per_wave,
        delay_per_control: interrogatorData.delay_per_control,
        concurrent_controls: interrogatorData.concurrent_controls,
        delay_per_fingerprint_wave: interrogatorData.delay_per_fingerprint_wave,
      }, {
        where: {
          id: interrogator_id
        },
      });
      return utils.response(statusCodes.SUCCESS, interrogator, req, res);
    } catch (err) {
      let errMessage = err;
      if (err.name === "SequelizeUniqueConstraintError" || err.name === "SequelizeValidationError") {
        errMessage = " "
        err.errors.forEach(error => {
          errMessage += " " + error.message + " \n"
        });
      }
      return utils.response(statusCodes.SERVER_ERROR, errMessage, req, res);
    }
  });
}
