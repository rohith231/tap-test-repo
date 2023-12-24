'use strict';
module.exports = (sequelize, DataTypes) => {
  const Framework = sequelize.define('Framework', {
    identifier: {
        primaryKey: true,
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.TEXT,
      },
      group: {
        type: DataTypes.TEXT,
      },
      number: {
        type: DataTypes.STRING,
      },
      revision: {
        type: DataTypes.INTEGER,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      deletedAt: DataTypes.DATE,
  }, {
    timestamps: true,
    paranoid: true,
    indexes: [
        {
          unique: true,
          fields: ['identifier']
        }
      ],
    tableName: 'frameworks'
  });

  return Framework;
};



