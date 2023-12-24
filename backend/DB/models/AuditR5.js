'use strict';
module.exports = (sequelize, DataTypes) => {
  const AuditR5 = sequelize.define('AuditR5', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },
    parent: DataTypes.STRING,
    data: DataTypes.JSONB,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
    framework: DataTypes.STRING,
  }, {
    indexes: [
      {
        unique: true,
        fields: ['parent']
      },
    ],
    timestamps: true,
    paranoid: true,
    tableName: 'audit_r5'
  });


  AuditR5.associate = (models) => {
    AuditR5.hasMany(models.AuditR5Control, {
      foreignKey: 'control_number',
      sourceKey: 'parent',
      onDelete: 'CASCADE',
      hooks: true,
      constraints: false
    });

   
  }
  return AuditR5;
};



