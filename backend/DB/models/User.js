module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true
      },
      first_name: {
        type: DataTypes.STRING,
        validate: {
          len: {
            args: [3, 16],
            msg: 'First Name must be between 3 and 16 characters long.'
          },
        },
      },
      last_name: {
        type: DataTypes.STRING,
        validate: {
          len: {
            args: [3, 16],
            msg: 'Last Name must be between 3 and 16 characters long.'
          },
        },
      },

      display_name: {
        type: DataTypes.STRING,
        validate: {
          len: {
            args: [3, 32],
            msg: 'Full name must be between 3 and 32 characters long.'
          },
        },
      },
      email: {
        type: DataTypes.STRING,
       
        validate: {
          len: {
            args: [6, 128],
            msg: "Email address must be between 6 and 128 characters in length"
          },
          isEmail: {
            msg: "Email address must be valid"
          }
        }
      },
      user_name: {
        type: DataTypes.STRING,
        validate: {
          len: {
            args: [3, 32],
            msg: 'User Name must be between 3 and 32 characters long.'
          },
        },
        
      },
      password: {
        type: DataTypes.TEXT,
        validate: {
          len: {
            args: 3,
            msg: "Password must be atleast 3 characters in length"
          }
        }
      },
      mobile_number: {
        type: DataTypes.STRING,
   
      },
      pass_change_by_admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      phone_number: DataTypes.STRING,
      extension: DataTypes.STRING,
      change_pass_in_login: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      changedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      cannot_change_pass: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      account_expires: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      expireAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      disable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      dashboard_widget: DataTypes.JSONB,
      settings: {
        type: DataTypes.JSONB,
        defaultValue: '{}'
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      deletedAt: DataTypes.DATE,
      // firstlogin: DataTypes.DATE,
      attrsToSkip: {
        type: DataTypes.VIRTUAL,
        get() {
          return ['id', 'createdAt', 'updatedAt', 'deletedAt', 'attrsToSkip', 'expireAt', 'changedAt'];
        },
      }
    }, {
    indexes: [
      {
        unique: false,
        fields: ['user_name']
      },
      {
        unique: false,
        fields: ['email']
      },
      {
        unique: false,
        fields: ['mobile_number']
      }
    ],
    timestamps: true,
      paranoid: true,
      tableName: 'users'
    }
  )
  User.associate = function (models) {

    // associations can be defined here

    //associations
    User.belongsToMany(models.Role, {
      through: models.UserRole,
      foreignKey: 'user_id',
      onDelete: 'cascade',
      hooks: true,
    });
    User.belongsToMany(models.System, {
      through: models.UserSystem,
      foreignKey: 'user_id',
      onDelete: 'cascade',
      hooks: true
    });
    User.hasMany(models.Ip, {
      foreignKey: 'user_id',
    });
    User.hasMany(models.Device, {
      foreignKey: 'user_id',
      onDelete: 'cascade',
      hooks: true,
    });
    User.hasMany(models.NIST80053R4CheckControl, {
      foreignKey: 'user_id',
      onDelete: 'cascade',
      hooks: true,
    });
    User.hasMany(models.NIST80053R5CheckControl, {
      foreignKey: 'user_id',
      onDelete: 'cascade',
      hooks: true,
    });
    User.hasMany(models.NIST800171R2CheckControl, {
      foreignKey: 'user_id',
      onDelete: 'cascade',
      hooks: true,
    });
    User.hasMany(models.Logs, {
      foreignKey: 'user_id',
    });
    User.hasMany(models.Notification, {
      foreignKey: 'receiver_id',
      onDelete: 'cascade',
      hooks: true,
    });

  };


  User.scopes = function (models) {
    User.addScope('defaultScope', {
      // attributes: { exclude: ['password'] },
      include: [{
        model: models.Role.unscoped(),
        required: false,
        include: [{
          model: models.Setting.unscoped(),
          required: false,
        }]
      }, {
        model: models.System.unscoped(),
        order: [["createdAt", 'DESC']],
        required: false,
        include: [
          {
            model: models.Framework.unscoped(),
            required: false
          }]
      }]
    });
  }
  User.prototype.validPassword = function (password) {
    return password === this.password
  }

  User.addHook('beforeBulkDestroy', (options) => {
    if (options.where.id) {
      // const models = require("./index");
      // models.NIST80053R4CheckControl.destroy({
      //   where: {
      //     user_id: options.where.id
      //   },
      //   force: true
      // });
      // models.Device.destroy({
      //   where: {
      //     user_id: options.where.id
      //   },
      //   force: true
      // });
      // models.Flush.destroy({
      //   where: {
      //     user_id: options.where.id
      //   },
      //   force: true
      // });
      // models.ApprovalProcessHistory.destroy({
      //   where: {
      //     action_by: options.where.id
      //   },
      //   force: true
      // });
      // models.Interrogator.destroy({
      //   where: {
      //     user_id: options.where.id
      //   },
      //   force: true
      // });
      // models.Ip.destroy({
      //   where: {
      //     user_id: options.where.id
      //   },
      //   force: true
      // });
      // models.Notification.destroy({
      //   where: {
      //     receiver_id: options.where.id
      //   },
      //   force: true
      // });
      // models.Stig.destroy({
      //   where: {
      //     user_id: options.where.id
      //   },
      //   force: true
      // });
      // models.StigCommand.destroy({
      //   where: {
      //     user_id: options.where.id
      //   },
      //   force: true
      // });
      // models.System.destroy({
      //   where: {
      //     user_id: options.where.id
      //   },
      //   force: true
      // });
      // models.UserRole.destroy({
      //   where: {
      //     user_id: options.where.id
      //   },
      //   force: true
      // });
      // models.UserSystem.destroy({
      //   where: {
      //     user_id: options.where.id
      //   },
      //   force: true
      // });

    }
    return options;
  });
  return User
}
