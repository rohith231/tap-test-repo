module.exports = (sequelize, DataTypes) => {
  const interrogator = sequelize.define('Interrogator', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
      //autoIncrement: true
    },
    sleep: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    sleep_duration: {
      type: DataTypes.INTEGER,
    },
    delay_per_wave: {
      type: DataTypes.INTEGER,
    },
    delay_per_control: {
      type: DataTypes.INTEGER,
    },
    delay_per_fingerprint_wave: {
      type: DataTypes.INTEGER,
    },
    concurrent_controls: {
      type: DataTypes.INTEGER,
    },
    last_run_duration: {
      type: DataTypes.INTEGER,
    },
    description: {
      type: DataTypes.STRING,
    },
    last_run: {
      type: DataTypes.DATE,
    },
    user_id: {
      type: DataTypes.UUID,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
    attrsToSkip: {
      type: DataTypes.VIRTUAL,
      get() {
        return ['id', 'createdAt', 'updatedAt', 'deletedAt', 'user_id','last_run','last_run_duration','attrsToSkip'];
      },
    }
  }, {
    indexes: [
  ],
  timestamps: true,
  paranoid: true,
  tableName: 'interrogators'
  })

  return interrogator;
};