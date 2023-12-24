const { utils, constants, flush } = require("../helpers");
const authenticationMiddleware = require("../middlewares/authentication");
const { statusCodes } = constants;
const prefix = `/api/v1/systems/`;
const { Op } = require('sequelize');
const config = require("../DB/config/config");
const crypto = require('crypto');

module.exports = (app) => {
  app.get(`${prefix}`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const { pageNumber, itemsPerPage, query_search, sortKey, descSort, search_attributes } = req.query;
     const order = sortKey && sortKey != null && sortKey !== 'null' && sortKey !== 'undefined' && typeof sortKey !== 'undefined' ? [[sortKey, descSort === 'true' ? "desc" : "asc"]] : [["updatedAt", "desc"]];

      let selected_attributes = ''
      if (search_attributes && search_attributes !== 'null' && search_attributes !== 'undefined' && typeof search_attributes !== 'undefined') {
        attributes = utils.filteredAttributes('Systems');
        selected_attributes = [['id', 'resultID'], [attributes[0], 'resultText'], [attributes[1], 'resultSource']];
      }

      let systems = []
      try {
        systems = app.get("cache").getItem('user-info').Systems
      } catch (e) {
        console.log(e)
      }

      const systems_ids = systems.map(system => system.id)
      console.log("systems_ids>>>>>>>>", systems_ids)
      const where = {
        id: {
          [Op.in]: systems_ids
        },
      }
      if (query_search && typeof query_search !== 'undefined' && query_search !== 'null' && query_search !== 'undefined') {
        where[Op.or] = [
          { name: { [Op.iLike]: `%${query_search}%` } },
          { identifier: { [Op.iLike]: `%${query_search}%` } },
          { abbreviation: { [Op.iLike]: `%${query_search}%` } },
        ]
      }

      const count = await app.get("models").System.scope(null).count({
        where
      });

      const rows = await app.get("models").System.findAll({
        where,
        attributes: selected_attributes,
        ...app.get("models").paginate({
          pageNumber,
          itemsPerPage
        }),
        order
      });
      return utils.response(statusCodes.SUCCESS, { rows, count }, req, res);
    } catch (err) {
      console.log(err)
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });
  app.get(`${prefix}:id`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const { id } = req.params;
      const system = await app.get("models").System.findAll({
        where: {
          id: id
        },
        include: {
          model: app.get("models").Framework.unscoped(),
          required: false
        }
      });
      if (system.length === 0) {
        return utils.response(statusCodes.BAD_REQUEST, "Not able to return system information", req, res);
      }
      return utils.response(statusCodes.SUCCESS, system[0], req, res);
    } catch (err) {
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });
  app.post(`${prefix}`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const systemData = req.body
      if (systemData.name && systemData.name.trim() != '') {
        var name = systemData.name;
      } else {
        return utils.response(statusCodes.BAD_REQUEST, "System name couldn't be empty", req, res);
      }

      if (systemData.description && systemData.description.trim() != '') {
        var description = systemData.description;
      } else {
        return utils.response(statusCodes.BAD_REQUEST, "System description couldn't be empty", req, res);
      }

      if (systemData.abbreviation && systemData.abbreviation.trim() != '') {
        var abbreviation = systemData.abbreviation;
      } else {
        return utils.response(statusCodes.BAD_REQUEST, "System abbreviation couldn't be empty", req, res);
      }

      if (systemData.identifier && systemData.identifier.trim() != '') {
        var identifier = systemData.identifier;
      } else {
        return utils.response(statusCodes.BAD_REQUEST, "System identifier couldn't be empty", req, res);
      }

      if (systemData.organization_id) {
        var organization_id = systemData.organization_id;
      } else {
        return utils.response(statusCodes.BAD_REQUEST, "Organization couldn't be empty", req, res);
      }

      if (systemData.user_id) {
        var user_id = systemData.user_id;
      } else {
        return utils.response(statusCodes.BAD_REQUEST, "User couldn't be empty", req, res);
      }
      var systemcount = await app.get("models").System.count({
        where: {
          status: true
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
      if(data.license_name && systemcount < data.usage_limits.max_info_system){
       var status = systemData.status == 1;
       await app.get("models").System.findOrCreate({
        where: {
          [Op.or]: [
            { name: name },
            { abbreviation: abbreviation },
            { identifier: identifier }
          ]
        },
        defaults: {
          name: name,
          description: description,
          abbreviation: abbreviation,
          identifier: identifier,
          organization_id: organization_id,
          user_id: user_id,
          status: status,
        }
       }).spread(
        async (system, isCreated) => {
          if (!isCreated) {
            let err = "System already exists";
            if (system.name === name) {
              err = 'System name already taken.';
            } else if (system.abbreviation === abbreviation) {
              err = 'System abbreviation already taken.';
            } else if (system.identifier === identifier) {
              err = 'System identifier already taken.';
            }
            return utils.response(statusCodes.BAD_REQUEST, err, req, res);
          }


          if (systemData.Frameworks && systemData.Frameworks.length > 0) {
            var system_frameworks = [];
            systemData.Frameworks.map((identifier) => {
              console.log("identifier")
              console.log(identifier)
              console.log("identifier")
              system_frameworks.push({
                framework_identifier: identifier,
                system_id: system.id
              });
            });
            await app.get("models").SystemFramework.bulkCreate(system_frameworks);
          }


          //users list in supper admin role
          const users = await app.get("models").UserRole.findAll({
            where: {
              role_id: 'c32e3cc0-f20f-11ea-8fd0-bdb301126903',
            }
          });
          const flushDataAll = [];
          for (let index = 0; index < users.length; index++) {
            if (users[index].id != user_id) {
              await app.get("models").UserSystem.findOrCreate({
                where: {
                  user_id: users[index].user_id,
                  system_id: system.id
                }
              })
            }
          }

          app.get("cache").deleteItem('user-info')

          return utils.response(statusCodes.SUCCESS, system, req, res);
        });
      }else{
        var message = data.license_name + ": you can not add more than "+ data.usage_limits.max_info_system + " systems"
        return utils.response(statusCodes.BAD_REQUEST, message, req, res);
      }
      }else if(config.licence.licenseName == systemData.licenseName && systemcount < config.licence.noOfInformationSystem){
        var status = systemData.status == 1;
        await app.get("models").System.findOrCreate({
         where: {
           [Op.or]: [
             { name: name },
             { abbreviation: abbreviation },
             { identifier: identifier }
           ]
         },
         defaults: {
           name: name,
           description: description,
           abbreviation: abbreviation,
           identifier: identifier,
           organization_id: organization_id,
           user_id: user_id,
           status: status,
         }
        }).spread(
         async (system, isCreated) => {
           if (!isCreated) {
             let err = "System already exists";
             if (system.name === name) {
               err = 'System name already taken.';
             } else if (system.abbreviation === abbreviation) {
               err = 'System abbreviation already taken.';
             } else if (system.identifier === identifier) {
               err = 'System identifier already taken.';
             }
             return utils.response(statusCodes.BAD_REQUEST, err, req, res);
           }
 
 
           if (systemData.Frameworks && systemData.Frameworks.length > 0) {
             var system_frameworks = [];
             systemData.Frameworks.map((identifier) => {
               console.log("identifier")
               console.log(identifier)
               console.log("identifier")
               system_frameworks.push({
                 framework_identifier: identifier,
                 system_id: system.id
               });
             });
             await app.get("models").SystemFramework.bulkCreate(system_frameworks);
           }
 
 
           //users list in supper admin role
           const users = await app.get("models").UserRole.findAll({
             where: {
               role_id: 'c32e3cc0-f20f-11ea-8fd0-bdb301126903',
             }
           });
           const flushDataAll = [];
           for (let index = 0; index < users.length; index++) {
             if (users[index].id != user_id) {
               await app.get("models").UserSystem.findOrCreate({
                 where: {
                   user_id: users[index].user_id,
                   system_id: system.id
                 }
               })
             }
           }
 
           app.get("cache").deleteItem('user-info')
 
           return utils.response(statusCodes.SUCCESS, system, req, res);
         });
      }else{
         var message = config.licence.licenseName + ": you can not add more than "+ config.licence.noOfInformationSystem + " systems"
         return utils.response(statusCodes.BAD_REQUEST, message, req, res);
      }
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
      const { id: system_id } = req.params;
      const systemData = req.body

      if (systemData.name && systemData.name.trim() != '') {
        var name = systemData.name;

      } else {
        return utils.response(statusCodes.BAD_REQUEST, "System name couldn't be empty", req, res);
      }

      if (systemData.description && systemData.description.trim() != '') {
        var description = systemData.description;
      } else {
        return utils.response(statusCodes.BAD_REQUEST, "System description couldn't be empty", req, res);
      }

      if (systemData.abbreviation && systemData.abbreviation.trim() != '') {
        var abbreviation = systemData.abbreviation;
        // const item = await app.get("models").System.findOne({
        //   where: {id:{[Op.ne]:req.params.system_id},abbreviation}
        // });
        // if (item) {
        //   return new global.ResponseHandler(req, res).error("System Abbreviation Already Taken.")
        // }
      } else {
        return utils.response(statusCodes.BAD_REQUEST, "System abbreviation couldn't be empty", req, res);
      }

      if (systemData.identifier && systemData.identifier.trim() != '') {
        var identifier = systemData.identifier;
        // const item = await app.get("models").System.findOne({
        //   where: {id:{[Op.ne]:req.params.system_id},identifier}
        // });
        // if (item) {
        //   return new global.ResponseHandler(req, res).error("System Identifier Already Taken.")
        // }
      } else {
        return utils.response(statusCodes.BAD_REQUEST, "System identifier couldn't be empty", req, res);
      }

      if (systemData.organization_id) {
        var organization_id = systemData.organization_id;
      } else {
        return utils.response(statusCodes.BAD_REQUEST, "Organization couldn't be empty", req, res);
      }

      if (systemData.user_id) {
        var user_id = systemData.user_id;
      } else {
        return utils.response(statusCodes.BAD_REQUEST, "User couldn't be empty", req, res);
      }

      var status = systemData.status == 1;
      const isExistsSystem = await app.get("models").System.findOne({
        where: {
          id: { [Op.ne]: system_id },
          [Op.or]: [
            { name },
            { abbreviation },
            { identifier }
          ]
        }
      });
      if (isExistsSystem) {
        let err = "System already exists";
        if (isExistsSystem.name === name) {
          err = 'System name already taken.';
        } else if (isExistsSystem.abbreviation === abbreviation) {
          err = 'System abbreviation already taken.';
        } else if (isExistsSystem.identifier === identifier) {
          err = 'System identifier already taken.';
        }
        return utils.response(statusCodes.BAD_REQUEST, err, req, res);
      }


      await app.get("models").System.update({
        name: name,
        description: description,
        abbreviation: abbreviation,
        identifier: identifier,
        organization_id: organization_id,
        user_id: user_id,
        status: status,
        ato_approval_step: 'Create',
        oss_credentials: systemData.oss_credentials

      }, {
        where: {
          id: system_id
        },
      }).then(async (system) => {

        await app.get("models").SystemFramework.destroy({
          where: {
            system_id: system_id,
          }
        });

        if (systemData.Frameworks && systemData.Frameworks.length > 0) {
          var system_frameworks = [];
          systemData.Frameworks.map((identifier) => {
            system_frameworks.push({
              framework_identifier: identifier,
              system_id: system_id
            });
          });


          await app.get("models").SystemFramework.bulkCreate(system_frameworks);
        }
        if (systemData.ato_approval_step != 'Create') {
          await app.get("models").ApprovalProcessHistory.create({
            system_id: system_id,
            type: 'ato',
            action: "edit",
            comment: "",
            action_by: user_id,
            approval_process: [],
            assigned_to: []
          })
        }
        app.get("cache").deleteItem('user-info');

        return utils.response(statusCodes.SUCCESS, system, req, res);
      })
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
  app.delete(`${prefix}:id`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const { id: system_id } = req.params;
      let userInfo = app.get("cache").getItem('user-info')
      const systemUsers = await app.get("models").UserSystem.findAll({
        where: {
          system_id: system_id
        }
      });
      app.get("models").System.destroy({
        where: {
          id: system_id
        },
      });

      let systems = app.get("cache").getItem('user-info').Systems
      let filterSystem = systems.filter(function (system) {
        return system.id != system_id;
      });
      userInfo['Systems'] = filterSystem;

      app.get("cache").deleteItem('user-info')
      app.get("cache").setItem('user-info', userInfo);
      return utils.response(statusCodes.SUCCESS, "System deleted successfully", req, res);
    } catch (err) {
      console.log(err)
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });

  app.get(`${prefix}credentials/:id`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const { id } = req.params;
      const data = await app.get("models").SystemCredentials.findAll({
        where: {
          system_id: id
        }
      });

      return utils.response(statusCodes.SUCCESS, data, req, res);
    } catch (err) {
      console.log(err)
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });
  app.post(`${prefix}credentials/:system_id`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const { system_id } = req.params;

      const { oss_credentials } = req.body;
      // console.log(oss_credentials)

      await app.get("models").SystemCredentials.destroy({
        where: {
          system_id: system_id
        }
      })

      await app.get("models").SystemCredentials.bulkCreate(oss_credentials,
        {
          fields: ["id", "system_id", "name", "username", "password", "ssh_private_key", "port", "createdAt", "updatedAt", "deletedAt"],
          updateOnDuplicate: ["name", "username", "password", "ssh_private_key", "port", "createdAt", "updatedAt", "deletedAt"],
        })
        
      return utils.response(statusCodes.SUCCESS, {}, req, res);

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
