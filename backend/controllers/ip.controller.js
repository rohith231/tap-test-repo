const { utils, constants } = require("../helpers");
const authenticationMiddleware = require("../middlewares/authentication");
const { statusCodes } = constants;
const prefix = `/api/v1/ips/`;

const { Op } = require('sequelize');
module.exports = (app) => {
  app.get(`${prefix}system`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const { system_id, pageNumber, itemsPerPage, query_search, sortKey, descSort } = req.query;
      if (!system_id) {
        return utils.response(statusCodes.BAD_REQUEST, "System Couldn't Be Empty", req, res);
      }

      const ip_conditions = {
        system_id: system_id
      }
      if (query_search && typeof query_search !== 'undefined' && query_search !== 'null' && query_search !== 'undefined') {
        ip_conditions[Op.or] = [
          { subnet: { [Op.iLike]: `%${query_search}%` } },
          { description: { [Op.iLike]: `%${query_search}%` } },
        ]

        if (query_search.toUpperCase() === 'INACTIVE' || query_search === 0 || query_search === "false") {
          ip_conditions[Op.or].push({ status: false })
        } else if (query_search.toUpperCase() === 'ACTIVE' || query_search === 1 || query_search === "true") {
          ip_conditions[Op.or].push({ status: true })
        }

      }

      let order =
        sortKey &&
          sortKey != null &&
          sortKey !== 'null' &&
          sortKey !== 'undefined' &&
          typeof sortKey !== 'undefined'
          ? [[sortKey, descSort === 'true' ? 'desc' : 'asc']]
          : [['picked_at', 'desc']]

      const ip = await app.get("models").Ip.scope(null).findAndCountAll({
        where: ip_conditions,
        order,
        ...app.get("models").paginate({
          pageNumber,
          itemsPerPage
        }),
        order: [["updatedAt", "DESC"]]

      });
      return utils.response(statusCodes.SUCCESS, ip, req, res);
    } catch (err) {
      console.log(err)
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });

  app.get(`${prefix}:id`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const { id } = req.params;
      const ip = await app.get("models").Ip.findByPk(id);
      return utils.response(statusCodes.SUCCESS, ip, req, res);
    } catch (err) {
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });

  app.post(`${prefix}`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const ipData = req.body;
      let subnet = "";

      if (ipData.subnet && ipData.subnet.trim() != '') {
        subnet = ipData.subnet;
      } else {
        return utils.response(statusCodes.BAD_REQUEST, "Subnet Couldn't Be Empty", req, res);
      }

      const description = ipData.description;
      /*if(ipData.description && ipData.description.trim() != ''){
          var description = ipData.description;
      }else{
          return new global.ResponseHandler(req, res).error("Description couldn't be empty")
      }*/

      let system_id = "";
      if (ipData.system_id) {
        system_id = ipData.system_id;
      } else {
        return utils.response(statusCodes.BAD_REQUEST, "System Couldn't Be Empty", req, res);
      }

      let user_id = "";
      if (ipData.user_id) {
        user_id = ipData.user_id;
      } else {
        return new global.ResponseHandler(req, res).error("User Couldn't Be Empty")
      }

      let status = false;
      if (ipData.status == 1) {
        status = true;
      }

      let createBody = {
        subnet: subnet,
        description: description,
        system_id: system_id,
        user_id: user_id,
        status: status
      }

      if ((!ipData.credential_id || ipData.credential_id === '') && (!ipData.username || ipData.username === '') && (!ipData.password || ipData.password === '')) {
        return utils.response(statusCodes.SERVER_ERROR, 'Credentials cannot be blank', req, res);
      }

      let username = '';
      if (ipData.username) {
        username = ipData.username;
      }

      let password = '';
      if (ipData.password) {
        password = ipData.password;
      }

      let credential_id = '';
      if (ipData.credential_id) {
        credential_id = ipData.credential_id;
        createBody = { ...createBody, credential_id: credential_id }
      } else {
        createBody = { ...createBody, username: username, password: password }
      }

      if (ipData.ssh_private_key && ipData.ssh_private_key.length != 0) {
        createBody = { ...createBody, ssh_private_key: ipData.ssh_private_key }
      }

      const ip = await app.get("models").Ip.create(createBody);

      return utils.response(statusCodes.SUCCESS, ip, req, res);
    } catch (err) {
      console.log(err)
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
      const { id } = req.params;
      const ipData = req.body;
      const obj = {
        description: ipData.description,
        status: false,
      };
      if (ipData.subnet && ipData.subnet.trim() != '') {
        obj['subnet'] = ipData.subnet;
      } else {
        return utils.response(statusCodes.BAD_REQUEST, "Subnet Couldn't Be Empty", req, res);
      }


      if (ipData.system_id) {
        obj['system_id'] = ipData.system_id;
      } else {
        return utils.response(statusCodes.BAD_REQUEST, "System Couldn't Be Empty", req, res);
      }

      if (ipData.user_id) {
        obj['user_id'] = ipData.user_id;
      } else {
        return utils.response(statusCodes.BAD_REQUEST, "User Couldn't Be Empty", req, res);
      }

      if (ipData.status == 1) {
        obj['status'] = true;
      }

      if (ipData.username) {
        obj['username'] = ipData.username;
      } else {
        obj['username'] = null;
      }

      if (ipData.password) {
        obj['password'] = ipData.password;
      } else {
        obj['password'] = null;
      }

      if (ipData.credential_id) {
        obj['credential_id'] = ipData.credential_id;
      } else {
        obj['credential_id'] = null
      }

      if (ipData.ssh_private_key && ipData.ssh_private_key.length != 0) {
        obj['ssh_private_key'] = ipData.ssh_private_key
      } else {
        obj['ssh_private_key'] = null
      }

      const ip = await app.get("models").Ip.update(obj, {
        where: {
          id: id
        },
      });
      return utils.response(statusCodes.SUCCESS, ip, req, res);
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
      const { id } = req.params;
      await app.get("models").Ip.destroy({
        where: {
          id: id
        }
      });
      return utils.response(statusCodes.SUCCESS, "IP deleted successfully", req, res);
    } catch (err) {
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });

}
