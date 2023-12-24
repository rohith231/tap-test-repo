'use strict';
module.exports = (sequelize, DataTypes) => {
  const AuditControl = sequelize.define('AuditControl', {
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
    tableName: 'audit_controls'
  });

  AuditControl.associate = (models) => {
    AuditControl.belongsTo(models.User, {
      foreignKey: 'user_id',
    });

    AuditControl.belongsTo(models.Audit, {
      foreignKey: 'control_number',
      targetKey: 'parent',
      constraints: false
    });

    AuditControl.belongsTo(models.NIST80053R4CheckControl, {
      foreignKey: 'check_control_id',
      targetKey: 'id',
      constraints: false
    });
    // AuditControl.belongsTo(models.NIST80053R5CheckControl, {
    //   foreignKey: 'check_control_id',
    //   targetKey: 'id',
    //   constraints: false
    // });

    AuditControl.belongsTo(models.NIST800171R2CheckControl, {
      foreignKey: 'check_control_id',
      targetKey: 'id',
      constraints: false
    });
  }

  return AuditControl;
};



