'use strict';
module.exports = (sequelize, DataTypes) => {
  const SystemCredentials = sequelize.define('SystemCredentials', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
    },
    system_id: DataTypes.UUID,
    name: DataTypes.STRING,
    
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    ssh_private_key: DataTypes.STRING,
    port: DataTypes.STRING,
    
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,

  }, {
    timestamps: true,
    onDelete: 'cascade',
    paranoid: true,
    tableName: 'system_credentials',
  });



  return SystemCredentials;
};
