'use strict';
module.exports = (sequelize, DataTypes) => {
  const Devicecategory = sequelize.define('Devicecategory', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
      //autoIncrement: true
    },
    name: DataTypes.STRING,
    system_id: DataTypes.UUID,
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    user_id: DataTypes.UUID,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
    attrsToSkip: {
      type: DataTypes.VIRTUAL,
      get() {
        return ['id', 'createdAt', 'updatedAt', 'deletedAt', 'attrsToSkip', 'user_id', 'system_id'];
      },
    }
  }, {
    timestamps: true,
    paranoid: true,
    freezeTableName: true,
    tableName: 'devicecategory'
  });

  Devicecategory.associate = (models) => {
   /* Devicecategory.hasMany(models.NIST80053R4CheckControl, {
      foreignKey: 'devicecategory_id',
      onDelete: 'cascade',
      hooks: true,
    });
    
    Devicecategory.hasMany(models.NIST800171R2CheckControl, {
      foreignKey: 'devicecategory_id',
      onDelete: 'cascade',
      hooks: true,
    });*/
  }
  Devicecategory.addHook('beforeBulkDestroy', (options) => {
    if (options.where.id) {
      // const models = require("./index");
      // console.log(models)
      // models.Validation.destroy({
      //   where: {
      //     devicecategory_id: options.where.id
      //   },
      //   force: true
      // });

    }
    return options;
  });
  return Devicecategory;
};



