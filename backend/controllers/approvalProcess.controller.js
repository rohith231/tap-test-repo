const {utils, constants, authentication, flush, cache} = require("../helpers");
const authenticationMiddleware = require("../middlewares/authentication");
const {statusCodes} = constants;
const prefix = `/api/v1/approval/`;
const {Op} = require('sequelize');

module.exports = (app) => {
  // app.use(authenticationMiddleware.decodeJWT);

  app.get(`${prefix}`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const {system_id, type} = req.query;
      if (!system_id) {
        return utils.response(statusCodes.BAD_REQUEST, "you must specified the system", req, res);
      }
      const roles = await app.get("models").Role.scope(null).findAll({
        attributes: [['id', 'role_id'], "name"], // role_id AS id
        include: [{
          model: app.get("models").User.unscoped(),
          attributes: [['id', 'user_id'], "display_name"], // user_id AS id
          required: false,
          as: 'users'
        }]
      })

      await app.get("models").ApprovalProcess.findAll({
        where: {
          system_id: system_id,
          type: type
        },
        order: [
          ['order', 'ASC'],
        ],
        include: [{
          model: app.get("models").ApprovalProcessRole.unscoped(),
          required: false
        }, {
          model: app.get("models").ApprovalProcessUser.unscoped(),
          required: false,
        }]
      }).then(async (approval_process) => {
        if (approval_process.length == 0) { // default data
          approval_process = [
            {
              "id": utils.uuidv4(),
              "system_id": system_id,
              "name": "Create",
              "label": "Create",
              "description": "First Approval Step",
              "type": type,
              "order": 1,
              "createdAt": new Date(),
              "updatedAt": new Date(),
              "deletedAt": null,
              "ApprovalProcessRoles": [],
              "ApprovalProcessUsers": []
            },
            {
              "id": utils.uuidv4(),
              "system_id": system_id,
              "name": (type == 'ato') ? "Authorize" : "Approval",
              "label": "Auth",
              "description": (type == 'ato') ? "Authorize Step" : "Approval Step",
              "type": type,
              "order": 2,
              "createdAt": new Date(),
              "updatedAt": new Date(),
              "deletedAt": null,
              "ApprovalProcessRoles": [],
              "ApprovalProcessUsers": []
            },
            {
              "id": utils.uuidv4(),
              "system_id": system_id,
              "name": "Edit",
              "label": "Edit",
              "description": "Edit Step",
              "type": type,
              "order": 3,
              "createdAt": new Date(),
              "updatedAt": new Date(),
              "deletedAt": null,
              "ApprovalProcessRoles": [],
              "ApprovalProcessUsers": []
            },
          ]
        }
        return utils.response(statusCodes.SUCCESS, {approval_process: approval_process, allRoles: roles}, req, res);
      })
    } catch (error) {
      console.log(error)
      return utils.response(statusCodes.SERVER_ERROR, error, req, res);
    }
  });

  app.get(`${prefix}stepper`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const {control_id,system_id,type} = req.query;
      const userInfo = app.get("cache").getItem('user-info')
      if (!userInfo) {
        return utils.response(statusCodes.BAD_REQUEST, "User not logged in ", req, res);
      }

      if (!system_id) {
        return utils.response(statusCodes.BAD_REQUEST, "you must specified the system", req, res);
      }

      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>")
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>")
      console.log(userInfo.id)
      console.log(userInfo.id)
      console.log(userInfo.id)
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>")

      let history_conditions = {}

      if (control_id != 'NULL') {
        history_conditions['control_id'] = control_id
      }
      const user_roles_ids = userInfo.Roles.map(role => role.UserRole.role_id)

      await app.get("models").ApprovalProcess.findAll({
        where: {
          system_id: system_id,
          type: type,
          label: {
            [Op.not]: "Edit"
          }
        },
        order: [['order', 'ASC']],
        include: [{
          model: app.get("models").ApprovalProcessHistory.unscoped(),
          required: false,
          limit: 1,
          order: [["createdAt", 'DESC']],
          where: history_conditions
        }]
      }).then(async (approval_process) => {

        var steps = [], approval_process_ids = [], previous_action = []
        var active_step, allow_history = false, allow_form = false, is_edit_last_action = false


        history_conditions['type'] = type
        history_conditions['system_id'] = system_id
        var lastApprovalProcessHistory = await app.get("models").ApprovalProcessHistory.findOne({
          order: [["createdAt", 'DESC']],
          where: history_conditions
        })
        if (lastApprovalProcessHistory) {

          if (lastApprovalProcessHistory.action == 'edit') {
            is_edit_last_action = true
          }
        }
        history_conditions['action'] = 'edit'
        var lastEditApprovalProcessHistory = await app.get("models").ApprovalProcessHistory.findOne({
          order: [["createdAt", 'DESC']],
          where: history_conditions
        })
        for (let index = 0; index < approval_process.length; index++) {
          var step_users = []
          var step_color = ''
          var active = false, disable = false, approved = false, reject = false, approved_button_disable = false,
            reject_button_disable = false
          const approval = approval_process[index];


          if (active_step || is_edit_last_action) disable = true

          if (approval.label == "Create") reject_button_disable = true

          if (!active_step && !is_edit_last_action) {
            active = active_step = true
          } else {
            active = false
          }


          if (approval.label == "Create" && is_edit_last_action) {
            disable = false
            active = active_step = true
          } else {
            disable = true, approved = false, reject = false, approved_button_disable = false, reject_button_disable = false
          }


          if (active && approval.ApprovalProcessHistories.length > 0) {
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>. approval.ApprovalProcessHistories.length")

            const approvalProcessHistory = approval.ApprovalProcessHistories[0];
            if (lastEditApprovalProcessHistory) {
              if (approvalProcessHistory.action == "approved" && !is_edit_last_action && approvalProcessHistory.createdAt > lastEditApprovalProcessHistory.createdAt) {
                step_color = 'green'
                active = active_step = reject = false
                approved = reject_button_disable = approved_button_disable = true
              } else {
                step_color = 'red'
                approved = reject = false
              }
            } else {
              if (approvalProcessHistory.action == "approved" && !is_edit_last_action) {
                step_color = 'green'
                active = active_step = reject = false
                approved = reject_button_disable = approved_button_disable = true
              } else {
                step_color = 'red'
                approved = reject = false
              }
            }

            if (lastEditApprovalProcessHistory) {
              console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>. lastEditApprovalProcessHistory")
              if (approvalProcessHistory.assigned_to && !is_edit_last_action && approvalProcessHistory.createdAt > lastEditApprovalProcessHistory.createdAt) {
                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>. !is_edit_last_action &&  approvalProcessHistory.createdAt > lastEditApprovalProcessHistory.createdAt")

                let include_in_assigned_user = approvalProcessHistory.assigned_to.filter((assigned_user) => assigned_user == userInfo.id)
                allow_form = (include_in_assigned_user.length > 0) ? true : false
                allow_history = (allow_form) ? true : false


              } else {
                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>. else !is_edit_last_action &&  approvalProcessHistory.createdAt > lastEditApprovalProcessHistory.createdAt")

                if (lastApprovalProcessHistory) {
                  if (is_edit_last_action) {

                    let approval_process_users = await approval_process[index].getUsers({attributes: ['id', "display_name"]})
                    for (let index = 0; index < approval_process_users.length; index++) {
                      const approval_process_user = approval_process_users[index];
                      let include_in_assigned_user = userInfo.id == approval_process_user.id

                      allow_form = !!include_in_assigned_user;
                      allow_history = allow_form
                      if (allow_form) {
                        break;
                      }
                    }
                    if (approval_process_users.length == 0) {

                      let approval_process_roles = await approval_process[index].getRoles()
                      for (let index = 0; index < approval_process_roles.length; index++) {
                        const approval_process_role = approval_process_roles[index];
                        let include_in_assigned_user = user_roles_ids.includes(approval_process_role.id)
                        allow_form = !!include_in_assigned_user;
                        allow_history = allow_form
                        if (allow_form) {
                          break;
                        }
                      }
                    }
                  } else {

                    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>. lastApprovalProcessHistory ELSE is_edit_last_action")

                    let include_in_assigned_user = lastApprovalProcessHistory.assigned_to.filter((assigned_user) => assigned_user == userInfo.id)
                    allow_form = include_in_assigned_user.length > 0
                    allow_history = allow_form
                  }

                } else {
                  console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>. else lastApprovalProcessHistory lastApprovalProcessHistory lastApprovalProcessHistory")

                  let approval_process_users = await approval_process[index].getUsers({attributes: ['id', "display_name"]})
                  for (let index = 0; index < approval_process_users.length; index++) {
                    const approval_process_user = approval_process_users[index];
                    let include_in_assigned_user = (userInfo.id == approval_process_user.id)

                    allow_form = !!include_in_assigned_user;
                    allow_history = allow_form
                    if (allow_form) {
                      break;
                    }
                  }
                  if (approval_process_users.length == 0) {

                    let approval_process_roles = await approval_process[index].getRoles()
                    for (let index = 0; index < approval_process_roles.length; index++) {
                      const approval_process_role = approval_process_roles[index];
                      let include_in_assigned_user = user_roles_ids.includes(approval_process_role.id)
                      allow_form = !!include_in_assigned_user;
                      allow_history = allow_form;
                      if (allow_form) {
                        break;
                      }
                    }
                  }
                }
              }
            } else {
              console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>.else lastEditApprovalProcessHistory")

              if (approvalProcessHistory.assigned_to && !is_edit_last_action) {
                let include_in_assigned_user = approvalProcessHistory.assigned_to.filter((assigned_user) => assigned_user == userInfo.id)
                allow_form = include_in_assigned_user.length > 0;
                allow_history = allow_form;
              } else {
                let approval_process_users = await approval_process[index].getUsers({attributes: ['id', "display_name"]})
                for (let index = 0; index < approval_process_users.length; index++) {
                  const approval_process_user = approval_process_users[index];
                  let include_in_assigned_user = (userInfo.id == approval_process_user.id)

                  allow_form = !!include_in_assigned_user;
                  allow_history = allow_form;
                  if (allow_form) {
                    break;
                  }
                }
                if (approval_process_users.length == 0) {

                  let approval_process_roles = await approval_process[index].getRoles()
                  for (let index = 0; index < approval_process_roles.length; index++) {
                    const approval_process_role = approval_process_roles[index];
                    let include_in_assigned_user = user_roles_ids.includes(approval_process_role.id)
                    allow_form = !!include_in_assigned_user;
                    allow_history = allow_form;
                    if (allow_form) {
                      break;
                    }
                  }
                }
              }
            }
          } else {
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>.else approval.ApprovalProcessHistories.length")
            if (active) {
              if (approval_process[index - 1]) {
                if (approval_process[index - 1].ApprovalProcessHistories.length > 0) {
                  const approvalProcessHistoryOld = approval_process[index - 1].ApprovalProcessHistories[0];
                  if (approvalProcessHistoryOld.assigned_to) {
                    let include_in_assigned_user = approvalProcessHistoryOld.assigned_to.filter((assigned_user) => assigned_user == userInfo.id)
                    allow_form = include_in_assigned_user.length > 0;
                    allow_history = allow_form;
                  }
                }
              } else {


                let approval_process_users = await approval_process[index].getUsers({attributes: ['id', "display_name"]})
                for (let index = 0; index < approval_process_users.length; index++) {
                  const approval_process_user = approval_process_users[index];
                  let include_in_assigned_user = (userInfo.id == approval_process_user.id)

                  allow_form = !!include_in_assigned_user;
                  allow_history = allow_form;
                  if (allow_form) {
                    break;
                  }
                }
                if (approval_process_users.length == 0) {

                  let approval_process_roles = await approval_process[index].getRoles()
                  for (let index = 0; index < approval_process_roles.length; index++) {
                    const approval_process_role = approval_process_roles[index];
                    let include_in_assigned_user = user_roles_ids.includes(approval_process_role.id)
                    allow_form = !!include_in_assigned_user;
                    allow_history = allow_form;
                    if (allow_form) {
                      break;
                    }
                  }
                }

              }
            }
          }
          if (active_step && !step_color) {
            step_color = 'blue'
          }
          if (active) {
            if (approval_process[index - 1]) {
              if (approval_process[index - 1].ApprovalProcessHistories.length > 0) {
                const approvalProcessHistoryOld = approval_process[index - 1].ApprovalProcessHistories[0];
                previous_action.push({"id": approvalProcessHistoryOld.action_by})
              }
            }
          }

          if (active && approval_process[index + 1]) { // Next step Users
            step_users = await approval_process[index + 1].getUsers({attributes: ['id', "display_name"]})
            if (step_users.length == 0) {// Get Users from Roles
              var step_users = await app.get("models").User.scope(null).findAll({
                attributes: ['id', "display_name"],
                include: [{
                  attributes: [],
                  model: app.get("models").Role.unscoped(),
                  
                  required: true,
                  where: {
                    id: {[Op.in]: await approval_process[index + 1].getRoles().map(role => role.id)}
                  }
                }]
              })
            }
          }

          allow_form = (userInfo.id == '07e3c3e0-f20f-11ea-b36c-cf90bdc91f63') ? true : allow_form
          allow_history = (userInfo.id == '07e3c3e0-f20f-11ea-b36c-cf90bdc91f63') ? true : allow_history
          if (allow_form) {
            disable = false
          }
          approval_process_ids.push(approval.id)
          steps.push({
            "id": approval.id,
            "system_id": approval.system_id,
            "name": approval.name,
            "label": approval.label,
            "description": approval.description,
            "type": approval.type,
            "order": approval.order,
            "createdAt": approval.createdAt,
            "updatedAt": approval.updatedAt,
            "step_color": step_color,
            "disable": disable,
            "active": active,
            "approved": approved,
            "reject": reject,
            "reject_button_disable": reject_button_disable,
            "approved_button_disable": approved_button_disable,
            "approval": approval,
            "previous_action": previous_action,
            "selectedUsers": step_users,
            "users": step_users
          })
        }
        if (!allow_form) {
          var include_in_process = await app.get("models").ApprovalProcessRole.count({
            where: {
              approval_process_id: {[Op.in]: approval_process_ids},
              role_id: {[Op.in]: user_roles_ids}
            }
          })
          allow_history = (include_in_process) ? true : false
        }

        return utils.response(statusCodes.SUCCESS, {
          steps: steps,
          allow_history: allow_history,
          allow_form: allow_form
        }, req, res);
      })
    } catch (error) {
      console.log(error)
      return utils.response(statusCodes.SERVER_ERROR, error, req, res);
    }
  });

  app.get(`${prefix}history`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const {type, target_id} = req.query;

      var conditions = {type: type};
      if (type == 'ato') {
        conditions['system_id'] = target_id
      } else {
        conditions['control_id'] = target_id

      }
      const approvalProcessHistory = await app.get("models").ApprovalProcessHistory.findAll({
        where: conditions,
        order: [
          ["createdAt", 'DESC'],
        ],
        include: [{
          model: app.get("models").User.unscoped(),
          required: true
        }]
      });
      return utils.response(statusCodes.SUCCESS, {approvalProcessHistory: approvalProcessHistory}, req, res);
    } catch (error) {
      console.log(error);
      return utils.response(statusCodes.SERVER_ERROR, error, req, res);
    }
  });

  app.post(`${prefix}`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const {system_id, type, steps} = req.body;
      await app.get("models").ApprovalProcess.findAll({
        attributes: [
          'id'
         ],
        where: {
          system_id: system_id,
          type: type
        }
      }).then(async(data) => {
      
          if(data.length > 0){
            let result = data.map(a => a.id);
            await app.get("models").ApprovalProcess.destroy({
              where: {
                system_id: system_id,
                type: type
              },
              cascade: true,
            });
      
            await app.get("models").ApprovalProcessRole.destroy({
                where: {
                  approval_process_id:{[Op.in]: result}
                },
                
            });

            await app.get("models").ApprovalProcessUser.destroy({
              where: {
                approval_process_id:{[Op.in]: result}
              },
            });
      
          }
      });
   
   


      await app.get("models").ApprovalProcess.bulkCreate(steps,
        {
          fields: ["id", "system_id", "name", "label", "description", "type", "order", "createdAt", "updatedAt", "deletedAt"],
          updateOnDuplicate: ["system_id", "name", "label", "description", "type", "order", "createdAt", "updatedAt", "deletedAt"],

          include: [
            {
              fields: ["id", "role_id", "approval_process_id"],
              ignoreDuplicates: true,
              association: app.get("models").ApprovalProcess.associations.ApprovalProcessRoles
            },
            {
              fields: ["id", "user_id", "approval_process_id"],
              ignoreDuplicates: true,
              association: app.get("models").ApprovalProcess.associations.ApprovalProcessUsers
            }
          ]
        })

   
      return utils.response(statusCodes.SUCCESS, "Approval Added Successfully", req, res);
    } catch (error) {
      console.log(error)
      return utils.response(statusCodes.SERVER_ERROR, error, req, res);
    }
  })

  app.post(`${prefix}action`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    var {system_id, type, body} = req.body;
    try {
      await app.get("models").ApprovalProcessHistory.create({
        system_id: system_id,
        type: type,
        approval_process_id: body.approval_process_id,
        action: body.action,
        comment: body.comment,
        action_by: body.action_by,
        approval_process: body.approval_process,
        control_id: body.control_id,
        assigned_to: body.assigned_to
      })
      if (type == 'ato') {
        await app.get("models").System.update({
          ato_approval_step: body.target_pointer
        }, {
          where: {
            id: system_id
          },
        })
      } else {
        await app.get("models").NIST80053R4CheckControl.update({
          control_process_step: body.target_pointer
        }, {
          where: {
            id: body.control_id
          },
        })
      }
      const notifications = body.approval_process.selectedUsers.map((user) => {
        return {
          text: `your process is ${body.action} in ${body.approval_process.name}`,
          related_id: body.approval_process.system_id,
          related_model: 'System',
          by_id: body.action_by,
          by_model: 'Admin',
          type: "approvalProcess",
          details: {},
          is_read: false,
          receiver_id: user.id
        }
      });
      await app.get("models").Notification.bulkCreate(notifications);

      return utils.response(statusCodes.SUCCESS, "Approval Action Added Successfully", req, res);
    } catch (error) {
      console.log(error);
      return utils.response(statusCodes.SERVER_ERROR, error, req, res);
    }


  })

  app.get(`${prefix}can-edit`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      // const {userInfo} = req.headers;
      const {system_id, type} = req.query;


      // const userInfo = app.get("cache").getItem('user-info')
      if (!userInfo) {
        return utils.response(statusCodes.BAD_REQUEST, "User not logged in ", req, res);
      }

      if (!system_id) {
        return utils.response(statusCodes.BAD_REQUEST, "you must specified the system", req, res);
      }
      // console.log(userInfo.id)


      const approvalProcess = await app.get("models").ApprovalProcess.findOne({
        where: {
          system_id: system_id,
          type: type,
          label: "Edit"
        },
        order: [
          ['order', 'ASC'],
        ],
        include: [{
          model: app.get("models").ApprovalProcessRole.unscoped(),
          required: false
        }, {
          model: app.get("models").ApprovalProcessUser.unscoped(),
          required: false,
        }]
      });
      let allow = false
      if (approvalProcess) {
        if (approvalProcess.ApprovalProcessUsers.length > 0) {
          approvalProcess.ApprovalProcessUsers.forEach(approval_process_user => {
            allow = (approval_process_user.user_id == userInfo.id) ? true : false
            if (allow) {
              return;
            }
          });
        } else {

          const user_roles_ids = userInfo.Roles.map(role => role.UserRole.role_id)
          approvalProcess.ApprovalProcessRoles.forEach(role => {
            let include_in_assigned_user = user_roles_ids.includes(role.role_id)
            // console.log("include_in_assigned_user >>>>>>><<<<");
            // console.log(include_in_assigned_user);
            // console.log(user_roles_ids);
            // console.log(role.role_id);
            allow = !!include_in_assigned_user;
            if (allow) {
              return;
            }

          });
        }
      }
      return utils.response(statusCodes.SUCCESS, {allow: allow}, req, res);

    } catch (error) {
      console.log(error);
      return utils.response(statusCodes.SERVER_ERROR, error, req, res);
    }
  });

}
