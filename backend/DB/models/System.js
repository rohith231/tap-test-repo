module.exports = (sequelize, DataTypes) => {
  const system = sequelize.define('System', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
      //autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      // validate: {
      //   len: {
      //     args: [3, 100],
      //     msg: 'System name must be between 3 and 100 characters long.'
      //   },
      // },
      // unique: {
      //   msg: 'System name already taken.'
      // },
    },
    description: {
      type: DataTypes.TEXT,
    },
    abbreviation: {
      type: DataTypes.STRING,
      // validate: {
      //   len: {
      //     args: [3, 30],
      //     msg: 'System abbreviation must be between 3 and 30 characters long.'
      //   },
      // },
      // unique: {
      //   msg: 'System abbreviation already taken.'
      // },
    },
    identifier: {
      type: DataTypes.STRING,
      // validate: {
      //   len: {
      //     args: [3, 100],
      //     msg: 'System identifier must be between 3 and 100 characters long.'
      //   },
      // },
      // unique: {
      //   msg: 'System identifier already taken.'
      // },
    },
    organization_id: {
      type: DataTypes.UUID,
    },
    user_id: {
      type: DataTypes.UUID,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    ato_approval_step: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Create',
    },
    oss_credentials: {
      type: DataTypes.ARRAY(DataTypes.JSONB),
      allowNull: false,
      defaultValue: [],
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
    attrsToSkip: {
      type: DataTypes.VIRTUAL,
      get() {
        return ['id', 'createdAt', 'updatedAt', 'deletedAt', 'user_id', 'organization_id', 'attrsToSkip', 'ato_approval_step'];
      },
    }
  }, {
    indexes: [
      {
        unique: false,
        fields: ['name']
      },
      {
        unique: false,
        fields: ['abbreviation']
      },
      {
        unique: false,
        fields: ['identifier']
      }
    ],
    timestamps: true,
    paranoid: true,
    tableName: 'systems'
  })

  system.associate = (models) => {
    system.belongsToMany(models.Framework, {
      through: models.SystemFramework,
      foreignKey: 'system_id',
      otherKey: 'framework_identifier'

    });
    system.hasMany(models.NIST80053R4CheckControl, {
      foreignKey: 'system_id',
      onDelete: 'cascade',
      hooks: true,
    });
    system.hasMany(models.NIST80053R5CheckControl, {
      foreignKey: 'system_id',
      onDelete: 'cascade',
      hooks: true,
    });
    system.hasMany(models.NIST800171R2CheckControl, {
      foreignKey: 'system_id',
      onDelete: 'cascade',
      hooks: true,
    });
    system.hasMany(models.Ip, {
      foreignKey: 'system_id',
      onDelete: 'cascade',
      hooks: true,
    });
    system.belongsToMany(models.User, {
      through: models.UserSystem,
      foreignKey: 'system_id',
      as: 'users',
      onDelete: 'cascade',
      hooks: true,
    });
    system.hasMany(models.NIST80053R4SSP, {
      foreignKey: 'system_id',
      sourceKey: 'id',
      constraints: false,
      onDelete: 'cascade',
      hooks: true,
    });
    system.hasMany(models.NIST80053R5SSP, {
      foreignKey: 'system_id',
      sourceKey: 'id',
      constraints: false,
      onDelete: 'cascade',
      hooks: true,
    });
    system.hasMany(models.NIST800171R2SSP, {
      foreignKey: 'system_id',
      sourceKey: 'id',
      constraints: false,
      onDelete: 'cascade',
      hooks: true,
    });
  }

  system.addHook('beforeBulkDestroy', (options) => {
    if (options.where.id) {
      // const models = require("./index");
      // models.NIST80053R4SSP.destroy({
      //   where: {
      //     system_id: options.where.id
      //   },
      //   force: true
      // });
      // models.UserSystem.destroy({
      //   where: {
      //     system_id: options.where.id
      //   },
      //   force: true
      // });
      // models.ApprovalProcess.destroy({
      //   where: {
      //     system_id: options.where.id
      //   },
      //   force: true
      // });
      // models.NIST80053R4CheckControl.destroy({
      //   where: {
      //     system_id: options.where.id
      //   },
      //   force: true
      // });
      // models.Device.destroy({
      //   where: {
      //     system_id: options.where.id
      //   },
      //   force: true
      // });
      // models.Inheritance.destroy({
      //   where: {
      //     system_id: options.where.id
      //   },
      //   force: true
      // });
      // models.Ip.destroy({
      //   where: {
      //     system_id: options.where.id
      //   },
      //   force: true
      // });
      // models.Poam.destroy({
      //   where: {
      //     system_id: options.where.id
      //   },
      //   force: true
      // });

    }
    return options;
  });

  return system;
};
