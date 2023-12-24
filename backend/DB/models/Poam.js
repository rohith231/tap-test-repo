module.exports = (sequelize, DataTypes) => {
  const Poam = sequelize.define('Poam', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
      //autoIncrement: true,
      allowNull: false,
    },
    control_id: DataTypes.UUID,
    system_id: DataTypes.UUID,
    idnt: DataTypes.STRING,
    weak_name: DataTypes.STRING,
    weak_desc: DataTypes.TEXT,
    weak_detector: DataTypes.STRING,
    weak_idnt: DataTypes.STRING,
    asset_identifier: DataTypes.STRING,
    poc: DataTypes.STRING,
    resources_required: DataTypes.TEXT,
    remediation_plan: DataTypes.TEXT,
    detection_date: DataTypes.DATE,
    completion_date: DataTypes.DATE,
    milestones_planned: DataTypes.ARRAY(DataTypes.JSONB),
    milestone_changes: DataTypes.ARRAY(DataTypes.JSONB),
    status_date: DataTypes.DATE,
    vendor_dependency: DataTypes.BOOLEAN,
    vendor_checkin: DataTypes.DATE,
    vendor_productname: DataTypes.STRING,
    risk_rating_org: DataTypes.STRING,
    risk_rating_adjust: DataTypes.STRING,
    risk_adjustment: DataTypes.STRING,
    false_positive: DataTypes.STRING,
    operational_requirement: DataTypes.STRING,
    deviation_rationale: DataTypes.TEXT,
    supporting_documents: DataTypes.ARRAY(DataTypes.JSONB),
    comments: DataTypes.TEXT,
    auto_approve: DataTypes.BOOLEAN,
    completed: DataTypes.BOOLEAN,
    completed_by: DataTypes.STRING,
    csp: DataTypes.STRING,
    system_impact_level: DataTypes.STRING,
    created_at: DataTypes.DATE,
    control: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
    attrsToSkip: {
      type: DataTypes.VIRTUAL,
      get() {
        return ['id', 'createdAt', 'updatedAt', 'deletedAt', 'attrsToSkip'];
      },
    }
  }, {
    tableName: 'poams',
    paranoid: true,
    timestamps: true
  });



  Poam.associate = (models) => {
    Poam.belongsTo(models.NIST80053R4CheckControl, {
      foreignKey: 'control_id',
    });
    Poam.belongsTo(models.NIST80053R5CheckControl, {
      foreignKey: 'control_id',
    });
    Poam.belongsTo(models.NIST800171R2CheckControl, {
      foreignKey: 'control_id',
    });
    
  }
  return Poam;
}
