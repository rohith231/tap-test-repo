module.exports = (db, DataTypes) => {
  const NIST80053R4Control = db.define('NIST80053R4Control', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true,
        //autoIncrement: true,
        allowNull: false,
      },
      number: DataTypes.STRING,
      framework_id: DataTypes.INTEGER,
      title: DataTypes.STRING,
      family: DataTypes.STRING,
      baseline_impact: DataTypes.ARRAY(DataTypes.STRING),
      withdrawn: DataTypes.JSONB,
      statement: DataTypes.JSONB,
      guidance: DataTypes.JSONB,
      priority: DataTypes.ARRAY(DataTypes.STRING),
      control_enhancements: DataTypes.ARRAY(DataTypes.JSONB),
      parent: DataTypes.STRING,
      updated_at: DataTypes.DATE,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      deletedAt: DataTypes.DATE,
    },
    {
      indexes: [{
        unique: false,
        fields: ['number']
      }],
      paranoid: true,
      timestamps: true,
      tableName: 'nist_800_53_r4_controls'
    }
  );

  NIST80053R4Control.associate = (models) => {
    NIST80053R4Control.hasOne(models.NIST80053R4CheckControl, {
      foreignKey: 'control_number',
      sourceKey: 'number',
      onDelete: 'cascade',
      hooks: true,
      constraints: false
    })
  }

  NIST80053R4Control.addHook('beforeBulkDestroy', (options) => {
    if (options.where.id) {
      // const models = require("./index");
      // models.NIST80053R4CheckControl.destroy({
      //   where: {
      //     control_number: options.where.id
      //   },
      //   force: true
      // });
    }
    return options;
  });

  return NIST80053R4Control;
}
