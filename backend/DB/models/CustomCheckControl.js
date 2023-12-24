'use strict';
module.exports = (sequelize, DataTypes) => {
  const CustomCheckControl = sequelize.define('CustomCheckControl', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
      //autoIncrement: true
    },
    name: DataTypes.STRING,
    os: DataTypes.STRING,
    sensitivity_level:DataTypes.STRING,
    validate:DataTypes.BOOLEAN,
    remediate:DataTypes.BOOLEAN,
    control_number:DataTypes.STRING,
    plugin_family:DataTypes.STRING,
    plugin_id:DataTypes.STRING,
    plugin_name:DataTypes.STRING,
    plugin_description:DataTypes.TEXT,
    implementation:DataTypes.JSONB,
    framework_id:DataTypes.INTEGER,
    control_identification:DataTypes.STRING,
    control_type:DataTypes.JSONB,
    validation_controls:DataTypes.JSONB,
    inheritable:DataTypes.BOOLEAN,
    inherited_from:DataTypes.UUID,
    compliance_status:DataTypes.STRING,
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
        return ['id', 'createdAt', 'updatedAt', 'deletedAt', 'attrsToSkip','user_id','system_id','disabled','control_process_step'];
      },
    }
  }, {
    timestamps: true,
    paranoid: true,
    tableName: 'custom_check_controls'
  });

  CustomCheckControl.addHook('beforeBulkDestroy', (options) => {
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

  CustomCheckControl.associate = (models) => {

    CustomCheckControl.hasMany(models.Validation, {
      foreignKey: 'control_id',
      sourceKey: 'id',
      onDelete: 'cascade',
      hooks: true,
    })

    CustomCheckControl.hasMany(models.Poam, {
      foreignKey: 'control_id',
      sourceKey: 'id',
      onDelete: 'cascade',
      hooks: true,
    })

  }
  CustomCheckControl.scopes = (models) => {
    CustomCheckControl.addScope('defaultScope', {
      include: [{
        model: models.Poam
      }]
    });
  }

  return CustomCheckControl;
};
