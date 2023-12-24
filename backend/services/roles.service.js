exports.saveFlushData = async (roleId) => {
  try {
    const userRoles = await global.DB.UserRole.findAll({
      where: {
        role_id: roleId,
      },
    });
    const flushDataAll = [];

    console.log('delete all user Role.......')

    // for (let index = 0; index < userRoles.length; index++) {
    //   const user_role = userRoles[index];
    //   const flushData = {
    //     user_id: user_role.user_id,
    //     model: 'user',
    //     key: 'user-info',
    //     related_id: user_role.role_id,
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   }
    //   flushDataAll.push(flushData);
    // }
    // console.log('create bulk flush.......');
    // flush.createBulkFlush(flushDataAll);

    const permissions = await global.DB.Permission.findAll({
      attributes: ['id'],
      where: {
        name: {
          [global.DB.Sequelize.Op.in]: ['role-list', 'role-edit', 'role-delete', 'role-view'],
        },
      },
    })

    const permissions_ids = permissions.map(permission => permission.id)
    const roles = await global.DB.RolePermission.findAll({
      where: {
        permission_id: {
          [DB.Sequelize.Op.in]: permissions_ids,
        },
      },
    })
    const flushPermissionAll = [];

    const roleIds = [];
    roles.forEach((ele) => {
      if (!roleIds.includes(ele.role_id)) {
        roleIds.push(ele.role_id);
      }
    });

    console.log('roleIds : ', roleIds)
    const users = await global.DB.UserRole.findAll({
      where: {
        role_id: {
          [DB.Sequelize.Op.in]: roleIds,
        },
      },
    })
    for (let user_index = 0; user_index < users.length; user_index++) {
      var flushPermission = {
        user_id: users[user_index].user_id,
        model: 'role',
        key: 'role-info-' + roleId,
        related_id: roleId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      flushPermissionAll.push(flushPermission);
    }
    console.log('create bulk flush second.......')
    flush.createBulkFlush(flushPermissionAll);
  } catch (err) {
    console.log("Error on insert flush data before delete role by id with error : ", err);
  }
}

exports.getAttributes = (modelName, selectedAttr = null) => {
  const result = [];
  const {rawAttributes} = global.DB[modelName];
  Object.keys(rawAttributes).filter((attribute) => {
    const {
      attrsToSkip,
    } = rawAttributes;
    if (attrsToSkip && !attrsToSkip.get().includes(attribute)) {
      const enabled = !!(selectedAttr && selectedAttr.includes(attribute));
      result.push({
        label: attribute,
        enabled: enabled,
      })
    }
  })
  return result;
}

exports.existItem = (id, rolePermissionSubModules) => {
  return rolePermissionSubModules.find((ele) => ele.id === id);
}
