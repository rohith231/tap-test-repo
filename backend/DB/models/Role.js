'use strict';

module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
      //autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
    attrsToSkip: {
      type: DataTypes.VIRTUAL,
      get() {
        return ['id', 'createdAt', 'updatedAt', 'deletedAt', 'attrsToSkip'];
      },
    }
  }, {
    indexes: [
      {
        unique: false,
        fields: ['name']
      }
    ],
    timestamps: true,
    paranoid: true,
    tableName: 'roles'
  });

  Role.associate = (models) => {
    Role.belongsToMany(models.User, {
      through: models.UserRole,
      foreignKey: 'role_id',
      as: 'users',
      onDelete: 'cascade',
      hooks: true,
    });
    Role.belongsToMany(models.permission, {
      through: models.RolePermission,
      foreignKey: 'permission_id',
      otherKey: 'role_id',
      onDelete: 'cascade',
      hooks: true,
    });
    Role.belongsToMany(models.Setting, {
      through: models.SettingRole,
      foreignKey: 'role_id',
      onDelete: 'cascade',
      hooks: true,
    });

  }
  // Role.associate = function(models) {
  //   // associations can be defined here
  //   Role.belongsToMany(models.User, {
  //     through: models.UserRole,
  //     foreignKey: 'role_id',
  //     as: 'users'
  //   });
  //   // associations can be defined here
  //   Role.belongsToMany(models.Permission, {
  //     through: models.RolePermission,
  //     foreignKey: 'permission_id',
  //     as: 'permissions'
  //   });
  // };

  Role.addHook('beforeBulkDestroy', (options) => {
    if (options.where.id) {
      // const models = require("./index");
      // await saveFlushData(options.where.id);
      // saveFlushData(options.where.id).then(() =>{
      // models.ApprovalProcessRole.destroy({
      //   where: {
      //     role_id: options.where.id
      //   },
      //   force: true
      // });
      // models.SettingRole.destroy({
      //   where: {
      //     role_id: options.where.id
      //   },
      //   force: true
      // });
      // models.RolePermission.destroy({
      //   where: {
      //     role_id: options.where.id
      //   },
      //   force: true
      // });
      // models.UserRole.destroy({
      //   where: {
      //     role_id: options.where.id
      //   },
      //   force: true
      // });
      // })

    }
    return options;
  });
  return Role;
};


// const saveFlushData = async (roleId) => {
//   try {
//     const userRoles = await models.UserRole.findAll({
//       where: {
//         role_id: roleId
//       }
//     });
//     const myFlush = global.Flush;
//     const flushObj = new myFlush();
//     const flushDataAll = [];
//
//     console.log('delete all user Role.......')
//
//
//     for (let index = 0; index < userRoles.length; index++) {
//       const user_role = userRoles[index];
//       const flushData = {
//         user_id: user_role.user_id,
//         model: 'user',
//         key: 'user-info',
//         related_id: user_role.role_id,
//         createdAt: new Date(),
//         updatedAt: new Date()
//       }
//       flushDataAll.push(flushData);
//     }
//     console.log('create bulk flush.......')
//     flushObj.createBulkFlush(flushDataAll);
//
//     const permissions = await models.Permission.findAll({
//       attributes: ['id'],
//       where: {
//         name: {
//           [models.Sequelize.Op.in]: ['role-list', 'role-edit', 'role-delete', 'role-view']
//         }
//       }
//     })
//
//     const permissions_ids = permissions.map(permission => permission.id)
//     const roles = await models.RolePermission.findAll({
//       where: {
//         permission_id: {
//           [DB.Sequelize.Op.in]: permissions_ids
//         }
//       }
//     })
//     const flushPermissionAll = [];
//
//     const roleIds = [];
//     roles.forEach((ele) => {
//       if (!roleIds.includes(ele.role_id)) {
//         roleIds.push(ele.role_id);
//       }
//     });
//
//     console.log('roleIds : ', roleIds)
//     const users = await models.UserRole.findAll({
//       where: {
//         role_id: {
//           [DB.Sequelize.Op.in]: roleIds
//         }
//       },
//     })
//
//     console.log('users list  : ', users)
//
//
//     for (let user_index = 0; user_index < users.length; user_index++) {
//       var flushPermission = {
//         user_id: users[user_index].user_id,
//         model: 'role',
//         key: 'role-info-' + roleId,
//         related_id: roleId,
//         createdAt: new Date(),
//         updatedAt: new Date()
//       };
//       flushPermissionAll.push(flushPermission);
//     }
//
//     console.log('create bulk flush second.......')
//     flushObj.createBulkFlush(flushPermissionAll);
//   } catch (err) {
//     console.log("Error on insert flush data before delete role by id with error : ", err);
//   }
// }
