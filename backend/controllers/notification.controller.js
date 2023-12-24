const config = require('../config');
const {utils, constants} = require("../helpers");
const authenticationMiddleware = require("../middlewares/authentication");
const {statusCodes} = constants;
const prefix = `/api/v1/notifications/`;

const {Op} = require("sequelize");
module.exports = (app) => {
  app.get(`${prefix}`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      var {pageNumber, itemsPerPage} = req.query;

     
      const unReadCount = await app.get("models").Notification.count({
        where: {
          receiver_id: await global.Auth.get_user_id(),
          is_read: false,
        }
      });

      const data = await app.get("models").Notification.findAndCountAll({
        where: {
          receiver_id: await global.Auth.get_user_id()
        },
        order: [["createdAt", 'DESC']],
        ...app.get("models").paginate({
          pageNumber,
          itemsPerPage
        }),
      });
      return utils.response(statusCodes.SUCCESS, {
        rows: data.rows, unReadCount, count:data.count
      }, req, res);
    } catch (err) {
      console.log(err);
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });
  app.post(`${prefix}action`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const {action, notifications} = req.body;
      let where = {
        'receiver_id': await global.Auth.get_user_id()
      };
      if (notifications && Array.isArray(notifications) && notifications.length) {
        where['id'] = {[Op.in]: notifications};
      }
      console.dir(where)
      console.dir(notifications)

      switch (action) {
        case 'read':
          console.dir(action)
          app.get("models").Notification.update({is_read: true}, {where: where})
          break;
        case 'unRead':
          console.dir(action)

           app.get("models").Notification.update({is_read: false}, { where })
          break;
        case 'delete':
          //  app.get("models").Notification.destroy({where});
          break;
      }
      return utils.response(statusCodes.SUCCESS, "Notification Action done", req, res);
    } catch (err) {
      console.log(err);
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });
  app.post(`${prefix}messages`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const {type, systemsArr, groupArr, usersArr, ...data} = req.body;
      const user = await global.Auth.get_user_info()
      const byId = user.id;

      switch (type) {
        case 'organization':
          app.get("models").User.findAll({
            attributes: ['id'],
            where: {
              id: {[Op.ne]: byId},
            }
          }).then((users) => {
            if (users && users.length) {
              const dataToInsert = users.map((u) => {
                return {
                  by_model: 'users',
                  type: 'message',
                  text: `Message From ${user.display_name} : ${data.text}`,
                  by_id: byId,
                  receiver_id: u.id,
                  //   related_id :null,
                  // related_model:n
                }
              });
              app.get("models").Notification.bulkCreate(dataToInsert);
            }
          });
          return utils.response(statusCodes.SUCCESS, "Notification sent to organization", req, res);
        case 'systems':
          //systemsArr --> system Id's
          app.get("models").UserRole.findAll({
            attributes: ['user_id'],
            where: {
              role_id: {[Op.in]: groupArr},
            },
            include: [{
              model: app.get("models").User,
              required: true,
              include: [{
                model: app.get("models").System,
                where: {
                  id: {[Op.in]: systemsArr},
                },
                required: true
              }]
            }]
          })
            // app.get("models").System.findAll({
            //   attributes: ["user_id"],
            //   where: {
            //     id: {[Op.in]: systemsArr},
            //     user_id: {[Op.ne]: byId},
            //   },
            //   include: [
            //     {
            //       model: app.get("models").User,
            //       as: 'users',
            //       required: true,
            //       include: [{
            //         model: app.get("models").UserRole,
            //         required: true,
            //         as: 'roles',
            //         where: {
            //           id: {[Op.in]: groupArr},
            //         }
            //       }]
            //     }
            //   ]
            // })
            //

            .then((roles) => {
              if (roles && roles.length) {
                const dataToInsert = roles.map((role) => {
                  return {
                    by_model: 'systems',
                    type: 'message',
                    text: `Message From ${user.display_name} : ${data.text}`,
                    by_id: byId,
                    receiver_id: role.user_id,
                    //   related_id :null,
                    // related_model:n
                  }
                });
                app.get("models").Notification.bulkCreate(dataToInsert);
              }
            });
          return utils.response(statusCodes.SUCCESS, "Notification sent to systems", req, res);
        case 'users':
          const where = {
            [Op.and]: [
              {user_id: {[Op.ne]: byId}},
              {user_id: {[Op.in]: usersArr}}
            ]
          };
          if (groupArr && groupArr.length) {
            where["role_id"] = {[Op.in]: groupArr}
          }
          app.get("models").UserRole.findAll({
            attributes: ['user_id'],
            where,
            include: [{
              model: app.get("models").User,
              required: true,
            }]
          }).then((roles) => {
            if (roles && roles.length) {
              const dataToInsert = roles.map((role) => {
                return {
                  by_model: 'systems',
                  type: 'message',
                  text: `Message From ${user.display_name} : ${data.text}`,
                  by_id: byId,
                  receiver_id: role.user_id,
                  //   related_id :null,
                  // related_model:n
                }
              });
              app.get("models").Notification.bulkCreate(dataToInsert);
            }
          })
          return utils.response(statusCodes.SUCCESS, "Notification sent to users", req, res);
        default:
          return utils.response(statusCodes.BAD_REQUEST, "your type not in specific types considered", req, res);
      }
    } catch (err) {
      console.log(err);
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
    // by_model -> users
    // type -> 'message'
    // text ->
    // by_id -> await global.Auth.get_user_id()
    // receiver_id --> ?
    // related_id ->
    // related_model ->
  });
}
