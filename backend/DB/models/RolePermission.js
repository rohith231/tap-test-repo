'use strict';
module.exports = (sequelize, DataTypes) => {
  const RolePermission = sequelize.define('RolePermission', {
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
    permission_id: {
      type: DataTypes.UUID,
      references: {
        model: {
          tableName: 'permissions'
        },
        key: 'id'
      },
      allowNull: false
    },
    attributes: {
      type: DataTypes.JSON,
      allowNull: true

    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  }, {
    paranoid: true,
    tableName: 'role_permissions'
  });


  RolePermission.associate = function (models) {
    // associations can be defined here
    RolePermission.belongsTo(models.permission, {
      foreignKey: "permission_id",
    });
    RolePermission.belongsTo(models.Role, {
      foreignKey: "role_id"
    });
  };

  RolePermission.scopes = (models) => {
    RolePermission.addScope('defaultScope', {
      include: [{
        model: models.Role
      }, {
        model: models.Permission
      }]
    });
  }


  return RolePermission;
};
