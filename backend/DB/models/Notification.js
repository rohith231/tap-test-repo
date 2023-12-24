'use strict';
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },
    related_id: DataTypes.UUID,
    related_model: DataTypes.STRING,
    by_id: {
      type: DataTypes.UUID,
      defaultValue: null
    },
    by_model: {
      type: DataTypes.STRING,
      defaultValue: null
    },
    text: DataTypes.TEXT,
    type: DataTypes.STRING,
    details: {
      type: DataTypes.JSONB,
      defaultValue: null
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    receiver_id: DataTypes.UUID,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  }, {
    indexes: [
      {
        fields: ['is_read']
      },
      {
        fields: ['receiver_id']
      },
    ],
    timestamps: true,
    tableName: 'notifications',
    paranoid: true
  });

  Notification.associate = (models) => {
    Notification.belongsTo(models.User, {
      foreignKey: "receiver_id"
    });
  }

  return Notification;
};



