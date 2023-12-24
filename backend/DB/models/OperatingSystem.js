module.exports = (sequelize, DataTypes) => {
  const operatingSystem = sequelize.define('OperatingSystem', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true,
        //autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        validate: {
          len: {
            args: [3, 20],
            msg: 'name must be between 3 and 20 characters long.'
          }
        },
        // unique: {
        //   msg: 'This name is already existing '
        // },
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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
    },
    {
      indexes: [
        {
          unique: false,
          fields: ['name']
        }
      ],
      timestamps: true,
      paranoid: true,
      tableName: 'operating_systems'
    });


  operatingSystem.associate = (models) => {
    operatingSystem.hasMany(models.Device, {
      foreignKey: 'os_type',
      onDelete: 'cascade',
      hooks: true,
    });
  }

  return operatingSystem;
};
