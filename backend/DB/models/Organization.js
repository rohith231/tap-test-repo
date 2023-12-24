'use strict';
module.exports = (sequelize, DataTypes) => {
  const Organization = sequelize.define('Organization', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
      //autoIncrement: true
    },
    name: DataTypes.STRING,
    logo:DataTypes.TEXT,
    description: DataTypes.TEXT,
    address1: DataTypes.TEXT,
    address2: DataTypes.TEXT,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zip_code: DataTypes.STRING,
    primary_color: DataTypes.STRING,
    secondary_color: DataTypes.STRING,
    accent_color: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM,
      values: ['0', '1']
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
    attrsToSkip: {
      type: DataTypes.VIRTUAL,
      get() {
        return ['id', 'createdAt', 'updatedAt', 'deletedAt', 'attrsToSkip'];
      },
    }
  }, {
    timestamps: true,
    paranoid: true,
    tableName: 'organizations'
  });

  return Organization;
};
