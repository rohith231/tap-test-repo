const {utils, constants} = require("../helpers");
const authenticationMiddleware = require("../middlewares/authentication");
const {statusCodes} = constants;
const prefix = `/api/v1/frameworks/`;

module.exports = (app) => {
  app.get(`${prefix}`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const {group} = req.query;
      const where = {}
      if (group)
        where['group'] = group

      const frameworks = await app.get("models").Framework.scope(null).findAll({where});
      return utils.response(statusCodes.SUCCESS, frameworks, req, res);

    } catch (err) {
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });

}
