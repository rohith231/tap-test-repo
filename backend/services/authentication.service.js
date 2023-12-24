exports.get_user_info = () => {
  return global.Cache.getItem('user-info');
}
exports.get_user_systems = () => {
  const user = this.get_user_info();
  return user.systems;
}
exports.get_permissions = () => {
  const user = this.get_user_info();
  if (!user) {
    return [];
  }
  return user.user_permissions;

  // if (!app.get("cache").hasItem('user-info')) {
  //   var roles_ids = this.user.roles.map(role => role.UserRole.role_id)
  //   var conditions = {}
  //   if (category) {
  //     var permissions = await DB.Permission.findAll({
  //       where: {
  //         category: category,
  //       }
  //     })
  //
  //     var permissions_ids = permissions.map(role => role.UserRole.role_id)
  //     conditions["permission_id"] = permissions_ids
  //   }
  //
  //   conditions["role_id"] = {
  //     [DB.Sequelize.Op.in]: roles_ids
  //   }
  //
  //
  //   return await DB.RolePermission.findAll({
  //     where: conditions
  //   })
  // } else {
  //   const userInfo = app.get("cache").getItem('user-info')
  //   return userInfo.user_permissions
  // }


}
exports.get_user_settings = () => {
  const user = this.get_user_info();
  if (!user) {
    return [];
  }

  const settings = []
  if (user.roles) {
    for (let index = 0; index < this.user.roles.length; index++) {
      const role = this.user.roles[index];
      settings.push(role.Settings)
    }
  }
  return settings
}
exports.get_user_id = () => {
  const user = this.get_user_info();
  if (!user) {
    return null;
  }
  return user.id;
}
exports.get_user_dashboard_widget = () => {
  const user = this.get_user_info();
  if (!user) {
    return null;
  }
  return user.dashboard_widget
}
exports.get_all_user_data = () => {
  const user = this.get_user_info();
  if (!user) {
    return null;
  }
  return user;
  // var userInfo
  // if (app.get("cache").hasItem('user-token')) {
  //   if (!app.get("cache").hasItem('user-info')) {
  //     this.user = null
  //     userInfo = {
  //       token: this.token || app.get("cache").getItem('user-token'),
  //       user: await this.get_user_info(),
  //       user_permissions: await this.get_permissions(),
  //       user_systems: await this.get_user_systems(),
  //       user_settings: await this.get_user_settings(),
  //       user_widgets: await this.get_user_dashboard_widget(),
  //     }
  //     app.get("cache").setItem('user-info', userInfo)
  //   } else {
  //     userInfo = app.get("cache").getItem('user-info')
  //   }
  // }
  //
  // return userInfo
}
exports.user = () => {
  return this.get_user_info();
}
exports.id = () => {
  const user = this.get_user_info();
  if (!user) {
    return null;
  }
  return user.id;
}
