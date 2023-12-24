module.exports = (db, DataTypes) => {
  const NIST800171R2Control = db.define('NIST800171R2Control', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true,
        //autoIncrement: true,
        allowNull: false,
      },
      family: DataTypes.STRING,
      family_abbreviation: DataTypes.STRING,
      family_id: DataTypes.STRING,
      number: DataTypes.STRING,
      title: DataTypes.TEXT,
      discussion: DataTypes.TEXT,
      DoD_guidance: DataTypes.TEXT,
      DoD_value: DataTypes.STRING,
      NIST80053r4_controls: DataTypes.ARRAY(DataTypes.STRING),
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
      tableName: 'nist_800_171_r2_controls'
    }
  );

  NIST800171R2Control.associate = (models) => {
    NIST800171R2Control.hasOne(models.NIST800171R2CheckControl, {
      foreignKey: 'control_number',
      sourceKey: 'number',
      onDelete: 'cascade',
      hooks: true,
      constraints: false
    });
  }

  NIST800171R2Control.addHook('beforeBulkDestroy', (options) => {
    if (options.where.id) {
      // const models = require("./index");
      // models.NIST800171R2CheckControl.destroy({
      //   where: {
      //     control_number: options.where.id
      //   },
      //   force: true
      // });
    }
    return options;
  });

  return NIST800171R2Control;
}
