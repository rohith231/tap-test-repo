'use strict';
module.exports = (sequelize, DataTypes) => {
  const Device = sequelize.define('Device', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
      //autoIncrement: true
    },
    ip_addr: DataTypes.STRING,
    mac_address: DataTypes.STRING,
    host_name: DataTypes.STRING,
    os_type: DataTypes.STRING,
    system_id: DataTypes.UUID,
    credential_id: DataTypes.UUID,
    category_id: DataTypes.UUID,
    validate: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    remediate: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    touched_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null
    },
    connectable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    connectable_info: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    os_build: DataTypes.STRING,
    os_version: DataTypes.STRING,
    os_product_type: DataTypes.STRING,
    device_model: DataTypes.STRING,
    hardware: DataTypes.STRING,
    hardware_platform: DataTypes.STRING,
    firmware: DataTypes.STRING,
    applications: DataTypes.ARRAY(DataTypes.STRING),
    drivers: DataTypes.ARRAY(DataTypes.STRING),
    last_login_user: DataTypes.STRING,
    last_login_at: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    user_id: DataTypes.UUID,
    os_detail: DataTypes.STRING,
    os_info: DataTypes.JSONB,
    installed_apps: DataTypes.JSONB,
    info: DataTypes.JSONB,
    ssh_private_key: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
    attrsToSkip: {
      type: DataTypes.VIRTUAL,
      get() {
        return ['id', 'createdAt', 'updatedAt', 'deletedAt', 'attrsToSkip', 'user_id', 'system_id', 'touched_at'];
      },
    }
  }, {
    timestamps: true,
    paranoid: true,
    tableName: 'devices'
  });

  Device.associate = (models) => {
    Device.belongsToMany(models.NIST80053R4CheckControl, {
      through: models.Validation,
      foreignKey: 'device_id',
      targetKey: 'id',
      onDelete: 'cascade',
      hooks: true,
    })
    Device.belongsToMany(models.NIST80053R5CheckControl, {
      through: models.Validation,
      foreignKey: 'device_id',
      targetKey: 'id',
      onDelete: 'cascade',
      hooks: true,
    })
    Device.belongsToMany(models.NIST800171R2CheckControl, {
      through: models.Validation,
      foreignKey: 'device_id',
      targetKey: 'id',
      onDelete: 'cascade',
      hooks: true,
    })
    Device.hasMany(models.Validation, {
      foreignKey: 'device_id',
      onDelete: 'cascade',
      hooks: true,
    })
  }
  Device.addHook('beforeBulkDestroy', (options) => {
    if (options.where.id) {
      // const models = require("./index");
      // console.log(models)
      // models.Validation.destroy({
      //   where: {
      //     device_id: options.where.id
      //   },
      //   force: true
      // });

    }
    return options;
  });
  return Device;
};



