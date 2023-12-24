module.exports = (sequelize, DataTypes) => {

  const ApprovalProcess = sequelize.define('ApprovalProcess', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
    },
    system_id: DataTypes.UUID,
    name: DataTypes.STRING,
    label: DataTypes.STRING,
    description: DataTypes.STRING,
    type: {
      type: DataTypes.ENUM,
      values: ['ato', 'control']
    },
    order: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,

  }, {
    timestamps: true,
    onDelete: 'cascade',
    paranoid: true,
    tableName: 'approvals_processes',
  });

  ApprovalProcess.associate = (models) => {
    ApprovalProcess.belongsToMany(models.Role, {
      through: models.ApprovalProcessRole,
      foreignKey: 'approval_process_id',
      otherKey: 'role_id',
      onDelete: 'cascade',
      hooks: true,
    });
    ApprovalProcess.belongsToMany(models.User, {
      through: models.ApprovalProcessUser,
      foreignKey: 'approval_process_id',
      otherKey: 'user_id',
      onDelete: 'cascade',
      hooks: true,
    });
    ApprovalProcess.hasMany(models.ApprovalProcessRole, {
      foreignKey: 'approval_process_id',
      onDelete: 'cascade',
      hooks: true
    })
    ApprovalProcess.hasMany(models.ApprovalProcessUser, {
      foreignKey: 'approval_process_id',
      onDelete: 'cascade',
      hooks: true
    })
    ApprovalProcess.hasMany(models.ApprovalProcessHistory, {foreignKey: 'approval_process_id'});
  }

  ApprovalProcess.addHook('beforeBulkDestroy', (options) => {
    console.log("options")
    console.log(options)
    if (options.where.id) {
      // const models = require("./index");
      // models.ApprovalProcessRole.destroy({
      //   where: {
      //     approval_process_id: options.where.id
      //   },
      //   force: true
      // });
      // models.ApprovalProcessUser.destroy({
      //   where: {
      //     approval_process_id: options.where.id
      //   },
      //   force: true
      // });
  
    }
    return options;
  });

  return ApprovalProcess;
};
