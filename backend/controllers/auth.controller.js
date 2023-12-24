const {utils, constants, cache, authentication} = require("../helpers");
const {statusCodes} = constants;
const prefix = `/api/v1/auth/`;
const authenticationMiddleware = require("../middlewares/authentication");
const { ENVIROMENT } = require('../../common/config/env')
const config = require("../DB/config/config");
const { Op, Sequelize } = require('sequelize')
module.exports = (app) => {
  app.post(`${prefix}login`, async (req, res) => {
    try {
      app.get("cache").reset()
      const data = req.body

      const user = await app.get("models").User.findOne({
        where: {
         user_name: { [Op.iLike]: `%${data.username}%` }
        }
      })

      if (!user) {
        return utils.response(statusCodes.BAD_REQUEST, "Your Username or Password is Invalid", req, res);
      }


      if (!authentication.comparePassword(data.password, user.password)) {
        return utils.response(statusCodes.BAD_REQUEST, "Your Username or Password is Invalid", req, res);
      }

      if (user.disable) {
        return utils.response(statusCodes.BAD_REQUEST, "Your Account Has Been Disabled", req, res);
      }

      if (user.account_expires && user.expireAt != null && new Date(user.expireAt) < new Date()) {
        return utils.response(statusCodes.BAD_REQUEST, "Your Account Has Been Expired", req, res);
      }

      //var dateDiff = getMinDiff(user.firstlogin, new Date())
      // var dateDiff = getWeeksDiff(user.firstlogin, new Date())
      
      // if(dateDiff > config.licence.licensePeriod){
      //   return utils.response(statusCodes.BAD_REQUEST, "Your License Period Has Been Ended", req, res);
      // }
      const token = authentication.JwTokenIssue({
        "sub": user.id,
        id: user.id,
      });

      app.get("cache").setItem('user-token', token)
      app.get("cache").setItem('user-id', user.id)
      app.get("cache").setItem('user-info', user)

      // const auth = new authService(token, user);
      // auth.get_all_user_data();
      // global.Auth.token = token
      // global.Auth.user = user
      // global.Auth.get_all_user_data()


      // date pass_change_by_admin in case admin force password change
     
      if (user.pass_change_by_admin == 1) {
        await app.get("models").User.update({
          pass_change_by_admin: 0
        }, {
          where: {
            id: user.id
          },
        });
      }
      // if(user.firstlogin== null){
      //   await app.get("models").User.update({
      //     firstlogin: new Date()
      //   }, {
      //     where: {
      //       id: user.id
      //     },
      //   });
      // }

      // const logger = new Logger('Login');
      // const dataAfter = {
      //   ...user.dataValues
      // };
      // delete dataAfter['password'];
      // logger.dataAfter = dataAfter;
      // logger.addLog('login', user.id);

      return utils.response(statusCodes.SUCCESS, {user, token}, req, res);
    } catch (err) {
      console.log(err)
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  })
  function calculateDiff(sentDate) {
    var date1 = new Date(sentDate);
    var date2 = new Date();
    var diffDays = Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));
    var diffMins = Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));
    var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes

    return diffDays;
}
function getMinDiff(startDate, endDate) {
  const msInMinute = 60 * 1000;

  return Math.round(
    Math.abs(endDate - startDate) / msInMinute
  );
}

function getWeeksDiff(startDate, endDate) {
  const msInWeek = 1000 * 60 * 60 * 24 * 7;

  return Math.round(Math.abs(endDate - startDate) / msInWeek);
}
  app.get(`${prefix}account`,[authenticationMiddleware.decodeJWT], async (req, res) => {
    let userInfo;
    try {
      if (app.get("cache").hasItem('user-token')) {
        userInfo =  app.get("cache").getItem('user-info')
      }

      if (!userInfo) {
        if (app.get("cache").hasItem('user-id')) {
          userInfo = await app.get("models").User.findOne({
            where: {
              id: app.get("cache").getItem('user-id'),
            }
          });

          app.get("cache").setItem('user-id', userInfo.id)
          app.get("cache").setItem('user-info', userInfo)
        }
  
      }

      // if (!userInfo) {
      //   return utils.response(statusCodes.BAD_REQUEST, "", req, res);
      // }
      return utils.response(statusCodes.SUCCESS, userInfo, req, res);
    } catch (error) {
      console.log(error);
      return utils.response(statusCodes.SERVER_ERROR, "Please login!", req, res);
    }
  })
  app.post(`${prefix}logout`,[authenticationMiddleware.decodeJWT], async (req, res) => {
    global.Cache.reset();
    return utils.response(statusCodes.SUCCESS, "User Logout Successfully", req, res);
  })
  app.put(`${prefix}`,[authenticationMiddleware.decodeJWT], async (req, res) => {
    var data = req.body
    let user = await app.get("models").User.scope(null).findOne({
      where: {
        id: await global.Auth.get_user_id(),
      }
    })
    if (!user) {
      return utils.response(statusCodes.BAD_REQUEST, "User Not Logged In", req, res);
    }
    if (data.password) {
      if (data.password !== data.password_confirmation) {
        return utils.response(statusCodes.BAD_REQUEST, "Password Doesn't Match Password Confirmation", req, res);
      }
      user.password = authentication.hashPassword(data.password);
    }
    if (data.first_name) {
      user.first_name = data.first_name
    }
    if (data.last_name) {
      user.last_name = data.last_name
    }
    if (data.display_name) {
      user.display_name = data.display_name
    }
    if (data.mobile_number) {
      user.mobile_number = data.mobile_number
    }
    if (data.phone_number) {
      user.phone_number = data.phone_number
    }
    if (data.extension) {
      user.extension = data.extension
    }
    if (data.changedAt) {
      user.changedAt = data.changedAt;
    }
    user.save().catch((ex) => {
      let err_name = " "
      if (ex.name === "SequelizeUniqueConstraintError" || ex.name === "SequelizeValidationError") {
        ex.errors.forEach(error => {
          err_name += " " + error.message + " \n"
        });
      }
      return utils.response(statusCodes.SERVER_ERROR, err_name, req, res);
    })
    app.get("cache").deleteItem('user-info');
    return utils.response(statusCodes.SUCCESS, user, req, res);
  })

  app.post(`${prefix}clear-cache`,[authenticationMiddleware.decodeJWT], async (req, res) => {
    global.Cache.deleteAll();
    console.log(1)
    await sleep(1000);
    console.log(2)
    if (ENVIROMENT.isdev) {
      const {app} = require('electron')
      app.relaunch({args: process.argv.slice(1).concat(['--relaunch'])})
      app.exit(0)
    }
    return utils.response(statusCodes.SUCCESS, "Cache Cleared", req, res);
  })
}
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}   
