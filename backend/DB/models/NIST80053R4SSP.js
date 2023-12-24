module.exports = (sequelize, DataTypes) => {
    const NIST80053R4SSP = sequelize.define('NIST80053R4SSP', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true,
        //autoIncrement: true
      },
      ssp_desc: DataTypes.TEXT,
      system_id: DataTypes.UUID,
      version: DataTypes.STRING,
      version_date: DataTypes.DATE,
      baseline_security_cat:DataTypes.STRING,
      ssp_data: DataTypes.JSONB,
      active: DataTypes.BOOLEAN,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      deletedAt: DataTypes.DATE,
      attrsToSkip: {
        type: DataTypes.VIRTUAL,
        get() {
          return ['id', 'createdAt', 'updatedAt', 'deletedAt','attrsToSkip'];
        },
      },
    }, {
    timestamps: true,
    paranoid: true,
    tableName: 'nist_800_53_r4_SSPs'
    })

    return NIST80053R4SSP;
  };