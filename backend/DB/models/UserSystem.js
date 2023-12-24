'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserSystem = sequelize.define('UserSystem', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
      //autoIncrement: true
    },
    system_id: {
      type: DataTypes.UUID,
      references: {
        model: {
          tableName: 'systems'
        },
        key: 'id'
      },
      allowNull: false
    },
    user_id: {
      type: DataTypes.UUID,
      references: {
        model: {
          tableName: 'users'
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
    tableName: 'user_system'
  });

  UserSystem.associate = (models) => {
    UserSystem.belongsTo(models.User, {
      foreignKey: "user_id",
    });
    UserSystem.belongsTo(models.System, {
      foreignKey: "system_id"
    });
  }

  return UserSystem;
};
