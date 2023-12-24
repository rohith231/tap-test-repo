const {utils, constants} = require("../helpers");
const authenticationMiddleware = require("../middlewares/authentication");
const {statusCodes} = constants;
const prefix = `/api/v1/organizations/`;

module.exports = (app) => {
  app.get(`${prefix}`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    const org = await app.get("models").Organization.findOne();
    return utils.response(statusCodes.SUCCESS, org, req, res);
  });
  app.put(`${prefix}:id`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const {id} = req.params;
      const orgData = req.body.org_data
      const organization = await app.get("models").Organization.update({
        name: orgData.name,
        logo: orgData.logo,
        description: orgData.description,
        address1: orgData.address1,
        address2: orgData.address2,
        city: orgData.city,
        state: orgData.state,
        zip_code: orgData.zip_code,
        primary_color: orgData.primary_color,
        secondary_color: orgData.secondary_color,
        accent_color: orgData.accent_color,
        status: 1
      }, {
        where: {
          id: id
        },
      });
      return utils.response(statusCodes.SUCCESS, organization, req, res);
    } catch (err) {
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });
}
