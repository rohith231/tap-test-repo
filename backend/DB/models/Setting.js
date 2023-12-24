module.exports = (sequelize, DataTypes) => {
  const setting = sequelize.define('Setting', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
      //autoIncrement: true
    },
    setting_type: {
      type: DataTypes.STRING
    },
    setting_key: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [3, 32],
          msg: 'setting key must be between 3 and 32 characters long.'
        },
      },
      unique: {
        msg: 'setting key is already taken.'
      },
    },
    setting_value: {
      type: DataTypes.STRING,
    },
    configuration_type: {
      type: DataTypes.ENUM,
      values: ['regular', 'custom'],
      defaultValue: 'regular'
    },
    extra: {
      type: DataTypes.JSONB,
      defaultValue: '{}'
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
    timestamps: true,
    paranoid: true,
    tableName: 'settings'
  });


  setting.associate = (models) => {
    setting.belongsToMany(models.Role, {
      through: models.SettingRole,
      foreignKey: 'setting_id',
      onDelete: 'cascade',
      hooks: true,
    });
  }

  setting.scopes = (models) => {
    setting.addScope('defaultScope', {
      include: [{
        model: models.Role
      }]
    });
  }
  setting.addHook('beforeBulkDestroy', (options) => {
    // if (options.where.id) {
    //   const models = require("./index");
    //   models.SettingRole.destroy({
    //     where: {
    //       setting_id: options.where.id
    //     },
    //     force: true
    //   });
    // }
    return options;
  });

  return setting;
};
