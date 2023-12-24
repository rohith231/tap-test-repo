'use strict';
module.exports = (sequelize, DataTypes) => {
  const Audit = sequelize.define('Audit', {
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
    tableName: 'audit'
  });


  Audit.associate = (models) => {
    Audit.hasMany(models.AuditControl, {
      foreignKey: 'control_number',
      sourceKey: 'parent',
      onDelete: 'CASCADE',
      hooks: true,
      constraints: false
    });

   
  }
  return Audit;
};



