module.exports = (sequelize, DataTypes) => {
  const deviation = sequelize.define('Deviation', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      validate: {},
    },
    user_id: {
      type: DataTypes.UUID,
      references: {
        model: {
          tableName: 'users'
        },
        key: 'id'
      },
      allowNull: false
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
        return ['id', 'createdAt', 'updatedAt', 'deletedAt', 'user_id', 'attrsToSkip'];
      },
    },
    vuln_count: {
      type: DataTypes.VIRTUAL,
    }
  }, {
    indexes: [
      {
        unique: false,
        fields: ['name']
      }
    ],
    timestamps: true,
    paranoid: true,
    tableName: 'deviations'
  });

  deviation.associate = (models) =>{
    deviation.hasMany(models.DeviationVulnerability, {
      foreignKey: 'deviation_id',
      onDelete: 'cascade',
      hooks: true,
    })
  }
  deviation.addHook('beforeBulkDestroy', (options) => {
    if (options.where.id) {
      // const models = require("./index");
      // models.DeviationVulnerability.destroy({
      //   where: {
      //     deviation_id: options.where.id
      //   },
      //   force: true
      // });
    }
    return options;
  });


  return deviation;
};
