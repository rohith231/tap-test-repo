'use strict';
module.exports = (sequelize, DataTypes) => {
  const Validation = sequelize.define('Validation', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
      //autoIncrement: true
    },
    device_id: {
      type: DataTypes.UUID,
      primaryKey: false,
    },
    control_id: {
      type: DataTypes.UUID,
      primaryKey: false,
    },
    command_output: {
      type: DataTypes.TEXT,
    },
    remediation_output: {
      type: DataTypes.TEXT,
    },
    vuln_num: DataTypes.STRING,
    status: DataTypes.STRING,
    updated_at: DataTypes.DATE,
    remediated_at: DataTypes.DATE,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  }, {
    paranoid: true,
    tableName: 'validations'
  })

  Validation.associate = (models) => {
    Validation.belongsTo(models.NIST80053R4CheckControl, {
      foreignKey: 'control_id',
    });
    Validation.belongsTo(models.NIST80053R5CheckControl, {
      foreignKey: 'control_id',
    });

    Validation.belongsTo(models.NIST800171R2CheckControl, {
      foreignKey: 'control_id',
    });

    Validation.belongsTo(models.Device, {
      foreignKey: 'device_id',
    });

    Validation.belongsTo(models.CustomCheckControl, {
      foreignKey: 'control_id',
    });
  }
  return Validation;
};
