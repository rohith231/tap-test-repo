'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define('UserRole', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
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
    tableName: 'user_role'
  });

  UserRole.associate = (models) => {
    UserRole.belongsTo(models.User, {
      foreignKey: "user_id",
    });
    UserRole.belongsTo(models.Role, {
      foreignKey: "role_id"
    });
  }

  return UserRole;
};
