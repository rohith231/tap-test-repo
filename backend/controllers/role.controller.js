const {utils, constants, flush} = require("../helpers");
const authenticationMiddleware = require("../middlewares/authentication");
const {statusCodes} = constants;
const prefix = `/api/v1/roles/`;
const {Op} = require('sequelize');
module.exports = (app) => {
  app.get(`${prefix}`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      let {pageNumber, itemsPerPage, query_search, status, sortKey, descSort, search_attributes, includes = true} = req.query;
      let order = sortKey && sortKey !=null && sortKey !== 'null' && sortKey !== 'undefined'   && typeof sortKey !== 'undefined'? [[sortKey, descSort ? "desc" : "asc"]] : [["updatedAt", "desc"]];
      let roles_conditions = {}

      let selected_attributes = ''
      if(search_attributes && search_attributes !=null && search_attributes !== 'null' && search_attributes !== 'undefined' && typeof search_attributes !== 'undefined') {
        attributes = utils.filteredAttributes('Roles');
        selected_attributes = [['id', 'resultID'],[attributes[0], 'resultText'], [attributes[1], 'resultSource']];
      } 

      if (query_search && typeof query_search !== 'undefined'  && query_search !== 'null' && query_search !== 'undefined' ) {
        roles_conditions = {
          [Op.or]: [
            {name: {[Op.iLike]: `%${query_search}%`}} // roles_conditions
          ]
        }
      }

      const include = includes != 'false' ? [{
        model: app.get("models").User.unscoped(),
        attributes: [['id', 'user_id'], "display_name"], // user_id AS id
        required: false,
        as: 'users'
      }]:[];

      console.log(include);

      const data = await app.get("models").Role.findAndCountAll({
        where: roles_conditions,
        attributes: selected_attributes,
        include,
        ...app.get("models").paginate({
          pageNumber,
          itemsPerPage
        }),
        order,
      });
      return utils.response(statusCodes.SUCCESS, data, req, res);
    } catch (err) {
      console.log(err);
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });
  app.get(`${prefix}with-users`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const data = await app.get("models").Role.scope(null).findAll({
        attributes: [['id', 'role_id'], "name"], // role_id AS id
        include: [{
          model: app.get("models").User.unscoped(),
          attributes: [['id', 'user_id'], "display_name"], // user_id AS id
          required: false,
          as: 'users'
        }]
      });

      return utils.response(statusCodes.SUCCESS, data, req, res);
    } catch (err) {
      console.log(err);
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });
  app.get(`${prefix}:id`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const {id: role_id} = req.params;

      const userInfo = global.Cache.getItem('user-info');
      const key = `role-info-${role_id}`;
      // const flush = await flush.needFlush(userInfo.user.id, 'role', key, role_id);
      // if (flush && flush.id) {
      //   flush.deleteFlush(key)
      // }

      let data = null;
      // if (!global.Cache.hasItem(key)) {
        console.log('from db');
        console.log(role_id);
        console.log(key);
        let [selectedPermissions, allPermissions] = await Promise.all([
          app.get("models").RolePermission.scope(null).findAll({
            attributes: ['id', 'role_id','permission_id','attributes'], // role_id AS id

            where: {
              role_id: role_id != 'new' ? role_id : null
            },
            include: [{
              model: app.get("models").Permission,
              right: true
            }],
           
          }),
          app.get("models").Permission.scope(null).findAll()
        ]);
        
        if (!selectedPermissions) {
          selectedPermissions = [];
        }
        let role = {
          name:''
        };

      if (role_id != 'new') {
          role = await app.get("models").Role.scope(null).findByPk(role_id)
        }
        const result = {};
        const enabledArr = [];

        selectedPermissions.forEach((ele) => {
          const {attributes, Permission} = ele;
          const {
            category,
            name,
            id,
            type,
            model_name
          } = Permission;
          
          const subModelObj = {
            id: id,
            label: name,
            key: id,
            module: name,
            enabled: true
          };

          if (type === 'model' && model_name) {
            subModelObj['attributes'] = getAttributes(model_name, attributes, id);
          } else {
            subModelObj['attributes'] = [];
          }
          if (result[`${category}`]) {
            if (!existItem(id, result[`${category}`].subModules)) {
              result[`${category}`].subModules.push(subModelObj);
            }
            
          } else {
            result[`${category}`] = {
              label: category,
              key: category.toLowerCase(),
              module: category,
              subModules: Array.from(new Set([subModelObj].map(JSON.stringify))).map(JSON.parse)
            };
            enabledArr.push[name];
          }
        });


  
        allPermissions.forEach((permission) => {
          const {
            category,
            name,
            id,
            type,
            model_name
          } = permission;
          const subModelObj = {
            id: id,
            key: id,
            label: name,
            module: name,
            enabled: !!enabledArr.includes(name)
          };
  
          if (type === 'model' && model_name) {
            subModelObj['attributes'] = getAttributes(model_name, [],id);
          } else {
            subModelObj['attributes'] = [];
          }

          if (result[`${category}`]) {
            if (!existItem(id, result[`${category}`].subModules)) {
              result[`${category}`].subModules.push(subModelObj);
            }
          } else {
            result[`${category}`] = {
              label: category,
              key: category.toLowerCase(),
              module: category,
              subModules: Array.from(new Set([subModelObj].map(JSON.stringify))).map(JSON.parse)
            };
          }
        })
        data = {
          role,
          groupPermissions: Object.keys(result).map((key) => result[key])
        };
        global.Cache.setItem(key, data)
      // } else {
      //   console.log('from cache');
      //   data = global.Cache.getItem(key);
      // }
      return utils.response(statusCodes.SUCCESS, data, req, res);
    } catch (err) {
      console.log(err)
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  })
  app.post(`${prefix}`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const role_data = req.body;
      app.get("models").Role.findOrCreate({
        where: {
          name: role_data.name
        },
        defaults: {
          name: role_data.name
        }
      }).spread(async (role, isCreated) => {
        if (!isCreated) {
          let err = "user role already exists !";
          return utils.response(statusCodes.BAD_REQUEST, err, req, res);
        }
        const groupPermissions = role_data.groupPermissions
        const dataToInsert = [];
        for (let groupPermissionsIndex = 0; groupPermissionsIndex < groupPermissions.length; groupPermissionsIndex++) {
          const groupPermission = groupPermissions[groupPermissionsIndex];

          for (let permissionIndex = 0; permissionIndex < groupPermission.subModules.length; permissionIndex++) {
            const permission = groupPermission.subModules[permissionIndex];

              var attributes = []
              if (permission.enabled) {
                console.log(permission.label)
                console.log(permission.label)
                console.log(permission.label)
                console.log(permission.label)
                console.log(permission.label)
                console.log(permission.label)
              for (let attributesIndex = 0; attributesIndex < permission.attributes.length; attributesIndex++) {
                var attribute = permission.attributes[attributesIndex];
                if (attribute.enabled) {
                  attributes.push(attribute.label)
                }
              }

              if ((attributes.length == 0 && permission.attributes.length == 0) || attributes.length > 0 && permission.attributes.length > 0) {
                dataToInsert.push({
                  role_id: role.id,
                  permission_id: permission.id,
                  attributes: attributes,
                });
                // await app.get("models").RolePermission.create({
                //   role_id: role.id,
                //   permission_id: permission.id,
                //   attributes: attributes,
                // })
              }
            }
          }
        }

        if (dataToInsert.length) {
          await app.get("models").RolePermission.bulkCreate(dataToInsert);
        }
        return utils.response(statusCodes.SUCCESS, role, req, res);
      });
    } catch (error) {
      let errMessage = error;
      if (error.name === "SequelizeUniqueConstraintError" || error.name === "SequelizeValidationError") {
        errMessage = " "
        error.errors.forEach(error => {
          errMessage += " " + error.message + " \n"
        });
      }
      return utils.response(statusCodes.SERVER_ERROR, errMessage, req, res);
    }
  });
  app.put(`${prefix}:id`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const {id: roleId} = req.params;
      const role_data = req.body;
      console.log(role_data)
      const isExists = await app.get("models").Role.findOne({
        where: {
          id: {[Op.ne]: roleId},
          name: role_data.name
        }
      });
      if (isExists) {
        let err = "user role already exists !";
        return utils.response(statusCodes.BAD_REQUEST, err, req, res);
      }
      const groupPermissions = role_data.groupPermissions
      // let role = null;


      await app.get("models").Role.update({
        name: role_data.name
      }, {
        where: {
          id: roleId
        },
      })
      await app.get("models").RolePermission.destroy({
        where: {
          role_id: roleId
        }
      })
      const dataToInsert = [];

      //var groupSettings = []
      for (let groupPermissionsIndex = 0; groupPermissionsIndex < groupPermissions.length; groupPermissionsIndex++) {
        const groupPermission = groupPermissions[groupPermissionsIndex];


          for (let permissionIndex = 0; permissionIndex < groupPermission.subModules.length; permissionIndex++) {
            const permission = groupPermission.subModules[permissionIndex];

            if (permission.enabled) {
              var attributes = []
              for (let attributesIndex = 0; attributesIndex < permission.attributes.length; attributesIndex++) {
                var attribute = permission.attributes[attributesIndex];
                if (attribute.enabled) {
                  attributes.push(attribute.label)
                }
              }
              if ((attributes.length == 0 && permission.attributes.length == 0) || attributes.length > 0 && permission.attributes.length > 0) {

                dataToInsert.push({
                  role_id: roleId,
                  permission_id: permission.id,
                  attributes: attributes,
                });
              }
            }
          }
      }
      if (dataToInsert.length) {
        await app.get("models").RolePermission.bulkCreate(dataToInsert);
      }

      await app.get("models").UserRole.findAll({
        where: {
          role_id: roleId
        }
      }).then(async (users_roles) => {
        // var flushDataAll = [];

        // for (let index = 0; index < users_roles.length; index++) {
        //   const user_role = users_roles[index];
        //   //flushObj.createFlush(user_role.user_id, 'user', 'user-info', user_role.role_id);
        //   var flushData = {
        //     user_id: user_role.user_id,
        //     model: 'user',
        //     key: 'user-info',
        //     related_id: user_role.role_id,
        //     createdAt: new Date(),
        //     updatedAt: new Date()
        //   }
        //   flushDataAll.push(flushData);
        // }
        // console.log('create user roles bulk flush.......')

        // flush.createBulkFlush(flushDataAll);

        // var permissions = await app.get("models").Permission.findAll({
        //   attributes: ['id'],
        //   where: {
        //     name: {
        //       [Op.in]: ['role-list', 'role-edit', 'role-delete', 'role-view']
        //     }
        //   }
        // })

        // var permissions_ids = permissions.map(permission => permission.id)

        // var roles = await app.get("models").RolePermission.findAll({
        //   attributes: ['id', 'role_id','permission_id','attributes'], // role_id AS id
        //   where: {
        //     permission_id: {
        //       [Op.in]: permissions_ids
        //     }
        //   }
        // })

        // var flushPermissionAll = [];

        // const roleIds = [];
        // roles.forEach((ele) => {
        //   if (!roleIds.includes(ele.role_id)) {
        //     roleIds.push(ele.role_id);
        //   }
        // });

        // console.log('roleIds : ', roleIds)
        // //for (let index = 0; index < roles.length; index++) {
        // var users = await app.get("models").UserRole.findAll({
        //   where: {
        //     role_id: {
        //       [Op.in]: roleIds
        //     }
        //   },
        // })

        // console.log('users list  : ', users)

        // for (let user_index = 0; user_index < users.length; user_index++) {
        //   //await  flushObj.createFlush(users[user_index].user_id,'role','role-info-'+req.params.role_id,req.params.role_id);
        //   var flushPermission = {
        //     user_id: users[user_index].user_id,
        //     model: 'role',
        //     key: 'role-info-' + roleId,
        //     related_id: roleId,
        //     createdAt: new Date(),
        //     updatedAt: new Date()
        //   }
        //   flushPermissionAll.push(flushPermission);
        // }
        // //console.log('flushPermissionAll.......'+flushPermissionAll)
        // console.log('create bulk flush second.......')
        // flush.createBulkFlush(flushPermissionAll);
      });
    } catch (error) {
      console.log(error)
      let errMessage = error;
      if (error.name === "SequelizeUniqueConstraintError" || error.name === "SequelizeValidationError") {
        errMessage = " "
        error.errors.forEach(error => {
          errMessage += " " + error.message + " \n"
        });
      }
      return utils.response(statusCodes.SERVER_ERROR, errMessage, req, res);
    }
    return utils.response(statusCodes.SUCCESS, null, req, res);
  });
  app.delete(`${prefix}:id`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const {id} = req.params;
      await saveFlushData(id);
      app.get("models").Role.destroy({
        where: {
          id: id
        }
      });
      return utils.response(statusCodes.SUCCESS, "Role Deleted Successfully", req, res);
    } catch (err) {
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });
  const saveFlushData = async (roleId) => {
    try {
      const userRoles = await app.get("models").UserRole.findAll({
        where: {
          role_id: roleId
        }
      });
      const flushDataAll = [];

      console.log('delete all user Role.......')


      for (let index = 0; index < userRoles.length; index++) {
        const user_role = userRoles[index];
        const flushData = {
          user_id: user_role.user_id,
          model: 'user',
          key: 'user-info',
          related_id: user_role.role_id,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        flushDataAll.push(flushData);
      }
      console.log('create bulk flush.......');
      flush.createBulkFlush(flushDataAll);

      const permissions = await app.get("models").Permission.findAll({
        attributes: ['id'],
        where: {
          name: {
            [Op.in]: ['role-list', 'role-edit', 'role-delete', 'role-view']
          }
        }
      })

      const permissions_ids = permissions.map(permission => permission.id)
      const roles = await app.get("models").RolePermission.findAll({
        where: {
          permission_id: {
            [Op.in]: permissions_ids
          }
        }
      })
      const flushPermissionAll = [];

      const roleIds = [];
      roles.forEach((ele) => {
        if (!roleIds.includes(ele.role_id)) {
          roleIds.push(ele.role_id);
        }
      });

      console.log('roleIds : ', roleIds)
      const users = await app.get("models").UserRole.findAll({
        where: {
          role_id: {
            [Op.in]: roleIds
          }
        },
      })


      for (let user_index = 0; user_index < users.length; user_index++) {
        var flushPermission = {
          user_id: users[user_index].user_id,
          model: 'role',
          key: 'role-info-' + roleId,
          related_id: roleId,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        flushPermissionAll.push(flushPermission);
      }

      console.log('create bulk flush second.......')
      flush.createBulkFlush(flushPermissionAll);
    } catch (err) {
      console.log("Error on insert flush data before delete role by id with error : ", err);
    }
  }

  function getAttributes(modelName, selectedAttr = null,subModelId = null) {
    const result = [];
    const {
      rawAttributes
    } = app.get("models")[modelName];
    Object.keys(rawAttributes).filter((attribute) => {
      const {
        attrsToSkip
      } = rawAttributes;
      if (attrsToSkip && !attrsToSkip.get().includes(attribute)) {
        const enabled = !!(selectedAttr && selectedAttr.includes(attribute));
        result.push({
          label: attribute,
          key: subModelId+'-'+attribute.toLowerCase(),
          enabled: enabled
        })
      }
    })
    return result;
  }

  function existItem(id, rolePermssionSubModules) {
    return rolePermssionSubModules.find((ele) => ele.id === id);
  }
}
