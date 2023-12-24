const {utils, constants, authentication, flush} = require("../helpers");
const authenticationMiddleware = require("../middlewares/authentication");
const {statusCodes} = constants;
const prefix = `/api/v1/users/`;
const {Op} = require('sequelize');
module.exports = (app) => {
  // app.use(authenticationMiddleware.decodeJWT);


  app.get(`${prefix}`,[authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      let {pageNumber, itemsPerPage, query_search, sortKey, descSort, search_attributes, includes = true} = req.query;

      let selected_attributes = ''
      if(search_attributes && search_attributes !=null && search_attributes !== 'null' && search_attributes !== 'undefined' && typeof search_attributes !== 'undefined') {
        attributes = utils.filteredAttributes('Users');
        selected_attributes = [['id', 'resultID'],[attributes[0],'resultText'],[attributes[1],'resultSource']];
      } 

      let order = sortKey && sortKey !=null && sortKey !== 'null' && sortKey !== 'undefined'   && typeof sortKey !== 'undefined'? [[sortKey, descSort ? "desc" : "asc"]] : [["updatedAt", "desc"]];
      

      

      let users_conditions = {}
      if (query_search) {
        users_conditions = {
          [Op.or]: [{
            first_name: {
              [Op.iLike]: `%${query_search}%`
            }
          },
            {
              last_name: {
                [Op.iLike]: `%${query_search}%`
              }
            },
            {
              user_name: {
                [Op.iLike]: `%${query_search}%`
              }
            },
            {
              email: {
                [Op.iLike]: `%${query_search}%`
              }
            },
            // {
            //   "$roles.name$": {
            //     [Op.iLike]: `%${query_search}%`
            //   }
            // } // roles_conditions
          ]
        }
      }

      const include = includes != 'false' ? [{
        model:  app.get("models").Role.unscoped(),
        required: false,
      }]:[]

      const {count, rows}= await  app.get("models").User.scope(null).findAndCountAll({
          include,
          distinct: true,
          attributes: selected_attributes,
          subQuery: false,
          where: users_conditions,
          ...app.get("models").paginate({
            pageNumber,
            itemsPerPage
          }),
          order
        });

      return utils.response(statusCodes.SUCCESS, {count, rows}, req, res);
    } catch (err) {
      return utils.response(statusCodes.SERVER_ERROR, err.message, req, res);
    }
  });
  app.get(`${prefix}:id`,[authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const {id} = req.params;
      const user = await  app.get("models").User.scope(null).findOne({
        where: {
          id: id
        },
        include: [{
          model:  app.get("models").Role.unscoped(),
          required: false,
        },
          {
            model:  app.get("models").System.unscoped(),
            required: false,
          }
        ]
      });
      user.password = '';
  
      return utils.response(statusCodes.SUCCESS, user, req, res);
    } catch (err) {
      return utils.response(statusCodes.SERVER_ERROR, err.message, req, res);
    }
  });
  app.post(`${prefix}`,[authenticationMiddleware.decodeJWT], async (req, res) => {
    const userData = req.body;
    if (userData.password != userData.confirm_password) {
      return utils.response(statusCodes.BAD_REQUEST, "Password doesn't match password confirmation", req, res);
    }
    let first_name = "";
    if (userData.first_name) {
      first_name = userData.first_name
    }

    let last_name = "";
    if (userData.last_name) {
      last_name = userData.last_name
    }

    let display_name = "";
    if (userData.display_name) {
      display_name = userData.display_name
    }

    let email = "";
    if (userData.email) {
      email = userData.email
    }

    let user_name = "";
    if (userData.user_name) {
      user_name = userData.user_name
    }

    let password = "";
    if (userData.password) {
      password = userData.password
    }

    let mobile_number = "";
    if (userData.mobile_number) {
      mobile_number = userData.mobile_number
    }

    let phone_number = "";
    if (userData.phone_number) {
      phone_number = userData.phone_number
    }

    let extension = "";
    if (userData.extension) {
      extension = userData.extension
    }

    let change_pass_in_login = false;
    if (userData.change_pass_in_login == 1) {
      change_pass_in_login = true;
    }

    let cannot_change_pass = false;
    if (userData.cannot_change_pass == 1) {
      cannot_change_pass = true;
    }

    let disable = false;
    if (userData.disable == 1) {
      disable = true;
    }

    let account_expires = false;
    let expire_at = null;
    if (userData.account_expires == 1) {
      account_expires = true;
      expire_at = userData.expireAt;

    }
    let settings = {
      notifications: true
    }
    if(userData.settings  // 👈 null and undefined check
      && Object.keys(userData.settings).length !== 0
      && Object.getPrototypeOf(userData.settings) !== Object.prototype){
       
        settings =  userData.settings
      }

    await  app.get("models").User.findOrCreate({
      where: {
        [Op.or]: [
          {user_name: user_name},
          {email: email},
          // {mobile_number: mobile_number}
        ],
      },
      defaults: {
        first_name: first_name,
        last_name: last_name,
        display_name: first_name + ' ' + last_name,
        email: email,
        user_name: user_name,
        password: authentication.hashPassword(password),
        mobile_number: mobile_number,
        phone_number: phone_number,
        extension: extension,
        change_pass_in_login: change_pass_in_login,
        cannot_change_pass: cannot_change_pass,
        account_expires: account_expires,
        expireAt: expire_at,
        disable: disable,
        settings: settings,
      }
    }).spread(async (user, created) => {

      if (!created) {
        let err = "user already exists !";
        if (user.email === email) {
          err = "email address already taken";
        } else if (user.user_name === user_name) {
          err = "User Name already taken";
        }
        // else if (user.mobile_number === mobile_number) {
        //   err = "This Mobile Number is used by anther user.";
        // }
        return utils.response(statusCodes.BAD_REQUEST, err, req, res);
      }
      const promiseArr = [];
      if (userData.Roles && userData.Roles.length) {
        const userRoleDataAll = userData.Roles.map((roleId) => {
          return {
            user_id: user.id,
            role_id: roleId
          }
        });
        promiseArr.push( app.get("models").UserRole.bulkCreate(userRoleDataAll))
      }

      if (userData.Systems && userData.Systems.length) {
        const userSystemDataAll = userData.Systems.map((systemId) => {
          return {
            user_id: user.id,
            system_id: systemId
          }
        });
        promiseArr.push( app.get("models").UserSystem.bulkCreate(userSystemDataAll))
      }
      await Promise.all(promiseArr);
      return utils.response(statusCodes.SUCCESS, user, req, res);
    }).catch((err) => {
      console.log("EEEE", JSON.stringify(err));
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    })
  });
  app.put(`${prefix}:id`,[authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const {id} = req.params;

      const {...data} = req.body;
      const user = await  app.get("models").User.scope(null).findOne({
        where: {
          id: id,
        }
      });
      if (!user) {
        return utils.response(statusCodes.BAD_REQUEST, "User does not exists", req, res);
      }

      if (data.email || data.user_name) {
        const orWhere = [];

        if (data.email) {
          orWhere.push({email: data.email});
        }
        if (data.user_name) {
          orWhere.push({user_name: data.user_name});
        }
        // if (data.mobile_number) {
        //   orWhere.push({mobile_number: data.mobile_number});
        // }
        const user = await  app.get("models").User.scope(null).findOne({
          where: {
            id: {[Op.ne]: id},
            [Op.or]: orWhere
          }
        });


        if (user) {
          let err = "user data already exists for another user !";
          if (user.email === data.email) {
            err = "email address already taken";
          } else if (user.user_name === data.user_name) {
            err = "User Name already taken";
          }
          // else if (user.mobile_number === data.mobile_number) {
          //   err = "This Mobile Number is used by anther user.";
          // }
          return utils.response(statusCodes.BAD_REQUEST, err, req, res);
        }
      }

      // var userData = req.uploadData[0].json()
      if (data.password) {
        data.password = authentication.hashPassword(data.password);
        data.pass_change_by_admin = 1;
      } else {
        delete data.password;
      }

      if (data.change_pass_in_login == 1) {
        data.change_pass_in_login = true;
      } else {
        data.change_pass_in_login = false
      }

      if (data.cannot_change_pass == 1) {
        data.cannot_change_pass = true;
      } else {
        data.cannot_change_pass = false;
      }

      if (data.disable == 1) {
        data.disable = true;
      } else {
        data.disable = false;
      }

      if (data.account_expires == 1) {
        data.account_expires = true;

      } else {
        data.account_expires = false;
        data.expireAt = null
      }


      let first_name = "";
      if (data.first_name) {
        first_name = data.first_name
      }
  
      let last_name = "";
      if (data.last_name) {
        last_name = data.last_name
      }
      data.display_name= first_name + ' ' + last_name,

      await user.update(data);
      await Promise.all([
         app.get("models").UserRole.destroy({
          where: {
            user_id: id,
          }
        }),
         app.get("models").UserSystem.destroy({
          where: {
            user_id: id
          }
        })
      ]);

      const promiseArrAdd = [];
      if (data.Roles && data.Roles.length) {
        const userRoleDataAll = data.Roles.map((roleId) => {
          return {
            user_id: id,
            role_id: roleId
          }
        });
        promiseArrAdd.push( app.get("models").UserRole.bulkCreate(userRoleDataAll))
      }
      if (data.Systems && data.Systems.length) {
        const userSystemDataAll = data.Systems.map((systemId) => {
          return {
            user_id: id,
            system_id: systemId
          }
        });
        promiseArrAdd.push( app.get("models").UserSystem.bulkCreate(userSystemDataAll))
      }

      app.get("cache").deleteItem('user-info');


      // promiseArrAdd.push(flush.createFlush(id, 'user', 'user-info', null))
      // await Promise.all(promiseArrAdd);

      return utils.response(statusCodes.SUCCESS, "User Updated Successfully", req, res);
    } catch (err) {
      console.log(err)
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });
  app.delete(`${prefix}:id`,[authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const {id} = req.params;
      if(!id){
        return utils.response(statusCodes.BAD_REQUEST, "User not found ", req, res);
      }
      const userInfo = app.get("cache").getItem('user-info')
      if (!userInfo) {
        return utils.response(statusCodes.BAD_REQUEST, "User not logged in ", req, res);
      }
      if (id == '07e3c3e0-f20f-11ea-b36c-cf90bdc91f63') {
        return utils.response(statusCodes.BAD_REQUEST, "You cannot delete super admin ", req, res);
      }
      if (userInfo.id == id) {
        return utils.response(statusCodes.BAD_REQUEST, "You cannot delete your account ", req, res);
      }
      
      await app.get("models").User.destroy({where: {id: id}});
      await flush.createFlush(id, 'user', 'user-info', null,app );
      return utils.response(statusCodes.SUCCESS, "done", req, res);
    } catch (err) {
      console.log(err)
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);

    }

  });
}
