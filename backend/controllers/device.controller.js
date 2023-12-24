const { utils, constants } = require('../helpers')
const authenticationMiddleware = require('../middlewares/authentication')
const { statusCodes } = constants
const prefix = `/api/v1/devices/`
const targetprefix = `/api/v1/targets/`
const crypto = require('crypto');
const config = require("../DB/config/config");
const { Op } = require('sequelize')

module.exports = app => {
  app.get(`${prefix}system/:id`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const { id: system_id } = req.params
      const { pageNumber, itemsPerPage, query_search, sortKey, descSort } = req.query

      const device_conditions = {
        system_id: system_id,
      }
      if (query_search) {
        device_conditions[Op.or] = [
          { ip_addr: { [Op.iLike]: `%${query_search}%` } },
          { mac_address: { [Op.iLike]: `%${query_search}%` } },
          { host_name: { [Op.iLike]: `%${query_search}%` } },
          { os_type: { [Op.iLike]: `%${query_search}%` } },
        ]

        if (query_search.toUpperCase() == 'CONNECTED') {
          device_conditions[Op.or].push({ connectable: true })
        } else if (query_search.toUpperCase() == 'WAITING') {
          device_conditions[Op.or].push({ touched_at: null })
        } else if (
          query_search.toUpperCase() == 'FAILED CONNECTION' ||
          query_search.toUpperCase() == 'FAILED'
        ) {
          device_conditions[Op.not] = {
            touched_at: null,
            connectable: true,
          }
        } else if (query_search == 0 || query_search == false || query_search == 'false') {
          device_conditions[Op.or].push({ remediate: false })
          device_conditions[Op.or].push({ validate: false })
        } else if (query_search == 1 || query_search == true || query_search == 'true') {
          device_conditions[Op.or].push({ remediate: true })
          device_conditions[Op.or].push({ validate: true })
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

      const device = await app
        .get('models')
        .Device.scope(null)
        .findAndCountAll({
          where: device_conditions,
          order,
          ...app.get('models').paginate({ pageNumber, itemsPerPage }),
        })
      return utils.response(statusCodes.SUCCESS, device, req, res)
    } catch (err) {
      return utils.response(statusCodes.SERVER_ERROR, err, req, res)
    }
  })
  app.get(`${prefix}:id`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const { id: device_id } = req.params
      const device = await app.get('models').Device.findByPk(device_id)
      return utils.response(statusCodes.SUCCESS, device, req, res)
    } catch (err) {
      return utils.response(statusCodes.SERVER_ERROR, err, req, res)
    }
  })
  app.post(`${prefix}`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const deviceData = req.body

      if (!deviceData.ip_addr || !deviceData.ip_addr.trim()) {
        // const ip_addr = deviceData.ip_addr;
        return utils.response(statusCodes.BAD_REQUEST, "IP Address Couldn't Be Empty", req, res)
      }

      const os_type = deviceData.os_type
      /*if(deviceData.os_type && deviceData.os_type.trim() != ''){
        var os_type = deviceData.os_type;
      }else{
        return new global.ResponseHandler(req, res).error("OS type couldn't be empty")
      }*/

      let category_id = 0;

      if (deviceData.category_id && deviceData.category_id != '') {
        category_id = deviceData.category_id
      } else {
        const devicecategory = await app.get("models").Devicecategory.findAll({
          where: {
            name: 'Unassigned'
          }
        });
        category_id = devicecategory[0].id;
      }
      // const info = { 'CATEGORYNAME': categoryname }
      const user_id = deviceData.user_id
      /*if(deviceData.user_id){
        var user_id = deviceData.user_id;
      }else{
        return new global.ResponseHandler(req, res).error("user couldn't be empty")
      }*/

      const system_id = deviceData.system_id
      /*if(deviceData.system_id){
        var system_id = deviceData.system_id;
      }else{
        return new global.ResponseHandler(req, res).error("system couldn't be empty")
      }*/

      let mac_address = ''
      if (deviceData.mac_address && deviceData.mac_address.trim() != '') {
        mac_address = deviceData.mac_address
      }

      let host_name = ''
      if (deviceData.host_name && deviceData.host_name.trim() != '') {
        host_name = deviceData.host_name
      }

      let validate = false
      if (deviceData.validate && deviceData.validate == 1) {
        validate = true
      }

      let remediate = false
      if (deviceData.remediate && deviceData.remediate == 1) {
        remediate = true
      }

      let os_build = ''
      if (deviceData.os_build && deviceData.os_build.trim() != '') {
        os_build = deviceData.os_build
      }

      let os_version = ''
      if (deviceData.os_version && deviceData.os_version.trim() != '') {
        os_version = deviceData.os_version
      }

      let os_product_type = ''
      if (deviceData.os_product_type && deviceData.os_product_type.trim() != '') {
        os_product_type = deviceData.os_product_type
      }

      let device_model = ''
      if (deviceData.device_model && deviceData.device_model.trim() != '') {
        device_model = deviceData.device_model
      }

      let hardware = ''
      if (deviceData.hardware && deviceData.hardware.trim() != '') {
        hardware = deviceData.hardware
      }

      let hardware_platform = ''
      if (deviceData.hardware_platform && deviceData.hardware_platform.trim() != '') {
        hardware_platform = deviceData.hardware_platform
      }

      let firmware = ''
      if (deviceData.firmware && deviceData.firmware.trim() != '') {
        firmware = deviceData.firmware
      }

      let drivers = null
      if (deviceData.drivers) {
        drivers = deviceData.drivers
      }

      let applications = null
      if (deviceData.applications) {
        applications = deviceData.applications
      }

      let last_login_user = ''
      if (deviceData.last_login_user && deviceData.last_login_user.trim() != '') {
        last_login_user = deviceData.last_login_user
      }

      let last_login_at = ''
      if (deviceData.last_login_at && deviceData.last_login_at.trim() != '') {
        last_login_at = deviceData.last_login_at
      }

      let username = ''
      if (deviceData.username && deviceData.username.trim() != '') {
        username = deviceData.username
      }

      let password = ''
      if (deviceData.password && deviceData.password.trim() != '') {
        password = deviceData.password
      }

      let status = false
      if (deviceData.status == 1) {
        status = true
      }

      let os_info = {}
      if (deviceData.os_info && deviceData.os_info.length != 0) {
        os_info = deviceData.os_info
      }

      let ssh_private_key = ''
      if (deviceData.ssh_private_key && deviceData.ssh_private_key.length != 0) {
        ssh_private_key = deviceData.ssh_private_key
      }

      let installed_apps = []

      let credential_id = deviceData.credential_id ? deviceData.credential_id : null
      console.log('credential_id before is :: ' + credential_id)
      // if (!deviceData.credential_id) {
      //   const credential = await app.get('models').SystemCredentials.findOne({
      //     where: {
      //       username: username,
      //       password: password,
      //       system_id: system_id,
      //     },
      //   })

      //   Create new if doesn't exists
      //   if (!credential) {
      //     const res = await app.get("models").SystemCredentials.create({
      //       name: `${username}@${deviceData.ip_addr}`,
      //       username: username,
      //       password: password,
      //       system_id: system_id
      //     })

      //     credential_id = res.id
      //   } else {
      //     credential_id = credential.id
      //   }
      // }
      console.log('credential_id after is :: ' + credential_id)
      var devicecount = await app.get("models").Device.count({
        where: { 
          status : true
        }
      })
      const license = await app.get("models").License.findOne({
        where: {},
        order: [ [ 'createdAt', 'DESC' ]]
      });
      if(license!=null){
      const encryptedLicense = Buffer.from(license.licensekey, 'base64');
      const originalData = encryptedLicense.slice(256);
      var decrypted_data = decryptString(originalData.toString('utf-8'))
      var data = JSON.parse(decrypted_data.toString('utf8'))
      if(data.license_name && devicecount < data.usage_limits.max_devices){     
      const device = await app.get('models').Device.create({
        ip_addr: deviceData.ip_addr,
        credential_id: credential_id,
        mac_address: mac_address,
        host_name: host_name,
        os_type: os_type,
        system_id: system_id,
        validate: validate,
        remediate: remediate,
        firmware: firmware,
        os_build: os_build,
        os_version: os_version,
        os_product_type: os_product_type,
        device_model: device_model,
        hardware: hardware,
        hardware_platform: hardware_platform,
        applications: applications,
        drivers: drivers,
        last_login_user: last_login_user,
        last_login_at: last_login_at,
        username: username,
        password: password,
        user_id: user_id,
        status: status,
        // info: info,
        os_info,
        installed_apps,
        ssh_private_key,
        category_id:category_id
      })
      return utils.response(statusCodes.SUCCESS, device, req, res)
      }else{
      var message = data.license_name + ": you can not add more than "+ data.usage_limits.max_devices + " targets"
      return utils.response(statusCodes.BAD_REQUEST, message, req, res);
      }
      }else if(config.licence.licenseName == deviceData.licenseName && devicecount < config.licence.noOfTargets){     
        const device = await app.get('models').Device.create({
          ip_addr: deviceData.ip_addr,
          credential_id: credential_id,
          mac_address: mac_address,
          host_name: host_name,
          os_type: os_type,
          system_id: system_id,
          validate: validate,
          remediate: remediate,
          firmware: firmware,
          os_build: os_build,
          os_version: os_version,
          os_product_type: os_product_type,
          device_model: device_model,
          hardware: hardware,
          hardware_platform: hardware_platform,
          applications: applications,
          drivers: drivers,
          last_login_user: last_login_user,
          last_login_at: last_login_at,
          username: username,
          password: password,
          user_id: user_id,
          status: status,
          // info: info,
          os_info,
          installed_apps,
          ssh_private_key,
          category_id:category_id
        })
        return utils.response(statusCodes.SUCCESS, device, req, res)
      }else{
        var message = config.licence.licenseName + ": you can not add more than "+ config.licence.noOfTargets + " targets"
        return utils.response(statusCodes.BAD_REQUEST, message, req, res);
      
      }
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
      const { id: device_id } = req.params

      var deviceData = req.body

      if (!deviceData.ip_addr || !deviceData.ip_addr.trim()) {
        return utils.response(statusCodes.BAD_REQUEST, "IP Address Couldn't Be Empty", req, res)
      }

      /*if(deviceData.os_type && deviceData.os_type.trim() != ''){
        var os_type = deviceData.os_type;
      }else{
        return new global.ResponseHandler(req, res).error("OS type couldn't be empty")
      }*/

      let os_type = ''
      if (deviceData.os_type && deviceData.os_type.trim() != '') {
        os_type = deviceData.os_type
      }

      let category_id = 0;
      if (deviceData.category_id && deviceData.category_id != '') {
        category_id = deviceData.category_id
      } else {
        const devicecategory = await app.get("models").Devicecategory.findAll({
          where: {
            name: 'Unassigned'
          }
        });
        category_id = devicecategory[0].id;
      }
      // const info = { 'CATEGORYNAME': categoryname }
      let user_id = deviceData.user_id
      /*if(deviceData.user_id){
        var user_id = deviceData.user_id;
      }else{
        return new global.ResponseHandler(req, res).error("user couldn't be empty")
      }*/

      let system_id = deviceData.system_id
      /*if(deviceData.system_id){
        var system_id = deviceData.system_id;
      }else{
        return new global.ResponseHandler(req, res).error("system couldn't be empty")
      }*/

      let mac_address = ''
      if (deviceData.mac_address && deviceData.mac_address.trim() != '') {
        mac_address = deviceData.mac_address
      }

      let host_name = ''
      if (deviceData.host_name && deviceData.host_name.trim() != '') {
        host_name = deviceData.host_name
      }

      let validate = false
      if (deviceData.validate && deviceData.validate == 1) {
        validate = true
      }

      let remediate = false
      if (deviceData.remediate && deviceData.remediate == 1) {
        remediate = true
      }

      let os_build = ''
      if (deviceData.os_build && deviceData.os_build.trim() != '') {
        os_build = deviceData.os_build
      }

      let os_version = ''
      if (deviceData.os_version && deviceData.os_version.trim() != '') {
        os_version = deviceData.os_version
      }

      let os_product_type = ''
      if (deviceData.os_product_type && deviceData.os_product_type.trim() != '') {
        os_product_type = deviceData.os_product_type
      }

      let device_model = ''
      if (deviceData.device_model && deviceData.device_model.trim() != '') {
        device_model = deviceData.device_model
      }

      let hardware = ''
      if (deviceData.hardware && deviceData.hardware.trim() != '') {
        hardware = deviceData.hardware
      }

      let hardware_platform = ''
      if (deviceData.hardware_platform && deviceData.hardware_platform.trim() != '') {
        hardware_platform = deviceData.hardware_platform
      }

      let firmware = ''
      if (deviceData.firmware && deviceData.firmware.trim() != '') {
        firmware = deviceData.firmware
      }

      let drivers = null
      if (deviceData.drivers && deviceData.drivers.trim() != '') {
        drivers = deviceData.drivers
      }

      let applications = null
      if (deviceData.applications && deviceData.applications.trim() != '') {
        applications = deviceData.applications
      }

      let last_login_user = ''
      if (deviceData.last_login_user && deviceData.last_login_user.trim() != '') {
        last_login_user = deviceData.last_login_user
      }

      let last_login_at = ''
      if (deviceData.last_login_at && deviceData.last_login_at.trim() != '') {
        last_login_at = deviceData.last_login_at
      }

      let username = ''
      if (deviceData.username && deviceData.username.trim() != '') {
        username = deviceData.username
      }

      let password = ''
      if (deviceData.password && deviceData.password.trim() != '') {
        password = deviceData.password
      }

      let status = false
      if (deviceData.status == 1) {
        status = true
      }

      let os_info = {}
      if (deviceData.os_info.length != 0) {
        os_info = deviceData.os_info
      }

      let installed_apps = []
      if (deviceData.installed_apps.length != 0) {
        installed_apps = deviceData.installed_apps
      }

      let ssh_private_key = ''
      if (deviceData.ssh_private_key && deviceData.ssh_private_key.length != 0) {
        ssh_private_key = deviceData.ssh_private_key
      }

      let credential_id = deviceData.credential_id ? deviceData.credential_id : null

      const device = await app.get('models').Device.update(
        {
          ip_addr: deviceData.ip_addr,
          mac_address: mac_address,
          credential_id: credential_id,
          host_name: host_name,
          os_type: os_type,
          system_id: system_id,
          validate: validate,
          remediate: remediate,
          firmware: firmware,
          os_build: os_build,
          os_version: os_version,
          os_product_type: os_product_type,
          device_model: device_model,
          hardware: hardware,
          hardware_platform: hardware_platform,
          applications: applications,
          drivers: drivers,
          last_login_user: last_login_user,
          last_login_at: last_login_at,
          username: username,
          password: password,
          user_id: user_id,
          status: status,
          // info: info,
          os_info,
          installed_apps,
          ssh_private_key,
          category_id: category_id,
        },
        {
          where: {
            id: device_id,
          },
        },
      )
      return utils.response(statusCodes.SUCCESS, device, req, res)
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
      const { id } = req.params
      await app.get('models').Device.destroy({
        where: {
          id: id,
        },
      })

      return utils.response(statusCodes.SUCCESS, 'Device Deleted Successfully', req, res)
    } catch (err) {
      console.log(err)

      return utils.response(statusCodes.SERVER_ERROR, err, req, res)
    }
  })
  app.get(`${targetprefix}system/:id`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const { id: system_id } = req.params
      const { pageNumber, itemsPerPage, query_search, sortKey, descSort, catquery_search} = req.query
      const devicecategory_conditions = {
        status: true
      }
      devicecategory_conditions[Op.or] = [
        { system_id: system_id },
        { name: 'Unassigned' }
      ]
      if (catquery_search) {
        devicecategory_conditions[Op.or] = [
          { name: { [Op.iLike]: `%${catquery_search}%` } },
        ]
      }
      let order =
        sortKey &&
        sortKey != null &&
        sortKey !== 'null' &&
        sortKey !== 'undefined' &&
        typeof sortKey !== 'undefined'
        ? [[sortKey, descSort === 'true' ? 'desc' : 'asc']]
        : [['updatedAt', 'desc']]
      const devicecategoryResult = await app
        .get('models')
        .Devicecategory.scope(null)
        .findAndCountAll({
          order,
          where: devicecategory_conditions,
          ...app.get('models').paginate({ pageNumber, itemsPerPage }),
        })
      var devices = [], catResult={};
      if (devicecategoryResult.rows.length > 0) {
        devices = []
        for (let devicecategory of devicecategoryResult.rows) {
          const device_conditions = {
            system_id: system_id,
            category_id: devicecategory.id
          }
          if (query_search) {
            device_conditions[Op.or] = [
              { ip_addr: { [Op.iLike]: `%${query_search}%` } },
              { mac_address: { [Op.iLike]: `%${query_search}%` } },
              { host_name: { [Op.iLike]: `%${query_search}%` } },
              { os_type: { [Op.iLike]: `%${query_search}%` } },
            ]

            if (query_search.toUpperCase() == 'CONNECTED') {
              device_conditions[Op.or].push({ connectable: true })
            } else if (query_search.toUpperCase() == 'WAITING') {
              device_conditions[Op.or].push({ touched_at: null })
            } else if (
              query_search.toUpperCase() == 'FAILED CONNECTION' ||
              query_search.toUpperCase() == 'FAILED'
            ) {
              device_conditions[Op.not] = {
                touched_at: null,
                connectable: true,
              }
            } else if (query_search == 0 || query_search == false || query_search == 'false') {
              device_conditions[Op.or].push({ remediate: false })
              device_conditions[Op.or].push({ validate: false })
            } else if (query_search == 1 || query_search == true || query_search == 'true') {
              device_conditions[Op.or].push({ remediate: true })
              device_conditions[Op.or].push({ validate: true })
            }
          }
          let order1 =
            sortKey &&
              sortKey != null &&
              sortKey !== 'null' &&
              sortKey !== 'undefined' &&
              typeof sortKey !== 'undefined'
              ? [[sortKey, descSort === 'true' ? 'desc' : 'asc']]
              : [['updatedAt', 'desc']]

          const deviceResult = await app
            .get('models')
            .Device.scope(null)
            .findAndCountAll({
              where: device_conditions,
              order1,
              // ...app.get('models').paginate({ pageNumber, itemsPerPage }),
            })
          devicecategory = devicecategory.toJSON();
          devicecategory.deviceCount = deviceResult.count
          devicecategory.devices = deviceResult.rows
          devices.push(devicecategory);
        }
      catResult = {
        count: devicecategoryResult.count,
        rows: devices
      }
      } else {
        devices = []
        const device_conditions1 = {
          system_id: system_id
        }
        if (catquery_search) {
          device_conditions1[Op.or] = [
            { ip_addr: { [Op.iLike]: `%${catquery_search}%` } },
            { mac_address: { [Op.iLike]: `%${catquery_search}%` } },
            { host_name: { [Op.iLike]: `%${catquery_search}%` } },
            { os_type: { [Op.iLike]: `%${catquery_search}%` } },
          ]

          if (catquery_search.toUpperCase() == 'CONNECTED') {
            device_conditions1[Op.or].push({ connectable: true })
          } else if (catquery_search.toUpperCase() == 'WAITING') {
            device_conditions1[Op.or].push({ touched_at: null })
          } else if (
            catquery_search.toUpperCase() == 'FAILED CONNECTION' ||
            catquery_search.toUpperCase() == 'FAILED'
          ) {
            device_conditions1[Op.not] = {
              touched_at: null,
              connectable: true,
            }
          } else if (catquery_search == 0 || catquery_search == false || catquery_search == 'false') {
            device_conditions1[Op.or].push({ remediate: false })
            device_conditions1[Op.or].push({ validate: false })
          } else if (catquery_search == 1 || catquery_search == true || catquery_search == 'true') {
            device_conditions1[Op.or].push({ remediate: true })
            device_conditions1[Op.or].push({ validate: true })
          }
        }
        const deviceResult1 = await app
          .get('models')
          .Device.scope(null)
          .findAndCountAll({
            attributes: ['category_id','id'],
            where: device_conditions1,
          })
        catArray = [], nullCatDeviceIds = [], catDeviceIds = [];
        for (let deviceResult of deviceResult1.rows) {
          if(deviceResult.category_id==null){
            nullCatDeviceIds.push(deviceResult.id);
          }else{
            catDeviceIds.push(deviceResult.id);
            catArray.push(deviceResult.category_id);
          }
        }
        const devicecategory_conditions1 = {
          status: true,
          id: catArray
        }
        // console.log("devicecategory_conditions1: ", devicecategory_conditions1);
        const devicecategoryResult1 = await app
          .get('models')
          .Devicecategory.scope(null)
          .findAndCountAll({
            where: devicecategory_conditions1,
            order,
            ...app.get('models').paginate({ pageNumber, itemsPerPage }),
          })
          for (let devicecategory of devicecategoryResult1.rows) {
            const device_conditions2 = {
              system_id: system_id,
              id: catDeviceIds,
              category_id: devicecategory.id
            }
            // console.log("device_conditions2: ", device_conditions2);
            let order1 =
              sortKey &&
                sortKey != null &&
                sortKey !== 'null' &&
                sortKey !== 'undefined' &&
                typeof sortKey !== 'undefined'
                ? [[sortKey, descSort === 'true' ? 'desc' : 'asc']]
                : [['updatedAt', 'desc']]
  
            const deviceResult2 = await app
              .get('models')
              .Device.scope(null)
              .findAndCountAll({
                where: device_conditions2,
                order1,
                // ...app.get('models').paginate({ pageNumber, itemsPerPage }),
              })
            devicecategory = devicecategory.toJSON();
            devicecategory.deviceCount = deviceResult2.count
            devicecategory.devices = deviceResult2.rows
            devices.push(devicecategory);
          }
        catResult = {
          count: devicecategoryResult1.count,
          rows: devices
        }
      }
      return utils.response(statusCodes.SUCCESS, catResult, req, res)
    } catch (err) {
      return utils.response(statusCodes.SERVER_ERROR, err, req, res)
    }
  })
  function decryptString(encryptedText) {
    // Use mainKey if key is not provided
    key = "d2d273f7e6e2c74ee63640d2fe4d40b8"
    // Ensure the key is in bytes
    const keyBytes = Buffer.from(key, 'utf-8');
    // Decode the Base64 encoded encrypted text
    const combined = Buffer.from(encryptedText, 'base64');
    // Extract the IV and the encrypted data
    const iv = combined.slice(0, 16); // AES block size is 16 bytes
    const encryptedData = combined.slice(16);
     // Create a new AES cipher object
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    // Decrypt the encrypted data
    const decryptedData = decipher.update(encryptedData) + decipher.final();
    // Return the decrypted data
    return decryptedData.toString('utf-8');
  }
  
}
