module.exports = (db, DataTypes) => {
  const Inheritance = db.define('Inheritance', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
      //autoIncrement: true,
      allowNull: false,
    },
    system_id: DataTypes.UUID,
    control_id: DataTypes.UUID,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  }, {
    paranoid: true,
    tableName: 'inheritances'
  })

  Inheritance.associate = (models) => {
    Inheritance.belongsTo(models.NIST80053R4CheckControl, {
      foreignKey: 'control_id',
      sourceKey: 'id',
      onDelete: 'cascade',
      hooks: true,
    });
    Inheritance.belongsTo(models.NIST80053R5CheckControl, {
      foreignKey: 'control_id',
      sourceKey: 'id',
      onDelete: 'cascade',
      hooks: true,
    });
    Inheritance.belongsTo(models.NIST800171R2CheckControl, {
      foreignKey: 'control_id',
      sourceKey: 'id',
      onDelete: 'cascade',
      hooks: true,
    });
    Inheritance.belongsTo(models.System, {
      foreignKey: 'system_id',
      sourceKey: 'id',
      onDelete: 'cascade',
      hooks: true,
    });
  }

  return Inheritance;
}
