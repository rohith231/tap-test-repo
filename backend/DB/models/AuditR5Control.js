'use strict';
module.exports = (sequelize, DataTypes) => {
  const AuditR5Control = sequelize.define('AuditR5Control', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
    },
    control_number: {
      type: DataTypes.STRING
    },
    check_control_id: {
      type: DataTypes.UUID,
    },
    user_name: {
      type: DataTypes.STRING
    },
    date: {
      type: DataTypes.DATE
    },
    version: {
      type: DataTypes.DECIMAL(10, 1)
    },
    is_draft: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    status: {
      type: DataTypes.STRING
    },
    override_status: {
      type: DataTypes.STRING
    },
    override_reason: {
      type: DataTypes.TEXT
    },
    data: DataTypes.JSONB,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  }, {
    timestamps: true,
    paranoid: true,
    tableName: 'audit_r5_controls'
  });

  AuditR5Control.associate = (models) => {
    AuditR5Control.belongsTo(models.User, {
      foreignKey: 'user_id',
    });

    AuditR5Control.belongsTo(models.AuditR5, {
      foreignKey: 'control_number',
      targetKey: 'parent',
      constraints: false
    });

    AuditR5Control.belongsTo(models.NIST80053R5CheckControl, {
      foreignKey: 'check_control_id',
      targetKey: 'id',
      constraints: false
    });
  }

  return AuditR5Control;
};



