module.exports = (sequelize, DataTypes) => {

  const License = sequelize.define('License', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
    },
    licensekey: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,

  }, {
    timestamps: true,
    paranoid: true,
    tableName: 'licenses'
  });


  return License;
};
