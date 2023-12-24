'use strict';
module.exports = (sequelize, DataTypes) => {
  const logs = sequelize.define('Logs', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
      //autoIncrement: true
    },
    action: {
      type: DataTypes.STRING
    },
    affected_model: {
      type: DataTypes.STRING
    },
    affected_model_id: {
      type: DataTypes.UUID
    },
    user_id: {
      type: DataTypes.UUID,
    },
    mac_address: {
      type: DataTypes.STRING,
      default: null
    },
    data_before: {
      type: DataTypes.JSONB,
      default: null
    },
    data_after: {
      type: DataTypes.JSONB,
      default: null
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
    attrsToSkip: {
      type: DataTypes.VIRTUAL,
      get() {
        return ['id', 'updatedAt', 'deletedAt', 'attrsToSkip'];
      },
    }
  }, {
    timestamps: true,
    paranoid: true,
    tableName: 'logs'
  })

  logs.associate = (models) => {
    logs.belongsTo(models.User, {
      foreignKey: 'user_id'
    });
  }

  return logs;
};
