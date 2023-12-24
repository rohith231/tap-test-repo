const config = require("../DB/config/config");
const {utils, constants, flush} = require("../helpers");
const authenticationMiddleware = require("../middlewares/authentication");
const {statusCodes} = constants;
const prefix = `/api/v1/settings/`;
const { ENVIROMENT } = require('../../common/config/env');
module.exports = (app) => {
  app.get(`${prefix}`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const setting = await app.get("models").Setting.findAll({
        where: {
          configuration_type: 'regular'
        }
      });
      return utils.response(statusCodes.SUCCESS, setting, req, res);
    } catch (err) {
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });
  app.get(`${prefix}:key`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const {key} = req.params;
      const setting = await app.get("models").Setting.findOne({
        where: {
          setting_key: key
        }
      });
      return utils.response(statusCodes.SUCCESS, setting, req, res);
    } catch (err) {
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });
  app.post(`${prefix}`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const settingData = req.body;
      const setting = await app.get("models").Setting.create({
        setting_type: settingData.setting_type,
        setting_key: settingData.setting_key,
        setting_value: settingData.setting_value,
      });
      if (settingData.Roles) {
        let settingDataAll = [];
        for (let index = 0; index < settingData.Roles.length; index++) {
          const role = settingData.Roles[index];
          //await app.get("models").SettingRole.create({  setting_id: setting.id, role_id: role.id})
          let userSettingData = {
            setting_id: setting.id,
            role_id: role
          }
          settingDataAll.push(userSettingData);
          // const users_roles = app.get("models").UserRole.findAll({
          //   where: {
          //     role_id: role.id
          //   }
          // });
          let flushDataAll = [];
          // for (let index = 0; index < users_roles.length; index++) {
          //   const user_role = users_roles[index];
          //   //flushObj.createFlush(user_role.user_id,'user','user-info',user_role.role_id);
          //   let flushData = {
          //     user_id: user_role.user_id,
          //     model: 'user',
          //     key: 'user-info',
          //     related_id: user_role.role_id,
          //     createdAt: new Date(),
          //     updatedAt: new Date()
          //   }
          //   flushDataAll.push(flushData);
          // }
          // console.log('create bulk flush.......')
          // flush.createBulkFlush(flushDataAll);
        }
        console.log('create bulk setting role.......')
        await app.get("models").SettingRole.bulkCreate(settingDataAll)
      }
      return utils.response(statusCodes.SUCCESS, setting, req, res);
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
      const {id:setting_id } = req.params;
      // const setting_id = id;
      const settingData = req.body;


      await app.get("models").Setting.update({
        setting_type: settingData.setting_type,
        setting_key: settingData.setting_key,
        setting_value: settingData.setting_value,
        extra: settingData.extra ? settingData.extra : {},
      }, {
        where: {
          id: setting_id
        },
      });

      //added by rami badran
      // const settingRoles = await app.get("models").SettingRole.findAll({
      //   where: {
      //     setting_id: setting_id
      //   }
      // });
      // for (let index = 0; index < settingRoles.length; index++) {
      //   let role = settingRoles[index];

      //   const users = app.get("models").UserRole.findAll({
      //     where: {
      //       role_id: role.role_id
      //     }
      //   });
      //   let flushDataAll = [];
      //   for (let index = 0; index < users.length; index++) {
      //     let user = users[index];
      //     //flushObj.createFlush(user.user_id,'user','user-info',setting_id);
      //     let flushData = {
      //       user_id: user.user_id,
      //       model: 'user',
      //       key: 'user-info',
      //       related_id: setting_id,
      //       createdAt: new Date(),
      //       updatedAt: new Date()
      //     }
      //     flushDataAll.push(flushData);
      //   }
      //   console.log('create bulk flush.......')
      //   flush.createBulkFlush(flushDataAll);
      // }
      //end
      await app.get("models").SettingRole.destroy({where: {setting_id: setting_id}})
      if (settingData.Roles) {
        var settingDataAll = [];
        for (let index = 0; index < settingData.Roles.length; index++) {
          const role = settingData.Roles[index];
          //await app.get("models").SettingRole.create({  setting_id: setting_id, role_id: role.id})
          const userSettingData = {
            setting_id: setting_id,
            role_id: role
          }
          settingDataAll.push(userSettingData);
          // const users_roles = app.get("models").UserRole.findAll({
          //   where: {
          //     role_id: role
          //   }
          // });
          // let flushDataAll = [];
          // for (let index = 0; index < users_roles.length; index++) {
          //   const user_role = users_roles[index];
          //   //flushObj.createFlush(user_role.user_id,'user','user-info',user_role.role_id);
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
          console.log('create bulk flush.......')
          // flush.createBulkFlush(flushDataAll);
        }
        console.log('create bulk setting role.......')
        await app.get("models").SettingRole.bulkCreate(settingDataAll)
      }
      return utils.response(statusCodes.SUCCESS, "done", req, res);
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
      const {id } = req.params;
      // const settingData = req.body;


      await app.get("models").Setting.destroy({
        where: {
          id
        },
      });
      await app.get("models").SettingRole.destroy({where: {setting_id: id}})

      //added by rami badran
      // const settingRoles = await app.get("models").SettingRole.findAll({
      //   where: {
      //     setting_id: setting_id
      //   }
      // });
      // for (let index = 0; index < settingRoles.length; index++) {
      //   let role = settingRoles[index];

      //   const users = app.get("models").UserRole.findAll({
      //     where: {
      //       role_id: role.role_id
      //     }
      //   });
      //   let flushDataAll = [];
      //   for (let index = 0; index < users.length; index++) {
      //     let user = users[index];
      //     //flushObj.createFlush(user.user_id,'user','user-info',setting_id);
      //     let flushData = {
      //       user_id: user.user_id,
      //       model: 'user',
      //       key: 'user-info',
      //       related_id: setting_id,
      //       createdAt: new Date(),
      //       updatedAt: new Date()
      //     }
      //     flushDataAll.push(flushData);
      //   }
      //   console.log('create bulk flush.......')
      //   flush.createBulkFlush(flushDataAll);
      // }
      //end
      // if (settingData.Roles) {
      //   var settingDataAll = [];
      //   for (let index = 0; index < settingData.Roles.length; index++) {
      //     const role = settingData.Roles[index];
      //     //await app.get("models").SettingRole.create({  setting_id: setting_id, role_id: role.id})
      //     const userSettingData = {
      //       setting_id: setting_id,
      //       role_id: role
      //     }
      //     settingDataAll.push(userSettingData);
      //     // const users_roles = app.get("models").UserRole.findAll({
      //     //   where: {
      //     //     role_id: role
      //     //   }
      //     // });
      //     // let flushDataAll = [];
      //     // for (let index = 0; index < users_roles.length; index++) {
      //     //   const user_role = users_roles[index];
      //     //   //flushObj.createFlush(user_role.user_id,'user','user-info',user_role.role_id);
      //     //   var flushData = {
      //     //     user_id: user_role.user_id,
      //     //     model: 'user',
      //     //     key: 'user-info',
      //     //     related_id: user_role.role_id,
      //     //     createdAt: new Date(),
      //     //     updatedAt: new Date()
      //     //   }
      //     //   flushDataAll.push(flushData);
      //     // }
      //     console.log('create bulk flush.......')
      //     // flush.createBulkFlush(flushDataAll);
      //   }
      //   console.log('create bulk setting role.......')
      //   await app.get("models").SettingRole.bulkCreate(settingDataAll)
      // }
      return utils.response(statusCodes.SUCCESS, "done", req, res);
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
  app.post(`${prefix}system-optimization`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const {tasks} = req.body;
      if (tasks.includes("DELETE_ALL_NOTIFIONS")) {
        await app.get("models").Notification.destroy({truncate: true})
      }

      if (tasks.includes("DELETE_ALL_LOGS")) {
        await app.get("models").Logs.destroy({truncate: true})
      }

      if (tasks.includes("RESET_DATABASE")) {
        const {exec} = require("child_process");
        global.Cache.reset();
        await new Promise((resolve, reject) => {
          if (!ENVIROMENT.isdev) {
            config.development = global.Cache.getItem('db-connection');
          } else {
            config.production = global.Cache.getItem('db-connection')
          }
      

        });
        if (ENVIROMENT.isdev) {
          const electronApp = require('electron').app
          electronApp.relaunch({args: process.argv.slice(1).concat(['--relaunch'])})
          electronApp.exit(0)
        }
      }

      if (tasks.includes("DATABASE_BACKUP")) {
       
      }

      return utils.response(statusCodes.SUCCESS, null, req, res);
    } catch (err) {
      console.log(err)
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });
}
