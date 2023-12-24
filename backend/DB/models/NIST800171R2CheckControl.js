'use strict';
module.exports = (sequelize, DataTypes) => {
  const NIST800171R2CheckControl = sequelize.define('NIST800171R2CheckControl', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
      //autoIncrement: true
    },
    name: DataTypes.STRING,
    os: DataTypes.STRING,
    sensitivity_level: DataTypes.STRING,
    validate: DataTypes.BOOLEAN,
    remediate: DataTypes.BOOLEAN,
    control_number: DataTypes.STRING,
    plugin_family: DataTypes.STRING,
    plugin_id: DataTypes.STRING,
    plugin_name: DataTypes.STRING,
    plugin_description: DataTypes.TEXT,
    implementation: DataTypes.JSONB,
    framework_id: DataTypes.INTEGER,
    control_identification: DataTypes.STRING,
    control_type: DataTypes.JSONB,
    validation_controls: DataTypes.JSONB,
    inheritable: DataTypes.BOOLEAN,
    inherited_from: DataTypes.UUID,
    compliance_status: DataTypes.STRING,
    system_id: DataTypes.UUID,
    user_id: DataTypes.UUID,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
    disabled: DataTypes.VIRTUAL,
    control_process_step: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Create',
    },
    attrsToSkip: {
      type: DataTypes.VIRTUAL,
      get() {
        return ['id', 'createdAt', 'updatedAt', 'deletedAt', 'attrsToSkip', 'user_id', 'system_id', 'disabled', 'control_process_step'];
      },
    }
  }, {
    timestamps: true,
    paranoid: true,
    tableName: 'nist_800_171_r2_check_controls'
  });


  NIST800171R2CheckControl.associate = (models) => {
    NIST800171R2CheckControl.belongsTo(models.User, {
      foreignKey: 'user_id',
    });
    NIST800171R2CheckControl.belongsTo(models.System, {
      foreignKey: 'system_id',
    });
    NIST800171R2CheckControl.belongsTo(models.NIST800171R2Control, {
      foreignKey: 'control_number',
      targetKey: 'number',
      constraints: false
    });
    NIST800171R2CheckControl.hasMany(models.Poam, {
      foreignKey: 'control_id',
      sourceKey: 'id',
      onDelete: 'cascade',
      hooks: true,
    });
    NIST800171R2CheckControl.hasMany(models.Validation, {
      foreignKey: 'control_id',
      sourceKey: 'id',
      onDelete: 'cascade',
      hooks: true,
    });
    NIST800171R2CheckControl.belongsToMany(models.Device, {
      through: models.Validation,
      foreignKey: 'control_id',
      targetKey: 'id',
      onDelete: 'cascade',
      hooks: true,
    })


    NIST800171R2CheckControl.hasMany(models.AuditControl, {
      foreignKey: 'check_control_id',
      onDelete: 'cascade',
      hooks: true,
    })

  }

  NIST800171R2CheckControl.scopes = (models) => {
    NIST800171R2CheckControl.addScope('defaultScope', {
      include: [{
        model: models.Poam
      }]
    });
  }
  NIST800171R2CheckControl.addHook('beforeBulkDestroy', (options) => {
    if (options.where.id) {
      // const models = require("./index");
      // models.AuditControl.destroy({
      //   where: {
      //     check_control_id: options.where.id
      //   },
      //   force: true
      // });
      // models.Poam.destroy({
      //   where: {
      //     control_id: options.where.id
      //   },
      //   force: true
      // });
      // models.Validation.destroy({
      //   where: {
      //     control_id: options.where.id
      //   },
      //   force: true
      // });
      // models.ApprovalProcessHistory.destroy({
      //   where: {
      //     control_id: options.where.id
      //   },
      //   force: true
      // });

    }
    return options;
  });

  return NIST800171R2CheckControl;
};
