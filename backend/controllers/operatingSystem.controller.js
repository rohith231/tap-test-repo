const {utils, constants} = require("../helpers");
const authenticationMiddleware = require("../middlewares/authentication");
const {statusCodes} = constants;
const prefix = `/api/v1/os/`;

const {Op} = require("sequelize");
module.exports = (app) => {
  app.get(`${prefix}`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const {pageNumber, itemsPerPage, query_search, sortKey, descSort} = req.query;
      const order = sortKey && sortKey !=null && sortKey !== 'null' && sortKey !== 'undefined'   && typeof sortKey !== 'undefined'? [[sortKey, descSort ? "desc" : "asc"]] : [["updatedAt", "desc"]];
      let roles_conditions = {}
      let query_search_status = null
      if (query_search) {
        if (query_search.toUpperCase() == 'INACTIVE' || query_search == 0) {
          query_search_status = false
        } else if (query_search.toUpperCase() == 'ACTIVE' || query_search == 1) {
          query_search_status = true
        }
        roles_conditions = {
          [Op.or]: [
            {name: {[Op.iLike]: `%${query_search}%`}}
          ]
        }
      }
      if (query_search_status !== null) {
        roles_conditions[Op.or].push({status: query_search_status})
      }
      const os = await app.get("models").OperatingSystem.findAndCountAll({
        where: roles_conditions,
        ...app.get("models").paginate({
          pageNumber,
          itemsPerPage
        }),
        order
      });
      return utils.response(statusCodes.SUCCESS, os, req, res);

    } catch (err) {
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });
  app.get(`${prefix}:id`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const {id} = req.params;
      const os = await app.get("models").OperatingSystem.findByPk(id);
      return utils.response(statusCodes.SUCCESS, os, req, res);
    } catch (err) {
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });
  app.post(`${prefix}`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const osData = req.body;

      if (osData.name && osData.name.trim() != '') {
        var name = osData.name;
      } else {
        return utils.response(statusCodes.BAD_REQUEST, "Operating System Name Couldn't Be Empty", req, res);
      }
      var status = osData.status == 1;
      await app.get("models").OperatingSystem.findOrCreate({
        where: {name: name},
        defaults: {
          name: name,
          status: status
        }
      }).spread((os, isCreated) => {
        if (!isCreated) {
          let err = "operation system name already taken ";
          return utils.response(statusCodes.BAD_REQUEST, err, req, res);
        }
        return utils.response(statusCodes.SUCCESS, os, req, res);
      });

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
  app.put(`${prefix}:id`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const {id: os_id} = req.params;
      const osData = req.body;
      if (osData.name && osData.name.trim() != '') {
        var name = osData.name;
      } else {
        return utils.response(statusCodes.BAD_REQUEST, "Operating System Name Couldn't Be Empty", req, res);
      }
      const status = osData.status == 1;
      const isExistsOs = await app.get("models").OperatingSystem.findOne({
        where: {
          id: {[Op.ne]: os_id},
          name: name
        }
      });
      if (isExistsOs) {

      }
      const os = await app.get("models").OperatingSystem.update({
        name: name,
        status: status,
      }, {
        where: {id: os_id}
      });
      return utils.response(statusCodes.SUCCESS, os, req, res);
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
  app.delete(`${prefix}:id`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const {id} = req.params;
      await app.get("models").OperatingSystem.destroy({where: {id: id}});
      return utils.response(statusCodes.SUCCESS, "Operating System Deleted Successfully", req, res);
    } catch (err) {
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });
};
