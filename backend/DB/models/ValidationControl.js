'use strict';
module.exports = (sequelize, DataTypes) => {
  const ValidationControl = sequelize.define('ValidationControl', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
      //autoIncrement: true
    },
    framework_identifier: {
      type: DataTypes.STRING,
    },
    validation_controls: DataTypes.JSONB,
    control_id: {
      type: DataTypes.UUID,
    },
    system_id: {
      type: DataTypes.UUID,
      references: {
        model: {
          tableName: 'systems'
        },
        key: 'id'
      },
      onDelete: "cascade",
    },
    validate: DataTypes.BOOLEAN,
    remediate: DataTypes.BOOLEAN,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    attrsToSkip: {
      type: DataTypes.VIRTUAL,
      get() {
        return ['id', 'createdAt', 'updatedAt', 'deletedAt', 'attrsToSkip','system_id'];
      },
    }
  }, {
    timestamps: true,
    tableName: 'validation_controls'
  });


  return ValidationControl;
};
