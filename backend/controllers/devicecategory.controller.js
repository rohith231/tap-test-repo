const { utils, constants, flush } = require("../helpers");
const authenticationMiddleware = require("../middlewares/authentication");
const { statusCodes } = constants;
const prefix = `/api/v1/devicecategory/`;
const { Op } = require('sequelize');
module.exports = (app) => {
  app.get(`${prefix}system/:id`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const { id: system_id } = req.params
      const { pageNumber, itemsPerPage, query_search, sortKey, descSort } = req.query

      const devicecategory_conditions = {
        system_id: system_id,
      }
      if (query_search) {

        if (query_search.toUpperCase() == 'CONNECTED') {
          devicecategory_conditions[Op.or].push({ connectable: true })
        } else if (query_search.toUpperCase() == 'WAITING') {
          devicecategory_conditions[Op.or].push({ touched_at: null })
        } else if (
          query_search.toUpperCase() == 'FAILED CONNECTION' ||
          query_search.toUpperCase() == 'FAILED'
        ) {
          devicecategory_conditions[Op.not] = {
            touched_at: null,
            connectable: true,
          }
        } else if (query_search == 0 || query_search == false || query_search == 'false') {
          devicecategory_conditions[Op.or].push({ remediate: false })
          devicecategory_conditions[Op.or].push({ validate: false })
        } else if (query_search == 1 || query_search == true || query_search == 'true') {
          devicecategory_conditions[Op.or].push({ remediate: true })
          devicecategory_conditions[Op.or].push({ validate: true })
        }
      }
      let order =
        sortKey &&
        sortKey != null &&
        sortKey !== 'null' &&
        sortKey !== 'undefined' &&
        typeof sortKey !== 'undefined'
          ? [[sortKey, descSort === 'true' ? 'desc' : 'asc']]
          : [['updatedAt', 'desc']]

      const devicecategory = await app
        .get('models')
        .Devicecategory.scope(null)
        .findAndCountAll({
          where: devicecategory_conditions,
          order,
          ...app.get('models').paginate({ pageNumber, itemsPerPage }),
        })
      return utils.response(statusCodes.SUCCESS, devicecategory, req, res)
    } catch (err) {
      return utils.response(statusCodes.SERVER_ERROR, err, req, res)
    }
  })
  app.get(`${prefix}:id`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const { id } = req.params;
      const devicecategory = await app.get("models").Devicecategory.findAll({
        where: {
          id: id
        }
      });
      if (devicecategory.length === 0) {
        return utils.response(statusCodes.BAD_REQUEST, "Not able to return devicecategory information", req, res);
      }
      return utils.response(statusCodes.SUCCESS, devicecategory[0], req, res);
    } catch (err) {
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });
  app.post(`${prefix}`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const devicecategoryData = req.body
      console.log("devicecategoryData", devicecategoryData)
      //const name = devicecategoryData.name
      if(devicecategoryData.name && devicecategoryData.name.trim() != ''){
        var name = devicecategoryData.name;
      }else{
        return new global.ResponseHandler(req, res).error("Device category name couldn't be empty")
      }

      const user_id = devicecategoryData.user_id
      /*if(devicecategoryData.user_id){
        var user_id = devicecategoryData.user_id;
      }else{
        return new global.ResponseHandler(req, res).error("user couldn't be empty")
      }*/

      const system_id = devicecategoryData.system_id
      /*if(devicecategoryData.system_id){
        var system_id = devicecategoryData.system_id;
      }else{
        return new global.ResponseHandler(req, res).error("system couldn't be empty")
      }*/

      let status = true
      if (devicecategoryData.status) {
        status = true
      }
      const devicecategory = await app.get('models').Devicecategory.create({
        name: name,
        system_id: system_id,
        user_id: user_id,
        status: status
      })

      return utils.response(statusCodes.SUCCESS, devicecategory, req, res)
    } catch (err) {
      let errMessage = err
      if (
        err.name === 'SequelizeUniqueConstraintError' ||
        err.name === 'SequelizeValidationError'
      ) {
        errMessage = ' '
        err.errors.forEach(error => {
          errMessage += ' ' + error.message + ' \n'
        })
      }
      return utils.response(statusCodes.SERVER_ERROR, errMessage, req, res)
    }
  })
  app.put(`${prefix}:id`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const { id: devicecategory_id } = req.params

      var devicecategoryData = req.body
      if(devicecategoryData.name && devicecategoryData.name.trim() != ''){
        var name = devicecategoryData.name;
      }else{
        return new global.ResponseHandler(req, res).error("Device category name couldn't be empty")
      }
      let user_id = devicecategoryData.user_id
      /*if(devicecategoryData.user_id){
        var user_id = devicecategoryData.user_id;
      }else{
        return new global.ResponseHandler(req, res).error("user couldn't be empty")
      }*/

      let system_id = devicecategoryData.system_id
      /*if(devicecategoryData.system_id){
        var system_id = devicecategoryData.system_id;
      }else{
        return new global.ResponseHandler(req, res).error("system couldn't be empty")
      }*/

      let status = false
      if (devicecategoryData.status == 1) {
        status = true
      }

  
      const devicecategory = await app.get('models').Devicecategory.update(
        {
         name: name,
          system_id: system_id,
          user_id: user_id,
          status: status,
         },
        {
          where: {
            id: devicecategory_id,
          },
        },
      )
      return utils.response(statusCodes.SUCCESS, devicecategory, req, res)
    } catch (err) {
      let errMessage = err
      if (
        err.name === 'SequelizeUniqueConstraintError' ||
        err.name === 'SequelizeValidationError'
      ) {
        errMessage = ' '
        err.errors.forEach(error => {
          errMessage += ' ' + error.message + ' \n'
        })
      }
      return utils.response(statusCodes.SERVER_ERROR, errMessage, req, res)
    }
  })
  app.delete(`${prefix}:id`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const { id } = req.params;
      const devicecategory = await app.get("models").Devicecategory.findOne({
        where: {
          name: "Unassigned"
        }
      });
      console.log("devicecategory: ", devicecategory);
      const device = await app.get('models').Device.update(
        {
          category_id: devicecategory.id,
         },
        {
          where: {
            category_id: id,
          },
        },
      )
      await app.get("models").Devicecategory.destroy({
        where: {
          id: id
        }
      });
      return utils.response(statusCodes.SUCCESS, "Category deleted successfully", req, res);
    } catch (err) {
      console.log(err)
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });
  app.get(`${prefix}active/:id`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const { id: system_id } = req.params
      const devicecategory_conditions = {
        status: true
      }
      devicecategory_conditions[Op.or] = [
        { system_id: system_id },
        { name: 'Unassigned' }
      ]
      const devicecategory = await app
        .get('models')
        .Devicecategory.scope(null)
        .findAll({
          where: devicecategory_conditions,
         // order,
          ...app.get('models'),
        })
       // console.log("devicecategory", devicecategory)
      return utils.response(statusCodes.SUCCESS, devicecategory, req, res)
    } catch (err) {
      return utils.response(statusCodes.SERVER_ERROR, err, req, res)
    }
  })
}
