'use strict';
module.exports = (sequelize, DataTypes) => {
  const ip = sequelize.define('Ip', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
      //autoIncrement: true
    },
    subnet: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [3, 20],
          msg: 'subnet must be between 3 and 20 characters long.'
        }
      },
    },
    description: {
      type: DataTypes.TEXT,
      /*validate: {
        len: {
          args: [10],
          msg: 'description must be at least 10 characters long.'
        }
      },*/
    },
    picked_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    system_id: {
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
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    credential_id: DataTypes.UUID,
    ssh_private_key: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
    attrsToSkip: {
      type: DataTypes.VIRTUAL,
      get () {
        return ['id', 'createdAt', 'updatedAt', 'deletedAt', 'picked_at', 'user_id', 'system_id', 'attrsToSkip'];
      },
    }
  },
    {
      timestamps: true,
      paranoid: true,
      tableName: 'ips'
    })

  ip.associate = (models) => {
    ip.belongsTo(models.User, {
      foreignKey: 'user_id',
    });
    ip.belongsTo(models.System, {
      foreignKey: 'system_id',
    });
  }
  return ip;
};
