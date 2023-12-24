'use strict';
module.exports = (sequelize, DataTypes) => {
  const Permission = sequelize.define('Permission', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
      //autoIncrement: true
    },
    name: DataTypes.STRING,
    category: DataTypes.STRING,
    type: DataTypes.ENUM('model', 'action'),
    model_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  }, {
    indexes: [
      {
        unique: true,
        fields: ['name', 'category']
      }
    ],
    timestamps: true,
    paranoid: true,
    tableName: 'permissions'
  });
  Permission.associate = function (models) {
    Permission.belongsToMany(models.Role, {
      through: models.RolePermission,
      foreignKey: 'permission_id',
      as: 'permissions'
    });
  };

  Permission.addHook('beforeBulkDestroy', (options) => {
    if (options.where.id) {
      // const models = require("./index");
      // models.RolePermission.destroy({
      //   where: {
      //     permission_id: options.where.id
      //   },
      //   force: true
      // });
    }
    return options;
  });

  return Permission;
};
