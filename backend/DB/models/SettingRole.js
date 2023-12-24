'use strict';
module.exports = (sequelize, DataTypes) => {
  const SettingRole = sequelize.define('SettingRole', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
      //autoIncrement: true
    },
    role_id: {
      type: DataTypes.UUID,
      references: {
        model: {
          tableName: 'roles'
        },
        key: 'id'
      },
      allowNull: false
    },
    setting_id: {
      type: DataTypes.UUID,
      references: {
        model: {
          tableName: 'settings'
        },
        key: 'id'
      },
      allowNull: false
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  }, {
    paranoid: true,
    tableName: 'setting_role'
  });

  return SettingRole;
};
