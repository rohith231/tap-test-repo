module.exports = (sequelize, DataTypes) => {
  const deviationCommand = sequelize.define('DeviationCommand', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
      //autoIncrement: true
    },
    vuln_num: {
      type: DataTypes.STRING,
    },
    validation_cmd: {
      type: DataTypes.TEXT,
    },
    remediation_cmd: {
      type: DataTypes.TEXT,
    },
    validation_expected: {
      type: DataTypes.TEXT,
    },
    validation_result: {
      type: DataTypes.TEXT,
    },
    validation_ip: {
      type: DataTypes.STRING,
    },
    remediation_expected: {
      type: DataTypes.TEXT,
    },
    remediation_result: {
      type: DataTypes.TEXT,
    },
    remediation_ip: {
      type: DataTypes.STRING,
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
    deviation_vulnerability_id: {
      type: DataTypes.UUID,
      references: {
        model: {
          tableName: 'deviations_vulnerabilities'
        },
        key: 'id'
      },
      allowNull: false
    },
    status:{
      type:DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    done:{
      type:DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
    attrsToSkip: {
      type: DataTypes.VIRTUAL,
      get() {
        return ['id','vuln_num','createdAt', 'updatedAt', 'deletedAt', 'user_id','attrsToSkip'];
      },
    }
  }, {
  timestamps: true,
  paranoid: true,
  tableName: 'deviations_commands'
  });

  deviationCommand.associate = (models) =>{
    deviationCommand.belongsTo(models.DeviationVulnerability, {
      foreignKey: 'deviation_vulnerability_id',
      as: 'commands',
      constraints: false
    })
  }
  return deviationCommand;
};
