'use strict';
module.exports = (sequelize, DataTypes) => {
  const SystemFramework = sequelize.define('SystemFramework', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true
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
        allowNull: false
      },
      framework_identifier: {
        type: DataTypes.STRING,
        references: {
          model: {
            tableName: 'frameworks'
          },
          key: 'identifier'
        }
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      deletedAt: DataTypes.DATE,
  }, {
    paranoid: true,
    tableName: 'system_framework'
  });




  return SystemFramework;
};
