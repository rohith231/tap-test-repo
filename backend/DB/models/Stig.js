module.exports = (sequelize, DataTypes) => {
  const stig = sequelize.define('Stig', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
      //autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      validate: {},
      // unique: {
      //   msg: 'Stig name already taken.'
      // },
    },
    user_id: {
      type: DataTypes.UUID,
    },
    stigref: { type: DataTypes.STRING },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    os: {
      type: DataTypes.STRING,
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
    indexes: [{
      unique: false,
      fields: ['name']
    }],
    timestamps: true,
    paranoid: true,
    tableName: 'stigs'
  });

  stig.associate = (models) => {
    stig.belongsToMany(models.Vulnerability, {
      through: models.StigVulnerability,
      foreignKey: 'stig_id',
      otherKey: 'vulnerability_id',
      onDelete: 'cascade',
      hooks: true,
    });
    stig.hasMany(models.StigVulnerability, {
      foreignKey: 'stig_id',
      onDelete: 'cascade',
      hooks: true,
    })
  }
  stig.addHook('beforeBulkDestroy', (options) => {
    if (options.where.id) {
      // const models = require("./index");
      // models.StigVulnerability.destroy({
      //   where: {
      //     stig_id: options.where.id
      //   },
      //   force: true
      // });
    }
    return options;
  });

  return stig;
};
