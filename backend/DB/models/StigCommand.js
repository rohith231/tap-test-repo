module.exports = (sequelize, DataTypes) => {
  const stigCommand = sequelize.define('StigCommand', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
      //autoIncrement: true
    },
    vuln_num: {
      type: DataTypes.STRING, 
    },
    stig_id: { type: DataTypes.UUID },
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
  tableName: 'stig_commands'
  })
  return stigCommand;
};
