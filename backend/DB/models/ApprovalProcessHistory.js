'use strict';
module.exports = (sequelize, DataTypes) => {
  const ApprovalProcessHistory = sequelize.define('ApprovalProcessHistory', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
    },
    system_id: DataTypes.UUID,
    control_id: DataTypes.UUID,
    type: DataTypes.STRING,
    comment: DataTypes.STRING,
    approval_process_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    action: {
      type: DataTypes.ENUM,
      values: ['approved', 'rejected', 'edit']
    },
    action_by: {
      type: DataTypes.UUID,
      references: {
        model: {
          tableName: 'users'
        },
        key: 'id'
      },
      allowNull: false
    },
    approval_process: DataTypes.JSONB,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
    assigned_to: {
      type: DataTypes.ARRAY(DataTypes.JSON),
      allowNull: true,
      defaultValue: [],
      get() {
        const data = this.getDataValue('assigned_to');
        return data;
      }
    },
  }, {
    paranoid: true,
    tableName: 'approvals_process_history'
  });

  ApprovalProcessHistory.associate = (models) => {
    ApprovalProcessHistory.belongsTo(models.User, {foreignKey: 'action_by', targetKey: 'id', constraints: false})
    ApprovalProcessHistory.belongsTo(models.ApprovalProcess, {
      foreignKey: 'approval_process_id',
      targetKey: 'id',
      constraints: false
    })
  }


  return ApprovalProcessHistory;
};
